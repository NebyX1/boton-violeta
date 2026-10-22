/** Rutas de la demo. El registro de vigilantes es una web independiente. */

export const REGISTRY_PATH = '/registro-vigilantes';

export function isRegistryPath(): boolean {
  return window.location.pathname.replace(/\/+$/, '').endsWith(REGISTRY_PATH);
}

/** Navegación interna sin recargar (mantiene el estado de la demo). */
export function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
