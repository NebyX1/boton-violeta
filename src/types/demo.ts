/**
 * Modelos de datos de la demostración.
 * Todo es ficticio: personas, posiciones, reportes, respuestas y autenticación.
 */

export type Role = 'self' | 'guardian' | 'community' | 'operator';

export type ScreenName =
  | 'home'
  | 'near'
  | 'alerts'
  | 'circle'
  | 'contact'
  | 'pair'
  | 'share'
  | 'sharelive'
  | 'follow'
  | 'activity'
  | 'profile'
  | 'settings'
  | 'privacy'
  | 'permissions'
  | 'report'
  | 'reports'
  | 'reportdetail'
  | 'reportsuccess'
  | 'sos'
  | 'ended'
  | 'incident'
  | 'chat'
  | 'onboarding'
  | 'roles'
  | 'lockscreen'
  | 'login'
  | 'register'
  | 'call'
  | 'help'
  | 'places'
  | 'accountedit';

export type IncidentStatus =
  | 'queued'
  | 'received'
  | 'taken'
  | 'assigned'
  | 'enroute'
  | 'onscene'
  | 'resolved';

export type ContactColor = 'peach' | 'mint' | 'blue' | 'pink' | '';

export type ChatTarget = 'central' | 'circle' | 'community';

export type ChatSender = Role | 'operator';

export type NotificationTarget =
  | 'circle'
  | 'privacy'
  | 'sos'
  | 'share'
  | 'sharelive'
  | 'reports'
  | 'chat'
  | 'incoming'
  | 'places'
  | 'alerts'
  | 'activity';

export type LatLng = [number, number];

export interface Contact {
  id: string;
  name: string;
  alias: string;
  relation: string;
  color: ContactColor;
  /** Recibe mis alertas SOS (sin ubicación permanente). */
  alerts: boolean;
}

/**
 * Perfil concreto que se puede encarnar en la demo.
 * Cada perfil representa un dispositivo distinto de la misma red.
 */
export interface UserProfile {
  id: string;
  name: string;
  role: Extract<Role, 'self' | 'guardian' | 'community'>;
  label: string;
  relation: string;
  city: string;
  color: ContactColor;
  /** Dispositivo vinculado a la red de alertas. */
  linked: boolean;
  /** Autorizado como vigilante comunitario. */
  authorized?: boolean;
  /** Postulación que originó este perfil, si vino del registro. */
  applicationId?: string;
  note: string;
}

export type GuardianApplicationStatus = 'pending' | 'review' | 'approved' | 'rejected';

/** Postulación al registro de vigilantes comunitarios autorizados. */
export interface GuardianApplication {
  id: string;
  name: string;
  phone: string;
  email: string;
  neighborhood: string;
  availability: string;
  motivation: string;
  references: boolean;
  training: boolean;
  identity: boolean;
  status: GuardianApplicationStatus;
  /** Puntaje de criterios de prueba (0 a 100). */
  score: number;
  created: number;
  reviewed: number | null;
  notes: string;
}

export interface IncidentEvent {
  time: number;
  text: string;
}

export interface Incident {
  id: string;
  owner: 'self' | 'seed';
  /** Perfil/dispositivo que activó la alerta. */
  ownerProfileId?: string;
  name: string;
  title: string;
  type: string;
  kind: 'care' | 'medical';
  pos: LatLng | null;
  distance: number;
  active: boolean;
  public: boolean;
  status: IncidentStatus;
  started: number;
  lastPosition: number;
  operator: string | null;
  unit: string | null;
  events: IncidentEvent[];
  helpers: string[];
  /* Campos opcionales de la simulación */
  family?: boolean;
  recipients?: string[];
  familyAck?: boolean;
  familyPresent?: boolean;
  noTalk?: boolean;
  escalated?: boolean;
  helpType?: string;
  closeRequested?: boolean;
  closure?: string;
  closedAt?: number;
  stoppedAt?: number;
  stopReason?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  text: string;
  icon: string;
  time: number;
  read: boolean;
  target: NotificationTarget;
  role?: Role;
  channel?: ChatTarget;
}

export interface ChatMessage {
  who?: 'other' | 'mine';
  sender: ChatSender;
  text: string;
  time: number;
}

export interface ReportDraft {
  person: 'me' | 'other';
  type: string;
  details: string;
  place: string;
  when: string;
  contact: string;
  attachments: string[];
  consent: boolean;
}

export interface DemoReport extends ReportDraft {
  id: string;
  created: number;
  status: string;
  reviewed?: number;
}

