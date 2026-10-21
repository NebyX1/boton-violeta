import { BASE_POS } from '@/lib/geo';
import type {
  Contact,
  DemoState,
  Incident,
  LatLng,
  NotificationItem,
} from '@/types/demo';

/** Puntos de apoyo ficticios (no representan locales reales adheridos). */
export const places = [
  {
    id: 'p1',
    name: 'Punto Violeta Norte',
    pos: [-34.3722, -55.2421] as LatLng,
    distance: 180,
  },
  {
    id: 'p2',
    name: 'Espacio de apoyo Centro',
    pos: [-34.3802, -55.2352] as LatLng,
    distance: 440,
  },
];

/** Personas vinculadas ficticias de la cuenta de Camila. */
export const seedContacts: Contact[] = [
  { id: 'elena', name: 'Elena Ríos', alias: 'Mamá', relation: 'Madre', color: 'peach', alerts: true },
  { id: 'sofi', name: 'Sofía Acosta', alias: 'Sofi', relation: 'Amiga', color: 'mint', alerts: true },
  { id: 'martin', name: 'Martín Ríos', alias: 'Martín', relation: 'Hermano', color: 'blue', alerts: true },
];

function seedIncidents(t: number): Incident[] {
  return [
    {
      id: 'BV-2402',
      owner: 'seed',
      name: 'Valentina',
      title: 'Necesito acompañamiento',
      type: 'Acompañamiento',
      kind: 'care',
      pos: [-34.3737, -55.2349],
      distance: 280,
      active: true,
      public: true,
      status: 'received',
      started: t - 185000,
      lastPosition: t,
      operator: null,
      unit: null,
      events: [{ time: t - 185000, text: 'Alerta de prueba recibida' }],
      helpers: [],
    },
    {
      id: 'BV-2401',
      owner: 'seed',
      name: 'Jorge',
      title: 'Asistencia en vía pública',
      type: 'Asistencia',
      kind: 'medical',
      pos: [-34.3792, -55.242],
      distance: 620,
      active: true,
      public: true,
      status: 'assigned',
      started: t - 410000,
      lastPosition: t,
      operator: 'Operadora demo',
      unit: 'V-02',
      events: [
        { time: t - 410000, text: 'Alerta de prueba recibida' },
        { time: t - 350000, text: 'Recurso de prueba asignado' },
      ],
      helpers: ['Apoyo demo'],
    },
  ];
}

function seedNotifications(t: number): NotificationItem[] {
  return [
    {
      id: 'n1',
      title: 'Tu círculo está listo',
      text: 'Elena, Sofi y Martín recibirán tus alertas. Vincular no habilita el seguimiento.',
      icon: 'users',
      time: t - 900000,
      read: false,
      target: 'circle',
    },
    {
      id: 'n2',
      title: 'Vos decidís cuándo compartir',
      text: 'Tu ubicación permanece privada hasta que actives una sesión o un SOS.',
      icon: 'lock',
      time: t - 1800000,
      read: true,
      target: 'privacy',
    },
  ];
}

/** Estado inicial de la demostración. Recargar la pestaña reinicia la sesión. */
export function createInitialState(): DemoState {
  const t = Date.now();
  return {
    role: 'self',
    screen: 'onboarding',
    context: null,
    history: [],
    device: /Android/i.test(navigator.userAgent) ? 'android' : 'ios',
    theme: 'light',
    large: false,
    contrast: false,
    reduced: false,
    online: true,
    motion: true,
    position: [...BASE_POS],
    trail: [[...BASE_POS]],
    lastPosition: t,
    motionStep: 0,
    permissions: { location: true, background: true, notifications: true, camera: false },
    profile: {
      name: 'Camila Ríos',
      email: 'camila@ejemplo.invalid',
      phone: '099 000 000',
      city: 'Minas, Lavalleja',
      contact: 'Solo mensajes',
    },
    contacts: seedContacts.map((c) => ({ ...c })),
    audience: { family: true, public: false, silent: true },
    share: { active: false, recipients: ['elena'], minutes: 60, started: null, until: null },
    shareDraft: null,
    alertId: null,
    lastStopped: null,
    incoming: null,
    incidents: seedIncidents(t),
    nearFilter: 'all',
    radius: 1000,
    receiveNear: true,
    nearAlertsRead: [],
    alertBoardFilter: 'all',
    circleTab: 'people',
    contactSearch: '',
    activityFilter: 'all',
    notifications: seedNotifications(t),
    chats: {
      central: [
        {
          who: 'other',
          sender: 'operator',
          text: 'Canal de prueba. No hay una operadora real conectada.',
          time: t,
        },
      ],
      circle: [],
      community: [],
    },
    chatTarget: 'central',
    reports: [],
    reportStep: 1,
    draft: {
      person: 'me',
      type: 'Situación de violencia',
      details: '',
      place: 'Escenario ficticio · Minas',
      when: 'Hoy',
      contact: 'Solo por mensaje en la app',
      attachments: [],
      consent: false,
    },
    lastReport: null,
    recording: false,
    pairToken: '682914',
    pairStarted: t,
    pairTab: 'show',
    onboarding: 0,
    consoleTab: 'overview',
    selectedIncident: 'BV-2402',
    queueFilter: 'open',
    queueSearch: '',
    units: [
      { id: 'V-01', name: 'Unidad V-01', type: 'Móvil de prueba', available: true },
      { id: 'V-02', name: 'Unidad V-02', type: 'Móvil de prueba', available: false },
      { id: 'A-01', name: 'Equipo de apoyo', type: 'Recurso de prueba', available: true },
    ],
    logs: [{ time: t, type: 'Sistema', text: 'Entorno de demostración iniciado. Datos ficticios.' }],
    config: { radius: 1000, ack: 30, escalate: 60, community: true },
    mapReal: false,
    mapTransforms: {},
    helperAvailable: true,
    callStart: null,
    mutedCall: false,
    speakerCall: false,
    sheet: null,
    sheetData: {},
    toast: null,
    now: t,
  };
}

/** Texto de estado de un incidente. */
export function incidentStatusLabel(status: string | undefined): string {
  return (
    (
      {
        queued: 'Pendiente de envío',
        received: 'Recibida',
        taken: 'En atención',
        assigned: 'Recurso asignado',
        enroute: 'En camino',
        onscene: 'En el lugar',
        resolved: 'Resuelta',
      } as Record<string, string>
    )[status ?? ''] || 'Sin incidente'
  );
}
