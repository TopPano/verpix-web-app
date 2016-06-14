import THREE from 'three';
import { Base64 } from 'js-base64';
import sortBy from 'lodash/sortBy';
import fetch from 'isomorphic-fetch';

import { isMobile } from 'lib/devices';
import externalApiConfig from 'etc/external-api';

var requestAnimationFrameId;
var TOPPANO = TOPPANO || {};

// global variables initialization
TOPPANO.gv = {
    scene: null,
    objScene: null,
    renderer: null,
    stats: null,
    canvasID: 'container',
    isFullScreen: false,
    headingOffset: 0,

    cursor: {
      position_array: [],
      slide_func_array:[]
    },

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
    currentLink: ''
 };

TOPPANO.gyro = {
    screen_rot_angle:0,
    lat: 0,
    lng: 0,
    setup: false,
    isOn: false // Only used for iphone/ipad currently.
};

// Entry function
export function startViewer(params) {
  // Optimization for mobile devices.
  optimizeMobile();

  // init threejs scene and camera
  initThree(params);

  update();
}

export function stopViewer() {
  window.removeEventListener('resize', TOPPANO.onWindowResize);
  if(requestAnimationFrameId) {
    window.cancelAnimationFrame(requestAnimationFrameId);
    requestAnimationFrameId = undefined;
  }
  if(TOPPANO.gv.mobile.isMobile) {
    document.removeEventListener('touchmove', preventPageScrolling);
  }
}

export function getCurrentUrl() {
  const queryStr =
    'fov=' + parseInt(TOPPANO.gv.cam.camera.fov) +
    '&lat=' + parseInt(TOPPANO.gv.cam.lat) +
    '&lng=' + parseInt(TOPPANO.gv.cam.lng);
  return window.location.href.split('?')[0] + '?' + Base64.encode(queryStr);
}

export function getSnapshot(width, height, accessToken) {
  const container = document.getElementById('container');
  let canvasMini, snapshot;

  canvasMini = document.createElement('CANVAS');
  canvasMini.setAttribute('width', width);
  canvasMini.setAttribute('height', height);
  canvasMini.setAttribute('type', 'hidden');
  container.appendChild(canvasMini);

  canvasMini.getContext('2d').drawImage(TOPPANO.gv.renderer.domElement, 0, 0, width, height);
  snapshot = base64toBlob(canvasMini.toDataURL('image/jpeg', 0.8));
  container.removeChild(canvasMini);

  return new Promise((resolve, reject) => {
    uploadPhoto(accessToken, snapshot).then((response) => {
      if(response.status >= 400) {
        // TODO: Error handling
        reject();
      }
      return response.json();
    }).then((data) => {
      // Get URL of the uploaded photo.
      const snapshotUrl = `${externalApiConfig.facebook.apiRoot}/${data.id}/picture?access_token=${accessToken}`;

      shortenUrl(snapshotUrl).then((response) => {
        if(response.status >= 400) {
          // TODO: Error handling
          reject();
        }
        return response.json();
      }).then((data) => {
        // Shorten the URL.
        // We use the shorter URL because the original URL of uploaded snapshot (fb.cdn)
        // is not allowed in Facebook previewe image.
        const shortUrl = data.id;
        resolve({
          imgUrl: shortUrl,
          width,
          height
        });
      });
    });
  });
}

function initThree(params) {
  TOPPANO.initGV(params);

  TOPPANO.gv.cam.camera = new THREE.PerspectiveCamera(
    TOPPANO.gv.cam.defaultCamFOV, // field of view (vertical)
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

  // build the scene
  buildScene(params.imgs);

  // add DOM event handlers
  TOPPANO.addListener();
}

// Generate textrues from images.
//function genTextures(imgs) {
function buildScene(imgs) {
  let loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
  let sortedImgs = sortBy(imgs, (img) => {
    const subIndex = img.srcUrl.indexOf('equirectangular');
    return img.srcUrl.slice(subIndex);
  });

  sortedImgs.map((img, index) => {
    loader.load(img.srcUrl, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      addMesh(texture, index);
    }, () => {
      // function called when download progresses
    }, () => {
      // TODO: Error handling.
    });
  });
}

