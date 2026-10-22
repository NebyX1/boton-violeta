import { useDemo } from '@/providers/DemoStateProvider';
import { ownAlert } from '@/providers/demoSelectors';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button, IconButton } from '@/components/common/Button';
import { Elapsed, LocationAge } from '@/components/common/Clock';
import { EmptyState } from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icon';
import { Tile } from '@/components/common/Tile';
import { MapLabel, VectorMap } from '@/components/map/VectorMap';
import { formatTime } from '@/lib/format';

/** Sesión de acompañamiento activa: visibilidad y revocación en vivo. */
export function ShareLiveScreen() {
  const { state, dispatch } = useDemo();

  if (!state.share.active) {
    return (
      <Screen>
        <PageTop title="Acompañamiento" />
        <EmptyState
          title={ownAlert(state) ? 'Acompañamiento detenido' : 'Tu ubicación vuelve a ser privada'}
          text={
            ownAlert(state)
              ? 'La sesión voluntaria terminó, pero tu SOS sigue activo con la audiencia que elegiste.'
              : 'No hay una sesión de seguimiento activa.'
          }
        />
        <Button block onClick={() => dispatch({ type: 'go', screen: 'share' })}>
          Elegir con quién compartir
        </Button>
      </Screen>
    );
  }

  return (
    <Screen>
      <PageTop title="Te están acompañando" sub="Permiso activo y bajo tu control" />

      <div className="flex items-center justify-between gap-[10px] mb-4">
        <Badge color="green" live>
          COMPARTIENDO
        </Badge>
        <span className="text-[12px] text-muted">
          <Elapsed since={state.share.started} />
        </span>
      </div>

      <VectorMap
        ctx="share"
        variant="big"
        label={
          <MapLabel
            icon={<Icon name="eye" size="sm" className="w-3 h-3 text-brand" />}
            title="Ubicación simulada en vivo"
            sub={<LocationAge lastPosition={state.lastPosition} />}
          />
        }
      />

      <Tile className="mt-4">
        <h3 className="text-[13px]">Pueden verte ahora</h3>
        {state.share.recipients.map((id) => {
          const c = state.contacts.find((x) => x.id === id);
          if (!c) return null;
          return (
            <div key={id} className="flex items-center gap-[11px] py-[15px] border-b border-line last:border-b-0">
              <Avatar name={c.name} color={c.color} size="sm" />
              <div className="flex-1 min-w-0">
                <strong className="block text-[12px]">{c.alias}</strong>
                <small className="block text-[10px] text-muted mt-1">
                  {state.share.until
                    ? `Hasta las ${formatTime(state.share.until)}`
                    : 'Hasta que lo desactives'}
                </small>
              </div>
              <IconButton
                icon="close"
                label={`Revocar permiso a ${c.alias}`}
                onClick={() => dispatch({ type: 'revokeOne', id })}
                className="w-[31px] h-[31px] rounded-[10px]"
              />
            </div>
          );
        })}
      </Tile>

      <Button block icon="lock" className="mt-5" onClick={() => dispatch({ type: 'stopSharingConfirm' })}>
        Dejar de compartir
      </Button>
      <Button variant="outline" block className="mt-2" onClick={() => dispatch({ type: 'editSharing' })}>
        Cambiar personas o duración
      </Button>
      <p className="text-center text-[9px] text-muted mt-3">
        Al detener, las otras cuentas dejan de ver el mapa.
      </p>
    </Screen>
  );
}
