
export const drawBerlinBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  const time = performance.now() * 0.001;
  
  // Dark industrial background with purple tint for Berlin techno scene
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, 'rgba(30, 10, 40, 0.4)');
  gradient.addColorStop(1, 'rgba(20, 5, 30, 0.4)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw industrial grid pattern
  const gridSpacing = 60;
  ctx.strokeStyle = 'rgba(200, 100, 255, 0.15)';
  ctx.lineWidth = 1;
  
  // Draw horizontal lines
  for (let y = 0; y < canvas.height; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    
    for (let x = 0; x < canvas.width; x += 20) {
      const offsetY = Math.sin(x * 0.01 + time * 0.5) * 5;
      ctx.lineTo(x, y + offsetY);
    }
    
    ctx.stroke();
  }
  
  // Draw vertical lines
  for (let x = 0; x < canvas.width; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    
    for (let y = 0; y < canvas.height; y += 20) {
      const offsetX = Math.sin(y * 0.01 + time * 0.5) * 5;
      ctx.lineTo(x + offsetX, y);
    }
    
    ctx.stroke();
  }
  
  // Draw techno music visualizer - frequency bars
  const numBars = 16;
  const barWidth = canvas.width / numBars;
  const maxBarHeight = canvas.height * 0.3;
  
  for (let i = 0; i < numBars; i++) {
    // Create height pattern that simulates audio frequencies
    const barHeight = (Math.sin(time * 1.5 + i * 0.4) * 0.5 + 0.5) * maxBarHeight;
    
    // Create a gradient for each bar
    const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(180, 70, 240, 0.6)');
    gradient.addColorStop(1, 'rgba(100, 20, 180, 0.2)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
  }
  
  // Draw pulsing geometric shapes
  for (let i = 0; i < 10; i++) {
    const x = canvas.width * 0.5 + Math.cos(time * 0.3 + i) * canvas.width * 0.4;
    const y = canvas.height * 0.5 + Math.sin(time * 0.4 + i) * canvas.height * 0.4;
    const size = 20 + Math.sin(time * 0.8 + i * 0.5) * 10;
    
    // Different shape types
    if (i % 3 === 0) {
      // Circle
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 100, 255, ${0.1 + Math.sin(time + i) * 0.05})`;
      ctx.fill();
    } else if (i % 3 === 1) {
      // Rectangle
      ctx.fillStyle = `rgba(160, 60, 200, ${0.1 + Math.sin(time + i) * 0.05})`;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    } else {
      // Triangle
      ctx.beginPath();
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x + size / 2, y + size / 2);
      ctx.lineTo(x - size / 2, y + size / 2);
      ctx.closePath();
      ctx.fillStyle = `rgba(140, 40, 180, ${0.1 + Math.sin(time + i) * 0.05})`;
      ctx.fill();
    }
  }
  
  // Draw Berlin TV Tower silhouette
  const tvTowerX = canvas.width * 0.5;
  const tvTowerHeight = canvas.height * 0.4;
  const tvTowerY = canvas.height - tvTowerHeight;
  
  ctx.fillStyle = 'rgba(10, 5, 15, 0.5)';
  ctx.beginPath();
  
  // Tower base
  ctx.moveTo(tvTowerX - 40, canvas.height);
  ctx.lineTo(tvTowerX - 30, tvTowerY + tvTowerHeight * 0.7);
  ctx.lineTo(tvTowerX + 30, tvTowerY + tvTowerHeight * 0.7);
  ctx.lineTo(tvTowerX + 40, canvas.height);
  
  // Tower shaft
  ctx.moveTo(tvTowerX - 15, tvTowerY + tvTowerHeight * 0.7);
  ctx.lineTo(tvTowerX - 15, tvTowerY + tvTowerHeight * 0.2);
  ctx.lineTo(tvTowerX + 15, tvTowerY + tvTowerHeight * 0.2);
  ctx.lineTo(tvTowerX + 15, tvTowerY + tvTowerHeight * 0.7);
  
  // Tower sphere
  ctx.arc(tvTowerX, tvTowerY + tvTowerHeight * 0.1, 25, 0, Math.PI * 2);
  
  // Tower antenna
  ctx.moveTo(tvTowerX, tvTowerY + tvTowerHeight * 0.1);
  ctx.lineTo(tvTowerX, tvTowerY - tvTowerHeight * 0.1);
  
  ctx.fill();
};
