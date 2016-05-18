import THREE from 'three';
import $ from 'jquery';

var TOPPANO = TOPPANO || {};

// global variables initialization
TOPPANO.gv = {
    modelId: '',
    scene: null,
    objScene: null,
    renderer: null,
    stats: null,
    canvasID: 'pano-container',
    isFullScreen: false,
    headingOffset: 0,
    
    cursor:{
        state: 'default',
        element: null,
        position_array: [],
        slide_func_array:[]
    },

    nodes_meta: null,
    current_node_ID:'',
    
    // camera parameter
    cam: {
        camera: null,
        lat: 0,
        virtual_lat: 0,
        lng: 0,
        camPos: new THREE.Vector3(0, 0, 0),
        defaultCamFOV: 60,
        phi: 0,
        theta: 0,
        fov: 60
    },

    // interative controls
    control: {
        // they are not used
        onMouseDownMouseX: 0,
        onMouseDownMouseY: 0,
        onMouseDownLon: 0,
        onMouseDownLat: 0,
        
        // they are initialized in TOPPANO.controlInit()
        bound:{
            top:0,
            bottom:0,
            left:0,
            right:0
        }
    },

    // scene1 for showing to users
    scene1: {
        geometry: null,
        texture: null,
        material: null,
        mesh: null,
        panoID: '00000000',
        nextInfo: null
    },

    // container of canvas
    container: {
        offsetTop: 0,
        offsetLeft: 0,
        Height: 0,
        Width: 0,
        bound: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    },

    // Const parameters
    para: {
        fov: {
            min: 50,
            max: 85
            // max: 100
        },
        sphereSize: 1000,
        epsilon: 0.1
    },

    // interaction variables
    interact: {
        isUserInteracting: false,
        isAnimate: false,
        onPointerDownPointerX: 0,
        onPointerDownPointerY: 0,
        onPointerDownLon: 0,
        onPointerDownLat: 0,
        timer: null
    },
    // variables for mobile support
    mobile: {
        isMobile: false,
        orientation: 'none'
    },
    click: {
      dblclickDelay: 300, // Delay for differentiate between single and double click
      count: 0,
      timer: null,
      longClickDelay: 150, // Delay for differentiate between short and long click
      lastMouseDown: 0,
      startPos: { x: 0, y: 0 },
      endPos: { x: 0, y: 0 }
    },
    currentLink: '',
    defaultMap: './image/tile/0-0.jpeg',
    apiUrl: 'http://dev.verpix.net:3000/api'
 };

TOPPANO.gyro = {
    screen_rot_angle:0,
    lat: 0,
    lng: 0,
    setup: false,
    isOn: false // Only used for iphone/ipad currently.
};

// Entry function
export default function startViewer(params) {
  // Optimization for mobile devices.
  TOPPANO.optimizeMobile();

  // init threejs scene and camera
  TOPPANO.threeInit(params);

  // request metadata, load all img files and build the first scene
  TOPPANO.modelInit(params.modelId);

  TOPPANO.update();
}

TOPPANO.modelInit = function(modelId) {
    TOPPANO.gv.modelId = modelId;
    var model = {};
    var url = (TOPPANO.gv.apiUrl + '/posts/' + modelId);

    $.get(url).then(
        function(modelMeta) {
            model['summary'] = {
                'name': modelMeta['name'],
                'presentedBy': modelMeta['presentedBy'],
                'description': modelMeta['description'],
                'address': modelMeta['address']
            };

            TOPPANO.gv.nodes_meta = $.extend({}, modelMeta.nodes);
            // load all imgs and build the first scene
            TOPPANO.loadAllImg(TOPPANO.gv.nodes_meta)
                 .pipe(function(){
                     var first_node_ID = Object.keys(TOPPANO.gv.nodes_meta)[0];
                     TOPPANO.gv.current_node_ID = first_node_ID;
                     TOPPANO.buildScene(first_node_ID);
                 });
    }).done(function() {
        // add listener
        TOPPANO.addListener();
    });

}

