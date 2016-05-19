export function shareTwitter(link) {
  let position_left = screen.width / 2 - 400;
  var position_top = screen.height / 2 - 200;
  var spec ='height=400,width=800,top=' + position_top.toString() + ',left=' + position_left.toString();
  var url = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(link);
  window.open(url, 'name', spec);
}
