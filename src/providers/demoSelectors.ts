import type { DemoState, Incident } from '@/types/demo';

/** Incidente propio activo (SOS en curso). */
export function liveAlert(s: DemoState): Incident | null {
  return s.incidents.find((x) => x.id === s.alertId && x.active) ?? null;
}

/** Incidente propio, activo o no. */
export function ownIncident(s: DemoState): Incident | null {
  return s.incidents.find((x) => x.id === s.alertId) ?? null;
}

/** Un incidente se considera recibido cuando no quedó en cola sin conexión. */
export function received(a: Incident | null | undefined): a is Incident {
  return !!a && a.status !== 'queued';
}

export function contact(s: DemoState, id: string) {
  return s.contacts.find((c) => c.id === id);
}

export function alertContacts(s: DemoState) {
  return s.contacts.filter((c) => c.alerts);
}

export function incidentById(s: DemoState, id: string | null | undefined) {
  return s.incidents.find((a) => a.id === (id || s.selectedIncident));
}

/** ¿Elena (cuenta familiar) puede seguir a Camila? El parentesco no reemplaza el consentimiento. */
export function followAllowed(s: DemoState): boolean {
  const a = liveAlert(s);
  return !!(
    (a && received(a) && a.family && a.recipients?.includes('elena')) ||
    (s.share.active && s.share.recipients.includes('elena'))
  );
}

export function followHasPosition(s: DemoState): boolean {
  const a = liveAlert(s);
  return !!(
    (s.share.active && s.share.recipients.includes('elena')) ||
    (a && received(a) && a.family && a.recipients?.includes('elena') && a.pos)
  );
}

/** Alertas comunitarias visibles para la persona que explora el mapa cercano. */
export function nearAlerts(s: DemoState): Incident[] {
  return s.incidents.filter(
    (a) =>
      a.active &&
      a.public &&
      received(a) &&
      (a.distance || 120) <= s.radius &&
      (s.nearFilter === 'all' ||
        (s.nearFilter === 'care' && a.kind !== 'medical') ||
        (s.nearFilter === 'medical' && a.kind === 'medical')),
  );
}

/**
 * Alertas recibidas de personas cercanas (mostrador de alertas).
 * No depende del filtro del explorador "Cerca", solo del radio elegido.
 */
export function nearbyFeed(s: DemoState): Incident[] {
  return s.incidents.filter(
    (a) => a.active && a.public && received(a) && (a.distance || 120) <= s.radius,
  );
}

/** Nombre de la persona activa (para ofrecimientos y mensajes). */
export function helperName(s: DemoState): string {
  return s.role === 'guardian' ? 'Elena' : s.role === 'community' ? 'Nicolás' : 'Camila';
}

export function unreadCount(s: DemoState): number {
  return (
    s.notifications.filter((n) => !n.read && (n.role ?? 'self') === s.role).length +
    (s.role === 'guardian' && liveAlert(s)?.family && received(liveAlert(s)) ? 1 : 0)
  );
}