TOPPANO.threeInit = function(map) {
    TOPPANO.initGV(map);

    TOPPANO.gv.cam.camera = new THREE.PerspectiveCamera(
        TOPPANO.gv.cam.defaultCamFOV, // field of view (vertical)
        // 80,
        window.innerWidth / window.innerHeight, // aspect ratio
        1, // near plane
        1100 // far plane
    );

    // change position of the cam
    var sphereSize = TOPPANO.gv.para.sphereSize;
    TOPPANO.gv.cam.camera.target = new THREE.Vector3(sphereSize, sphereSize, sphereSize);

    // scene for bg, objScene for transition objects
    TOPPANO.gv.scene = new THREE.Scene();
    TOPPANO.gv.objScene = new THREE.Scene();

    // renderer setting
    TOPPANO.rendererSetting();
    
   /* increase progress bar */
   var current_progress = $('#progress-div progress').val();
   $('#progress-div progress').val(current_progress+8);
};

// Optimization function for mobile devices.
TOPPANO.optimizeMobile = function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        TOPPANO.gv.mobile.isMobile = true;
        //TOPPANO.gyro.isOn = (getUrlParam('gyro') === 'on');

        // Prevent scrolling the entire page.
        $(document).on('touchmove', function(event) {
            event.preventDefault();
        });
    }
};

function loadImg(node_ID, file_url){
    var _dfr = $.Deferred();
      
    var file_name = file_url.substr(file_url.lastIndexOf('/')+1);
    var texture = THREE.ImageUtils.loadTexture(file_url, THREE.UVMapping, function() {
      texture.minFilter = THREE.LinearFilter;
      var file_obj = {
        'name':file_name,
        'texture':texture
      };
      if(!('textures' in TOPPANO.gv.nodes_meta[node_ID])){
        TOPPANO.gv.nodes_meta[node_ID]['textures'] = new Array();
      }
      TOPPANO.gv.nodes_meta[node_ID].textures.push(file_obj);
      return _dfr.resolve('');
    }, function() {
      return _dfr.reject('');
    });
    return _dfr.promise();
}

// loading tiles images
TOPPANO.loadAllImg = function(nodes_meta) {
    THREE.ImageUtils.crossOrigin = '';
    var _dfr = $.Deferred();
    var deferreds = [];

    for (let node_ID in nodes_meta){
        var node_files = nodes_meta[node_ID].files;
        for (let file_index in node_files){
            if(file_index.search('equirectangular')>0 && file_index.search('low')<0 ){
                var file_url = node_files[file_index];
                deferreds.push(loadImg(node_ID, file_url).done(() => {
                    /* increase progress bar */
                    var current_progress = $('#progress-div progress').val();
                    $('#progress-div progress').val(current_progress+10);
                }));
            }
        }
    }

    $.when.apply($, deferreds).then(
            function(){
                // order all files of nodes in TOPPANO.gv.file_sets
                for (let node_ID in TOPPANO.gv.nodes_meta){
                    TOPPANO.gv.nodes_meta[node_ID].textures.sort(
                    function(a,b){
                        if(a.name>b.name)
                            return 1;
                        else if(a.name<b.name)
                            return -1
                        return 0});
                }
                _dfr.resolve();
             },
             function() {
               _dfr.reject();
             }
            );
    return _dfr.promise();
};

TOPPANO.buildScene = function(node_ID){
    var sphereSize = TOPPANO.gv.para.sphereSize;
    var node_textures = TOPPANO.gv.nodes_meta[node_ID].textures;
    var i;
    var opacity;
    
    TOPPANO.gv.headingOffset = 0;
    opacity = 1;

    for(i=0; i<8; i++){
        var j = parseInt(i/4);
        var geometry = new THREE.SphereGeometry(sphereSize, 20, 20, Math.PI/2 * i - TOPPANO.gv.headingOffset * Math.PI / 180, Math.PI/2, Math.PI/2 * j, Math.PI/2);
        geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

        var material = new THREE.MeshBasicMaterial({
            map:node_textures[i].texture,
            overdraw: true,
            transparent: true,
            opacity: opacity
        });
        var mesh = new THREE.Mesh(geometry, material);
        TOPPANO.gv.scene.add(mesh);
    }
}

