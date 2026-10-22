import { BASE_POS } from '@/lib/geo';
import {
  alertContacts,
  activeProfile,
  helperName,
  incidentById,
  ownAlert,
  received,
  watchedAlert,
} from '@/providers/demoSelectors';
import { createInitialState, guardianScore, places } from '@/services/demoData';
import { qrCodes } from '@/services/qrCodes';
import type {
  ChatSender,
  ChatTarget,
  DemoState,
  GuardianApplication,
  GuardianApplicationStatus,
  Incident,
  NotificationTarget,
  Profile,
  Role,
  ScreenName,
  SheetKind,
} from '@/types/demo';

export type DemoAction =
  /* Navegación y shell */
  | { type: 'go'; screen: ScreenName; context?: string | null }
  | { type: 'back' }
  | { type: 'jump'; screen: ScreenName }
  | { type: 'nav'; screen: ScreenName }
  | { type: 'setRole'; role: Role }
  | { type: 'selectProfile'; id: string }
  | { type: 'setAlertVisibility'; value: 'circle' | 'community' }
  | { type: 'toggleLockButton' }
  | { type: 'sosFromLock' }
  | { type: 'setDevice'; device: 'ios' | 'android' }
  | { type: 'openSheet'; kind: SheetKind; data?: Record<string, unknown> }
  | { type: 'closeSheet' }
  | { type: 'toast'; text: string }
  | { type: 'clearToast' }
  | { type: 'tick' }
  /* SOS */
  | { type: 'sosOptions' }
  | { type: 'toggleAudienceFamily' }
  | { type: 'toggleAudiencePublic' }
  | { type: 'startCountdown'; publicConsent: boolean }
  | { type: 'countdownTick' }
  | { type: 'viewSos' }
  | { type: 'demoFull' }
  | { type: 'injectSos' }
  | { type: 'stopSosConfirm' }
  | { type: 'stopSos'; reason: string }
  | { type: 'togglePublic' }
  | { type: 'confirmPublic' }
  | { type: 'cantSpeak' }
  /* Conectividad y movimiento */
  | { type: 'toggleNetwork' }
  | { type: 'toggleMotion' }
  /* Alertas entrantes y familiar */
  | { type: 'toggleIncoming' }
  | { type: 'viewIncoming' }
  | { type: 'incomingAck' }
  | { type: 'familyAck' }
  | { type: 'familyPresent' }
  | { type: 'requestLocation' }
  /* Círculo y vínculos */
  | { type: 'setCircleTab'; tab: 'people' | 'sharing' }
  | { type: 'setContactSearch'; value: string }
  | { type: 'openContact'; id: string }
  | { type: 'toggleContactAlerts'; id: string }
  | { type: 'toggleContactShare'; id: string }
  | { type: 'unlinkConfirm'; id: string }
  | { type: 'unlink'; id: string }
  | { type: 'setPairTab'; tab: 'show' | 'scan' }
  | { type: 'renewCode' }
  | { type: 'pairManual'; code: string }
  | { type: 'pairDetected' }
  | { type: 'pairAccept'; alias: string; relation: string }
  /* Acompañamiento (compartir ubicación) */
  | { type: 'toggleSharePerson'; id: string }
  | { type: 'setShareMinutes'; minutes: number }
  | { type: 'startSharing' }
  | { type: 'editSharing' }
  | { type: 'stopSharingConfirm' }
  | { type: 'stopSharing' }
  | { type: 'revokeOne'; id: string }
  /* Cerca / comunidad */
  | { type: 'setNearFilter'; filter: 'all' | 'care' | 'medical' | 'places' }
  | { type: 'openRadius' }
  | { type: 'applyRadius'; radius: number }
  | { type: 'toggleReceiveNear' }
  | { type: 'injectNearAlert' }
  | { type: 'setAlertBoardFilter'; filter: 'all' | 'new' | 'helping' }
  | { type: 'markAlertSeen'; id: string }
  | { type: 'openIncident'; id: string }
  | { type: 'offerHelp'; id: string }
  | { type: 'acceptHelp'; id: string; helpType: string }
  | { type: 'helpStatus'; id: string }
  | { type: 'withdrawHelp'; id: string }
  | { type: 'toggleHelperAvailable' }
  | { type: 'openPlace'; id: string }
  | { type: 'requestPlace'; id: string }
  /* Actividad */
  | { type: 'setActivityFilter'; filter: 'all' | 'unread' }
  | { type: 'readAll' }
  | { type: 'openNotification'; id: string }
  /* Mensajería */
  | { type: 'openChat'; target?: ChatTarget }
  | { type: 'sendMessage'; text: string; target?: ChatTarget; sender?: ChatSender }
  | { type: 'quickMessage'; text: string }
  /* Reportes */
  | { type: 'newReport' }
  | { type: 'setDraft'; field: string; value: string | boolean | string[] }
  | { type: 'setReportPerson'; person: 'me' | 'other' }
  | { type: 'reportExample' }
  | { type: 'reportNext' }
  | { type: 'reportPrev' }
  | { type: 'reportEdit' }
  | { type: 'attachPhoto' }
  | { type: 'toggleRecording' }
  | { type: 'removeAttachment'; index: number }
  | { type: 'submitReport' }
  | { type: 'openReportDetail'; id?: string }
  | { type: 'reportsConsole' }
  | { type: 'seedReport' }
  | { type: 'reviewReport'; id: string }
  | { type: 'contactReport'; id: string }
  | { type: 'archiveReport'; id: string }
  | { type: 'openOperatorReport'; id: string }
  /* Cuenta y apariencia */
  | { type: 'setTheme'; theme: 'light' | 'dark' }
  | { type: 'toggleSetting'; key: 'large' | 'contrast' | 'reduced' }
  | { type: 'togglePermission'; key: keyof DemoState['permissions'] }
  | { type: 'testReadiness' }
  | { type: 'saveProfile'; profile: Profile }
  | { type: 'setOnboarding'; step: number }
  | { type: 'onboardingNext' }
  | { type: 'googleLogin' }
  | { type: 'emailLogin'; email: string; password: string }
  | { type: 'finishLogin' }
  | { type: 'createAccount'; name: string; email: string; city: string; accountType: string; consent: boolean }
  | { type: 'recover' }
  | { type: 'recoverSend'; email: string }
  | { type: 'logout' }
  | { type: 'confirmLogout' }
  /* Llamada simulada */
  | { type: 'startCall' }
  | { type: 'toggleCallMute' }
  | { type: 'toggleCallSpeaker' }
  | { type: 'callKeypad' }
  | { type: 'dial'; digit: string }
  | { type: 'hangup' }
  /* Ayuda, acerca de y reinicio */
  | { type: 'faq'; faq: string }
  | { type: 'about' }
  | { type: 'demoTools' }
  | { type: 'gallery' }
  | { type: 'resetConfirm' }
  | { type: 'reset' }
  /* Consola institucional */
  | { type: 'setConsoleTab'; tab: DemoState['consoleTab'] }
  | { type: 'setQueueFilter'; filter: 'open' | 'new' | 'all' }
  | { type: 'setQueueSearch'; value: string }
  | { type: 'selectIncident'; id: string }
  | { type: 'takeIncident'; id?: string }
  | { type: 'assignUnit'; id?: string }
  | { type: 'confirmUnit'; id?: string; unitId: string }
  | { type: 'advanceIncident'; id?: string }
  | { type: 'requestClose'; id?: string }
  | { type: 'closeIncident'; id?: string }
  | { type: 'confirmClosure'; id?: string; note: string }
  | { type: 'closureDetail'; id?: string }
  | { type: 'openOperatorChat'; id?: string }
  | { type: 'operatorSend'; text: string; target?: ChatTarget }
  | { type: 'personInfo'; id: string }
  | { type: 'unitInfo' }
  | { type: 'toggleUnitAvailability'; id: string }
  | { type: 'unitAssignments'; id: string }
  | { type: 'newUnit' }
  | { type: 'createUnit'; name: string; unitType: string }
  | { type: 'toggleConfigCommunity' }
  | { type: 'saveConfig'; radius: number; ack: number; escalate: number }
  /* Registro de vigilantes comunitarios */
  | {
      type: 'submitGuardianApplication';
      data: {
        name: string;
        phone: string;
        email: string;
        neighborhood: string;
        availability: string;
        motivation: string;
        references: boolean;
        training: boolean;
        identity: boolean;
      };
    }
  | { type: 'reviewGuardianApp'; id: string; status: GuardianApplicationStatus }
  | { type: 'setGuardianFilter'; filter: 'all' | GuardianApplicationStatus }
  /* Mapa */
  | { type: 'setMapLayer'; layer: 'vector' | 'real' }
  | { type: 'mapZoom'; ctx: string; delta: number }
  | { type: 'mapCenter'; ctx: string }
  | { type: 'mapPan'; ctx: string; dx: number; dy: number };

