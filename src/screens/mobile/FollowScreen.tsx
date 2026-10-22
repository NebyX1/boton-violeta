import { useDemo } from '@/providers/DemoStateProvider';
import { followAllowed, followHasPosition, watchedAlert } from '@/providers/demoSelectors';
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

  const a = watchedAlert(state);
  const person = a?.name.split(' ')[0] ?? 'Camila';
  return (
    <Screen>
      <PageTop
        title={a ? `${person} necesita ayuda` : `Siguiendo a ${person}`}
        sub={a ? 'SOS activo · datos ficticios' : 'Compartido con consentimiento'}
        right={
          a ? (
            <span className="flex items-center gap-1 rounded-full bg-[#d52f55] px-[9px] py-[5px] text-[8px] font-extrabold tracking-[0.8px] text-white">
              <i className="h-[5px] w-[5px] rounded-full bg-white animate-pulse-live" />
              SOS
            </span>
          ) : undefined
        }
      />
      <div className="flex items-center justify-between gap-[10px] mb-4">
        <Badge color={a ? 'red' : 'green'} live>
          {a ? 'SOS ACTIVO · SEGUIMIENTO HABILITADO' : 'PERMISO ACTIVO'}
        </Badge>
        <span className={a ? 'text-[12px] font-bold text-[#b71339]' : 'text-[12px] text-muted'}>
          <Elapsed since={a?.started ?? state.share.started} />
        </span>
      </div>

      {a && (
        <div className="mb-3 flex items-start gap-[10px] rounded-[15px] border-2 border-[#d52f55] bg-[#ffe4ea] p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#d52f55] text-white">
            <Icon name="bell" size="sm" />
          </span>
          <div className="min-w-0">
            <strong className="block text-[12px] text-[#8f1836]">{person} activó un SOS</strong>
            <p className="mt-[2px] text-[9px] leading-relaxed text-[#a34a63]">
              La ubicación se actualiza mientras la alerta siga activa. Confirmá que la viste y
              avisá si podés estar con {person}.
            </p>
          </div>
        </div>
      )}

      {followHasPosition(state) ? (
        <VectorMap
          ctx="follow"
          variant="big"
          label={
            <MapLabel
              icon={
                a ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d52f55] text-white">
                    <Icon name="pin" size="sm" className="h-3 w-3" />
                  </span>
                ) : (
                  <Avatar name="Camila Ríos" size="sm" />
                )
              }
              title={a?.name ?? 'Camila Ríos'}
              sub={<LocationAge lastPosition={a?.lastPosition ?? state.lastPosition} />}
            />
          }
        />
      ) : (
        <EmptyState
          title="Alerta recibida sin ubicación"
          text={`${person} pudo enviar su SOS, pero no hay coordenadas disponibles. Podés escribirle y confirmar que viste su aviso.`}
          icon="pin"
        />
      )}

      <Tile className={a ? 'mt-4 border-[#d52f55]/45 bg-[#fff7f9]' : 'mt-4'}>
        <div className="flex items-center justify-between gap-[10px]">
          <div>
            <h3 className="text-[13px]">
              {a ? 'Ubicación compartida por el SOS' : 'Compartiendo con vos'}
            </h3>
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
          <Icon
            name={state.online ? 'wifi' : 'offline'}
            className={a ? 'text-[#b71339]' : 'text-green'}
          />
        </div>
      </Tile>

      {a && (
        <>
          <Button
            variant="danger"
            block
            icon="check2"
            className="mt-4"
            onClick={() => dispatch({ type: 'familyAck' })}
          >
            {a.familyAck ? 'Recepción confirmada' : 'Confirmar que vi la alerta'}
          </Button>
          <a
            href="tel:911"
            className="mt-2 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[13px] bg-[#b71339] px-4 py-2 text-[12px] font-extrabold text-white shadow-[0_5px_14px_#b7133940] transition-transform hover:-translate-y-px active:scale-[0.98]"
          >
            <Icon name="phone" size="sm" />
            Llamar al 911
          </a>
          <Button
            variant="outline"
            block
            icon="users"
            className="mt-2 border-[#d52f55] text-[#b71339]"
            onClick={() => dispatch({ type: 'familyPresent' })}
          >
            {a.familyPresent ? `Ya estás con ${person}` : `Ya estoy con ${person}`}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        block
        icon="chat"
        className={a ? 'mt-2 border-[#d52f55]/40 text-[#b71339]' : 'mt-3'}
        onClick={() => dispatch({ type: 'openChat', target: 'circle' })}
      >
        Enviar mensaje
      </Button>
      <div className="mt-4">
        <Note icon="lock" color="gray">
          {person} puede detener este permiso. No se muestra un historial anterior al inicio de esta
          sesión.
        </Note>
      </div>
    </Screen>
  );
}