// add listeners
TOPPANO.addListener = function() {
    TOPPANO.setCursorHandler();
    TOPPANO.handleClick();
    window.addEventListener('resize', TOPPANO.onWindowResize, false);
};

// setting global variables for initialization
TOPPANO.initGV = function(params){
  const { cam } = params;
  if(cam) {
    if(cam.lat) {
      TOPPANO.gv.cam.lat = clamp(cam.lat, -85, 85);
    }
    if(cam.lng) {
      TOPPANO.gv.cam.lng = (cam.lng + 360) % 360;
    }
    if(cam.fov) {
      TOPPANO.gv.cam.defaultCamFOV = clamp(cam.fov, TOPPANO.gv.para.fov.min, TOPPANO.gv.para.fov.max);
    }
  }
  if(params.canvas) {
    TOPPANO.gv.canvasID = params.canvas;
  }
};

// renderer setting
TOPPANO.rendererSetting = function() {
    // WebGLRenderer for better quality if having webgl
    var webglRendererPara = {
        preserveDrawingBuffer: true,
        autoClearColor: false,
        alpha: true
    };
    TOPPANO.gv.renderer = new THREE.WebGLRenderer(webglRendererPara);
//    : new THREE.CanvasRenderer(); // with no WebGL supported
    TOPPANO.gv.renderer.setClearColor( 0x000000, 0 );

    TOPPANO.gv.renderer.autoClear = false;
    TOPPANO.gv.renderer.setPixelRatio(window.devicePixelRatio);
    var container = document.getElementById(TOPPANO.gv.canvasID);
    var canvasHeight = window.getComputedStyle(document.getElementById(TOPPANO.gv.canvasID), null).getPropertyValue('height'),
    canvasWidth = window.getComputedStyle(document.getElementById(TOPPANO.gv.canvasID), null).getPropertyValue('width');
    canvasHeight = parseInt(canvasHeight, 10),
    canvasWidth = parseInt(canvasWidth, 10);

    if (canvasWidth * canvasHeight > 0) {
        TOPPANO.gv.renderer.setSize(canvasWidth, canvasHeight);
    }
    else {
        TOPPANO.gv.isFullScreen = true;
        TOPPANO.gv.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    container.appendChild(TOPPANO.gv.renderer.domElement);
    // set some global variables about container styles
    var bodyRect = document.body.getBoundingClientRect(),
        containerRect = container.getBoundingClientRect();
        TOPPANO.gv.container.offsetTop = containerRect.top - bodyRect.top,
        TOPPANO.gv.container.offsetLeft = containerRect.left - bodyRect.left,
        TOPPANO.gv.container.Height = containerRect.bottom - containerRect.top,
        TOPPANO.gv.container.Width = containerRect.right - containerRect.left;
        TOPPANO.gv.container.bound.top = TOPPANO.gv.container.offsetTop,
        TOPPANO.gv.container.bound.bottom = TOPPANO.gv.container.offsetTop + TOPPANO.gv.container.Height,
        TOPPANO.gv.container.bound.left = TOPPANO.gv.container.offsetLeft,
        TOPPANO.gv.container.bound.right = TOPPANO.gv.container.offsetLeft + TOPPANO.gv.container.Width;
};

// snapshot function
TOPPANO.getSnapshot = function(width, height) {
    var canvasMini = $('<canvas width="' + width + '" height="' + height + '"></canvas>')
            .attr('type', 'hidden').append('#container');
    var snapshot = '';

    canvasMini[0].getContext('2d').drawImage(TOPPANO.gv.renderer.domElement, 0, 0, width, height);
    snapshot= canvasMini[0].toDataURL('image/jpeg', 0.8);
    canvasMini.remove();

    return snapshot;
};

// render scene
TOPPANO.renderScene = function() {
  requestAnimationFrame(TOPPANO.update);
  TOPPANO.gv.renderer.clear();
  TOPPANO.gv.renderer.render(TOPPANO.gv.scene, TOPPANO.gv.cam.camera);
  TOPPANO.gv.renderer.clearDepth();
  TOPPANO.gv.renderer.render(TOPPANO.gv.objScene, TOPPANO.gv.cam.camera);
};

// threejs update
TOPPANO.update = function() {
    TOPPANO.gv.cam.lat = Math.max(-85, Math.min(85, TOPPANO.gv.cam.lat));
    TOPPANO.gv.cam.lng = (TOPPANO.gv.cam.lng + 360) % 360;
    TOPPANO.gv.cam.phi = THREE.Math.degToRad(90 - TOPPANO.gv.cam.lat);
    TOPPANO.gv.cam.theta = THREE.Math.degToRad(TOPPANO.gv.cam.lng);

    // y: up
    TOPPANO.gv.cam.camera.target.x = Math.sin(TOPPANO.gv.cam.phi) * Math.cos(TOPPANO.gv.cam.theta);
    TOPPANO.gv.cam.camera.target.y = Math.cos(TOPPANO.gv.cam.phi);
    TOPPANO.gv.cam.camera.target.z = Math.sin(TOPPANO.gv.cam.phi) * Math.sin(TOPPANO.gv.cam.theta);
    TOPPANO.gv.cam.camera.lookAt(TOPPANO.gv.cam.camera.target);
    
   
    var vect_target_onXZ = new THREE.Vector3(TOPPANO.gv.cam.camera.target.x, 0, TOPPANO.gv.cam.camera.target.z);
    var vect_cam_up = new THREE.Vector3(0, 1, 0);
    var normal_vect = new THREE.Vector3();
    normal_vect.crossVectors(vect_target_onXZ, vect_cam_up);
    normal_vect = normal_vect.normalize();
    vect_cam_up.applyAxisAngle(normal_vect, (Math.PI/180)*(TOPPANO.gv.cam.lat));
    

    vect_cam_up.applyAxisAngle(TOPPANO.gv.cam.camera.target, (Math.PI/180)*TOPPANO.gyro.screen_rot_angle);
    TOPPANO.gv.cam.camera.up.x = vect_cam_up.x;
    TOPPANO.gv.cam.camera.up.y = vect_cam_up.y;
    TOPPANO.gv.cam.camera.up.z = vect_cam_up.z;
    
    // mainly for changing TOPPANO.gv.cam.camera.fov
    TOPPANO.gv.cam.camera.updateProjectionMatrix();

    TOPPANO.renderScene();
    TOPPANO.updateCurrentUrl();
};

TOPPANO.updateCurrentUrl = function() {
    /*
    var queryStr =
        'post=' + TOPPANO.gv.modelId +
        '&fov=' + parseInt(TOPPANO.gv.cam.camera.fov) +
        '&lat=' + parseInt(TOPPANO.gv.cam.lat) +
        '&lng=' + parseInt(TOPPANO.gv.cam.lng);
    TOPPANO.gv.currentUrl = window.location.origin + '/?' + base64Convert(queryStr, 'encode');
    */
};

function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}

