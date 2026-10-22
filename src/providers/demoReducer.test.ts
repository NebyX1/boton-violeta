import { describe, expect, it } from 'vitest';
import { demoReducer } from '@/providers/demoReducer';
import {
  liveAlert,
  nearAlerts,
  nearbyFeed,
  ownAlert,
  received,
  watchedAlert,
} from '@/providers/demoSelectors';
import { createInitialState } from '@/services/demoData';
import type { DemoState } from '@/types/demo';

function start(): DemoState {
  return createInitialState();
}

describe('demoReducer', () => {
  it('navega y vuelve con el historial', () => {
    let s = start();
    s = demoReducer(s, { type: 'go', screen: 'circle', context: 'elena' });
    expect(s.screen).toBe('circle');
    expect(s.context).toBe('elena');
    s = demoReducer(s, { type: 'back' });
    expect(s.screen).toBe('onboarding');
  });

  it('activa un SOS con audiencia y lo detiene volviendo a privado', () => {
    let s = start();
    s = demoReducer(s, { type: 'startCountdown', publicConsent: false });
    expect(s.sheet).toBe('countdown');
    for (let i = 0; i < 3; i++) s = demoReducer(s, { type: 'countdownTick' });
    const alert = liveAlert(s);
    expect(alert).not.toBeNull();
    expect(alert!.status).toBe('received');
    expect(alert!.family).toBe(true);
    s = demoReducer(s, { type: 'stopSos', reason: 'Estoy en un lugar seguro' });
    expect(liveAlert(s)).toBeNull();
    expect(s.screen).toBe('ended');
  });

  it('inicia en la introducción, permite elegir perfiles y todos pueden activar SOS', () => {
    let s = start();
    expect(s.screen).toBe('onboarding');
    s = demoReducer(s, { type: 'onboardingNext' });
    s = demoReducer(s, { type: 'setOnboarding', step: 2 });
    s = demoReducer(s, { type: 'onboardingNext' });
    expect(s.screen).toBe('roles');

    for (const [role, expectedName] of [
      ['self', 'Camila Ríos'],
      ['guardian', 'Elena Ríos'],
      ['community', 'Nicolás Pérez'],
    ] as const) {
      s = demoReducer(s, { type: 'setRole', role });
      s = demoReducer(s, { type: 'startCountdown', publicConsent: true });
      for (let i = 0; i < 3; i++) s = demoReducer(s, { type: 'countdownTick' });
      expect(liveAlert(s)?.name).toBe(expectedName);
      expect(s.role).toBe(role);
      s = demoReducer(s, { type: 'stopSos', reason: 'Prueba' });
    }
  });

  it('una alerta sin conexión queda pendiente hasta recuperar la red', () => {
    let s = start();
    s = demoReducer(s, { type: 'toggleNetwork' });
    expect(s.online).toBe(false);
    s = demoReducer(s, { type: 'startCountdown', publicConsent: false });
    for (let i = 0; i < 3; i++) s = demoReducer(s, { type: 'countdownTick' });
    const alert = liveAlert(s);
    expect(alert!.status).toBe('queued');
    expect(received(alert)).toBe(false);
    s = demoReducer(s, { type: 'toggleNetwork' });
    expect(liveAlert(s)!.status).toBe('received');
  });

  it('el acompañamiento comparte solo con las cuentas elegidas', () => {
    let s = start();
    s = demoReducer(s, { type: 'toggleSharePerson', id: 'sofi' });
    s = demoReducer(s, { type: 'startSharing' });
    expect(s.share.active).toBe(true);
    expect(s.share.recipients).toEqual(['elena', 'sofi']);
    s = demoReducer(s, { type: 'revokeOne', id: 'sofi' });
    expect(s.share.active).toBe(true);
    s = demoReducer(s, { type: 'revokeOne', id: 'elena' });
    expect(s.share.active).toBe(false);
  });

  it('desvincular un contacto retira sus permisos', () => {
    let s = start();
    expect(s.contacts.some((c) => c.id === 'sofi')).toBe(true);
    s = demoReducer(s, { type: 'unlink', id: 'sofi' });
    expect(s.contacts.some((c) => c.id === 'sofi')).toBe(false);
  });

  it('el radio filtra las alertas comunitarias visibles', () => {
    let s = start();
    expect(nearAlerts(s).map((a) => a.id)).toEqual(['BV-2402', 'BV-2401']);
    s = demoReducer(s, { type: 'applyRadius', radius: 500 });
    expect(nearAlerts(s).map((a) => a.id)).toEqual(['BV-2402']);
    s = demoReducer(s, { type: 'applyRadius', radius: 250 });
    expect(nearAlerts(s)).toEqual([]);
  });

  it('recibe alertas de personas cercanas y las marca como vistas', () => {
    let s = start();
    expect(nearbyFeed(s)).toHaveLength(2);
    s = demoReducer(s, { type: 'injectNearAlert' });
    expect(nearbyFeed(s)).toHaveLength(3);
    expect(s.nearAlertsRead).not.toContain('BV-2501');
    s = demoReducer(s, { type: 'openIncident', id: 'BV-2501' });
    expect(s.nearAlertsRead).toContain('BV-2501');
    expect(s.screen).toBe('incident');
  });

  it('con la recepción desactivada no llegan alertas cercanas', () => {
    let s = start();
    s = demoReducer(s, { type: 'toggleReceiveNear' });
    expect(s.receiveNear).toBe(false);
    s = demoReducer(s, { type: 'injectNearAlert' });
    expect(nearbyFeed(s)).toHaveLength(2);
  });

  it('ofrecer ayuda registra a la persona activa y puede retirarla', () => {
    let s = start();
    s = demoReducer(s, {
      type: 'acceptHelp',
      id: 'BV-2402',
      helpType: 'Acompañamiento desde un lugar seguro',
    });
    const a = s.incidents.find((x) => x.id === 'BV-2402');
    expect(a!.helpers).toContain('Camila Ríos');
    s = demoReducer(s, { type: 'withdrawHelp', id: 'BV-2402' });
    expect(s.incidents.find((x) => x.id === 'BV-2402')!.helpers).not.toContain('Camila Ríos');
  });

  it('los perfiles cambian el dispositivo activo y el nombre del SOS', () => {
    let s = start();
    expect(s.profiles.length).toBeGreaterThanOrEqual(9);

    s = demoReducer(s, { type: 'selectProfile', id: 'micaela' });
    expect(s.role).toBe('community');
    expect(s.activeProfileId).toBe('micaela');
    expect(s.screen).toBe('home');

    s = demoReducer(s, { type: 'startCountdown', publicConsent: true });
    for (let i = 0; i < 3; i++) s = demoReducer(s, { type: 'countdownTick' });
    expect(liveAlert(s)?.name).toBe('Micaela Sosa');
    s = demoReducer(s, { type: 'stopSos', reason: 'Prueba' });
  });

  it('la visibilidad elegida decide si el SOS es comunitario o solo del círculo', () => {
    let s = start();
    expect(s.alertVisibility).toBe('circle');
    s = demoReducer(s, { type: 'startCountdown', publicConsent: false });
    for (let i = 0; i < 3; i++) s = demoReducer(s, { type: 'countdownTick' });
    expect(liveAlert(s)!.public).toBe(false);
    s = demoReducer(s, { type: 'stopSos', reason: 'Prueba' });

    s = demoReducer(s, { type: 'setAlertVisibility', value: 'community' });
    expect(s.audience.public).toBe(true);
    s = demoReducer(s, { type: 'startCountdown', publicConsent: true });
    for (let i = 0; i < 3; i++) s = demoReducer(s, { type: 'countdownTick' });
    expect(liveAlert(s)!.public).toBe(true);
  });

  it('el SOS de pantalla bloqueada exige la opción activada', () => {
    let s = start();
    expect(s.lockButton).toBe(true);

    s = demoReducer(s, { type: 'toggleLockButton' });
    expect(s.lockButton).toBe(false);
    s = demoReducer(s, { type: 'sosFromLock' });
    expect(liveAlert(s)).toBeNull();

    s = demoReducer(s, { type: 'toggleLockButton' });
    s = demoReducer(s, { type: 'sosFromLock' });
    const a = liveAlert(s);
    expect(a).not.toBeNull();
    expect(a!.events.some((e) => e.text.includes('5 segundos'))).toBe(true);
    expect(s.screen).toBe('sos');
  });

  it('el registro de vigilantes aprueba altas y las vuelve dispositivos disponibles', () => {
    let s = start();
    s = demoReducer(s, {
      type: 'submitGuardianApplication',
      data: {
        name: 'Vecina Nueva',
        phone: '099 777 888',
        email: 'vecina@ejemplo.invalid',
        neighborhood: 'Centro',
        availability: 'Mañanas',
        motivation: 'Quiero acompañar a otras personas.',
        references: true,
        training: true,
        identity: true,
      },
    });
    const app = s.guardianApps[0];
    expect(app.score).toBe(100);
    expect(app.status).toBe('pending');

    s = demoReducer(s, { type: 'reviewGuardianApp', id: app.id, status: 'approved' });
    const created = s.profiles.find((p) => p.applicationId === app.id);
    expect(created?.role).toBe('community');
    expect(created?.authorized).toBe(true);

    s = demoReducer(s, { type: 'reviewGuardianApp', id: app.id, status: 'rejected' });
    expect(s.guardianApps.find((x) => x.id === app.id)?.status).toBe('rejected');
  });

  it('los otros dispositivos ven el SOS según el vínculo y la visibilidad', () => {
    let s = start();
    s = demoReducer(s, { type: 'startCountdown', publicConsent: false });
    for (let i = 0; i < 3; i++) s = demoReducer(s, { type: 'countdownTick' });
    const id = s.alertId!;

    // La alerta privada no aparece en el feed comunitario.
    s = demoReducer(s, { type: 'selectProfile', id: 'lucia' });
    expect(ownAlert(s)).toBeNull();
    expect(nearbyFeed(s).some((a) => a.id === id)).toBe(false);

    // El círculo vinculado sí la ve.
    s = demoReducer(s, { type: 'selectProfile', id: 'elena' });
    expect(watchedAlert(s)?.id).toBe(id);

    // Con visibilidad comunitaria, otro dispositivo de la zona también la ve.
    s = demoReducer(s, { type: 'selectProfile', id: 'camila' });
    s = demoReducer(s, { type: 'stopSos', reason: 'Prueba' });
    s = demoReducer(s, { type: 'setAlertVisibility', value: 'community' });
    s = demoReducer(s, { type: 'startCountdown', publicConsent: true });
    for (let i = 0; i < 3; i++) s = demoReducer(s, { type: 'countdownTick' });
    const publicId = s.alertId!;
    s = demoReducer(s, { type: 'selectProfile', id: 'nicolas' });
    expect(ownAlert(s)).toBeNull();
    expect(nearbyFeed(s).some((a) => a.id === publicId)).toBe(true);
  });

  it('reiniciar restaura el estado inicial', () => {
    let s = start();
    s = demoReducer(s, { type: 'demoFull' });
    s = demoReducer(s, { type: 'reset' });
    expect(s.incidents).toHaveLength(2);
    expect(s.alertId).toBeNull();
  });
});
