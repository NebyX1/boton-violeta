import { useDemo } from '@/providers/DemoStateProvider';
import { ownAlert } from '@/providers/demoSelectors';
import { incidentStatusLabel } from '@/services/demoData';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Badge } from '@/components/common/Badge';
import { Button, IconButton } from '@/components/common/Button';
import { Elapsed, LocationAge } from '@/components/common/Clock';
import { EmptyState } from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Tile } from '@/components/common/Tile';
import { Timeline } from '@/components/common/Timeline';
import { MapLabel, VectorMap } from '@/components/map/VectorMap';

/**
 * Mi SOS activo: estado visible de cada confirmación (recibida, asumida, en camino)
 * y control para detener el seguimiento.
 */
export function SosScreen() {
  const { state, dispatch } = useDemo();
  const a = ownAlert(state);

  if (!a) {
    return (
      <Screen>
        <PageTop title="Tu alerta" />
        <EmptyState
          title="No hay un SOS activo"
          text="Tu ubicación no se comparte por una emergencia en este momento."
          icon="shield"
        />
        <Button block onClick={() => dispatch({ type: 'sosOptions' })}>
          Configurar un SOS de prueba
        </Button>
      </Screen>
    );
  }

  return (
    <Screen>
      <PageTop
        title="Estamos con vos"
        sub="Alerta de demostración"
        right={
          <IconButton
            icon="phone"
            label="Simular llamada de emergencia"
            onClick={() => dispatch({ type: 'startCall' })}
          />
        }
      />

      <div className="flex items-center justify-between gap-[10px] mb-4">
        <Badge color={a.status === 'queued' ? 'amber' : 'red'} live>
          {a.status === 'queued' ? 'PENDIENTE DE ENVÍO' : 'SOS ACTIVO'}
        </Badge>
        <span className="text-[12px] text-muted">
          <Elapsed since={a.started} />
        </span>
      </div>

      {a.status === 'queued' && (
        <div className="mb-4">
          <Note icon="offline" color="amber">
            Sin conexión. La central y tus contactos todavía no recibieron esta alerta.
          </Note>
        </div>
      )}
      {!state.permissions.location && (
        <div className="mb-4">
          <Note icon="pin" color="amber">
            Ubicación desactivada. La alerta se envía igual, pero no hay una posición nueva.
          </Note>
        </div>
      )}

      <VectorMap
        ctx="active"
        variant="big"
        label={
          <MapLabel
            icon={<Icon name="pin" size="sm" className="w-3 h-3 text-brand" />}
            title={a.pos ? 'Ubicación simulada · ± 8 m' : 'Sin ubicación disponible'}
            sub={a.pos ? <LocationAge lastPosition={a.lastPosition} /> : 'Alerta sin coordenadas'}
          />
        }
      />

      <h2 className="mt-5">Tu alerta está activa.</h2>
      <p className="text-[12px] text-muted mt-2">
        {a.status === 'queued'
          ? 'Esperando conexión para comunicarla.'
          : 'Cada confirmación tiene un estado visible.'}
      </p>
      <div className="flex flex-wrap gap-[6px] mt-3">
        <Badge>Central</Badge>
        {a.family && <Badge>{a.recipients?.length ?? 0} contactos</Badge>}
        {a.public && <Badge color="red">Comunidad</Badge>}
      </div>

      <Tile className="mt-4">
        <div className="flex items-center justify-between gap-[10px]">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-brand-soft text-brand">
              <Icon name="monitor" />
            </span>
            <div>
              <strong className="text-[12px]">{incidentStatusLabel(a.status)}</strong>
              <p className="text-[10px] text-muted">
                {a.operator ? 'Operadora de prueba asignada' : 'Sin operadora asignada todavía'}
              </p>
            </div>
          </div>
          <Icon name={a.operator ? 'check2' : 'clock'} className={a.operator ? 'text-green' : 'text-muted'} />
        </div>
        {a.familyAck && (
          <p className="text-[10px] text-green mt-3">Tu círculo confirmó que vio tu alerta.</p>
        )}
        {a.familyPresent && (
          <p className="text-[10px] text-green mt-2">Alguien de tu círculo está contigo.</p>
        )}
      </Tile>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <Button
          variant="secondary"
          small
          icon="chat"
          onClick={() => dispatch({ type: 'openChat', target: 'central' })}
        >
          Mensaje
        </Button>
        <Button variant="outline" small icon="volume" onClick={() => dispatch({ type: 'cantSpeak' })}>
          No puedo hablar
        </Button>
      </div>

      <Tile className="mt-4">
        <div className="flex items-center justify-between gap-[10px]">
          <div className="flex-1 min-w-0">
            <strong className="text-[12px]">Visible para personas cercanas</strong>
            <p className="text-[10px] text-muted mt-2">
              {a.public
                ? 'Comparten tu posición mientras el SOS siga activo.'
                : 'Tu alerta no se difunde a la comunidad.'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={a.public}
            aria-label="Compartir alerta con comunidad"
            onClick={() => dispatch({ type: 'togglePublic' })}
            className={`relative w-[42px] h-[24px] rounded-[20px] shrink-0 transition-colors ${
              a.public ? 'bg-brand' : 'bg-[#dcd5e4]'
            }`}
          >
            <i
              className={`absolute left-[3px] top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-[0_2px_3px_#0001] transition-transform ${
                a.public ? 'translate-x-[18px]' : ''
              }`}
            />
          </button>
        </div>
      </Tile>

      <Tile className="mt-4">
        <Timeline events={a.events} />
      </Tile>

      <Button block icon="shield" className="mt-5" onClick={() => dispatch({ type: 'stopSosConfirm' })}>
        Estoy a salvo · detener
      </Button>
      <p className="text-center text-[9px] text-muted mt-3">
        Detener corta el seguimiento. La central conserva
        <br />
        el incidente para registrar su cierre.
      </p>
    </Screen>
  );
}
