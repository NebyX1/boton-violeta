import { useDemo } from '@/providers/DemoStateProvider';
import { liveAlert, received } from '@/providers/demoSelectors';
import { Sheet } from '@/components/common/Sheet';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { LogoMark } from '@/components/common/Logo';
import { Note } from '@/components/common/Note';
import { Toggle } from '@/components/common/Toggle';
import type { Role, ScreenName } from '@/types/demo';

const perspectives: Array<{ role: Role; icon: string; label: string }> = [
  { role: 'self', icon: 'mobile', label: 'Mi app · Camila' },
  { role: 'guardian', icon: 'users', label: 'Círculo · Elena' },
  { role: 'community', icon: 'radar', label: 'Comunidad · Nicolás' },
  { role: 'operator', icon: 'monitor', label: 'Central · Mariana' },
];

const galleryScreens: Array<{ screen: ScreenName; icon: string; label: string }> = [
  { screen: 'home', icon: 'home', label: 'Inicio' },
  { screen: 'onboarding', icon: 'heart', label: 'Introducción' },
  { screen: 'roles', icon: 'users', label: 'Elegir perfil' },
  { screen: 'lockscreen', icon: 'lock', label: 'Pantalla bloqueada' },
  { screen: 'login', icon: 'user', label: 'Inicio de sesión' },
  { screen: 'register', icon: 'plus', label: 'Registro' },
  { screen: 'near', icon: 'map', label: 'Mapa cercano' },
  { screen: 'circle', icon: 'users', label: 'Círculo' },
  { screen: 'pair', icon: 'qr', label: 'Vinculación QR' },
  { screen: 'share', icon: 'walk', label: 'Permitir seguir' },
  { screen: 'sharelive', icon: 'eye', label: 'Seguimiento activo' },
  { screen: 'sos', icon: 'radar', label: 'Mi SOS' },
  { screen: 'activity', icon: 'bell', label: 'Notificaciones' },
  { screen: 'report', icon: 'file', label: 'Reporte / denuncia' },
  { screen: 'reports', icon: 'file', label: 'Mis reportes' },
  { screen: 'chat', icon: 'chat', label: 'Mensajería' },
  { screen: 'profile', icon: 'user', label: 'Mi cuenta' },
  { screen: 'accountedit', icon: 'edit', label: 'Editar datos' },
  { screen: 'privacy', icon: 'lock', label: 'Privacidad' },
  { screen: 'permissions', icon: 'mobile', label: 'Permisos' },
  { screen: 'settings', icon: 'sun', label: 'Apariencia' },
  { screen: 'places', icon: 'store', label: 'Espacios de apoyo' },
  { screen: 'help', icon: 'help', label: 'Centro de ayuda' },
];