/* ------------------------------------------------------------------ */
/* Utilidades internas sobre una copia mutable del estado              */
/* ------------------------------------------------------------------ */

function log(s: DemoState, text: string, type = 'Sistema') {
  s.logs.unshift({ time: Date.now(), type, text });
  if (s.logs.length > 250) s.logs.pop();
}

function notify(
  s: DemoState,
  title: string,
  text: string,
  icon = 'bell',
  target: NotificationTarget = 'activity',
) {
  s.notifications.unshift({
    id: 'n' + Date.now() + Math.random(),
    title,
    text,
    icon,
    time: Date.now(),
    read: false,
    target,
  });
}

function addEvent(s: DemoState, a: Incident, text: string) {
  a.events.push({ time: Date.now(), text });
  log(s, `${a.id}: ${text}`, 'Operación');
}

function toast(s: DemoState, text: string) {
  s.toast = text;
}

function openSheet(s: DemoState, kind: SheetKind, data: Record<string, unknown> = {}) {
  s.sheet = kind;
  s.sheetData = data;
}

function go(s: DemoState, screen: ScreenName, context: string | null = null) {
  s.history.push({ screen: s.screen, context: s.context });
  s.screen = screen;
  s.context = context;
  if (screen === 'share' && !s.shareDraft) {
    s.shareDraft = { recipients: [...s.share.recipients], minutes: s.share.minutes };
  }
  s.sheet = null;
}

function activateSOS(s: DemoState, publicOverride: boolean | null = null): Incident | null {
  const existing = ownAlert(s);
  if (existing) return existing;
  const t = Date.now();
  const id = 'BV-' + (2403 + s.incidents.filter((a) => a.owner === 'self').length);
  let pub = publicOverride === null ? s.alertVisibility === 'community' : publicOverride;
  pub = pub && s.config.community;
  const a: Incident = {
    id,
    owner: 'self',
    name: activeProfile(s)?.name ?? s.profile.name,
    title: 'Necesito ayuda',
    type: 'SOS personal',
    kind: 'care',
    pos: s.permissions.location ? [...s.position] : null,
    distance: 120,
    active: true,
    public: pub,
    family: s.audience.family,
    recipients: alertContacts(s).map((c) => c.id),
    status: s.online ? 'received' : 'queued',
    ownerProfileId: s.activeProfileId,
    started: t,
    lastPosition: t,
    operator: null,
    unit: null,
    events: [
      {
        time: t,
        text: s.online
          ? 'Alerta recibida por la central de prueba'
          : 'Alerta pendiente de conexión',
      },
    ],
    helpers: [],
    familyAck: false,
  };
  s.incidents.push(a);
  s.alertId = id;
  s.selectedIncident = id;
  s.trail = [[...s.position]];
  log(
    s,
    `${id}: SOS ${s.online ? 'recibido' : 'pendiente'}; audiencia ${pub ? 'comunitaria' : 'privada'}.`,
    'Alerta',
  );
  notify(
    s,
    s.online ? 'Tu alerta de prueba fue recibida' : 'Tu alerta está pendiente',
    s.online
      ? 'La recepción no significa que ya haya un recurso en camino.'
      : 'Todavía no hay confirmación de la central ni de tus contactos.',
    'radar',
    'sos',
  );
  return a;
}

function stopSOS(s: DemoState) {
  const a = ownAlert(s);
  if (!a) return;
  const t = Date.now();
  a.active = false;
  a.public = false;
  a.stoppedAt = t;
  addEvent(s, a, 'La persona detuvo la transmisión de ubicación');
  s.lastStopped = a.id;
  s.share.active = false;
  s.share.until = null;
  s.shareDraft = null;
  notify(
    s,
    'Seguimiento detenido',
    'La comunidad y tu círculo ya no reciben tu ubicación. La central puede registrar el cierre.',
    'lock',
    'privacy',
  );
  s.sheet = null;
  s.screen = 'ended';
  s.history = [];
}

function stopSharing(s: DemoState) {
  s.share.active = false;
  s.share.until = null;
  s.shareDraft = null;
  log(s, 'Consentimiento de seguimiento familiar revocado.', 'Consentimiento');
  notify(
    s,
    'Acompañamiento finalizado',
    'Las cuentas elegidas ya no pueden seguir esta sesión.',
    'lock',
    'privacy',
  );
  s.sheet = null;
  toast(s, 'Seguimiento voluntario detenido.');
}

function toggleNetwork(s: DemoState) {
  s.online = !s.online;
  const a = ownAlert(s);
  if (s.online && a?.status === 'queued') {
    a.status = 'received';
    if (s.permissions.location) {
      a.pos = [...s.position];
      a.lastPosition = Date.now();
      s.lastPosition = a.lastPosition;
    }
    addEvent(s, a, 'Conexión recuperada: recepción confirmada de prueba');
    notify(
      s,
      'Tu alerta llegó a la central',
      'También está disponible para la audiencia autorizada.',
      'check2',
      'sos',
    );
  }
  log(s, s.online ? 'Conexión simulada restablecida.' : 'Pérdida de conexión simulada.', 'Conectividad');
  toast(
    s,
    s.online
      ? 'Conexión de prueba restablecida.'
      : 'Sin conexión de prueba. No se confirma nueva recepción.',
  );
}

function sendMessage(
  s: DemoState,
  text: string,
  target: ChatTarget = s.chatTarget,
  sender: ChatSender = s.role,
) {
  const clean = String(text || '')
    .trim()
    .slice(0, 500);
  if (!clean) {
    toast(s, 'Escribí un mensaje de prueba.');
    return;
  }
  s.chats[target].push({ text: clean, sender, time: Date.now() });
  log(s, `Mensaje de prueba en el canal ${target}.`, 'Mensaje');
  if (sender === 'guardian') {
    notify(s, 'Elena te escribió', clean, 'chat', 'chat');
    s.notifications[0].channel = target;
  }
  if (sender === 'operator') {
    notify(s, 'Mensaje de la central', clean, 'chat', 'chat');
    s.notifications[0].channel = target;
  }
}

const FAQS: Record<string, [string, string]> = {
  sos: [
    'Activar un SOS',
    'Tocá el botón, elegí quién recibe el aviso y confirmá. Después de una cuenta regresiva de tres segundos se crea el incidente ficticio. Recibida, asumida y en camino son confirmaciones diferentes.',
  ],
  circle: [
    'Vincular a tu gente',
    'Desde Mi círculo abrí el QR o simulá un escaneo. La invitación necesita aceptación de ambas cuentas. Vincular no comparte ubicación; cada persona conserva sus permisos.',
  ],
  privacy: [
    'Quién ve tu ubicación',
    'Tu círculo ve ubicación durante un SOS autorizado o una sesión de seguimiento. La comunidad solo cuando elegís una alerta pública. La central ve incidentes, no sesiones familiares privadas.',
  ],
  offline: [
    'Qué pasa sin conexión',
    'Una alerta nueva queda pendiente de envío. Nadie la recibe hasta que vuelve la conexión simulada. En una sesión ya recibida se conserva la última ubicación conocida y se indica su antigüedad.',
  ],
  report: [
    'Reportes y denuncias',
    'El formulario representa un canal no urgente. Esta demo no formaliza denuncias, no envía información al Estado y no reemplaza un servicio de emergencia.',
  ],
  help: [
    'Ayudar sin exponerse',
    'Podés ofrecer acompañamiento desde un lugar seguro, aportar información u ofrecer refugio. El ofrecimiento se coordina; no autoriza enfrentamientos ni persecuciones.',
  ],
};

