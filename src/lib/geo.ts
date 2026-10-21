import type { LatLng } from '@/types/demo';

/** Posición base del escenario ficticio (Minas, Lavalleja). */
export const BASE_POS: LatLng = [-34.3759, -55.2377];

/**
 * Proyección esquemática lat/lng → plano vectorial 1000×800.
 * La geometría es deliberadamente ilustrativa: no representa calles reales.
 */
export function xy(p: LatLng): [number, number] {
  return [((p[1] + 55.255) / 0.035) * 1000, ((-34.362 - p[0]) / 0.028) * 800];
}

/** Radio de búsqueda en formato legible. */
export function formatRadius(radius: number): string {
  return radius < 1000 ? `${radius} m` : `${radius / 1000} km`;
}