function addMesh(texture, index) {
  const sphereSize = TOPPANO.gv.para.sphereSize;
  const opacity = 1;
  const j = parseInt(index / 4);

  TOPPANO.gv.headingOffset = 0;

  let geometry = new THREE.SphereGeometry(sphereSize, 20, 20, Math.PI/2 * index - TOPPANO.gv.headingOffset * Math.PI / 180, Math.PI/2, Math.PI/2 * j, Math.PI/2);
  geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  let material = new THREE.MeshBasicMaterial({
    map: texture,
    overdraw: true,
    transparent: true,
    opacity
  });
  let mesh = new THREE.Mesh(geometry, material);

  TOPPANO.gv.scene.add(mesh);
}

// Optimization function for mobile devices.
function optimizeMobile() {
  if(isMobile()) {
    TOPPANO.gv.mobile.isMobile = true;
    document.addEventListener('touchmove', preventPageScrolling);
  }
}

// Prevent scrolling the entire page.
function preventPageScrolling(e) {
  e.preventDefault();
}

// add listeners
TOPPANO.addListener = function() {
  addRotationHandlers();
  set_on_scrolling_scene();
  TOPPANO.handleClick();
  window.addEventListener('resize', TOPPANO.onWindowResize);
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

// render scene
TOPPANO.renderScene = function() {
  requestAnimationFrameId = window.requestAnimationFrame(update);
  TOPPANO.gv.renderer.clear();
  TOPPANO.gv.renderer.render(TOPPANO.gv.scene, TOPPANO.gv.cam.camera);
  TOPPANO.gv.renderer.clearDepth();
  TOPPANO.gv.renderer.render(TOPPANO.gv.objScene, TOPPANO.gv.cam.camera);
};

// threejs update
function update() {
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
}

function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}

function base64toBlob(dataUrl) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if(dataUrl.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataUrl.split(',')[1]);
  } else {
    byteString = unescape(dataUrl.split(',')[1]);
  }

  // separate out the mime component
  let mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  // write the bytes of the string to a typed array
  let ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
}

// Upload an image to Facebook by using Graph API.
function uploadPhoto(accessToken, photo) {
  let data = new FormData();
  let config;

  data.append('access_token', accessToken);
  data.append('source', photo);
  data.append('privacy', JSON.stringify({ 'value': 'SELF' }));
  config = {
    method: 'POST',
    body: data
  }
  // Upload the photo to user's Facebook by using multipart/form-data post.
  return fetch(`${externalApiConfig.facebook.apiRoot}/me/photos?access_token=${accessToken}`, config);
}

// Add handlers about rotating the scene
function addRotationHandlers(){
  let container = document.getElementById('container');
  // Determine whether on the mobile or desktop
  let startEvent, endEvent, cancelEvent;
  if (TOPPANO.gv.mobile.isMobile) {
    startEvent = 'touchstart';
    endEvent = 'touchend';
    cancelEvent = 'touchcancel';
  } else {
    startEvent = 'mousedown';
    endEvent = 'mouseup';
    cancelEvent = 'mouseout';
  }

  container.addEventListener(startEvent, handleRotationStart);
  container.addEventListener(endEvent, handleRotationEnd);
  container.addEventListener(cancelEvent, handleRotationEnd);
}

function handleRotationStart(e) {
  let moveEvent;

  if(TOPPANO.gv.mobile.isMobile) {
    TOPPANO.gv.interact.onPointerDownPointerX = e.touches[0].pageX;
    TOPPANO.gv.interact.onPointerDownPointerY = e.touches[0].pageY;
    moveEvent = 'touchmove';
  } else {
    TOPPANO.gv.interact.onPointerDownPointerX = e.offsetX;
    TOPPANO.gv.interact.onPointerDownPointerY = e.offsetY;
    moveEvent = 'mousemove';
  }
  TOPPANO.gv.interact.onPointerDownLon = TOPPANO.gv.cam.lng;
  TOPPANO.gv.interact.onPointerDownLat = TOPPANO.gv.cam.lat;

  while(TOPPANO.gv.cursor.slide_func_array.length > 0) {
    clearTimeout(TOPPANO.gv.cursor.slide_func_array.shift());
  }
  document.getElementById('container').addEventListener(moveEvent, handleRotationMove);
}

// Shorten URL by using Google URL Shortener.
function shortenUrl(longUrl) {
  const config = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      longUrl: longUrl
    })
  }
  return fetch(`${externalApiConfig.google.apiRoot}/urlshortener/v1/url?key=${externalApiConfig.google.shortUrlKey}`, config);
}

