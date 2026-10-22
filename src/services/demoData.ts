import { BASE_POS } from '@/lib/geo';
import type {
  Contact,
  DemoState,
  GuardianApplication,
  Incident,
  LatLng,
  NotificationItem,
  UserProfile,
} from '@/types/demo';

/**
 * Perfiles disponibles en la demo. Cada uno simula un dispositivo distinto
 * vinculado a la misma red de cuidado.
 */
export const seedProfiles: UserProfile[] = [
  {
    id: 'camila',
    name: 'Camila Ríos',
    role: 'self',
    label: 'Persona',
    relation: 'Cuenta propia',
    city: 'Minas, Lavalleja',
    color: 'peach',
    linked: true,
    note: 'Pide ayuda, administra su círculo y decide quién ve su ubicación.',
  },
  {
    id: 'lucia',
    name: 'Lucía Ferreira',
    role: 'self',
    label: 'Persona',
    relation: 'Cuenta propia',
    city: 'Minas, Lavalleja',
    color: 'pink',
    linked: true,
    note: 'Usa Botón Violeta desde el celular y comparte solo con su círculo.',
  },
  {
    id: 'rocio',
    name: 'Rocío Pérez',
    role: 'self',
    label: 'Persona',
    relation: 'Cuenta propia',
    city: 'Villa Serrana, Lavalleja',
    color: 'mint',
    linked: true,
    note: 'Vive zona rural; prueba el SOS sin señal y la alerta comunitaria.',
  },
  {
    id: 'elena',
    name: 'Elena Ríos',
    role: 'guardian',
    label: 'Vigilante del círculo familiar',
    relation: 'Madre de Camila',
    city: 'Minas, Lavalleja',
    color: 'peach',
    linked: true,
    note: 'Recibe los SOS de Camila y puede acompañarla solo con su permiso.',
  },
  {
    id: 'martin',
    name: 'Martín Ríos',
    role: 'guardian',
    label: 'Vigilante del círculo familiar',
    relation: 'Hermano de Camila',
    city: 'Montevideo',
    color: 'blue',
    linked: true,
    note: 'Sigue una sesión compartida y confirma la recepción de la alerta.',
  },
  {
    id: 'sofi',
    name: 'Sofía Acosta',
    role: 'guardian',
    label: 'Vigilante del círculo familiar',
    relation: 'Amiga de Camila',
    city: 'Minas, Lavalleja',
    color: 'mint',
    linked: true,
    note: 'Amiga de confianza: recibe alertas privadas del círculo.',
  },
  {
    id: 'nicolas',
    name: 'Nicolás Pérez',
    role: 'community',
    label: 'Vigilante de la comunidad',
    relation: 'Vecino · Centro',
    city: 'Minas, Lavalleja',
    color: 'blue',
    linked: true,
    authorized: true,
    note: 'Vigilante autorizado: ve pedidos SOS cercanos y ofrece apoyo.',
  },
  {
    id: 'micaela',
    name: 'Micaela Sosa',
    role: 'community',
    label: 'Vigilante de la comunidad',
    relation: 'Vecina · La Coronilla',
    city: 'Minas, Lavalleja',
    color: 'pink',
    linked: true,
    authorized: true,
    note: 'Vigilante autorizada con formación básica en primeros auxilios.',
  },
  {
    id: 'diego',
    name: 'Diego Cabrera',
    role: 'community',
    label: 'Vigilante de la comunidad',
    relation: 'Vecino · Villa Serrana',
    city: 'Villa Serrana, Lavalleja',
    color: 'mint',
    linked: true,
    authorized: true,
    note: 'Vigilante autorizado en zona rural, sin cobertura permanente.',
  },
];

/** Postulaciones de ejemplo al registro de vigilantes comunitarios. */
export const seedGuardianApps: GuardianApplication[] = [
  {
    id: 'GA-118',
    name: 'Valeria Núñez',
    phone: '099 111 222',
    email: 'valeria@ejemplo.invalid',
    neighborhood: 'Centro',
    availability: 'Mañanas y fines de semana',
    motivation: 'Quiero acompañar a vecinas en el regreso a casa.',
    references: true,
    training: true,
    identity: true,
    status: 'pending',
    score: 100,
    created: Date.now() - 1000 * 60 * 60 * 26,
    reviewed: null,
    notes: '',
  },
  {
    id: 'GA-117',
    name: 'Rodrigo Bentancor',
    phone: '098 333 444',
    email: 'rodrigo@ejemplo.invalid',
    neighborhood: 'La Coronilla',
    availability: 'Noches',
    motivation: 'Tengo disponibilidad nocturna y movilidad propia.',
    references: true,
    training: false,
    identity: true,
    status: 'review',
    score: 80,
    created: Date.now() - 1000 * 60 * 60 * 52,
    reviewed: null,
    notes: 'Falta acreditar la formación básica.',
  },
  {
    id: 'GA-116',
    name: 'Ana Laura Méndez',
    phone: '091 555 666',
    email: 'analaura@ejemplo.invalid',
    neighborhood: 'Villa Serrana',
    availability: 'Fines de semana',
    motivation: 'Soy docente y conozco a muchas familias de la zona.',
    references: true,
    training: true,
    identity: false,
    status: 'review',
    score: 80,
    created: Date.now() - 1000 * 60 * 60 * 80,
    reviewed: null,
    notes: 'Documento ilegible en la postulación de prueba.',
  },
];

/** Criterios de prueba usados por el registro (a definir en la versión final). */
export const guardianCriteria = [
  { key: 'identity', label: 'Identidad verificada', points: 20 },
  { key: 'references', label: 'Dos referencias vecinales', points: 20 },
  { key: 'training', label: 'Formación básica realizada', points: 20 },
] as const;

/** Puntaje de prueba: base por completar el formulario + criterios. */
export function guardianScore(app: Pick<GuardianApplication, 'identity' | 'references' | 'training'>) {
  return (
    40 +
    (app.identity ? 20 : 0) +
    (app.references ? 20 : 0) +
    (app.training ? 20 : 0)
  );
}

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
    profiles: seedProfiles.map((p) => ({ ...p })),
    activeProfileId: 'camila',
    alertVisibility: 'circle',
    lockButton: true,
    guardianApps: seedGuardianApps.map((a) => ({ ...a })),
    guardianFilter: 'all',
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