function set_on_rotating_scene(){
    // rotating-scene
    // determine if on the mobile or PC web

    var start_event, move_event, end_event;
    if (TOPPANO.gv.mobile.isMobile)
    {
        start_event = 'touchstart';
        move_event = 'touchmove';
        end_event = 'touchend';
    }
    else{
        start_event = 'mousedown';
        move_event = 'mousemove';
        end_event = 'mouseup';
    }

    $('#container').on(start_event,
                      function(event){
                          if(TOPPANO.gv.cursor.state == 'default'){
                              if(event.type == 'touchstart')
                              {
                                  event = event.originalEvent.touches[0];
                              }
                              TOPPANO.gv.interact.onPointerDownPointerX = event.clientX;
                              TOPPANO.gv.interact.onPointerDownPointerY = event.clientY;
                              TOPPANO.gv.interact.onPointerDownLon = TOPPANO.gv.cam.lng;
                              TOPPANO.gv.interact.onPointerDownLat = TOPPANO.gv.cam.lat;
                              TOPPANO.gv.cursor.position_array.splice(0, TOPPANO.gv.cursor.position_array.length);
                              TOPPANO.gv.cursor.state = 'mouse-down-container';

                              while(TOPPANO.gv.cursor.slide_func_array.length>0){
                                  clearTimeout(TOPPANO.gv.cursor.slide_func_array.shift());
                              }

                          }
                      });

    $('#container').on(move_event,
                       function(event){
                           if(TOPPANO.gv.cursor.state == 'mouse-down-container'){
                                TOPPANO.gv.cursor.state = 'rotating-scene';
                            }
                            else if(TOPPANO.gv.cursor.state == 'rotating-scene')
                            {
                                if(event.type == 'touchmove')
                                {
                                    event = event.originalEvent.touches[0];
                                    var deltaX = TOPPANO.gv.interact.onPointerDownPointerX - event.clientX,
                                        deltaY = event.clientY - TOPPANO.gv.interact.onPointerDownPointerY;
                                    var angle = -TOPPANO.gyro.screen_rot_angle*(Math.PI/180);
                                    TOPPANO.gv.cam.lng = (deltaX*(Math.cos(angle)) - deltaY*(Math.sin(angle))) * 0.1 + TOPPANO.gv.interact.onPointerDownLon;
                                    TOPPANO.gv.cam.lat = (deltaX*(Math.sin(angle)) + deltaY*(Math.cos(angle))) * 0.1 + TOPPANO.gv.interact.onPointerDownLat;
                                }
                                else{
                                    var deltaX = TOPPANO.gv.interact.onPointerDownPointerX - event.clientX,
                                        deltaY = event.clientY - TOPPANO.gv.interact.onPointerDownPointerY;
                                    TOPPANO.gv.cam.lng = deltaX * 0.1 + TOPPANO.gv.interact.onPointerDownLon;
                                    TOPPANO.gv.cam.lat = deltaY * 0.1 + TOPPANO.gv.interact.onPointerDownLat;
                                }
                                var position = {'clientX': event.clientX, 'clientY': event.clientY};
                                TOPPANO.gv.cursor.position_array.push(position);
                            }
    });
    
    $('#container').on(end_event,
                       function(event){
                           if(TOPPANO.gv.cursor.state == 'rotating-scene'){
                                TOPPANO.gv.cursor.state = 'default';
                                TOPPANO.gv.cursor.element = null;
                                if(event.type == 'touchend')
                                {
                                    event = event.originalEvent.changedTouches[0];
                                }
                                var last_position = TOPPANO.gv.cursor.position_array.pop(),
                                    last_sec_position = TOPPANO.gv.cursor.position_array.pop();
                                
                                var deltaX = (last_position.clientX+last_sec_position.clientX)/2 - event.clientX ,
                                    deltaY = event.clientY - (last_position.clientY+last_sec_position.clientY)/2;
                              
                                var count;
                                for (count=0; count<200; count++){
                                    var id = setTimeout(function(count){
                                        TOPPANO.gv.cam.lng += (deltaX) * (200-count)/10000;
                                        TOPPANO.gv.cam.lat += deltaY * (200-count)/10000;
                                    }, (1 + count) * 5, count);
                                    TOPPANO.gv.cursor.slide_func_array.push(id);
                                }
                           }
                       });


    $('#container').on('mouseout',
                       function(){
                            TOPPANO.gv.cursor.state = 'default';
                            TOPPANO.gv.cursor.element = null;
                       });
}