function handleRotationMove(e) {
  let clientX, clientY;
  if(TOPPANO.gv.mobile.isMobile) {
    clientX = e.touches[0].pageX;
    clientY = e.touches[0].pageY;

    const deltaX = TOPPANO.gv.interact.onPointerDownPointerX - clientX,
          deltaY = clientY - TOPPANO.gv.interact.onPointerDownPointerY;
    const angle = -TOPPANO.gyro.screen_rot_angle * (Math.PI / 180);
    TOPPANO.gv.cam.lng = (deltaX * (Math.cos(angle)) - deltaY * (Math.sin(angle))) * 0.1 + TOPPANO.gv.interact.onPointerDownLon;
    TOPPANO.gv.cam.lat = (deltaX * (Math.sin(angle)) + deltaY * (Math.cos(angle))) * 0.1 + TOPPANO.gv.interact.onPointerDownLat;
  } else {
    clientX = e.offsetX;
    clientY = e.offsetY;

    const deltaX = TOPPANO.gv.interact.onPointerDownPointerX - clientX,
          deltaY = clientY - TOPPANO.gv.interact.onPointerDownPointerY;
    TOPPANO.gv.cam.lng = deltaX * 0.1 + TOPPANO.gv.interact.onPointerDownLon;
    TOPPANO.gv.cam.lat = deltaY * 0.1 + TOPPANO.gv.interact.onPointerDownLat;
  }
  TOPPANO.gv.cursor.position_array.push({ clientX, clientY });
}

function handleRotationEnd(e) {
  let clientX, clientY;
  let moveEvent;

  if(TOPPANO.gv.mobile.isMobile) {
    clientX = e.changedTouches[0].pageX;
    clientY = e.changedTouches[0].pageY;
    moveEvent = 'touchmove';
  } else {
    clientX = e.offsetX;
    clientY = e.offsetY;
    moveEvent = 'mousemove';
  }

  document.getElementById('container').removeEventListener(moveEvent, handleRotationMove);

  const lastPosition = TOPPANO.gv.cursor.position_array.pop(),
        lastSecondPosition = TOPPANO.gv.cursor.position_array.pop();
  if(lastPosition && lastSecondPosition) {
    const deltaX = (lastPosition.clientX + lastSecondPosition.clientX) / 2 - clientX ,
          deltaY = clientY - (lastPosition.clientY + lastSecondPosition.clientY) / 2;
    for(let count=0; count < 200; count++) {
      let id = setTimeout((count) => {
        TOPPANO.gv.cam.lng += (deltaX) * (200 - count) / 10000;
        TOPPANO.gv.cam.lat += deltaY * (200 - count) / 10000;
      }, (1 + count) * 5, count);
      TOPPANO.gv.cursor.slide_func_array.push(id);
    }
    TOPPANO.gv.cursor.position_array = [];
  }
}

// Handlers about scrolling the scene.
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

  let container = document.getElementById('container');
  // for IE & chrome
  container.addEventListener('mousewheel', onMouseWheel);
  // for firefox
  container.addEventListener('DOMMouseScroll', onMouseWheel);
}

TOPPANO.setCursorHandler = function(){
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
    let container = document.getElementById('container');
    var click = TOPPANO.gv.click;
    var startEvent, endEvent;

    if(TOPPANO.gv.mobile.isMobile) {
        startEvent = 'touchstart';
        endEvent = 'touchend';
    } else {
        startEvent = 'mousedown';
        endEvent = 'mouseup';
    }

    container.addEventListener(startEvent, function(e) {
        click.lastMouseDown = new Date().getTime();
        if(TOPPANO.gv.mobile.isMobile) {
            click.startPos.x = e.touches[0].pageX;
            click.startPos.y = e.touches[0].pageY;
        } else {
            click.startPos.x = e.offsetX;
            click.startPos.y = e.offsetY;
        }
    });
    container.addEventListener(endEvent, function(e) {
        var deltaX, deltaY;
        if(TOPPANO.gv.mobile.isMobile) {
            click.endPos.x = e.changedTouches[0].pageX;
            click.endPos.y = e.changedTouches[0].pageY;
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
  TOPPANO.gv.cam.camera.aspect = window.innerWidth / window.innerHeight;
  TOPPANO.gv.cam.camera.updateProjectionMatrix();
  TOPPANO.gv.renderer.setSize(window.innerWidth, window.innerHeight);

  TOPPANO.gv.container.bound.bottom = window.innerHeight;
  TOPPANO.gv.container.bound.right = window.innerWidth;
  TOPPANO.gv.control.bound.bottom = TOPPANO.gv.container.bound.bottom;
  TOPPANO.gv.control.bound.right = TOPPANO.gv.container.bound.right;
};
