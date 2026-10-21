import { useDemo } from '@/providers/DemoStateProvider';
import { received } from '@/providers/demoSelectors';
import { ConsolePanel, StatCard } from '@/components/console/ConsolePanel';
import { IncidentDetailsPanel } from '@/components/console/IncidentDetailsPanel';
import { IconButton } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { SearchBox } from '@/components/common/SearchBox';
import { MapLabel, VectorMap } from '@/components/map/VectorMap';
import { IncidentCard } from '@/components/incidents/IncidentCard';
import { EmptyState } from '@/components/common/EmptyState';

/** Centro de control: indicadores, bandeja, mapa operativo y detalle. */
export function DashboardScreen() {
  const { state, dispatch } = useDemo();
  const open = state.incidents.filter((a) => a.status !== 'resolved' && received(a));
  const unassigned = open.filter((a) => !a.operator);
  const working = open.filter((a) => a.operator);

  const queue = state.incidents
    .filter(
      (a) =>
        received(a) &&
        (state.queueFilter === 'all' ||
          (a.status !== 'resolved' && (state.queueFilter !== 'new' || !a.operator))) &&
        `${a.name} ${a.id}`.toLowerCase().includes(state.queueSearch.toLowerCase()),
    )
    .slice()
    .reverse();

  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-[14px] mb-5">
        <StatCard value={open.length} label="Incidentes abiertos" sub="Datos de esta sesión" icon="radar" tone="red" />
        <StatCard value={unassigned.length} label="Sin asignar" sub="Pendientes de atención" icon="clock" tone="brand" />
        <StatCard value={working.length} label="En seguimiento" sub="Operación simulada" icon="shield" tone="green" />
        <StatCard
          value={state.reports.filter((r) => r.status === 'Pendiente').length}
          label="Reportes por revisar"
          sub="Canal no urgente"
          icon="file"
          tone="gray"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[272px_minmax(270px,1fr)_308px] gap-4 min-h-[594px]">
        <ConsolePanel
          title="Bandeja de incidentes"
          action={
            <IconButton
              icon="plus"
              label="Crear un SOS de prueba"
              className="w-[31px] h-[31px] rounded-[10px]"
              onClick={() => dispatch({ type: 'injectSos' })}
            />
          }
        >
          <div className="flex gap-[5px] px-3 pt-3">
            {(
              [
                ['open', 'Abiertos'],
                ['new', 'Sin asignar'],
                ['all', 'Todos'],
              ] as const
            ).map(([f, label]) => (
              <button
                key={f}
                type="button"
                onClick={() => dispatch({ type: 'setQueueFilter', filter: f })}
                className={`flex-1 text-[9px] py-[7px] rounded-[8px] ${
                  state.queueFilter === f ? 'bg-[#eee2fa] text-[#8860b3]' : 'bg-[#f7f2fb] text-[#a087b2]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <SearchBox
            compact
            className="mt-3 mx-3"
            value={state.queueSearch}
            onChange={(value) => dispatch({ type: 'setQueueSearch', value })}
            placeholder="Buscar nombre o ID"
            label="Buscar incidentes"
          />
          <div className="p-3 pt-1.5 pb-[14px] max-h-[586px] overflow-auto flex flex-col gap-[9px]">
            {queue.map((a) => (
              <IncidentCard
                key={a.id}
                incident={a}
                central
                onOpen={(id) => dispatch({ type: 'selectIncident', id })}
              />
            ))}
            {!queue.length && (
              <EmptyState title="Bandeja al día" text="No hay incidentes para este filtro." icon="check2" />
            )}
          </div>
        </ConsolePanel>

        <div className="flex flex-col gap-3 min-w-0">
          <VectorMap
            ctx="central"
            variant="fill"
            className="flex-1"
            label={
              <MapLabel
                icon={<Icon name="monitor" size="sm" className="w-3 h-3 text-brand" />}
                title="Vista operativa de incidentes"
                sub="Sin acceso a sesiones familiares"
              />
            }
          />
          <div className="flex gap-[15px] items-center px-4 py-[13px] bg-white border border-[#e7ddee] rounded-[12px] text-[8px] text-[#a38bb3]">
            <span className="flex items-center gap-[5px]">
              <i className="w-[6px] h-[6px] rounded-full bg-[#d97696]" />
              Alerta
            </span>
            <span className="flex items-center gap-[5px]">
              <i className="w-[6px] h-[6px] rounded-full bg-[#6fa28b]" />
              Asistencia
            </span>
            <span className="flex items-center gap-[5px]">
              <i className="w-[6px] h-[6px] rounded-full bg-[#7d9dc8]" />
              Recurso demo
            </span>
          </div>
        </div>

        <ConsolePanel title="Detalle del incidente" action={<span className="text-[8px] text-[#9686a4] bg-[#f0ecf5] px-[9px] py-[5px] rounded-[25px]">DEMO</span>}>
          <IncidentDetailsPanel />
        </ConsolePanel>
      </div>
    </>
  );
}