function set_on_scrolling_scene(){
    function onMouseWheel(event) {
        // check FoV range
        if (TOPPANO.gv.cam.camera.fov <= TOPPANO.gv.para.fov.max
            && TOPPANO.gv.cam.camera.fov >= TOPPANO.gv.para.fov.min) {
            // WebKit (Safari / Chrome)
            if (event.wheelDeltaY) {
                TOPPANO.gv.cam.camera.fov -= event.wheelDeltaY * 0.05;
            }
            // Opera / IE 9
            else if (event.wheelDelta) {
                TOPPANO.gv.cam.camera.fov -= event.wheelDelta * 0.05;
            }
            // Firefox
            else if (event.detail) {
                TOPPANO.gv.cam.camera.fov += event.detail * 1.0;
            }
        }

        if (TOPPANO.gv.cam.camera.fov > TOPPANO.gv.para.fov.max) {
            TOPPANO.gv.cam.camera.fov = TOPPANO.gv.para.fov.max;
        }
        if (TOPPANO.gv.cam.camera.fov < TOPPANO.gv.para.fov.min) {
            TOPPANO.gv.cam.camera.fov = TOPPANO.gv.para.fov.min;
        }

        TOPPANO.gv.cam.camera.updateProjectionMatrix();
        // update URL after scroll stops for 0.1 second
        if (TOPPANO.gv.interact.timer !== null) {
            clearTimeout(TOPPANO.gv.interact.timer);
        }
    }
    
    // for IE & chrome
    $('#container').on('mousewheel', function(event){onMouseWheel(event.originalEvent);});
    // for firefox
    $('#container').on('DOMMouseScroll', function(event){onMouseWheel(event.originalEvent);});
}

