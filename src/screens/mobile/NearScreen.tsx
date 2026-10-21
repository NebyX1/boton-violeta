import { useDemo } from '@/providers/DemoStateProvider';
import { helperName, nearAlerts, nearbyFeed } from '@/providers/demoSelectors';
import { formatRadius } from '@/lib/geo';
import { places } from '@/services/demoData';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Chip, Chips } from '@/components/common/Segmented';
import { IconButton } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { MapLabel, VectorMap } from '@/components/map/VectorMap';
import { Elapsed } from '@/components/common/Clock';
import { AlertBoardStats } from '@/components/alerts/AlertBoardStats';
import { AlertPreferences } from '@/components/alerts/AlertPreferences';
import { ReceivedAlertCard, alertFeedState } from '@/components/alerts/ReceivedAlertCard';

const filters = [
  { key: 'all', label: 'Todas' },
  { key: 'care', label: 'Ayuda' },
  { key: 'medical', label: 'Asistencia' },
  { key: 'places', label: 'Puntos' },
] as const;

/**
 * "Cerca de vos": el lugar único para las alertas de personas cercanas.
 * Mapa, mostrador de alertas recibidas, estado de recepción y preferencias.
 * La urgencia (asistencia médica) queda al frente: se ordena y resalta primero.
 */
