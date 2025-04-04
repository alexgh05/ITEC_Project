
export const drawSeoulBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  // K-pop inspired with cute aesthetics and pastels
  const time = performance.now() * 0.001;
  
  // Draw pastel gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, 'rgba(255, 200, 230, 0.5)'); // Pink
  gradient.addColorStop(0.3, 'rgba(230, 200, 255, 0.5)'); // Lavender
  gradient.addColorStop(0.7, 'rgba(200, 230, 255, 0.5)'); // Baby blue
  gradient.addColorStop(1, 'rgba(255, 230, 200, 0.5)'); // Light orange
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw hearts of different sizes and colors
  for (let i = 0; i < 20; i++) {
    const x = (Math.sin(time * 0.3 + i * 0.4) + 1) * 0.5 * canvas.width;
    const y = (Math.cos(time * 0.2 + i * 0.5) + 1) * 0.5 * canvas.height;
    const size = 5 + Math.sin(time + i) * 3 + Math.random() * 15;
    
    ctx.fillStyle = `hsla(${(i * 20 + time * 10) % 360}, 80%, 80%, ${0.3 + Math.sin(time + i) * 0.2})`;
    
    // Draw heart
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    // Left curve
    ctx.bezierCurveTo(
      x - size / 2, y - size / 2,
      x - size, y - size / 4,
      x, y - size
    );
    // Right curve
    ctx.bezierCurveTo(
      x + size, y - size / 4,
      x + size / 2, y - size / 2,
      x, y + size / 4
    );
    ctx.fill();
  }
  
  // Draw cute kitten silhouettes
  for (let i = 0; i < 5; i++) {
    const x = canvas.width * (0.2 + i * 0.15);
    const y = canvas.height * 0.6;
    const size = 20 + Math.sin(time + i) * 5;
    
    // Kitten body color
    ctx.fillStyle = `hsla(${(i * 40) % 360}, 70%, 80%, 0.6)`;
    
    // Cat body
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Head
    ctx.beginPath();
    ctx.arc(x, y - size * 0.8, size * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // Ears
    ctx.beginPath();
    ctx.moveTo(x - size * 0.4, y - size * 1.2);
    ctx.lineTo(x - size * 0.2, y - size * 1.5);
    ctx.lineTo(x, y - size * 1.2);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(x, y - size * 1.2);
    ctx.lineTo(x + size * 0.2, y - size * 1.5);
    ctx.lineTo(x + size * 0.4, y - size * 1.2);
    ctx.closePath();
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    ctx.beginPath();
    ctx.ellipse(x - size * 0.2, y - size * 0.8, size * 0.08, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(x + size * 0.2, y - size * 0.8, size * 0.08, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw shiny stars and glitter
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 1 + Math.random() * 3 * (Math.sin(time * 3 + i) * 0.5 + 0.5);
    
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.sin(time * 3 + i) * 0.6})`;
    
    // Draw star
    ctx.beginPath();
    for (let j = 0; j < 5; j++) {
      const radius = j % 2 === 0 ? size : size * 0.4;
      const angle = (j * 2 * Math.PI / 10) + time + i;
      const starX = x + radius * Math.cos(angle);
      const starY = y + radius * Math.sin(angle);
      
      if (j === 0) {
        ctx.moveTo(starX, starY);
      } else {
        ctx.lineTo(starX, starY);
      }
    }
    ctx.closePath();
    ctx.fill();
  }
  
  // Draw flowing K-pop music notes
  for (let i = 0; i < 15; i++) {
    const x = (time * 50 + i * 100) % canvas.width;
    const y = canvas.height * 0.3 + Math.sin(x * 0.01 + time) * 100;
    
    // Music note body
    ctx.fillStyle = `hsla(${(i * 20 + time * 30) % 360}, 90%, 70%, 0.6)`;
    ctx.beginPath();
    ctx.ellipse(x, y, 10, 8, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Music note stem
    ctx.strokeStyle = `hsla(${(i * 20 + time * 30) % 360}, 90%, 70%, 0.6)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 7, y - 7);
    ctx.lineTo(x + 7, y - 30);
    ctx.stroke();
  }
};