TOPPANO.setCursorHandler = function(){
    set_on_rotating_scene();
    set_on_scrolling_scene();
};

TOPPANO.onDeviceOrientation = function(event){
    var degtorad = Math.PI / 180;

    var x = event.beta*degtorad;
    var y = event.gamma*degtorad;
    var z = event.alpha*degtorad;

    var cX = Math.cos( x );
    var cY = Math.cos( y );
    var cZ = Math.cos( z );
    var sX = Math.sin( x );
    var sY = Math.sin( y );
    var sZ = Math.sin( z );

    // Calculate Vx and Vy components
    var V_heading_negZ = new THREE.Vector3( -cZ*sY -sZ*sX*cY, -sZ*sY + cZ*sX*cY, -cX*cY);
    // Calculate compass heading
    var longitude = Math.atan( V_heading_negZ.x / V_heading_negZ.y );

    var leng_onXY = Math.sqrt(Math.pow(V_heading_negZ.x,2)+Math.pow(V_heading_negZ.y,2));
    var latitude = Math.atan(leng_onXY/V_heading_negZ.z);

    // Convert compass heading to use whole unit circle
    if( V_heading_negZ.y < 0 ) {
        longitude += Math.PI;
    } else if( V_heading_negZ.x < 0 ) {
        longitude += 2 * Math.PI;
    }
    if( V_heading_negZ.z < 0 ) {
        latitude += Math.PI;
    }

    longitude = longitude * ( 180 / Math.PI );
    latitude = ((-1)*latitude+Math.PI/2) * ( 180 / Math.PI );
    
    if(TOPPANO.gyro.setup == false)
    {
        TOPPANO.gv.cam.lng = longitude;
        TOPPANO.gv.cam.lat = latitude;
        TOPPANO.gv.cam.virtual_lat = latitude;
        TOPPANO.gyro.lng = longitude;
        TOPPANO.gyro.lat = latitude;
        TOPPANO.gyro.lat = latitude;
        TOPPANO.gyro.setup = true;
    }
    else
    {
        var lng_delta = longitude-TOPPANO.gyro.lng;
        var lat_delta = latitude-TOPPANO.gyro.lat;
        TOPPANO.gv.cam.lng += lng_delta;
        TOPPANO.gv.cam.lat += lat_delta;
        TOPPANO.gv.cam.virtual_lat += lat_delta;
        TOPPANO.gyro.lng = longitude;
        TOPPANO.gyro.lat = latitude;
    }


    var V_heading_Y = new THREE.Vector3((-1)*cX*sZ, cZ*cX, sX);
    var V_Z =  new THREE.Vector3(0, 0, 1);
    var V_rot_axis = new THREE.Vector3();
    V_rot_axis.crossVectors(V_heading_negZ, V_Z);
      
    V_rot_axis = V_rot_axis.normalize();
    V_Z.applyAxisAngle(V_rot_axis, (Math.PI/180)*TOPPANO.gv.cam.virtual_lat);
    
    var angle = V_Z.angleTo(V_heading_Y);
    angle = angle*(180/Math.PI);

    var side = V_heading_Y.dot(V_rot_axis) ;
    if(side<0)
    {angle = -angle;}
    
    angle = Math.round(1000*angle)/1000;
    TOPPANO.gyro.screen_rot_angle = angle + window.orientation;
}

