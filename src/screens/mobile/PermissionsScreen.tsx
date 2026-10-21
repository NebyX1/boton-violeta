import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Tile } from '@/components/common/Tile';
import { Toggle } from '@/components/common/Toggle';

const items: Array<{
  key: 'location' | 'background' | 'notifications' | 'camera';
  icon: string;
  title: string;
  sub: string;
}> = [
  {
    key: 'location',
    icon: 'pin',
    title: 'Ubicación mientras usás la app',
    sub: 'Permite ubicar un SOS. Desactivarla no impide crear una alerta.',
  },
  {
    key: 'background',
    icon: 'navigation',
    title: 'Ubicación en segundo plano',
    sub: 'Permiso simulado para seguir una sesión con pantalla apagada.',
  },
  {
    key: 'notifications',
    icon: 'bell',
    title: 'Notificaciones',
    sub: 'Avisos de tu círculo y alertas cercanas.',
  },
  {
    key: 'camera',
    icon: 'camera',
    title: 'Cámara para vincular',
    sub: 'Solo para leer QR cuando lo decidas.',
  },
];

/**
 * Permisos del dispositivo (interruptores simulados).
 * No se piden permisos reales del navegador ni del sistema.
 */
export function PermissionsScreen() {
  const { state, dispatch } = useDemo();

  return (
    <Screen>
      <PageTop title="Permisos del teléfono" sub="Prepará tu experiencia" />

      <div className="mb-4">
        <Note icon="beaker">
          Interruptores simulados. No usamos tu GPS, cámara ni micrófono, ni pedimos permisos reales
          al navegador.
        </Note>
      </div>

      <Tile>
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-[11px] py-[15px] border-b border-line last:border-b-0">
            <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-brand-soft text-brand shrink-0">
              <Icon name={item.icon} />
            </span>
            <div className="flex-1 min-w-0">
              <strong className="block text-[12px]">{item.title}</strong>
              <small className="block text-[10px] text-muted mt-1 leading-[1.6]">{item.sub}</small>
            </div>
            <Toggle
              on={state.permissions[item.key]}
              label={item.title}
              onToggle={() => dispatch({ type: 'togglePermission', key: item.key })}
            />
          </div>
        ))}
      </Tile>

      <Tile className="mt-4">
        <div className="flex items-center justify-between gap-[10px]">
          <div className="flex items-center gap-2">
            <Icon name={state.online ? 'wifi' : 'offline'} className="text-brand" />
            <strong className="text-[12px]">Conexión de prueba</strong>
          </div>
          <Toggle
            on={state.online}
            label="Conexión simulada"
            onToggle={() => dispatch({ type: 'toggleNetwork' })}
          />
        </div>
        <p className="text-[12px] text-muted mt-3">
          Probá el estado pendiente de envío y la recuperación al volver a tener conexión.
        </p>
      </Tile>

      <Button block className="mt-5" onClick={() => dispatch({ type: 'testReadiness' })}>
        Probar configuración
      </Button>
      <p className="text-[9px] text-muted mt-3 leading-[1.6]">
        La ejecución real en segundo plano requiere una app nativa compilada y pruebas en
        dispositivos.
      </p>
    </Screen>
  );
}
