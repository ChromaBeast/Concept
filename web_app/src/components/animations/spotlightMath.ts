export interface SpotlightCoords {
  x: number;
  y: number;
}

/**
 * Calculates pointer position relative to element bounding box
 */
export function calculateRelativeCoords(
  clientX: number,
  clientY: number,
  element: HTMLElement
): SpotlightCoords {
  const rect = element.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

/**
 * Generates dynamic radial gradient string for CSS background
 */
export function buildSpotlightGradient(
  x: number,
  y: number,
  radius: number,
  color: string,
  opacity: number
): string {
  return `radial-gradient(${radius}px circle at ${x}px ${y}px, ${color}, transparent 80%)`;
}
