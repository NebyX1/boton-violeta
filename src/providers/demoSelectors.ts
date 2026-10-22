import type { DemoState, Incident } from '@/types/demo';

/** Incidente propio activo (SOS en curso). */
export function liveAlert(s: DemoState): Incident | null {
  return s.incidents.find((x) => x.id === s.alertId && x.active) ?? null;
}

/**
 * SOS activo del dispositivo que estamos usando.
 * Al cambiar de perfil, la alerta de otro dispositivo no se vuelve propia.
 */
export function ownAlert(s: DemoState): Incident | null {
  const a = liveAlert(s);
  if (!a) return null;
  const owner = a.ownerProfileId ?? s.activeProfileId;
  return owner === s.activeProfileId ? a : null;
}

/** Alertas activas de otros dispositivos vinculados (para familia y comunidad). */
export function otherActiveAlerts(s: DemoState): Incident[] {
  return s.incidents.filter(
    (a) => a.active && (!a.ownerProfileId || a.ownerProfileId !== s.activeProfileId),
  );
}

/**
 * Alerta de una persona del círculo que este dispositivo puede acompañar.
 * Solo si fue incluido como destinatario y la alerta sigue activa.
 */
export function watchedAlert(s: DemoState): Incident | null {
  const me = activeProfile(s);
  if (!me) return null;
  return (
    otherActiveAlerts(s).find(
      (a) => a.owner === 'self' && received(a) && a.recipients?.includes(me.id),
    ) ?? null
  );
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

/** ¿La cuenta familiar activa puede seguir a la persona? El parentesco no reemplaza el consentimiento. */
export function followAllowed(s: DemoState): boolean {
  const a = watchedAlert(s);
  return !!(a || (s.share.active && s.share.recipients.includes(activeProfile(s)?.id ?? '')));
}

export function followHasPosition(s: DemoState): boolean {
  const a = watchedAlert(s);
  return !!(
    (s.share.active && s.share.recipients.includes(activeProfile(s)?.id ?? '')) ||
    (a && a.pos)
  );
}

/** Alertas comunitarias visibles para la persona que explora el mapa cercano. */
export function nearAlerts(s: DemoState): Incident[] {
  return s.incidents.filter(
    (a) =>
      a.active &&
      a.public &&
      received(a) &&
      (a.ownerProfileId ?? '') !== s.activeProfileId &&
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
    (a) =>
      a.active &&
      a.public &&
      received(a) &&
      (a.ownerProfileId ?? '') !== s.activeProfileId &&
      (a.distance || 120) <= s.radius,
  );
}

/** Perfil activo: el dispositivo que se está encarnando en la demo. */
export function activeProfile(s: DemoState) {
  return (
    s.profiles.find((p) => p.id === s.activeProfileId) ??
    s.profiles.find((p) => p.role === s.role) ??
    s.profiles[0]
  );
}

/** Nombre de la persona activa (para ofrecimientos y mensajes). */
export function helperName(s: DemoState): string {
  return activeProfile(s)?.name ?? 'Camila Ríos';
}

export function unreadCount(s: DemoState): number {
  return (
    s.notifications.filter((n) => !n.read && (n.role ?? 'self') === s.role).length +
    (s.role === 'guardian' && watchedAlert(s) ? 1 : 0)
  );
}
