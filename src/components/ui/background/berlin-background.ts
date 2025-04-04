export const drawBerlinBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  const time = performance.now() * 0.001;
  
  // Dark background with blue tint for Berlin electronic club scene
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, 'rgba(10, 15, 30, 0.4)');
  gradient.addColorStop(1, 'rgba(5, 10, 20, 0.4)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw LED-like grid lines
  const gridSpacing = 50;
  ctx.strokeStyle = 'rgba(30, 150, 255, 0.15)';
  ctx.lineWidth = 1;
  
  // Horizontal lines
  for (let y = 0; y < canvas.height; y += gridSpacing) {
    const offsetY = y + Math.sin(time + y * 0.01) * 5;
    
    ctx.beginPath();
    ctx.moveTo(0, offsetY);
    ctx.lineTo(canvas.width, offsetY);
    ctx.stroke();
  }
  
  // Vertical lines
  for (let x = 0; x < canvas.width; x += gridSpacing) {
    const offsetX = x + Math.sin(time + x * 0.01) * 5;
    
    ctx.beginPath();
    ctx.moveTo(offsetX, 0);
    ctx.lineTo(offsetX, canvas.height);
    ctx.stroke();
  }
  
  // Draw electronic music visualizer bars
  const numBars = 20;
  const barWidth = canvas.width / numBars;
  
  for (let i = 0; i < numBars; i++) {
    const height = Math.sin(time * 2 + i * 0.2) * 40 + 20;
    const barX = i * barWidth;
    const barY = canvas.height - height;
    
    // Create a gradient for each bar
    const barGradient = ctx.createLinearGradient(barX, barY, barX, canvas.height);
    barGradient.addColorStop(0, 'rgba(0, 180, 255, 0.8)');
    barGradient.addColorStop(1, 'rgba(80, 140, 255, 0.2)');
    
    ctx.fillStyle = barGradient;
    ctx.fillRect(barX, barY, barWidth - 2, height);
  }
  
  // Draw pulsing LED dots
  for (let i = 0; i < 40; i++) {
    const x = Math.sin(time * 0.5 + i * 0.3) * canvas.width * 0.5 + canvas.width * 0.5;
    const y = Math.cos(time * 0.7 + i * 0.2) * canvas.height * 0.5 + canvas.height * 0.5;
    const radius = 2 + Math.sin(time * 2 + i) * 1;
    const alpha = 0.3 + Math.sin(time * 3 + i) * 0.2;
    
    // Different colors for the LEDs
    const colors = [
      `rgba(0, 180, 255, ${alpha})`,   // Blue
      `rgba(255, 0, 180, ${alpha})`,   // Pink
      `rgba(180, 255, 0, ${alpha})`    // Green
    ];
    
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw Berlin skyline silhouette
  const skylineHeight = canvas.height * 0.2; // Increased height for more detail
  const skylineY = canvas.height - skylineHeight;
  const waterLevel = canvas.height - skylineHeight * 0.3; // Thames water level
  
  ctx.fillStyle = 'rgba(0, 0, 10, 0.6)'; // Slightly darker for better visibility
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  
  // Left side buildings
  ctx.lineTo(0, skylineY + skylineHeight * 0.4);
  ctx.lineTo(canvas.width * 0.05, skylineY + skylineHeight * 0.5);
  ctx.lineTo(canvas.width * 0.1, skylineY + skylineHeight * 0.3);
  ctx.lineTo(canvas.width * 0.15, skylineY + skylineHeight * 0.4);
  
  // Big Ben and Parliament
  ctx.lineTo(canvas.width * 0.17, skylineY + skylineHeight * 0.4);
  ctx.lineTo(canvas.width * 0.17, skylineY + skylineHeight * 0.1);
  ctx.lineTo(canvas.width * 0.175, skylineY);
  ctx.lineTo(canvas.width * 0.18, skylineY + skylineHeight * 0.1);
  ctx.lineTo(canvas.width * 0.18, skylineY + skylineHeight * 0.3);
  ctx.lineTo(canvas.width * 0.22, skylineY + skylineHeight * 0.3);
  
  // Some mid skyline buildings
  ctx.lineTo(canvas.width * 0.25, skylineY + skylineHeight * 0.35);
  ctx.lineTo(canvas.width * 0.3, skylineY + skylineHeight * 0.25);
  ctx.lineTo(canvas.width * 0.33, skylineY + skylineHeight * 0.45);
  
  // Tower Bridge - Left tower
  ctx.lineTo(canvas.width * 0.35, skylineY + skylineHeight * 0.45);
  ctx.lineTo(canvas.width * 0.35, skylineY + skylineHeight * 0.2);
  ctx.lineTo(canvas.width * 0.37, skylineY + skylineHeight * 0.15);
  ctx.lineTo(canvas.width * 0.39, skylineY + skylineHeight * 0.2);
  ctx.lineTo(canvas.width * 0.39, skylineY + skylineHeight * 0.45);
  
  // Tower Bridge - Span
  ctx.lineTo(canvas.width * 0.41, skylineY + skylineHeight * 0.45);
  ctx.lineTo(canvas.width * 0.41, skylineY + skylineHeight * 0.35);
  ctx.lineTo(canvas.width * 0.49, skylineY + skylineHeight * 0.35);
  ctx.lineTo(canvas.width * 0.49, skylineY + skylineHeight * 0.45);
  
  // Tower Bridge - Right tower
  ctx.lineTo(canvas.width * 0.51, skylineY + skylineHeight * 0.45);
  ctx.lineTo(canvas.width * 0.51, skylineY + skylineHeight * 0.2);
  ctx.lineTo(canvas.width * 0.53, skylineY + skylineHeight * 0.15);
  ctx.lineTo(canvas.width * 0.55, skylineY + skylineHeight * 0.2);
  ctx.lineTo(canvas.width * 0.55, skylineY + skylineHeight * 0.45);
  
  // The Shard
  ctx.lineTo(canvas.width * 0.6, skylineY + skylineHeight * 0.45);
  ctx.lineTo(canvas.width * 0.6, skylineY + skylineHeight * 0.1);
  ctx.lineTo(canvas.width * 0.62, skylineY);
  ctx.lineTo(canvas.width * 0.64, skylineY + skylineHeight * 0.1);
  ctx.lineTo(canvas.width * 0.64, skylineY + skylineHeight * 0.45);
  
  // Berlin TV Tower
  const eyeX = canvas.width * 0.8;
  const eyeY = skylineY + skylineHeight * 0.3;
  const eyeRadius = skylineHeight * 0.6;
  
  // Draw buildings leading to the Eye
  ctx.lineTo(canvas.width * 0.7, skylineY + skylineHeight * 0.4);
  ctx.lineTo(canvas.width * 0.75, skylineY + skylineHeight * 0.35);
  
  // Draw the base of the Berlin TV Tower
  ctx.lineTo(eyeX - eyeRadius, skylineY + skylineHeight * 0.45);
  
  // Draw the Berlin TV Tower
  ctx.arc(eyeX, eyeY, eyeRadius, Math.PI, 0, true);
  
  // Right side buildings
  ctx.lineTo(canvas.width * 0.9, skylineY + skylineHeight * 0.4);
  ctx.lineTo(canvas.width * 0.95, skylineY + skylineHeight * 0.3);
  ctx.lineTo(canvas.width, skylineY + skylineHeight * 0.5);
  ctx.lineTo(canvas.width, canvas.height);
  
  // Complete the silhouette
  ctx.closePath();
  ctx.fill();
  
  // Add Thames river reflection
  ctx.fillStyle = 'rgba(0, 100, 180, 0.1)';
  ctx.fillRect(0, waterLevel, canvas.width, canvas.height - waterLevel);
  
  // Add subtle river waves
  ctx.strokeStyle = 'rgba(0, 150, 255, 0.1)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < 10; i++) {
    const waveY = waterLevel + i * 10 + Math.sin(time * 0.5) * 5;
    
    ctx.beginPath();
    ctx.moveTo(0, waveY);
    
    for (let x = 0; x < canvas.width; x += 20) {
      const offsetY = Math.sin(x * 0.01 + time + i * 0.2) * 2;
      ctx.lineTo(x, waveY + offsetY);
    }
    
    ctx.stroke();
  }
  
  // Add subtle glow to the skyline
  const glowGradient = ctx.createLinearGradient(0, skylineY, 0, waterLevel);
  glowGradient.addColorStop(0, 'rgba(0, 150, 255, 0.05)');
  glowGradient.addColorStop(1, 'rgba(0, 100, 255, 0)');
  ctx.fillStyle = glowGradient;
  ctx.fillRect(0, skylineY, canvas.width, waterLevel - skylineY);
};