// Handle Click for showing/hiding UI (single), or fullscreen (double).
TOPPANO.handleClick = function() {
    var click = TOPPANO.gv.click;
    var startEvent, endEvent;

    if(TOPPANO.gv.mobile.isMobile) {
        startEvent = 'touchstart';
        endEvent = 'touchend';
    } else {
        startEvent = 'mousedown';
        endEvent = 'mouseup';
    }

    $('#container').on(startEvent, function(e) {
        click.lastMouseDown = new Date().getTime();
        if(TOPPANO.gv.mobile.isMobile) {
            click.startPos.x = e.originalEvent.touches[0].pageX;
            click.startPos.y = e.originalEvent.touches[0].pageY;
        } else {
            click.startPos.x = e.offsetX;
            click.startPos.y = e.offsetY;
        }
    }).on(endEvent, function(e) {
        var deltaX, deltaY;
        if(TOPPANO.gv.mobile.isMobile) {
            click.endPos.x = e.originalEvent.changedTouches[0].pageX;
            click.endPos.y = e.originalEvent.changedTouches[0].pageY;
        } else {
            click.endPos.x = e.offsetX;
            click.endPos.y = e.offsetY;
        }
        deltaX = Math.abs(click.endPos.x - click.startPos.x);
        deltaY = Math.abs(click.endPos.y - click.startPos.y);

        // Check the click duration is small enough and no move occurs while clicking.
        if((new Date().getTime() < (click.lastMouseDown + click.longClickDelay)) && (deltaX < 1) && (deltaY < 1)) {
            click.count++;
            if(click.count === 1) {
                click.timer = setTimeout(function() {
                    // Single click: show/hide all UI.
                    //TOPPANO.ui.utils.toggleUI();
                    click.count = 0;
                }, click.dblclickDelay);
            } else {
                // Double click: turn on/off fullscreen.
                // TODO: Fullscreen support for IOS Safari, Android Browser...
                if(process.env.BROWSER) {
                    let screenfull = require('screenfull');
                    if(screenfull.enabled) {
                        screenfull.toggle();
                    }
                }
                clearTimeout(click.timer);
                click.count = 0;
            }
        }
    });
};

TOPPANO.onWindowResize = function() {
    if (TOPPANO.gv.isFullScreen) {
        TOPPANO.gv.cam.camera.aspect = window.innerWidth / window.innerHeight;
        TOPPANO.gv.cam.camera.updateProjectionMatrix();
        TOPPANO.gv.renderer.setSize(window.innerWidth, window.innerHeight);

        TOPPANO.gv.container.bound.bottom = window.innerHeight;
        TOPPANO.gv.container.bound.right = window.innerWidth;
        TOPPANO.gv.control.bound.bottom = TOPPANO.gv.container.bound.bottom-$('#node-gallery').height();
        TOPPANO.gv.control.bound.right = TOPPANO.gv.container.bound.right;
    }
};
