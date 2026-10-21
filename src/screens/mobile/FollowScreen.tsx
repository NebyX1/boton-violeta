import { useDemo } from '@/providers/DemoStateProvider';
import { followAllowed, followHasPosition, liveAlert, received } from '@/providers/demoSelectors';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Elapsed, LocationAge } from '@/components/common/Clock';
import { EmptyState } from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Tile } from '@/components/common/Tile';
import { MapLabel, VectorMap } from '@/components/map/VectorMap';

/**
 * Seguimiento con consentimiento.
 * Tanto la vista del familiar (Elena) como la alerta entrante de Sofi
 * respetan el permiso vigente: sin permiso, no hay mapa.
 */
export function FollowScreen() {
  const { state, dispatch } = useDemo();

  /* Variante: alerta entrante de Sofi. */
  if (state.context === 'incoming') {
    const a = state.incoming;
    if (!a?.active) {
      return (
        <Screen>
          <PageTop title="Seguimiento" />
          <EmptyState
            title="La alerta finalizó"
            text="La ubicación de Sofi ya no está disponible."
          />
          <Button block onClick={() => dispatch({ type: 'go', screen: 'circle' })}>
            Volver a mi círculo
          </Button>
        </Screen>
      );
    }
    return (
      <Screen>
        <PageTop title="Sofi pidió ayuda" sub="Recibiste esta alerta por tu vínculo" />
        <div className="flex items-center gap-[10px] p-3 rounded-[14px] bg-red-soft mb-4">
          <Icon name="bell" className="text-red" />
          <div>
            <strong className="block text-[11px]">Alerta de prueba de Sofi</strong>
            <small className="block text-[9px] text-muted mt-0.5">
              <Elapsed since={a.started} /> · ubicación compartida por SOS
            </small>
          </div>
        </div>
        <VectorMap ctx="incoming" variant="big" />
        <Tile className="mt-4">
          <div className="flex items-center gap-3">
            <Avatar name="Sofía Acosta" color="mint" />
            <div>
              <h3>Sofía Acosta</h3>
              <p className="text-[12px] text-muted">Contacto de tu círculo</p>
            </div>
          </div>
          <Button block className="mt-4" onClick={() => dispatch({ type: 'incomingAck' })}>
            {a.ack ? 'Confirmaste recepción' : 'Confirmar que vi su alerta'}
          </Button>
          <Button
            variant="outline"
            block
            icon="chat"
            className="mt-2"
            onClick={() => dispatch({ type: 'openChat', target: 'circle' })}
          >
            Escribirle
          </Button>
        </Tile>
        <div className="mt-4">
          <Note icon="info" color="gray">
            Ver una alerta no equivale a un despacho policial. No te expongas para intervenir.
          </Note>
        </div>
      </Screen>
    );
  }

  /* Variante: seguimiento familiar de Camila. */
  if (state.role !== 'guardian') {
    return (
      <Screen>
        <PageTop title="Seguimiento familiar" />
        <EmptyState
          title="Probá la cuenta de Elena"
          text="Desde allí podés comprobar qué ve una persona vinculada."
          icon="users"
        />
        <Button block onClick={() => dispatch({ type: 'setRole', role: 'guardian' })}>
          Cambiar a la cuenta de Elena
        </Button>
      </Screen>
    );
  }

  if (!followAllowed(state)) {
    return (
      <Screen>
        <PageTop title="Camila" sub="Cuenta familiar vinculada" />
        <EmptyState
          title="Ubicación privada"
          text="Camila no está compartiendo en este momento. La vinculación no permite seguirla."
        />
        <Button variant="outline" block onClick={() => dispatch({ type: 'requestLocation' })}>
          Pedir permiso para seguir
        </Button>
        <div className="mt-5">
          <Note icon="shield" color="green">
            Si acabás de ver su mapa, el permiso o la alerta ya finalizaron. El seguimiento no
            continúa.
          </Note>
        </div>
      </Screen>
    );
  }

  const a = liveAlert(state);
  return (
    <Screen>
      <PageTop
        title="Siguiendo a Camila"
        sub={a ? 'Alerta SOS de prueba' : 'Compartido con consentimiento'}
      />
      <div className="flex items-center justify-between gap-[10px] mb-4">
        <Badge color={a ? 'red' : 'green'} live>
          {a ? 'SOS ACTIVO' : 'PERMISO ACTIVO'}
        </Badge>
        <span className="text-[12px] text-muted">
          <Elapsed since={a?.started ?? state.share.started} />
        </span>
      </div>

      {followHasPosition(state) ? (
        <VectorMap
          ctx="follow"
          variant="big"
          label={
            <MapLabel
              icon={<Avatar name="Camila Ríos" size="sm" />}
              title="Camila Ríos"
              sub={<LocationAge lastPosition={state.lastPosition} />}
            />
          }
        />
      ) : (
        <EmptyState
          title="Alerta recibida sin ubicación"
          text="Camila pudo enviar su SOS, pero no hay coordenadas disponibles. Podés escribirle y confirmar que viste su aviso."
          icon="pin"
        />
      )}

      <Tile className="mt-4">
        <div className="flex items-center justify-between gap-[10px]">
          <div>
            <h3 className="text-[13px]">Compartiendo con vos</h3>
            <p className="text-[12px] text-muted mt-2">
              {!followHasPosition(state)
                ? 'Todavía no hay coordenadas disponibles'
                : !state.permissions.location
                  ? 'Última conocida · ubicación desactivada'
                  : state.online
                    ? 'Precisión ficticia ± 8 m'
                    : 'Sin conexión · última posición conocida'}
            </p>
          </div>
          <Icon name={state.online ? 'wifi' : 'offline'} className="text-green" />
        </div>
      </Tile>

      {a && (
        <Button block className="mt-4" onClick={() => dispatch({ type: 'familyAck' })}>
          {a.familyAck ? 'Recepción confirmada' : 'Confirmar que vi la alerta'}
        </Button>
      )}
      <Button
        variant="outline"
        block
        icon="chat"
        className="mt-3"
        onClick={() => dispatch({ type: 'openChat', target: 'circle' })}
      >
        Enviar mensaje
      </Button>
      {a && received(a) && (
        <Button variant="secondary" block className="mt-2" onClick={() => dispatch({ type: 'familyPresent' })}>
          Ya estoy con Camila
        </Button>
      )}
      <div className="mt-4">
        <Note icon="lock" color="gray">
          Camila puede detener este permiso. No se muestra un historial anterior al inicio de esta
          sesión.
        </Note>
      </div>
    </Screen>
  );
}
