import { describe, expect, it } from 'vitest';
import { demoReducer } from '@/providers/demoReducer';
import { liveAlert, nearAlerts, nearbyFeed, received } from '@/providers/demoSelectors';
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
    expect(a!.helpers).toContain('Camila');
    s = demoReducer(s, { type: 'withdrawHelp', id: 'BV-2402' });
    expect(s.incidents.find((x) => x.id === 'BV-2402')!.helpers).not.toContain('Camila');
  });

  it('reiniciar restaura el estado inicial', () => {
    let s = start();
    s = demoReducer(s, { type: 'demoFull' });
    s = demoReducer(s, { type: 'reset' });
    expect(s.incidents).toHaveLength(2);
    expect(s.alertId).toBeNull();
  });
});