export function NearScreen() {
  const { state, dispatch } = useDemo();
  const alerts = nearAlerts(state);
  const feed = nearbyFeed(state);
  const me = helperName(state);
  const showPlaces = state.nearFilter === 'places';

  const orderedAlerts = [...alerts].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'medical' ? -1 : 1;
    return (a.distance || 120) - (b.distance || 120);
  });

  const boardFilter = state.alertBoardFilter;
  const board = feed
    .filter((a) => {
      const f = alertFeedState(a, state.nearAlertsRead, me);
      if (boardFilter === 'new') return f === 'new';
      if (boardFilter === 'helping') return f === 'helping';
      return true;
    })
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'medical' ? -1 : 1;
      return (a.distance || 120) - (b.distance || 120);
    });

  const stats = [
    {
      value: feed.filter((a) => alertFeedState(a, state.nearAlertsRead, me) === 'new').length,
      label: 'Nuevas sin abrir',
      icon: 'bell',
      tone: 'red' as const,
    },
    { value: feed.length, label: 'Activas en tu zona', icon: 'radar', tone: 'brand' as const },
    {
      value: feed.filter((a) => a.helpers.includes(me)).length,
      label: 'Con mi ayuda ofrecida',
      icon: 'hand',
      tone: 'green' as const,
    },
  ];

  return (
    <Screen>
      <PageTop
        title="Cerca de vos"
        sub="Ayuda y comunidad en tu zona"
        right={
          <IconButton
            icon="filter"
            label="Filtrar alertas"
            onClick={() => dispatch({ type: 'openRadius' })}
          />
        }
      />

      <Chips className="mb-4">
        {filters.map((f) => (
          <Chip
            key={f.key}
            label={f.label}
            active={state.nearFilter === f.key}
            onClick={() => dispatch({ type: 'setNearFilter', filter: f.key })}
          />
        ))}
      </Chips>

      <VectorMap
        ctx="near"
        variant="big"
        label={
          <MapLabel
            icon={<Icon name="radar" size="sm" className="w-3 h-3 text-brand" />}
            title={`${feed.length} pedido${feed.length === 1 ? '' : 's'} de ayuda cerca`}
            sub={`SOS comunitarios · radio ${formatRadius(state.radius)}`}
          />
        }
      />

      {showPlaces ? (
        <>
          <div className="flex items-center justify-between gap-2 mt-[23px] mb-3">
            <h3 className="text-[13px]">Espacios de apoyo</h3>
            <Badge color="gray">2 de prueba</Badge>
          </div>
          <div className="flex flex-col">
            {places.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => dispatch({ type: 'openPlace', id: p.id })}
                className="flex items-center gap-[11px] w-full text-left py-[15px] border-b border-line last:border-b-0"
              >
                <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-green-soft text-green shrink-0">
                  <Icon name="store" />
                </span>
                <span className="flex-1 min-w-0">
                  <strong className="block text-[12px]">{p.name}</strong>
                  <small className="block text-[10px] text-muted mt-1">
                    Punto ficticio de apoyo · {p.distance} m
                  </small>
                </span>
                <Icon name="chev" size="sm" className="text-muted" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2 mt-[23px] mb-3">
            <h3 className="text-[13px]">Alertas visibles</h3>
            <Badge color="gray">{orderedAlerts.length} activas</Badge>
          </div>
          <div className="flex flex-col gap-3">
            {orderedAlerts.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => dispatch({ type: 'openIncident', id: a.id })}
                className="w-full text-left p-[18px] rounded-[20px] border border-red/20 bg-red-soft/50 relative overflow-hidden border-l-[5px] border-l-red shadow-sm"
              >
                <div className="flex items-center justify-between gap-[10px]">
                  <div className="flex items-center gap-[6px]">
                    <Badge color="red">
                      {a.kind === 'medical' ? 'AYUDA URGENTE · ASISTENCIA' : 'PEDIDO DE AYUDA'}
                    </Badge>
                    <span className="inline-flex items-center gap-1 px-[7px] py-[3px] rounded-[25px] text-[7px] font-[800] tracking-[0.5px] bg-red text-white">
                        <i className="w-[5px] h-[5px] rounded-full bg-current animate-pulse-live" />
                        NECESITA AYUDA
                    </span>
                  </div>
                  <span className="text-[10px] text-muted">{a.distance || 120} m</span>
                </div>
                <h3 className="mt-2 text-[15px] font-extrabold text-[#8f1836]">{a.title}</h3>
                <p className="text-[10px] text-muted mt-1">
                  {a.name} · {a.active ? a.status : 'Seguimiento detenido'}
                </p>
                <div className="flex items-center justify-between gap-[10px] mt-2">
                  <span className="flex items-center gap-1 text-[10px] text-muted">
                    <Icon name="clock" size="sm" className="w-3 h-3" />{' '}
                    <Elapsed since={a.started} />
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-red">
                    Ver pedido de ayuda <Icon name="chev" size="sm" className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))}
            {!orderedAlerts.length && (
              <EmptyState
                title="Todo tranquilo por acá"
                text="No hay alertas dentro del filtro y radio elegidos."
                icon="shield"
              />
            )}
          </div>
        </>
      )}

      {/* Mostrador de alertas recibidas (recepción y preferencias) */}
      <div className="mt-6">
        <AlertPreferences />
      </div>
      <div className="mt-4">
        <AlertBoardStats
          stats={stats.map((s) => ({ ...s, tone: s.tone }))}
        />
      </div>

      <div className="flex items-center justify-between gap-2 mt-[23px] mb-3">
        <h3 className="text-[13px]">Mostrador de alertas recibidas</h3>
        <button
          type="button"
          onClick={() => dispatch({ type: 'injectNearAlert' })}
          className="text-[10px] font-bold text-brand px-2 py-1"
        >
          + Simular
        </button>
      </div>

      <Chips className="mb-4">
        {(
          [
            ['all', 'Todas'],
            ['new', 'Nuevas'],
            ['helping', 'Con mi ayuda'],
          ] as const
        ).map(([f, label]) => (
          <Chip
            key={f}
            label={label}
            active={state.alertBoardFilter === f}
            onClick={() => dispatch({ type: 'setAlertBoardFilter', filter: f })}
          />
        ))}
      </Chips>

      {!state.receiveNear ? (
        <EmptyState
          title="Alertas cercanas desactivadas"
          text="Activá la recepción arriba para enterarte cuando alguien de tu zona pida ayuda."
          icon="bell"
        />
      ) : board.length ? (
        <div className="flex flex-col gap-3">
          {board.map((a) => (
            <ReceivedAlertCard
              key={a.id}
              incident={a}
              onOpen={(id) => dispatch({ type: 'openIncident', id })}
              onOfferHelp={(id) => dispatch({ type: 'offerHelp', id })}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Sin alertas en este filtro"
          text="No hay alertas recibidas que coincidan con el filtro y el radio elegidos."
          icon="check2"
        />
      )}

      <div className="mt-4">
        <Note icon="info" color="gray">
          Solo se reciben alertas de personas que activaron una alerta comunitaria. Recibir una
          alerta no te pide intervenir: ofrecer ayuda es una decisión tuya.
        </Note>
      </div>
    </Screen>
  );
}
