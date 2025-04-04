
export const drawDefaultBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  // Subtle neutral background
  const time = performance.now() * 0.001;
  
  // Draw soft gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, 'rgba(240, 240, 250, 0.01)');
  gradient.addColorStop(1, 'rgba(220, 225, 235, 0.01)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw floating particles
  for (let i = 0; i < 20; i++) {
    const x = (Math.sin(time * 0.2 + i * 0.5) + 1) * 0.5 * canvas.width;
    const y = (Math.cos(time * 0.3 + i * 0.7) + 1) * 0.5 * canvas.height;
    const size = 2 + Math.sin(time + i) * 1;
    
    ctx.beginPath();
    ctx.fillStyle = 'rgba(200, 200, 220, 0.2)';
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
};
