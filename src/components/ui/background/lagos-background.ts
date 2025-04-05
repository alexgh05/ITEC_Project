
export const drawLagosBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  // Vibrant sunny beaches and latin patterns
  const time = performance.now() * 0.001;
  
  // Draw sunny background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(255, 210, 120, 0.5)');  // Sunny sky
  gradient.addColorStop(0.6, 'rgba(255, 180, 100, 0.3)'); // Horizon
  gradient.addColorStop(1, 'rgba(100, 200, 255, 0.3)');  // Ocean
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw sun
  const sunX = canvas.width * 0.75;
  const sunY = canvas.height * 0.2;
  const sunRadius = 70;
  
  const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
  sunGradient.addColorStop(0, 'rgba(255, 220, 100, 0.8)');
  sunGradient.addColorStop(0.8, 'rgba(255, 150, 50, 0.3)');
  sunGradient.addColorStop(1, 'rgba(255, 150, 50, 0)');
  
  ctx.beginPath();
  ctx.fillStyle = sunGradient;
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw beach with palm trees
  const beachHeight = canvas.height * 0.3;
  ctx.fillStyle = 'rgba(255, 220, 150, 0.4)';  // Sand color
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - beachHeight);
  
  // Wavy beach line
  for (let x = 0; x <= canvas.width; x += 20) {
    const y = canvas.height - beachHeight + Math.sin(x * 0.01 + time) * 10;
    ctx.lineTo(x, y);
  }
  
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fill();
  
  // Draw ocean waves
  ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - beachHeight + i * 20 + Math.sin(time * 2) * 5);
    
    for (let x = 0; x <= canvas.width; x += 20) {
      const waveHeight = Math.sin(x * 0.02 + time * (1 + i * 0.2)) * 10;
      ctx.lineTo(x, canvas.height - beachHeight + i * 20 + waveHeight);
    }
    
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
  }
  
  // Draw palm trees
  for (let i = 0; i < 5; i++) {
    const x = canvas.width * (0.1 + i * 0.2);
    const y = canvas.height - beachHeight;
    
    // Tree trunk
    ctx.fillStyle = 'rgba(120, 80, 40, 0.6)';
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.quadraticCurveTo(x + 5, y - 80, x + 15, y - 120);
    ctx.lineTo(x + 20, y - 120);
    ctx.quadraticCurveTo(x + 10, y - 80, x + 10, y);
    ctx.closePath();
    ctx.fill();
    
    // Palm leaves
    ctx.fillStyle = 'rgba(50, 200, 50, 0.5)';
    for (let j = 0; j < 7; j++) {
      const angle = j * Math.PI / 3.5 + time * 0.2;
      const leafLength = 50 + Math.random() * 20;
      
      ctx.beginPath();
      ctx.moveTo(x + 15, y - 120);
      ctx.quadraticCurveTo(
        x + 15 + Math.cos(angle) * leafLength * 0.6,
        y - 120 + Math.sin(angle) * leafLength * 0.6,
        x + 15 + Math.cos(angle) * leafLength,
        y - 120 + Math.sin(angle) * leafLength
      );
      ctx.lineTo(
        x + 15 + Math.cos(angle) * leafLength * 0.9,
        y - 120 + Math.sin(angle) * leafLength * 1.1
      );
      ctx.quadraticCurveTo(
        x + 15 + Math.cos(angle) * leafLength * 0.5,
        y - 120 + Math.sin(angle) * leafLength * 0.5,
        x + 15,
        y - 120
      );
      ctx.closePath();
      ctx.fill();
    }
  }

    // Draw static pineapples (no animation)
    for (let i = 0; i < 6; i++) {
      const x = canvas.width * (0.05 + i * 0.15); // Fixed positions, no animation
      const y = canvas.height - beachHeight * 1.1 - (i % 3) * beachHeight * 0.1; // Slight height variation
      const size = 20 + (i % 4) * 3; // Slight size variation
      
      // Draw pineapple body
      ctx.fillStyle = 'rgba(255, 200, 0, 0.7)';  // Yellow-orange
      ctx.beginPath();
      ctx.ellipse(x, y + size * 0.6, size * 0.5, size, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Diamond pattern on pineapple
      ctx.strokeStyle = 'rgba(150, 100, 0, 0.4)';
      ctx.lineWidth = 1;
      for (let j = 0; j < 10; j++) {
        const angle = j * Math.PI / 5;
        for (let k = 0; k < 3; k++) {
          ctx.beginPath();
          ctx.arc(
            x + Math.cos(angle) * (k * size * 0.2), 
            y + size * 0.6 + Math.sin(angle) * (k * size * 0.15),
            size * 0.1,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      }
      
      // Draw pineapple crown
      ctx.fillStyle = 'rgba(20, 150, 20, 0.6)';  // Green
      for (let j = 0; j < 7; j++) {
        const angle = (j / 7) * Math.PI - Math.PI / 2;
        ctx.beginPath();
        ctx.ellipse(
          x + Math.cos(angle) * size * 0.2,
          y - size * 0.3 + Math.sin(angle) * size * 0.2,
          size * 0.15,
          size * 0.4,
          angle,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  
  // Draw colorful patterns
  for (let i = 0; i < 15; i++) {
    const x = (Math.sin(time * 0.2 + i * 0.5) + 1) * 0.5 * canvas.width;
    const y = (Math.cos(time * 0.3 + i * 0.7) + 1) * 0.3 * canvas.height;
    const size = 15 + Math.sin(time + i) * 5;
    
    ctx.fillStyle = `hsla(${(i * 30 + time * 20) % 360}, 80%, 60%, 0.2)`;
    
    // Draw geometric patterns
    ctx.beginPath();
    if (i % 3 === 0) {
      // Triangle
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x - size, y + size);
    } else if (i % 3 === 1) {
      // Diamond
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
    } else {
      // Circle
      ctx.arc(x, y, size, 0, Math.PI * 2);
    }
    ctx.closePath();
    ctx.fill();
  }
};
