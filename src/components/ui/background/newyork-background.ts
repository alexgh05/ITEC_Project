export const drawNewYorkBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  // Darker urban grid with buildings and hip-hop elements
  const time = performance.now() * 0.001;
  
  // Draw dark urban background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(10, 15, 30, 0.9)');
  gradient.addColorStop(1, 'rgba(30, 40, 60, 0.9)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw city skyline with Empire State Building
  ctx.fillStyle = 'rgba(15, 20, 40, 0.8)';
  
  // Empire State Building (center)
  const empireX = canvas.width * 0.5;
  const empireBaseWidth = 120;
  const empireHeight = 350;
  const empireY = canvas.height - empireHeight;
  
  // Main body
  ctx.fillRect(empireX - empireBaseWidth/2, empireY, empireBaseWidth, empireHeight * 0.7);
  
  // Upper sections
  const upperWidth = empireBaseWidth * 0.6;
  ctx.fillRect(empireX - upperWidth/2, empireY, upperWidth, empireHeight * 0.85);
  
  // Spire
  const spireWidth = empireBaseWidth * 0.1;
  ctx.fillRect(empireX - spireWidth/2, empireY, spireWidth, empireHeight);
  
  // Windows (lights)
  for (let y = empireY + 20; y < canvas.height - 20; y += 20) {
    for (let x = empireX - empireBaseWidth/2 + 10; x < empireX + empireBaseWidth/2; x += 25) {
      if (Math.random() > 0.4) {
        ctx.fillStyle = `rgba(255, 255, 150, ${0.3 + Math.random() * 0.5})`;
        ctx.fillRect(x, y, 10, 10);
      }
    }
  }
  
  // Other buildings
  for (let i = 0; i < canvas.width; i += 60) {
    if (Math.abs(i - empireX) < empireBaseWidth) continue; // Skip where Empire State is
    
    const height = 100 + Math.sin(i * 0.01 + time) * 30 + Math.random() * 150;
    const width = 30 + Math.random() * 40;
    
    ctx.fillStyle = 'rgba(20, 30, 50, 0.8)';
    ctx.fillRect(i, canvas.height - height, width, height);
    
    // Windows
    ctx.fillStyle = 'rgba(255, 255, 150, 0.2)';
    for (let y = canvas.height - height + 10; y < canvas.height - 10; y += 20) {
      for (let x = i + 5; x < i + width - 5; x += 15) {
        if (Math.random() > 0.3) {
          ctx.fillRect(x, y, 8, 8);
        }
      }
    }
  }
  
  // Draw grid lines like streets
  ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)';
  ctx.lineWidth = 1;
  
  const gridSize = 60;
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
  
  // Draw floating vinyl records and microphones
  for (let i = 0; i < 8; i++) {
    const x = (Math.sin(time * 0.2 + i * 0.7) + 1) * 0.5 * canvas.width;
    const y = (Math.cos(time * 0.3 + i * 0.8) + 1) * 0.5 * canvas.height;
    const size = 25 + Math.sin(time + i) * 5;
    
    // Draw vinyl record
    ctx.beginPath();
    ctx.fillStyle = 'rgba(30, 30, 30, 0.8)';
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.fillStyle = 'rgba(60, 60, 60, 0.8)';
    ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.fillStyle = 'rgba(30, 30, 30, 0.8)';
    ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 180, 0, 0.3)';
    ctx.arc(x, y, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }
};
