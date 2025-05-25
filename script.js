const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

// Function to generate gradient colors
function generateGradientColors(startColor, endColor, steps) {
  const start = parseInt(startColor.slice(1), 16);
  const end = parseInt(endColor.slice(1), 16);
  
  const startR = (start >> 16) & 0xff;
  const startG = (start >> 8) & 0xff;
  const startB = start & 0xff;
  
  const endR = (end >> 16) & 0xff;
  const endG = (end >> 8) & 0xff;
  const endB = end & 0xff;
  
  const colors = [];
  
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1); // Normalize t to range [0, 1]
    const r = Math.round(startR + t * (endR - startR));
    const g = Math.round(startG + t * (endG - startG));
    const b = Math.round(startB + t * (endB - startB));
    colors.push(`#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`);
  }
  
  return colors;
}

// Generate colors dynamically based on the number of circles
const colors = generateGradientColors("#2720ff", "#000000", circles.length);

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = colors[index];
});

window.addEventListener("mousemove", function(e){
  coords.x = e.clientX;
  coords.y = e.clientY;
});

function animateCircles() {
  let x = coords.x;
  let y = coords.y;
  
  circles.forEach(function (circle, index) {
    circle.style.left = x - 12 + "px";
    circle.style.top = y - 12 + "px";
    
    circle.style.scale = (circles.length - index) / circles.length;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });
 
  requestAnimationFrame(animateCircles);
}

animateCircles();
