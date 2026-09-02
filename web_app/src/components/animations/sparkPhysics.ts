export interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  createdAt: number;
  lifeMs: number;
}

/**
 * Generates an explosive burst of sparks around a center coordinate
 */
export function createSparkBurst(
  originX: number,
  originY: number,
  count: number = 14,
  colors: string[] = ['#d97706', '#0d9488', '#f59e0b', '#10b981', '#ffffff']
): SparkParticle[] {
  const particles: SparkParticle[] = [];
  const now = performance.now();

  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = 60 + Math.random() * 90; // pixels per second
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 2.5 + Math.random() * 2.5;
    const lifeMs = 450 + Math.random() * 200;

    particles.push({
      x: originX,
      y: originY,
      vx,
      vy,
      size,
      color,
      alpha: 1.0,
      createdAt: now,
      lifeMs,
    });
  }

  return particles;
}

/**
 * Updates physics for particle pool
 */
export function updateParticles(
  particles: SparkParticle[],
  now: number,
  dtSeconds: number,
  gravity: number = 120
): SparkParticle[] {
  return particles
    .map((p) => {
      const elapsed = now - p.createdAt;
      const progress = Math.min(1, elapsed / p.lifeMs);
      const alpha = Math.max(0, 1 - Math.pow(progress, 1.5));

      return {
        ...p,
        x: p.x + p.vx * dtSeconds,
        y: p.y + p.vy * dtSeconds + 0.5 * gravity * dtSeconds * dtSeconds,
        vy: p.vy + gravity * dtSeconds,
        alpha,
      };
    })
    .filter((p) => now - p.createdAt < p.lifeMs && p.alpha > 0.01);
}
