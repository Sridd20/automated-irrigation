const fs = require('fs');

const frames = 5; // 0%, 20%, ..., 100%
let css = '';
for (let i = 0; i <= frames; i++) {
  const percentComplete = i / frames;
  const progressPercent = percentComplete * 100;
  
  const baseHeight = 100 - progressPercent;
  const amplitude = Math.sin(percentComplete * Math.PI) * 10;
  
  let points = [];
  const numPoints = 60; // extremely smooth
  for (let j = 0; j <= numPoints; j++) {
    const x = (j / numPoints) * 100;
    const phaseX = (j / numPoints) * Math.PI * 4;
    const phaseT = percentComplete * Math.PI * 5;
    
    const yWave = Math.sin(phaseX - phaseT) * amplitude;
    let y = baseHeight + yWave;
    
    points.push(x.toFixed(1) + '% ' + y.toFixed(1) + '%');
  }
  
  points.push('100% 100%', '0% 100%');
  
  css += '  ' + progressPercent + '% {\n';
  css += '    clip-path: polygon(\n';
  css += '      ' + points.join(', ') + '\n';
  css += '    );\n';
  css += '  }\n';
}

fs.writeFileSync('wave_css.txt', css);
