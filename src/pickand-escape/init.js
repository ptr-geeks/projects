var mouse = { x: 0, y: 0, pressed: false };
var keyboard = {};
document.addEventListener("DOMContentLoaded", function() {
  // Ta del kode se zazene na zacetku

  // Poskrbimo za pravilno raztegovanje okna
  var doResize = function() {
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", doResize);
  doResize();

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  // Zazenemo glavni del programa (ki ga sprogramirate vi)
  main();
});

function handleKeyDown(e) {
  // Tipka je bila pritisnena
  console.log("Tipka", e.key);
  keyboard[e.key] = true;
}
function handleKeyUp(e) {
  // Tipka je bila spuscena
  delete keyboard[e.key];
}

function handleMouseDown(e) {
  // Tipka na miski je bila pritisnjena
  console.log("MouseDown", e);
  mouse.pressed = true;
}
function handleMouseMove(e) {
  // Miska se je premaknila
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}
function handleMouseUp(e) {
  // Tipka na miski je bila spuscena
  mouse.pressed = false;
}
