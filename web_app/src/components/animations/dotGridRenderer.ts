export interface DotGridConfig {
  spacing: number;
  baseRadius: number;
  maxRadius: number;
  baseColor: string;
  activeColor: string;
  influenceRadius: number;
}

/**
 * Draws high performance dot matrix with interactive mouse proximity wave on HTML5 Canvas
 */
export function renderDotGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mouseX: number,
  mouseY: number,
  isHovered: boolean,
  config: DotGridConfig
) {
  ctx.clearRect(0, 0, width, height);

  const { spacing, baseRadius, maxRadius, baseColor, activeColor, influenceRadius } = config;
  const cols = Math.ceil(width / spacing) + 1;
  const rows = Math.ceil(height / spacing) + 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * spacing;
      const y = r * spacing;

      let radius = baseRadius;
      let color = baseColor;

      if (isHovered && mouseX >= 0 && mouseY >= 0) {
        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < influenceRadius) {
          const factor = Math.pow(1 - dist / influenceRadius, 2);
          radius = baseRadius + (maxRadius - baseRadius) * factor;
          color = activeColor;
        }
      }

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
}