export interface Unit {
  id: string;
  name: string;
  type: string;
  available: boolean;
}

export interface LogEntry {
  time: number;
  type: string;
  text: string;
}

export interface ShareSession {
  active: boolean;
  recipients: string[];
  minutes: number;
  started: number | null;
  until: number | null;
}

export interface ShareDraft {
  recipients: string[];
  minutes: number;
}

export interface IncomingAlert {
  active: boolean;
  pos: LatLng;
  started: number;
  ack: boolean;
}

export interface Permissions {
  location: boolean;
  background: boolean;
  notifications: boolean;
  camera: boolean;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  city: string;
  contact: string;
  accountType?: string;
}

export interface DemoConfig {
  radius: number;
  ack: number;
  escalate: number;
  community: boolean;
}

export interface MapTransform {
  x: number;
  y: number;
  z: number;
}

export interface HistoryEntry {
  screen: ScreenName;
  context: string | null;
}

export interface DemoState {
  role: Role;
  screen: ScreenName;
  context: string | null;
  history: HistoryEntry[];
  device: 'ios' | 'android';
  theme: 'light' | 'dark';
  large: boolean;
  contrast: boolean;
  reduced: boolean;
  online: boolean;
  motion: boolean;
  position: LatLng;
  trail: LatLng[];
  lastPosition: number;
  motionStep: number;
  permissions: Permissions;
  profile: Profile;
  contacts: Contact[];
  audience: { family: boolean; public: boolean; silent: boolean };
  share: ShareSession;
  shareDraft: ShareDraft | null;
  alertId: string | null;
  lastStopped: string | null;
  incoming: IncomingAlert | null;
  incidents: Incident[];
  nearFilter: 'all' | 'care' | 'medical' | 'places';
  radius: number;
  /** Recibir alertas de personas cercanas (mostrador de alertas). */
  receiveNear: boolean;
  /** Alertas del mostrador ya vistas. */
  nearAlertsRead: string[];
  alertBoardFilter: 'all' | 'new' | 'helping';
  circleTab: 'people' | 'sharing';
  contactSearch: string;
  activityFilter: 'all' | 'unread';
  notifications: NotificationItem[];
  chats: Record<ChatTarget, ChatMessage[]>;
  chatTarget: ChatTarget;
  reports: DemoReport[];
  reportStep: 1 | 2 | 3;
  draft: ReportDraft;
  lastReport: string | null;
  recording: boolean;
  pairToken: string;
  pairStarted: number;
  pairTab: 'show' | 'scan';
  onboarding: number;
  consoleTab:
    | 'overview'
    | 'incidents'
    | 'reports'
    | 'people'
    | 'guardians'
    | 'resources'
    | 'audit'
    | 'config';
  selectedIncident: string | null;
  queueFilter: 'open' | 'new' | 'all';
  queueSearch: string;
  /* Perfiles, visibilidad y pantalla bloqueada */
  profiles: UserProfile[];
  activeProfileId: string;
  alertVisibility: 'circle' | 'community';
  lockButton: boolean;
  /* Registro de vigilantes comunitarios (web independiente) */
  guardianApps: GuardianApplication[];
  guardianFilter: 'all' | GuardianApplicationStatus;
  units: Unit[];
  logs: LogEntry[];
  config: DemoConfig;
  mapReal: boolean;
  mapTransforms: Record<string, MapTransform>;
  helperAvailable: boolean;
  callStart: number | null;
  mutedCall: boolean;
  speakerCall: boolean;
  /* Estado de interfaz del prototipo */
  sheet: SheetKind | null;
  sheetData: Record<string, unknown>;
  toast: string | null;
  now: number;
}

export type SheetKind =
  | 'already'
  | 'sos-options'
  | 'countdown'
  | 'stop-sos'
  | 'public'
  | 'demo-tools'
  | 'gallery'
  | 'about'
  | 'incoming'
  | 'unlink'
  | 'copy'
  | 'pair'
  | 'gps'
  | 'stopshare'
  | 'radius'
  | 'help-offer'
  | 'helpstatus'
  | 'place'
  | 'readiness'
  | 'google'
  | 'recover'
  | 'logout'
  | 'keypad'
  | 'faq'
  | 'reset'
  | 'operator-chat'
  | 'operator-report'
  | 'assign'
  | 'closure'
  | 'closure-detail'
  | 'person'
  | 'unit-info'
  | 'assignments'
  | 'newunit'
  | 'layers';