/** Panel de demostración: cambiar de perspectiva y probar escenarios. */
export function DemoToolsDialog() {
  const { state, dispatch } = useDemo();
  const close = () => dispatch({ type: 'closeSheet' });

  return (
    <Sheet
      title="Explorá las cuatro miradas"
      onClose={close}
      actions={
        <>
          <Button icon="play" onClick={() => dispatch({ type: 'demoFull' })}>
            Iniciar un SOS comunitario de prueba
          </Button>
          <Button variant="secondary" onClick={() => dispatch({ type: 'toggleIncoming' })}>
            {state.incoming?.active ? 'Finalizar alerta de Sofi' : 'Recibir una alerta de Sofi'}
          </Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'gallery' })}>
            Explorar todas las pantallas
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: 'resetConfirm' })}>
            Reiniciar la demostración
          </Button>
        </>
      }
    >
      <p className="text-[11px] text-muted leading-[1.75]">
        Todo ocurre en esta pestaña y con datos ficticios. Cambiá de perspectiva sin perder la sesión.
      </p>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {perspectives.map((p) => (
          <button
            key={p.role}
            type="button"
            onClick={() => dispatch({ type: 'setRole', role: p.role })}
            className="flex items-center gap-2 p-3 rounded-[12px] border border-line bg-paper text-[10px] text-left"
          >
            <Icon name={p.icon} size="sm" /> {p.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <strong className="text-[11px]">Dispositivos vinculados</strong>
          <button
            type="button"
            onClick={() => dispatch({ type: 'go', screen: 'roles' })}
            className="text-[9px] font-bold text-brand"
          >
            Ver todos
          </button>
        </div>
        <div className="flex flex-col gap-[6px]">
          {state.profiles.map((p) => {
            const alert = liveAlert(state);
            const sees =
              p.role === 'guardian'
                ? !!(alert?.family && received(alert) && alert.recipients?.includes(p.id))
                : p.role === 'community'
                  ? !!(alert?.public && received(alert) && p.authorized)
                  : false;
            return (
              <div
                key={p.id}
                className="flex items-center gap-2 rounded-[10px] border border-line bg-paper px-2 py-[7px]"
              >
                <Avatar name={p.name} color={p.color} size="sm" />
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-[9px]">{p.name}</strong>
                  <small className="block truncate text-[8px] text-muted">{p.label}</small>
                </div>
                <Badge color={sees ? 'green' : 'gray'}>
                  {sees ? 'VE EL SOS' : p.role === 'self' ? 'SU ALERTA' : 'SIN AVISO'}
                </Badge>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[8px] leading-relaxed text-muted">
          La visibilidad depende de la configuración de quien pide ayuda y del vínculo de cada
          dispositivo. Cambiá de perfil para comprobarlo.
        </p>
      </div>

      <div className="h-px bg-line my-[19px]" />
      <div className="px-4 border border-line rounded-[19px] bg-paper">
        <div className="flex items-center gap-[11px] py-[15px] border-b border-line">
          <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-brand-soft text-brand">
            <Icon name={state.online ? 'wifi' : 'offline'} />
          </span>
          <div className="flex-1 min-w-0">
            <strong className="block text-[12px]">Conexión de prueba</strong>
            <small className="block text-[10px] text-muted mt-1">
              {state.online ? 'Disponible' : 'Sin conexión'}
            </small>
          </div>
          <Toggle
            on={state.online}
            label="Conexión de prueba"
            onToggle={() => dispatch({ type: 'toggleNetwork' })}
          />
        </div>
        <div className="flex items-center gap-[11px] py-[15px]">
          <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-brand-soft text-brand">
            <Icon name="navigation" />
          </span>
          <div className="flex-1 min-w-0">
            <strong className="block text-[12px]">Movimiento GPS simulado</strong>
            <small className="block text-[10px] text-muted mt-1">
              Solo mientras hay una sesión activa.
            </small>
          </div>
          <Toggle
            on={state.motion}
            label="Movimiento de prueba"
            onToggle={() => dispatch({ type: 'toggleMotion' })}
          />
        </div>
      </div>
    </Sheet>
  );
}

/** Galería con todas las pantallas del prototipo. */
export function GalleryDialog() {
  const { dispatch } = useDemo();
  return (
    <Sheet
      title="Todas las pantallas"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button onClick={() => dispatch({ type: 'setRole', role: 'operator' })}>
          Ver consola institucional
        </Button>
      }
    >
      <p className="text-[11px] text-muted leading-[1.75]">
        Las vistas de seguimiento muestran datos solo después de activar un permiso o SOS. Los
        diálogos y pasos forman parte de cada recorrido.
      </p>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {galleryScreens.map((s) => (
          <button
            key={s.screen}
            type="button"
            onClick={() => dispatch({ type: 'jump', screen: s.screen })}
            className="flex items-center gap-2 p-3 rounded-[12px] border border-line bg-paper text-[10px] text-left"
          >
            <Icon name={s.icon} size="sm" /> {s.label}
          </button>
        ))}
      </div>
    </Sheet>
  );
}

const sources: Array<{ href: string; name: string; sub: string }> = [
  {
    href: 'https://www.pulsepoint.org/pulsepoint-respond',
    name: 'PulsePoint Respond',
    sub: 'Referencia funcional: asistencia cercana y respuesta comunitaria.',
  },
  {
    href: 'https://www.goodsamapp.org/',
    name: 'GoodSAM',
    sub: 'Referencia funcional: coordinación y respuesta geolocalizada.',
  },
  {
    href: 'https://www.nativewind.dev/',
    name: 'NativeWind',
    sub: 'Objetivo de estilo y composición para la implementación nativa.',
  },
  {
    href: 'https://docs.expo.dev/versions/latest/sdk/location/',
    name: 'Expo Location',
    sub: 'Documentación para la futura integración nativa de ubicación.',
  },
  {
    href: 'https://leafletjs.com/',
    name: 'Leaflet',
    sub: 'Cartografía opcional de esta demostración.',
  },
];

/** Sobre la demo: alcance, tecnología y referencias. */
export function AboutDialog() {
  const { dispatch } = useDemo();
  return (
    <Sheet title="Diseñado para cuidarnos" onClose={() => dispatch({ type: 'closeSheet' })} actions={<Button onClick={() => dispatch({ type: 'closeSheet' })}>Seguir explorando</Button>}>
      <div className="p-[17px] rounded-[20px] bg-brand-soft">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div>
            <h3>Botón Violeta</h3>
            <p className="text-[10px] text-muted mt-2">Lavalleja · Prototipo de producto v0.1</p>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted leading-[1.75] mt-5">
        Diseño original en violeta, lila, blanco cálido y acentos de estado. Navegación móvil,
        componentes redondeados y permisos visibles, pensados para una implementación posterior en{' '}
        <strong>React Native + Expo + NativeWind</strong>, con backend <strong>Flask</strong>.
      </p>

      <Note icon="beaker">
        <strong>Esta demo es React web.</strong> No ejecuta React Native, no integra Google Auth real,
        no registra denuncias ni conecta con la Policía. Todos los escenarios son ficticios.
      </Note>

      <h3 className="mt-6">Qué podés probar</h3>
      <p className="text-[12px] text-muted mt-3">
        SOS con cuenta regresiva, cuatro perspectivas, consentimiento por vínculo, QR simulado,
        ubicaciones en movimiento, filtros por radio, reportes, mensajes, recepción, asignación y
        cierre operativo. Sin conexión, el estado cambia a pendiente.
      </p>

      <h3 className="mt-6">Mapas y datos</h3>
      <p className="text-[12px] text-muted mt-3">
        El plano vectorial funciona sin internet y no representa calles exactas. El mapa real opcional
        usa Leaflet y OpenStreetMap; requiere conexión. Los marcadores y distancias siguen siendo
        ficticios. Los QR codifican tokens de demostración.
      </p>

      <h3 className="mt-6">Referencias de diseño y tecnología</h3>
      <div className="flex flex-col gap-2 mt-3">
        {sources.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener"
            className="block p-3 rounded-[12px] border border-line bg-paper"
          >
            <strong className="block text-[11px] text-brand">{s.name}</strong>
            <small className="block text-[9px] text-muted mt-1">{s.sub}</small>
          </a>
        ))}
      </div>
      <p className="text-[9px] text-muted mt-5 leading-[1.6]">
        Referencias consultadas: 20 de octubre de 2026. No hay afiliación, convenio operativo ni
        aprobación institucional implícita.
      </p>
    </Sheet>
  );
}

/** Preguntas frecuentes. */
export function FaqDialog() {
  const { state, dispatch } = useDemo();
  return (
    <Sheet
      title={String(state.sheetData.title ?? 'Ayuda')}
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={<Button onClick={() => dispatch({ type: 'closeSheet' })}>Entendido</Button>}
    >
      <p className="text-[11px] text-muted leading-[1.75]">
        {String(state.sheetData.text ?? '')}
      </p>
    </Sheet>
  );
}

/** Comprobación simulada de permisos. */
export function ReadinessDialog() {
  const { state, dispatch } = useDemo();
  const missing = (state.sheetData.missing as string[] | undefined) ?? [];
  return (
    <Sheet
      title="Comprobación de prueba"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={<Button onClick={() => dispatch({ type: 'closeSheet' })}>Entendido</Button>}
    >
      <Note
        icon={missing.length ? 'info' : 'check2'}
        color={missing.length ? 'amber' : 'green'}
      >
        {missing.length
          ? 'Revisá estos permisos simulados: ' + missing.join(', ') + '.'
          : 'Los permisos principales están habilitados en la demo.'}
      </Note>
      <p className="text-[11px] text-muted leading-[1.75] mt-4">
        Conexión: {state.online ? 'disponible' : 'no disponible'}. Esta comprobación no evalúa un
        dispositivo real.
      </p>
    </Sheet>
  );
}

/** Confirmación de reinicio de la demostración. */
export function ResetDialog() {
  const { dispatch } = useDemo();
  return (
    <Sheet
      title="¿Reiniciar la demostración?"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <>
          <Button onClick={() => dispatch({ type: 'reset' })}>Reiniciar todo</Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'closeSheet' })}>
            Conservar sesión
          </Button>
        </>
      }
    >
      <Note icon="refresh">
        Se borrarán los reportes, mensajes, cambios de permisos e incidentes creados en esta pestaña.
        Se restauran los ejemplos iniciales.
      </Note>
    </Sheet>
  );
}
