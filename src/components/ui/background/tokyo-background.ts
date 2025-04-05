
export const drawTokyoBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  // Tokyo nightlife with neon grids and LED panels
  const time = performance.now() * 0.001;
  
  // Draw dark background with city silhouette
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(10, 10, 30, 0.8)');
  gradient.addColorStop(1, 'rgba(40, 10, 60, 0.8)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw neon grid
  ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)';
  ctx.lineWidth = 1;
  
  const gridSize = 40;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Draw neon LED panels with Japanese characters
  for (let i = 0; i < 8; i++) {
    const x = (Math.sin(time * 0.5 + i * 1.4) + 1) * 0.5 * canvas.width;
    const y = (Math.cos(time * 0.3 + i * 0.8) + 1) * 0.3 * canvas.height;
    const size = 50 + Math.sin(time + i) * 10;
    
    // LED panel background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x - size/2, y - size/2, size, size);
    
    // LED panel border
    ctx.strokeStyle = `hsl(${(i * 40 + time * 20) % 360}, 100%, 70%)`;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - size/2, y - size/2, size, size);
    
    // Japanese characters (simulated)
    ctx.fillStyle = `hsl(${(i * 40 + time * 20) % 360}, 100%, 70%)`;
    ctx.font = `${size/3}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('ト キ オ', x, y + size/10);
  }
  
  for (let i = 0; i < 3; i++) {
    const x = ((time * (0.1 + i * 0.05)) % 2) * canvas.width - 180;
    const y = canvas.height - 100 - i * 60;
  
    // Car body - sleek, low-profile design
    ctx.fillStyle = 'rgb(132, 0, 114)';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 50, y - 10);
    ctx.lineTo(x + 90, y - 25); // angled front
    ctx.lineTo(x + 140, y - 25); // roof front
    ctx.lineTo(x + 170, y - 10); // roof back
    ctx.lineTo(x + 220, y);
    ctx.lineTo(x + 220, y + 25);
    ctx.lineTo(x, y + 25);
    ctx.closePath();
    ctx.fill();
  
    // Car windows - sharp & low
    ctx.fillStyle = 'rgba(100, 200, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(x + 90, y - 25);
    ctx.lineTo(x + 140, y - 25);
    ctx.lineTo(x + 165, y - 10);
    ctx.lineTo(x + 95, y - 10);
    ctx.closePath();
    ctx.fill();
  
    // Wheels - bigger, sportier
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.beginPath();
    ctx.arc(x + 60, y + 25, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 170, y + 25, 13, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Floating treats (unchanged)
  for (let i = 0; i < 20; i++) {
    const x = (Math.sin(time * 0.5 + i * 0.4) + 1) * canvas.width * 0.5;
    const y = (Math.cos(time * 0.3 + i * 0.3) + 1) * canvas.height * 0.5;
    const radius = 3 + Math.sin(time + i) * 1;
  
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
    gradient.addColorStop(0, 'rgba(255, 200, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw floating particles like sweets and treats
  for (let i = 0; i < 20; i++) {
    const x = (Math.sin(time * 0.5 + i * 0.4) + 1) * canvas.width * 0.5;
    const y = (Math.cos(time * 0.3 + i * 0.3) + 1) * canvas.height * 0.5;
    const radius = 3 + Math.sin(time + i) * 1;
    
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
    gradient.addColorStop(0, 'rgba(255, 200, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
    ctx.fill();
  }
};
