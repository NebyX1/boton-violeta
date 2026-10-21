import { useDemo } from '@/providers/DemoStateProvider';
import { helperName, received } from '@/providers/demoSelectors';
import { incidentStatusLabel } from '@/services/demoData';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Elapsed } from '@/components/common/Clock';
import { EmptyState } from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Tile } from '@/components/common/Tile';
import { MapLabel, VectorMap } from '@/components/map/VectorMap';

/** Detalle de una alerta comunitaria cercana y ofrecimiento de ayuda. */
export function IncidentScreen() {
  const { state, dispatch } = useDemo();
  const a = state.incidents.find((x) => x.id === state.context);

  if (!a?.active || !a.public || !received(a)) {
    return (
      <Screen>
        <PageTop title="Alerta cercana" />
        <EmptyState
          title="La alerta ya no es visible"
          text="La persona finalizó o retiró la difusión comunitaria. Su ubicación ya no se comparte."
        />
        <Button block onClick={() => dispatch({ type: 'go', screen: 'near' })}>
          Volver a explorar
        </Button>
      </Screen>
    );
  }

  const joined = a.helpers.includes(helperName(state));

  return (
    <Screen>
      <PageTop title="Ayuda cerca de vos" sub={`${a.distance || 120} m · distancia simulada`} />

      <div className="flex items-center justify-between gap-[10px] mb-4">
        <Badge color={a.kind === 'medical' ? 'green' : 'red'} live>
          {a.kind === 'medical' ? 'ASISTENCIA' : 'ALERTA COMUNITARIA'}
        </Badge>
        <span className="text-[10px] text-muted">
          <Elapsed since={a.started} />
        </span>
      </div>

      <VectorMap
        ctx={`incident:${a.id}`}
        variant="big"
        label={
          <MapLabel
            icon={<Avatar name={a.name} color={a.kind === 'medical' ? 'mint' : 'pink'} size="sm" />}
            title={a.name.split(' ')[0]}
            sub="Ubicación compartida por SOS"
          />
        }
      />

      <h2 className="mt-5">{a.title}</h2>
      <p className="text-[12px] text-muted mt-2">
        {a.owner === 'self'
          ? 'Camila activó una alerta abierta a personas próximas.'
          : 'Escenario ficticio para probar la colaboración ciudadana.'}
      </p>

      <Tile className="mt-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-brand-soft text-brand">
            <Icon name="monitor" />
          </span>
          <div>
            <h3 className="text-[13px]">Central: {incidentStatusLabel(a.status).toLowerCase()}</h3>
            <p className="text-[10px] text-muted mt-2">
              {a.unit ? `Recurso de prueba ${a.unit}` : 'No hay un recurso despachado confirmado.'}
            </p>
          </div>
        </div>
      </Tile>

      <a
        href="tel:911"
        aria-label="Llamar al 911"
        className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#c91f45] px-4 py-3 text-[13px] font-extrabold text-white shadow-[0_5px_16px_#c91f4538] transition-transform hover:-translate-y-px active:scale-[0.98]"
      >
        <Icon name="phone" size="sm" />
        Llamar al 911
      </a>

      {a.owner === 'self' && a.id === state.alertId ? (
        <Button block className="mt-5" onClick={() => dispatch({ type: 'go', screen: 'sos' })}>
          Ver mi SOS
        </Button>
      ) : (
        <Button
          block
          icon={joined ? 'check2' : 'hand'}
          className="mt-5"
          onClick={() =>
            joined
              ? dispatch({ type: 'helpStatus', id: a.id })
              : dispatch({ type: 'offerHelp', id: a.id })
          }
        >
          {joined ? 'Tu ayuda está ofrecida' : 'Puedo ayudar'}
        </Button>
      )}
      <Button
        variant="outline"
        block
        icon="chat"
        className="mt-2"
        onClick={() => dispatch({ type: 'openChat', target: 'community' })}
      >
        Comunicación con la central
      </Button>
      {joined && (
        <Button
          variant="ghost"
          block
          className="mt-2"
          onClick={() => dispatch({ type: 'withdrawHelp', id: a.id })}
        >
          Retirar mi ofrecimiento
        </Button>
      )}

      <div className="mt-4">
        <Note icon="shield" color="green">
          Ofrecer ayuda no autoriza a confrontar a nadie. Coordiná con la central y mantenete a
          resguardo.
        </Note>
      </div>
    </Screen>
  );
}
