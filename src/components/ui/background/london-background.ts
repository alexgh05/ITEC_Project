export const drawLondonBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  const time = performance.now() * 0.001;
  
  // Dark background with blue tint for London drill/electronic scene
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, 'rgba(10, 15, 30, 0.4)');
  gradient.addColorStop(1, 'rgba(5, 10, 20, 0.4)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw urban grid lines
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
  
  // Draw falling balaclavas - improved visibility with black background and white/light gray features
  const numBalaclavas = 8;
  for (let i = 0; i < numBalaclavas; i++) {
    // Create falling animation with different speeds
    const yOffset = (time * (50 + i * 20)) % canvas.height;
    const xPosition = canvas.width * (0.1 + (i * 0.1) + Math.sin(time + i) * 0.05);
    const size = 30 + Math.sin(i * 0.5) * 10;
    const rotation = Math.sin(time + i) * 0.2;
    
    // Draw balaclava (improved visibility)
    ctx.save();
    ctx.translate(xPosition, yOffset);
    ctx.rotate(rotation);
    
    // Main balaclava shape (pure black for better visibility)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.6, size, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add white/gray border for contrast
    ctx.strokeStyle = 'rgba(120, 120, 120, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Eye holes (light gray for visibility in both dark and light mode)
    ctx.fillStyle = 'rgba(200, 200, 220, 0.9)';
    // Left eye
    ctx.beginPath();
    ctx.ellipse(-size * 0.25, -size * 0.15, size * 0.15, size * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    // Right eye
    ctx.beginPath();
    ctx.ellipse(size * 0.25, -size * 0.15, size * 0.15, size * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth hole (light gray for visibility in both dark and light mode)
    ctx.beginPath();
    ctx.ellipse(0, size * 0.2, size * 0.3, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  // Draw drill music-inspired bass visualizer bars
  const numBars = 20;
  const barWidth = canvas.width / numBars;
  
  for (let i = 0; i < numBars; i++) {
    // Create height pattern that simulates drill beats
    const height = Math.abs(Math.sin(time * 2 + i * 0.2)) * 40 + 
                   (i % 4 === 0 ? 40 : 20); // Accent on every 4th beat
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
  
  // Draw London skyline silhouette with more urban elements
  const skylineHeight = canvas.height * 0.2;
  const skylineY = canvas.height - skylineHeight;
  
  ctx.fillStyle = 'rgba(0, 0, 10, 0.5)';
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  
  // Tower blocks and urban elements
  for (let i = 0; i < 8; i++) {
    const buildingWidth = canvas.width / 8;
    const buildingX = i * buildingWidth;
    const buildingHeight = skylineHeight * (0.5 + Math.random() * 0.5);
    
    ctx.rect(buildingX, canvas.height - buildingHeight, buildingWidth * 0.8, buildingHeight);
    
    // Add windows to buildings
    ctx.fillStyle = 'rgba(0, 0, 10, 0.5)';
    for (let w = 0; w < 6; w++) {
      for (let h = 0; h < Math.floor(buildingHeight / 20); h++) {
        const windowOn = Math.random() > 0.6;
        if (windowOn) {
          ctx.fillStyle = `rgba(255, 255, 150, ${0.1 + Math.random() * 0.2})`;
        } else {
          ctx.fillStyle = 'rgba(0, 0, 10, 0.5)';
        }
        
        ctx.fillRect(
          buildingX + 10 + w * 15, 
          canvas.height - buildingHeight + 10 + h * 20, 
          8, 
          12
        );
      }
    }
  }
  
  // Big Ben
  const bigBenX = canvas.width * 0.2;
  ctx.fillStyle = 'rgba(0, 0, 10, 0.5)';
  ctx.beginPath();
  ctx.rect(bigBenX - 15, skylineY + skylineHeight * 0.3, 30, skylineHeight * 0.7);
  ctx.rect(bigBenX - 20, skylineY + skylineHeight * 0.2, 40, skylineHeight * 0.1);
  ctx.rect(bigBenX - 10, skylineY, 20, skylineHeight * 0.2);
  ctx.fill();
  
  // The Shard
  const shardX = canvas.width * 0.6;
  ctx.beginPath();
  ctx.moveTo(shardX, skylineY - skylineHeight * 0.5);
  ctx.lineTo(shardX + 30, skylineY + skylineHeight);
  ctx.lineTo(shardX - 30, skylineY + skylineHeight);
  ctx.closePath();
  ctx.fill();

  // Draw enhanced London Eye with more prominence
  const eyeX = canvas.width * 0.8;
  const eyeY = skylineY + skylineHeight * 0.3;
  const eyeRadius = skylineHeight * 0.8; // Increased size for more prominence
  
  // Main wheel structure with brighter color
  ctx.strokeStyle = 'rgba(80, 150, 220, 0.6)'; // Brighter blue color
  ctx.lineWidth = 3; // Thicker line
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  // London Eye spokes with animation
  for (let i = 0; i < 12; i++) { // More spokes
    const angle = i * Math.PI / 6 + time * 0.1; // Added rotation animation
    ctx.lineWidth = i % 3 === 0 ? 3 : 1; // Varying thickness for visual interest
    ctx.beginPath();
    ctx.moveTo(eyeX, eyeY);
    ctx.lineTo(
      eyeX + Math.cos(angle) * eyeRadius,
      eyeY + Math.sin(angle) * eyeRadius
    );
    ctx.stroke();
  }
  
  // London Eye capsules/pods
  for (let i = 0; i < 12; i++) { // Add passenger capsules around the wheel
    const angle = i * Math.PI / 6 + time * 0.1; // Match spoke rotation
    const podX = eyeX + Math.cos(angle) * eyeRadius;
    const podY = eyeY + Math.sin(angle) * eyeRadius;
    
    // Draw capsule
    ctx.fillStyle = 'rgba(220, 220, 250, 0.5)';
    ctx.beginPath();
    ctx.ellipse(podX, podY, eyeRadius * 0.12, eyeRadius * 0.06, angle, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(150, 200, 255, 0.7)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // Center hub of the wheel
  ctx.fillStyle = 'rgba(100, 170, 255, 0.8)';
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, eyeRadius * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(200, 220, 255, 0.9)';
  ctx.lineWidth = 2;
  ctx.stroke();
};