/* ------------------------------------------------------------------ */
/* Reducer                                                            */
/* ------------------------------------------------------------------ */

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  const s = structuredClone(state);

  switch (action.type) {
    /* ---------- Navegación y shell ---------- */
    case 'go':
      go(s, action.screen, action.context ?? null);
      return s;
    case 'back': {
      const p = s.history.pop();
      s.screen = p?.screen ?? 'home';
      s.context = p?.context ?? null;
      s.sheet = null;
      return s;
    }
    case 'jump':
      s.role = 'self';
      s.screen = action.screen;
      s.history = [];
      s.context = null;
      if (action.screen === 'share') s.shareDraft = null;
      s.sheet = null;
      return s;
    case 'nav':
      s.screen = action.screen;
      s.context = null;
      s.history = [];
      if (action.screen === 'chat') {
        s.chatTarget = s.role === 'guardian' ? 'circle' : 'community';
      }
      s.sheet = null;
      return s;
    case 'setRole': {
      s.role = action.role;
      if (action.role !== 'operator') {
        const p = s.profiles.find((x) => x.role === action.role);
        if (p) s.activeProfileId = p.id;
      }
      s.screen = 'home';
      s.context = null;
      s.history = [];
      s.sheet = null;
      return s;
    }
    case 'selectProfile': {
      const p = s.profiles.find((x) => x.id === action.id);
      if (!p) return s;
      s.activeProfileId = p.id;
      s.role = p.role;
      s.screen = 'home';
      s.context = null;
      s.history = [];
      s.sheet = null;
      log(s, `Perfil activo: ${p.name} · ${p.label}.`, 'Cuenta');
      toast(s, `Ahora explorás como ${p.name}.`);
      return s;
    }
    case 'setAlertVisibility': {
      s.alertVisibility = action.value;
      s.audience.public = action.value === 'community';
      if (action.value === 'circle') s.audience.family = true;
      log(
        s,
        action.value === 'community'
          ? 'Visibilidad del SOS: círculo y personas cercanas.'
          : 'Visibilidad del SOS: solo el círculo.',
        'Privacidad',
      );
      toast(
        s,
        action.value === 'community'
          ? 'Tu SOS también se mostrará a personas cercanas.'
          : 'Tu SOS solo se mostrará a tu círculo.',
      );
      return s;
    }
    case 'toggleLockButton':
      s.lockButton = !s.lockButton;
      log(
        s,
        `Botón de SOS en pantalla bloqueada ${s.lockButton ? 'activado' : 'desactivado'}.`,
        'Permiso',
      );
      toast(
        s,
        s.lockButton
          ? 'El botón aparecerá al encender la pantalla.'
          : 'El botón ya no aparecerá en la pantalla bloqueada.',
      );
      return s;
    case 'sosFromLock': {
      if (s.lockButton === false) {
        toast(s, 'Activá el botón en pantalla bloqueada para usar este acceso.');
        return s;
      }
      s.audience.family = true;
      const a = activateSOS(s);
      if (a) {
        addEvent(s, a, 'SOS activado desde la pantalla bloqueada tras 5 segundos');
        notify(
          s,
          'SOS activado sin abrir la app',
          s.alertVisibility === 'community'
            ? 'Tu círculo y las personas cercanas recibieron la alerta de prueba.'
            : 'Tu círculo recibió la alerta de prueba.',
          'radar',
          'sos',
        );
        log(s, 'SOS activado desde la pantalla bloqueada con pulsación de 5 s.', 'Alerta');
      }
      s.screen = 'sos';
      s.history = [];
      s.sheet = null;
      toast(s, 'SOS activado desde la pantalla bloqueada.');
      return s;
    }
    case 'setDevice':
      s.device = action.device;
      return s;
    case 'openSheet':
      openSheet(s, action.kind, action.data);
      return s;
    case 'closeSheet':
      s.sheet = null;
      s.sheetData = {};
      return s;
    case 'toast':
      toast(s, action.text);
      return s;
    case 'clearToast':
      s.toast = null;
      return s;

    /* ---------- SOS ---------- */
    case 'sosOptions':
      if (ownAlert(s)) {
        openSheet(s, 'already');
      } else {
        openSheet(s, 'sos-options');
      }
      return s;
    case 'toggleAudienceFamily':
      s.audience.family = !s.audience.family;
      return s;
    case 'toggleAudiencePublic':
      if (!s.config.community && !s.audience.public) {
        toast(s, 'La difusión comunitaria está deshabilitada en la configuración de prueba.');
        return s;
      }
      s.audience.public = !s.audience.public;
      s.alertVisibility = s.audience.public ? 'community' : 'circle';
      return s;
    case 'startCountdown':
      if (s.audience.public && !action.publicConsent) {
        toast(s, 'Confirmá que autorizás la ubicación comunitaria.');
        return s;
      }
      openSheet(s, 'countdown', { count: 3 });
      return s;
    case 'countdownTick': {
      const count = Number(s.sheetData.count ?? 0) - 1;
      if (count > 0) {
        s.sheetData = { ...s.sheetData, count };
        return s;
      }
      s.sheet = null;
      s.sheetData = {};
      activateSOS(s);
      s.screen = 'sos';
      s.history = [];
      return s;
    }
    case 'viewSos':
      s.screen = 'sos';
      s.history = [];
      s.sheet = null;
      return s;
    case 'demoFull': {
      s.audience.family = true;
      s.audience.public = true;
      s.config.community = true;
      s.online = true;
      s.nearFilter = 'all';
      s.radius = 1000;
      const full = activateSOS(s, true);
      if (full) {
        full.public = true;
        full.family = true;
        full.recipients = alertContacts(s).map((c) => c.id);
      }
      s.role = 'self';
      s.screen = 'sos';
      s.history = [];
      s.sheet = null;
      toast(s, 'SOS de prueba activo. Cambiá a Círculo, Comunidad o Central.');
      return s;
    }
    case 'injectSos':
      s.online = true;
      s.audience.family = true;
      s.config.community = true;
      activateSOS(s, true);
      s.consoleTab = 'overview';
      s.sheet = null;
      toast(s, 'Incidente ficticio añadido a la bandeja.');
      return s;
    case 'stopSosConfirm':
      openSheet(s, 'stop-sos');
      return s;
    case 'stopSos': {
      const a = ownAlert(s);
      if (a) a.stopReason = action.reason || 'Finalización de prueba';
      stopSOS(s);
      return s;
    }
    case 'togglePublic': {
      const a = ownAlert(s);
      if (!a) return s;
      if (a.public) {
        a.public = false;
        addEvent(s, a, 'La persona retiró la difusión comunitaria');
        toast(s, 'La comunidad ya no ve tu ubicación.');
      } else if (!s.config.community) {
        toast(s, 'Difusión comunitaria deshabilitada en la configuración.');
      } else {
        openSheet(s, 'public');
      }
      return s;
    }
    case 'confirmPublic': {
      const a = ownAlert(s);
      if (a) {
        a.public = true;
        addEvent(s, a, 'Consentimiento explícito para difusión comunitaria');
      }
      s.sheet = null;
      toast(s, 'Alerta visible para la comunidad de prueba.');
      return s;
    }
    case 'cantSpeak': {
      const a = ownAlert(s);
      if (a) {
        a.noTalk = true;
        addEvent(s, a, 'La persona solicita comunicación solo por mensajes');
        s.chats.central.push({
          text: 'No puedo hablar. Escribime por acá.',
          sender: 'self',
          time: Date.now(),
        });
      }
      toast(s, 'Preferencia registrada: solo mensajes.');
      return s;
    }

    /* ---------- Conectividad y movimiento ---------- */
    case 'toggleNetwork':
      toggleNetwork(s);
      return s;
    case 'toggleMotion':
      s.motion = !s.motion;
      return s;

    /* ---------- Alertas entrantes y familiar ---------- */
    case 'toggleIncoming':
      if (s.incoming?.active) {
        s.incoming.active = false;
        log(s, 'Sofi finalizó su alerta ficticia.', 'Alerta');
        notify(s, 'Sofi finalizó su alerta', 'Su ubicación ya no está compartida.', 'lock', 'circle');
        s.sheet = null;
        toast(s, 'Alerta de Sofi finalizada.');
      } else {
        s.incoming = { active: true, pos: [-34.374, -55.2402], started: Date.now(), ack: false };
        notify(s, 'Sofi necesita ayuda', 'Recibiste una alerta de una amiga de tu círculo.', 'bell', 'incoming');
        log(s, 'Alerta ficticia de Sofi recibida por Camila.', 'Alerta');
        if (s.role !== 'self') {
          s.role = 'self';
          s.screen = 'activity';
        }
        openSheet(s, 'incoming');
      }
      return s;
    case 'viewIncoming':
      s.role = 'self';
      s.screen = 'follow';
      s.context = 'incoming';
      s.history = [];
      s.sheet = null;
      return s;
    case 'incomingAck':
      if (s.incoming) s.incoming.ack = true;
      log(s, 'Camila confirmó recepción de la alerta de Sofi.', 'Recepción');
      toast(s, 'Recepción confirmada en la demo.');
      return s;
    case 'familyAck': {
      const a = watchedAlert(s);
      const me = helperName(s);
      if (a) {
        a.familyAck = true;
        addEvent(s, a, `${me} confirmó que vio la alerta`);
        notify(
          s,
          `${me.split(' ')[0]} vio tu alerta`,
          'Tu círculo confirmó recepción. No implica un despacho policial.',
          'users',
          'sos',
        );
      }
      toast(s, 'Confirmación de recepción registrada.');
      return s;
    }
    case 'familyPresent': {
      const a = watchedAlert(s);
      const me = helperName(s);
      if (a) {
        a.familyPresent = true;
        addEvent(s, a, `${me} informó que está con la persona que pidió ayuda`);
        notify(
          s,
          `${me.split(' ')[0]} informó que está contigo`,
          'La alerta sigue activa hasta que la persona la detenga.',
          'users',
          'sos',
        );
      }
      toast(s, 'Aviso enviado a la central de demostración.');
      return s;
    }
    case 'requestLocation':
      notify(
        s,
        'Elena solicita acompañarte',
        'Podés permitir un seguimiento temporal. La solicitud no le da acceso a tu ubicación.',
        'eye',
        'share',
      );
      log(s, 'Elena solicitó permiso de seguimiento; no se otorgó acceso.', 'Consentimiento');
      toast(s, 'Solicitud creada. Revisala desde la cuenta de Camila.');
      return s;

    /* ---------- Círculo y vínculos ---------- */
    case 'setCircleTab':
      s.circleTab = action.tab;
      return s;
    case 'setContactSearch':
      s.contactSearch = action.value;
      return s;
    case 'openContact':
      go(s, 'contact', action.id);
      return s;
    case 'toggleContactAlerts': {
      const c = s.contacts.find((x) => x.id === action.id);
      if (!c) return s;
      c.alerts = !c.alerts;
      const a = ownAlert(s);
      if (a && !c.alerts && a.recipients) {
        a.recipients = a.recipients.filter((id) => id !== c.id);
      }
      log(
        s,
        `${c.alias}: recepción de próximos SOS ${c.alerts ? 'habilitada' : 'deshabilitada'}.`,
        'Permiso',
      );
      return s;
    }
    case 'toggleContactShare': {
      const c = s.contacts.find((x) => x.id === action.id);
      if (!c) return s;
      if (s.share.active && s.share.recipients.includes(c.id)) {
        s.share.recipients = s.share.recipients.filter((id) => id !== c.id);
        if (!s.share.recipients.length) s.share.active = false;
        log(s, `Permiso de seguimiento revocado a ${c.alias}.`, 'Consentimiento');
        toast(s, 'Seguimiento revocado para este contacto.');
      } else {
        s.shareDraft = { recipients: [c.id], minutes: 60 };
        go(s, 'share');
      }
      return s;
    }
    case 'unlinkConfirm':
      openSheet(s, 'unlink', { id: action.id });
      return s;
    case 'unlink': {
      const c = s.contacts.find((x) => x.id === action.id);
      s.contacts = s.contacts.filter((x) => x.id !== action.id);
      s.share.recipients = s.share.recipients.filter((id) => id !== action.id);
      if (!s.share.recipients.length) s.share.active = false;
      const a = ownAlert(s);
      if (a && a.recipients) a.recipients = a.recipients.filter((id) => id !== action.id);
      s.shareDraft = null;
      log(s, `Vínculo con ${c?.alias ?? 'contacto'} revocado. Permisos retirados.`, 'Consentimiento');
      s.sheet = null;
      s.screen = 'circle';
      toast(s, 'Contacto desvinculado.');
      return s;
    }
    case 'setPairTab':
      s.pairTab = action.tab;
      return s;
    case 'renewCode': {
      const tokens = Object.keys(qrCodes);
      s.pairToken = tokens[(tokens.indexOf(s.pairToken) + 1) % tokens.length];
      s.pairStarted = Date.now();
      toast(s, 'Nuevo token de vinculación de prueba.');
      return s;
    }
    case 'pairManual':
      if (Date.now() - s.pairStarted > 300000) {
        toast(s, 'El código venció. Renovalo en Mi código QR.');
        return s;
      }
      if (action.code !== s.pairToken) {
        toast(s, 'Código de prueba incorrecto. Usá el que muestra la pantalla.');
        return s;
      }
      openSheet(s, 'pair');
      return s;
    case 'pairDetected':
      openSheet(s, 'pair');
      return s;
    case 'pairAccept':
      if (s.contacts.some((c) => c.id === 'bruno')) {
        s.sheet = null;
        toast(s, 'Bruno ya está vinculado.');
        return s;
      }
      s.contacts.push({
        id: 'bruno',
        name: 'Bruno Silva',
        alias: action.alias.trim() || 'Bruno',
        relation: action.relation || 'Amistad',
        color: 'blue',
        alerts: true,
      });
      log(s, 'Vínculo de prueba con Bruno aceptado por ambas cuentas. Ubicación privada.', 'Vínculo');
      notify(s, 'Bruno se sumó a tu círculo', 'No se compartió ubicación al vincularlo.', 'users', 'circle');
      s.sheet = null;
      s.screen = 'circle';
      s.circleTab = 'people';
      toast(s, 'Cuenta de Bruno vinculada. Sin seguimiento automático.');
      return s;

    /* ---------- Acompañamiento ---------- */
    case 'toggleSharePerson': {
      if (!s.shareDraft) {
        s.shareDraft = { recipients: [...s.share.recipients], minutes: s.share.minutes };
      }
      const ids = s.shareDraft.recipients;
      s.shareDraft.recipients = ids.includes(action.id)
        ? ids.filter((id) => id !== action.id)
        : [...ids, action.id];
      return s;
    }
    case 'setShareMinutes':
      if (s.shareDraft) s.shareDraft.minutes = action.minutes;
      return s;
    case 'startSharing': {
      const draft = s.shareDraft ?? {
        recipients: [...s.share.recipients],
        minutes: s.share.minutes,
      };
      if (!draft.recipients.length) {
        toast(s, 'Elegí al menos una persona.');
        return s;
      }
      if (!s.permissions.location) {
        openSheet(s, 'gps');
        return s;
      }
      if (!s.online) {
        toast(s, 'Restablecé la conexión de prueba para comunicar este permiso.');
        return s;
      }
      const t = Date.now();
      s.share = {
        active: true,
        recipients: [...draft.recipients],
        minutes: draft.minutes,
        started: t,
        until: draft.minutes ? t + draft.minutes * 60000 : null,
      };
      s.shareDraft = null;
      s.trail = [[...s.position]];
      log(
        s,
        `Consentimiento de seguimiento otorgado a ${s.share.recipients.length} contacto(s); ${s.share.minutes ? s.share.minutes + ' minutos' : 'hasta detener'}.`,
        'Consentimiento',
      );
      notify(
        s,
        'Acompañamiento activo',
        'Solo las cuentas seleccionadas pueden ver tu ubicación.',
        'eye',
        'sharelive',
      );
      s.screen = 'sharelive';
      s.sheet = null;
      toast(s, 'Permiso activo. Probá la perspectiva de Elena.');
      return s;
    }
    case 'editSharing':
      s.shareDraft = { recipients: [...s.share.recipients], minutes: s.share.minutes };
      go(s, 'share');
      return s;
    case 'stopSharingConfirm':
      openSheet(s, 'stopshare');
      return s;
    case 'stopSharing':
      stopSharing(s);
      return s;
    case 'revokeOne':
      s.share.recipients = s.share.recipients.filter((id) => id !== action.id);
      if (!s.share.recipients.length) s.share.active = false;
      log(
        s,
        `Permiso individual revocado: ${s.contacts.find((c) => c.id === action.id)?.alias ?? action.id}.`,
        'Consentimiento',
      );
      toast(s, 'Permiso retirado inmediatamente en la demo.');
      return s;

    /* ---------- Cerca / comunidad ---------- */
    case 'setNearFilter':
      s.nearFilter = action.filter;
      return s;
    case 'openRadius':
      openSheet(s, 'radius');
      return s;
    case 'applyRadius':
      s.radius = action.radius;
      s.sheet = null;
      return s;
    case 'toggleReceiveNear':
      s.receiveNear = !s.receiveNear;
      log(
        s,
        `Recepción de alertas de personas cercanas ${s.receiveNear ? 'activada' : 'desactivada'}.`,
        'Permiso',
      );
      toast(
        s,
        s.receiveNear
          ? 'Vas a recibir alertas de personas cercanas.'
          : 'Ya no recibís alertas de personas cercanas.',
      );
      return s;
    case 'injectNearAlert': {
      if (!s.receiveNear) {
        toast(s, 'Activá la recepción de alertas cercanas para probar esta función.');
        return s;
      }
      const seed = [
        { name: 'Lucía Ferreira', title: 'Necesito un lugar seguro', type: 'Acompañamiento', kind: 'care' as const, d: 340, p: [-34.3748, -55.2362] },
        { name: 'Micaela Sosa', title: 'Me siento seguida de camino', type: 'Acompañamiento', kind: 'care' as const, d: 520, p: [-34.3771, -55.2401] },
        { name: 'Rocío Pérez', title: 'Preciso asistencia en la parada', type: 'Asistencia', kind: 'medical' as const, d: 260, p: [-34.3752, -55.2394] },
      ];
      const created = s.incidents.filter((a) => a.owner === 'seed' && a.id.startsWith('BV-25')).length;
      const pick = seed[created % seed.length];
      const id = 'BV-' + (2501 + created);
      const t = Date.now();
      s.incidents.push({
        id,
        owner: 'seed',
        name: pick.name,
        title: pick.title,
        type: pick.type,
        kind: pick.kind,
        pos: pick.p as Incident['pos'],
        distance: pick.d,
        active: true,
        public: true,
        status: 'received',
        started: t,
        lastPosition: t,
        operator: null,
        unit: null,
        events: [{ time: t, text: 'Alerta de prueba recibida' }],
        helpers: [],
      });
      notify(
        s,
        'Alerta cercana recibida',
        `${pick.name.split(' ')[0]} pide ayuda a ${pick.d} m de vos. Podés verla en el mostrador.`,
        'radar',
        'alerts',
      );
      log(s, `${id}: alerta cercana de prueba recibida por ${helperName(s)}.`, 'Alerta');
      toast(s, 'Nueva alerta cercana recibida.');
      return s;
    }
    case 'setAlertBoardFilter':
      s.alertBoardFilter = action.filter;
      return s;
    case 'markAlertSeen':
      if (!s.nearAlertsRead.includes(action.id)) s.nearAlertsRead.push(action.id);
      return s;
    case 'openIncident':
      if (!s.nearAlertsRead.includes(action.id)) s.nearAlertsRead.push(action.id);
      go(s, 'incident', action.id);
      return s;
    case 'offerHelp': {
      const a = incidentById(s, action.id);
      if (!a?.active || !a.public) {
        toast(s, 'Esta alerta ya no está disponible.');
        return s;
      }
      openSheet(s, 'help-offer', { id: a.id });
      return s;
    }
    case 'acceptHelp': {
      const a = incidentById(s, action.id);
      if (!a?.active || !a.public) {
        s.sheet = null;
        toast(s, 'La alerta ya no está visible.');
        return s;
      }
      const me = helperName(s);
      if (!a.helpers.includes(me)) a.helpers.push(me);
      a.helpType = action.helpType;
      addEvent(s, a, `${me} ofreció apoyo comunitario de prueba`);
      if (a.owner === 'self') {
        notify(
          s,
          'Alguien cerca ofreció apoyo',
          'La central puede coordinar el ofrecimiento.',
          'hand',
          'sos',
        );
      }
      s.sheet = null;
      toast(s, 'Ofrecimiento registrado. No hay intervención autorizada automáticamente.');
      return s;
    }
    case 'helpStatus':
      openSheet(s, 'helpstatus', { id: action.id });
      return s;
    case 'withdrawHelp': {
      const a = incidentById(s, action.id);
      const me = helperName(s);
      if (a) {
        a.helpers = a.helpers.filter((n) => n !== me);
        addEvent(s, a, `${me} retiró su ofrecimiento de apoyo`);
      }
      toast(s, 'Ofrecimiento retirado.');
      return s;
    }
    case 'toggleHelperAvailable':
      s.helperAvailable = !s.helperAvailable;
      toast(
        s,
        s.helperAvailable ? 'Disponible para ayudar en la demo.' : 'Disponibilidad de ayuda pausada.',
      );
      return s;
    case 'openPlace': {
      const p = places.find((x) => x.id === action.id);
      if (p) openSheet(s, 'place', { id: p.id });
      return s;
    }
    case 'requestPlace':
      log(s, `Solicitud de recepción de prueba al punto ${action.id}.`, 'Comunidad');
      s.sheet = null;
      notify(
        s,
        'Punto de apoyo de prueba avisado',
        'Solicitud simulada. No hay un espacio real reservado.',
        'store',
        'places',
      );
      toast(s, 'Solicitud de demostración registrada.');
      return s;

    /* ---------- Actividad ---------- */
    case 'setActivityFilter':
      s.activityFilter = action.filter;
      return s;
    case 'readAll':
      s.notifications
        .filter((n) => (n.role ?? 'self') === s.role)
        .forEach((n) => (n.read = true));
      toast(s, 'Avisos marcados como leídos.');
      return s;
    case 'openNotification': {
      const n = s.notifications.find((x) => x.id === action.id);
      if (!n) return s;
      n.read = true;
      if (n.target === 'incoming') {
        s.role = 'self';
        s.screen = 'follow';
        s.context = 'incoming';
        s.history = [];
        return s;
      }
      if (n.target === 'chat') {
        s.chatTarget = n.channel ?? (n.title.includes('Elena') ? 'circle' : 'central');
      }
      go(s, n.target as ScreenName);
      return s;
    }

    /* ---------- Mensajería ---------- */
    case 'openChat':
      s.chatTarget = action.target ?? 'central';
      go(s, 'chat');
      return s;
    case 'sendMessage':
      sendMessage(s, action.text, action.target, action.sender);
      return s;
    case 'quickMessage':
      sendMessage(s, action.text);
      return s;

    /* ---------- Reportes ---------- */
    case 'newReport':
      s.reportStep = 1;
      s.screen = 'report';
      s.history.push({ screen: 'home', context: null });
      s.sheet = null;
      return s;
    case 'setDraft':
      Object.assign(s.draft, { [action.field]: action.value });
      return s;
    case 'setReportPerson':
      s.draft.person = action.person;
      return s;
    case 'reportExample':
      s.draft.details =
        'Ejemplo ficticio: quiero informar una situación de intimidación en un espacio público y solicitar orientación por mensajes.';
      s.draft.place = 'Escenario de demostración · Minas';
      return s;
    case 'reportNext':
      if (s.reportStep === 1 && s.draft.details.trim().length < 10) {
        toast(s, 'Contá el ejemplo con al menos 10 caracteres.');
        return s;
      }
      if (s.recording) {
        toast(s, 'Finalizá la nota de voz simulada antes de continuar.');
        return s;
      }
      s.reportStep = Math.min(3, s.reportStep + 1) as 1 | 2 | 3;
      return s;
    case 'reportPrev':
      s.reportStep = Math.max(1, s.reportStep - 1) as 1 | 2 | 3;
      return s;
    case 'reportEdit':
      s.reportStep = 1;
      return s;
    case 'attachPhoto':
      if (!s.draft.attachments.includes('foto_ejemplo.jpg')) {
        s.draft.attachments.push('foto_ejemplo.jpg');
      }
      toast(s, 'Foto ficticia adjuntada. No se usó tu cámara.');
      return s;
    case 'toggleRecording':
      s.recording = !s.recording;
      if (!s.recording && !s.draft.attachments.includes('nota_demo.m4a')) {
        s.draft.attachments.push('nota_demo.m4a');
      }
      if (!s.recording) toast(s, 'Nota ficticia añadida. No se usó el micrófono.');
      return s;
    case 'removeAttachment':
      s.draft.attachments.splice(action.index, 1);
      return s;
    case 'submitReport':
      if (!s.draft.consent) {
        toast(s, 'Confirmá que entendés el carácter de demostración.');
        return s;
      }
      if (!s.online) {
        toast(s, 'Sin conexión de prueba. El borrador se conserva, pero no se envía.');
        return s;
      }
      if (s.draft.details.trim().length < 10) {
        s.reportStep = 1;
        toast(s, 'Completá el relato de prueba.');
        return s;
      }
      {
        const id = 'RP-' + (1001 + s.reports.length);
        s.reports.push({
          ...s.draft,
          attachments: [...s.draft.attachments],
          id,
          created: Date.now(),
          status: 'Pendiente',
        });
        s.lastReport = id;
        log(s, `${id}: reporte ficticio recibido para revisión.`, 'Reporte');
        notify(
          s,
          'Tu reporte fue creado',
          id + ' está disponible en la central de demostración.',
          'file',
          'reports',
        );
        s.draft = {
          person: 'me',
          type: 'Situación de violencia',
          details: '',
          place: 'Escenario ficticio · Minas',
          when: 'Hoy',
          contact: 'Solo por mensaje en la app',
          attachments: [],
          consent: false,
        };
        s.screen = 'reportsuccess';
      }
      return s;
    case 'openReportDetail':
      go(s, 'reportdetail', action.id ?? null);
      return s;
    case 'reportsConsole':
      s.role = 'operator';
      s.consoleTab = 'reports';
      s.sheet = null;
      return s;
    case 'seedReport': {
      const id = 'RP-' + (1001 + s.reports.length);
      s.reports.push({
        id,
        person: 'me',
        type: 'Pedido de orientación',
        details:
          'Ejemplo ficticio: solicito orientación ante una situación de intimidación. Prefiero recibir mensajes dentro de la aplicación.',
        place: 'Escenario de prueba · Minas',
        when: 'Hoy',
        contact: 'Solo por mensaje en la app',
        attachments: [],
        consent: true,
        created: Date.now(),
        status: 'Pendiente',
      });
      s.lastReport = id;
      log(s, `${id}: ejemplo de reporte añadido desde el simulador.`, 'Reporte');
      return s;
    }
    case 'reviewReport': {
      const r = s.reports.find((x) => x.id === action.id);
      if (!r) return s;
      r.status = r.status === 'Pendiente' ? 'En revisión' : 'Revisado';
      r.reviewed = Date.now();
      log(s, `${r.id}: ${r.status.toLowerCase()} por Mariana.`, 'Reporte');
      notify(s, 'Tu reporte cambió de estado', r.id + ': ' + r.status + '.', 'file', 'reports');
      return s;
    }
    case 'contactReport': {
      const r = s.reports.find((x) => x.id === action.id);
      if (!r) return s;
      if (r.contact === 'Por ahora no quiero contacto') {
        toast(s, 'La persona pidió no ser contactada. No se genera una solicitud.');
        return s;
      }
      log(s, `${r.id}: solicitud de contacto simulada según canal autorizado.`, 'Reporte');
      notify(
        s,
        'Solicitud de contacto de la central',
        'Se creó una solicitud de prueba sobre ' + r.id + '. Se respetará el canal que elegiste.',
        'chat',
        'chat',
      );
      s.notifications[0].channel = 'central';
      toast(s, 'Solicitud ficticia creada. No se envía ningún mensaje externo.');
      return s;
    }
    case 'archiveReport': {
      const r = s.reports.find((x) => x.id === action.id);
      if (r) {
        r.status = 'Archivado';
        log(s, `${r.id}: reporte de prueba archivado.`, 'Reporte');
      }
      toast(s, 'Reporte archivado en la sesión.');
      return s;
    }
    case 'openOperatorReport':
      openSheet(s, 'operator-report', { id: action.id });
      return s;

    /* ---------- Cuenta y apariencia ---------- */
    case 'setTheme':
      s.theme = action.theme;
      return s;
    case 'toggleSetting':
      s[action.key] = !s[action.key];
      return s;
    case 'togglePermission':
      if (action.key in s.permissions) {
        s.permissions[action.key] = !s.permissions[action.key];
        log(
          s,
          `Permiso simulado ${action.key}: ${s.permissions[action.key] ? 'habilitado' : 'deshabilitado'}.`,
          'Permiso',
        );
      }
      return s;
    case 'testReadiness': {
      const missing = Object.entries(s.permissions)
        .filter(([k, v]) => !v && k !== 'camera')
        .map(
          ([k]) =>
            ({ location: 'ubicación', background: 'segundo plano', notifications: 'notificaciones' })[k],
        );
      openSheet(s, 'readiness', { missing });
      return s;
    }
    case 'saveProfile':
      s.profile = action.profile;
      log(s, 'Datos del perfil ficticio actualizados.', 'Cuenta');
      go(s, 'profile');
      toast(s, 'Datos de prueba guardados en esta pestaña.');
      return s;
    case 'setOnboarding':
      s.onboarding = action.step;
      return s;
    case 'onboardingNext':
      if (s.onboarding < 2) s.onboarding += 1;
      else go(s, 'roles');
      return s;
    case 'googleLogin':
      openSheet(s, 'google');
      return s;
    case 'emailLogin':
      if (!action.email.includes('@') || !action.password) {
        toast(s, 'Completá ambos campos con datos de prueba.');
        return s;
      }
      s.role = 'self';
      s.screen = 'home';
      s.history = [];
      s.sheet = null;
      log(s, 'Inicio de sesión ficticio completado.', 'Cuenta');
      toast(s, 'Entraste a la cuenta de demostración.');
      return s;
    case 'finishLogin':
      s.role = 'self';
      s.screen = 'home';
      s.history = [];
      s.sheet = null;
      log(s, 'Inicio de sesión ficticio completado.', 'Cuenta');
      toast(s, 'Entraste a la cuenta de demostración.');
      return s;
    case 'createAccount':
      if (!action.consent) {
        toast(s, 'Confirmá que vas a usar una cuenta ficticia.');
        return s;
      }
      if (!action.name.trim() || !action.email.includes('@')) {
        toast(s, 'Completá nombre y correo de ejemplo.');
        return s;
      }
      s.profile.name = action.name.trim();
      s.profile.email = action.email.trim();
      s.profile.city = action.city;
      s.profile.accountType = action.accountType;
      s.role = 'self';
      s.screen = 'permissions';
      s.history = [];
      s.sheet = null;
      log(s, 'Cuenta ficticia creada. Sin seguimiento automático.', 'Cuenta');
      toast(s, 'Cuenta de prueba creada. Revisá los permisos.');
      return s;
    case 'recover':
      openSheet(s, 'recover');
      return s;
    case 'recoverSend':
      if (!action.email.includes('@')) {
        toast(s, 'Ingresá un correo de ejemplo.');
        return s;
      }
      s.sheet = null;
      toast(s, 'Recuperación simulada. No se envió un correo real.');
      return s;
    case 'logout':
      openSheet(s, 'logout');
      return s;
    case 'confirmLogout':
      s.role = 'self';
      s.screen = 'login';
      s.history = [];
      s.sheet = null;
      return s;

    /* ---------- Llamada simulada ---------- */
    case 'startCall':
      s.callStart = Date.now();
      go(s, 'call');
      return s;
    case 'toggleCallMute':
      s.mutedCall = !s.mutedCall;
      return s;
    case 'toggleCallSpeaker':
      s.speakerCall = !s.speakerCall;
      return s;
    case 'callKeypad':
      openSheet(s, 'keypad', { digits: '' });
      return s;
    case 'dial':
      s.sheetData = { ...s.sheetData, digits: String(s.sheetData.digits ?? '') + action.digit };
      return s;
    case 'hangup':
      s.callStart = null;
      {
        const p = s.history.pop();
        s.screen = p?.screen ?? 'home';
        s.context = p?.context ?? null;
      }
      toast(s, 'Llamada simulada finalizada.');
      return s;

    /* ---------- Ayuda, acerca de y reinicio ---------- */
    case 'faq': {
      const f = FAQS[action.faq];
      if (f) openSheet(s, 'faq', { title: f[0], text: f[1] });
      return s;
    }
    case 'about':
      openSheet(s, 'about');
      return s;
    case 'demoTools':
      openSheet(s, 'demo-tools');
      return s;
    case 'gallery':
      openSheet(s, 'gallery');
      return s;
    case 'resetConfirm':
      openSheet(s, 'reset');
      return s;
    case 'reset':
      return createInitialState();

    /* ---------- Consola institucional ---------- */
    case 'setConsoleTab':
      s.consoleTab = action.tab;
      s.sheet = null;
      return s;
    case 'setQueueFilter':
      s.queueFilter = action.filter;
      return s;
    case 'setQueueSearch':
      s.queueSearch = action.value;
      return s;
    case 'selectIncident':
      s.selectedIncident = action.id;
      s.role = 'operator';
      s.consoleTab = 'overview';
      s.sheet = null;
      return s;
    case 'takeIncident': {
      const a = incidentById(s, action.id);
      if (!a || !received(a)) return s;
      a.operator = 'Mariana Duarte';
      a.status = 'taken';
      addEvent(s, a, 'Mariana tomó el incidente de prueba');
      if (a.owner === 'self') {
        notify(
          s,
          'La central asumió tu alerta',
          'Una operadora de prueba registró que está atendiendo el incidente.',
          'monitor',
          'sos',
        );
      }
      toast(s, 'Incidente asumido en la demostración.');
      return s;
    }
    case 'assignUnit': {
      const a = incidentById(s, action.id);
      if (!a?.operator) {
        toast(s, 'Tomá el incidente antes de asignar un recurso.');
        return s;
      }
      openSheet(s, 'assign', { id: a.id });
      return s;
    }
    case 'confirmUnit': {
      const a = incidentById(s, action.id);
      const u = s.units.find((x) => x.id === action.unitId);
      if (!a || !u || (!u.available && u.id !== a.unit)) {
        toast(s, 'Elegí un recurso disponible.');
        return s;
      }
      if (a.unit && a.unit !== u.id) {
        const old = s.units.find((x) => x.id === a.unit);
        if (old) old.available = true;
      }
      u.available = false;
      a.unit = u.id;
      a.status = 'assigned';
      addEvent(s, a, `${u.name} asignado; salida todavía no confirmada`);
      if (a.owner === 'self') {
        notify(
          s,
          'Recurso de prueba asignado',
          'La central asignó ' + u.name + '. El estado en camino requiere otra confirmación.',
          'car',
          'sos',
        );
      }
      s.sheet = null;
      toast(s, 'Asignación registrada.');
      return s;
    }
    case 'advanceIncident': {
      const a = incidentById(s, action.id);
      if (!a?.unit) return s;
      a.status = a.status === 'enroute' ? 'onscene' : 'enroute';
      addEvent(
        s,
        a,
        a.status === 'enroute'
          ? 'Salida del recurso confirmada en la demo'
          : 'Llegada al lugar confirmada en la demo',
      );
      if (a.owner === 'self') {
        notify(
          s,
          a.status === 'enroute' ? 'Recurso en camino · demo' : 'Recurso en el lugar · demo',
          'Estado actualizado por la operadora de prueba.',
          'car',
          'sos',
        );
      }
      return s;
    }
    case 'requestClose': {
      const a = incidentById(s, action.id);
      if (!a) return s;
      a.closeRequested = true;
      addEvent(s, a, 'La central solicitó confirmación de cierre a la persona');
      notify(
        s,
        'La central consulta si estás a salvo',
        'Si ya no necesitás compartir, podés detener tu alerta. La solicitud no la desactiva.',
        'shield',
        'sos',
      );
      toast(s, 'Solicitud enviada a la cuenta de Camila.');
      return s;
    }
    case 'closeIncident': {
      const a = incidentById(s, action.id);
      if (!a) return s;
      if (a.owner === 'self' && a.active) {
        toast(s, 'Camila todavía comparte su SOS. Solicitá confirmación de cierre.');
        return s;
      }
      openSheet(s, 'closure', { id: a.id });
      return s;
    }
    case 'confirmClosure': {
      const a = incidentById(s, action.id);
      const text = action.note.trim();
      if (!a || !text || text.length < 5) {
        toast(s, 'Agregá un resultado y confirmá el cierre simulado.');
        return s;
      }
      a.status = 'resolved';
      a.active = false;
      a.public = false;
      a.closure = text;
      a.closedAt = Date.now();
      if (a.unit) {
        const u = s.units.find((x) => x.id === a.unit);
        if (u) u.available = true;
      }
      addEvent(s, a, 'Cierre operativo registrado: ' + text);
      if (a.owner === 'self') {
        notify(s, 'Incidente cerrado en la demo', 'La central registró el cierre operativo.', 'shield', 'activity');
      }
      s.sheet = null;
      toast(s, 'Cierre registrado; el recurso vuelve a estar disponible.');
      return s;
    }
    case 'closureDetail':
      openSheet(s, 'closure-detail', { id: action.id });
      return s;
    case 'openOperatorChat': {
      const a = incidentById(s, action.id);
      openSheet(s, 'operator-chat', {
        id: a?.id,
        target: a?.owner === 'self' ? 'central' : 'community',
      });
      return s;
    }
    case 'operatorSend':
      sendMessage(s, action.text, action.target ?? 'central', 'operator');
      return s;
    case 'personInfo':
      openSheet(s, 'person', { id: action.id });
      return s;
    case 'unitInfo':
      openSheet(s, 'unit-info');
      return s;
    case 'toggleUnitAvailability': {
      const u = s.units.find((x) => x.id === action.id);
      if (!u) return s;
      const busy = s.incidents.find((a) => a.unit === u.id && a.status !== 'resolved');
      if (busy && !u.available) {
        toast(s, 'Este recurso sigue asignado a ' + busy.id + '. Reasigná o cerrá ese caso.');
        return s;
      }
      u.available = !u.available;
      log(
        s,
        `${u.name}: disponibilidad de prueba ${u.available ? 'activa' : 'pausada'}.`,
        'Recurso',
      );
      return s;
    }
    case 'unitAssignments':
      openSheet(s, 'assignments', { id: action.id });
      return s;
    case 'newUnit':
      openSheet(s, 'newunit');
      return s;
    case 'createUnit': {
      const name = action.name.trim();
      if (!name || name.length < 2) {
        toast(s, 'Agregá un nombre para el recurso ficticio.');
        return s;
      }
      const id = 'R-' + String(s.units.length + 1).padStart(2, '0');
      s.units.push({ id, name, type: action.unitType || 'Recurso de prueba', available: true });
      log(s, `${name} añadido como recurso ficticio.`, 'Recurso');
      s.consoleTab = 'resources';
      s.sheet = null;
      return s;
    }
    case 'toggleConfigCommunity':
      s.config.community = !s.config.community;
      if (!s.config.community) {
        s.incidents
          .filter((a) => a.owner === 'self' && a.active && a.public)
          .forEach((a) => {
            a.public = false;
            addEvent(s, a, 'Difusión comunitaria retirada por configuración de prueba');
          });
        s.audience.public = false;
      }
      log(
        s,
        'Difusión comunitaria ' + (s.config.community ? 'habilitada' : 'deshabilitada') + ' en la demo.',
        'Configuración',
      );
      return s;
    case 'saveConfig':
      if (
        !Number.isFinite(action.ack) ||
        !Number.isFinite(action.escalate) ||
        action.ack < 10 ||
        action.ack > 600 ||
        action.escalate < action.ack ||
        action.escalate > 900
      ) {
        toast(s, 'Usá atención entre 10 y 600 s y escalamiento igual o posterior, hasta 900 s.');
        return s;
      }
      s.config = { ...s.config, radius: action.radius, ack: action.ack, escalate: action.escalate };
      s.radius = action.radius;
      log(
        s,
        `Configuración guardada: radio ${action.radius} m; atención ${action.ack} s; escalamiento ${action.escalate} s.`,
        'Configuración',
      );
      toast(s, 'Configuración aplicada a esta demostración.');
      return s;

    /* ---------- Registro de vigilantes comunitarios ---------- */
    case 'submitGuardianApplication': {
      const d = action.data;
      if (!d.name.trim() || !d.phone.trim() || !d.neighborhood.trim()) {
        toast(s, 'Completá nombre, teléfono y barrio para postularte.');
        return s;
      }
      const app: GuardianApplication = {
        id: 'GA-' + (119 + s.guardianApps.length),
        name: d.name.trim(),
        phone: d.phone.trim(),
        email: d.email.trim() || 'sin-correo@ejemplo.invalid',
        neighborhood: d.neighborhood.trim(),
        availability: d.availability,
        motivation: d.motivation,
        references: d.references,
        training: d.training,
        identity: d.identity,
        status: 'pending',
        score: guardianScore(d),
        created: Date.now(),
        reviewed: null,
        notes: '',
      };
      s.guardianApps.unshift(app);
      s.guardianFilter = 'all';
      log(s, `${app.id}: postulación de ${app.name} recibida en el registro.`, 'Registro');
      toast(s, 'Postulación enviada. Queda pendiente de revisión.');
      return s;
    }
    case 'reviewGuardianApp': {
      const app = s.guardianApps.find((a) => a.id === action.id);
      if (!app) return s;
      app.status = action.status;
      app.reviewed = Date.now();
      if (action.status === 'approved') {
        const exists = s.profiles.some((p) => p.applicationId === app.id);
        if (!exists) {
          const id = 'vigilante-' + app.id.toLowerCase();
          s.profiles.push({
            id,
            name: app.name,
            role: 'community',
            label: 'Vigilante de la comunidad',
            relation: `Vecino · ${app.neighborhood}`,
            city: 'Minas, Lavalleja',
            color: 'mint',
            linked: true,
            authorized: true,
            applicationId: app.id,
            note: 'Alta aprobada desde el registro de vigilantes.',
          });
          notify(
            s,
            'Nuevo vigilante autorizado',
            `${app.name} ya puede recibir alertas comunitarias como dispositivo vinculado.`,
            'shield',
            'activity',
          );
        }
        log(s, `${app.id}: ${app.name} aprobada como vigilante comunitaria.`, 'Registro');
        toast(s, 'Alta aprobada: el perfil ya está disponible en la app.');
      } else if (action.status === 'rejected') {
        log(s, `${app.id}: postulación de ${app.name} rechazada.`, 'Registro');
        toast(s, 'Postulación rechazada con criterios de prueba.');
      } else {
        log(s, `${app.id}: postulación de ${app.name} en revisión.`, 'Registro');
        toast(s, 'Postulación marcada en revisión.');
      }
      return s;
    }
    case 'setGuardianFilter':
      s.guardianFilter = action.filter;
      return s;

    /* ---------- Mapa ---------- */
    case 'setMapLayer':
      s.mapReal = action.layer === 'real';
      s.sheet = null;
      return s;
    case 'mapZoom': {
      const t = s.mapTransforms[action.ctx] ?? { x: 0, y: 0, z: 1 };
      t.z = Math.min(3, Math.max(0.65, t.z + action.delta * 0.25));
      s.mapTransforms[action.ctx] = t;
      return s;
    }
    case 'mapCenter':
      s.mapTransforms[action.ctx] = { x: 0, y: 0, z: 1 };
      return s;
    case 'mapPan': {
      const t = s.mapTransforms[action.ctx] ?? { x: 0, y: 0, z: 1 };
      s.mapTransforms[action.ctx] = { x: t.x + action.dx, y: t.y + action.dy, z: t.z };
      return s;
    }

    /* ---------- Reloj y simulación de sesión ---------- */
    case 'tick': {
      const t = Date.now();
      s.now = t;
      /* Vencimiento del permiso temporal de seguimiento */
      if (s.share.active && s.share.until && t >= s.share.until) {
        s.share.active = false;
        s.shareDraft = null;
        log(s, 'El permiso temporal de seguimiento venció automáticamente.', 'Consentimiento');
        notify(
          s,
          'Permiso de seguimiento vencido',
          'La sesión terminó por su duración elegida.',
          'lock',
          'privacy',
        );
        toast(s, 'La sesión temporal de seguimiento terminó.');
      }
      /* Movimiento GPS simulado */
      const a = ownAlert(s);
      if (s.motion && s.online && s.permissions.location && (a || s.share.active)) {
        s.motionStep += 1;
        const k = s.motionStep;
        if (k % 2 === 0) {
          s.position = [
            BASE_POS[0] + 0.0017 * Math.sin(k * 0.08),
            BASE_POS[1] + 0.00155 * Math.sin(k * 0.06),
          ];
          s.lastPosition = t;
          s.trail.push([...s.position]);
          if (s.trail.length > 75) s.trail.shift();
          if (a) {
            a.pos = [...s.position];
            a.lastPosition = t;
          }
        }
      }
      /* Escalamiento simulado si nadie asume el incidente */
      const live = ownAlert(s);
      if (
        live &&
        received(live) &&
        !live.operator &&
        !live.escalated &&
        t - live.started > s.config.escalate * 1000
      ) {
        live.escalated = true;
        addEvent(s, live, 'Sin confirmación de atención: escalamiento simulado');
        notify(
          s,
          'Tu alerta sigue pendiente de atención',
          'La demo registró un escalamiento. Esto no es un despacho confirmado.',
          'clock',
          'sos',
        );
      }
      return s;
    }

    default:
      return state;
  }
}
