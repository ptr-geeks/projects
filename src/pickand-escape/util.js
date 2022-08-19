// primer uporabe:
// drawImageRotated(context, slikaDuhca, x, y, slikaDuhca.width * scale, slikaDuhca.height * scale, angle);
function drawImageRotated(context, image, x, y, width, height, angle) {
    if (!angle) angle = 0;
    context.translate(x +width/2, y +height/2);
    context.rotate(angle);
    context.translate(-x -width/2, -y -height/2);
    context.drawImage(image, x, y, width, height);
    context.setTransform(1, 0, 0, 1, 0, 0);
  }