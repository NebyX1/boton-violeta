import { useDemo } from '@/providers/DemoStateProvider';
import { helperName } from '@/providers/demoSelectors';
import { incidentStatusLabel } from '@/services/demoData';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/common/Badge';
import { Elapsed } from '@/components/common/Clock';
import { Icon } from '@/components/common/Icon';
import type { Incident } from '@/types/demo';

export type AlertFeedState = 'new' | 'seen' | 'helping';

/** Estado de recepción de una alerta cercana. */
export function alertFeedState(
  incident: Incident,
  readIds: string[],
  me: string,
): AlertFeedState {
  if (incident.helpers.includes(me)) return 'helping';
  return readIds.includes(incident.id) ? 'seen' : 'new';
}

const stateChip: Record<AlertFeedState, { label: string; className: string }> = {
  new: { label: 'NUEVA', className: 'bg-red-soft text-red' },
  seen: { label: 'VISTA', className: 'bg-[#f0ecf5] text-[#9686a4]' },
  helping: { label: 'AYUDANDO', className: 'bg-green-soft text-green' },
};

/**
 * Fila del mostrador: alerta recibida de una persona cercana,
 * con su estado de recepción y acceso al detalle.
 */
export function ReceivedAlertCard({
  incident,
  onOpen,
  onOfferHelp,
}: {
  incident: Incident;
  onOpen: (id: string) => void;
  onOfferHelp: (id: string) => void;
}) {
  const { state } = useDemo();
  const me = helperName(state);
  const feed = alertFeedState(incident, state.nearAlertsRead, me);
  const chip = stateChip[feed];

  return (
    <div
      className={cn(
        'rounded-[18px] border border-line bg-paper overflow-hidden border-l-[3px]',
        incident.kind === 'medical' ? 'border-l-green' : 'border-l-red',
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(incident.id)}
        className="w-full text-left p-[15px]"
      >
        <div className="flex items-center justify-between gap-[10px]">
          <div className="flex items-center gap-[6px]">
            <Badge color={incident.kind === 'medical' ? 'green' : 'red'}>
              {incident.kind === 'medical' ? 'ASISTENCIA' : 'AYUDA CERCANA'}
            </Badge>
            <span
              className={cn(
                'inline-flex items-center gap-1 px-[7px] py-[3px] rounded-[25px] text-[7px] font-[750] tracking-[0.5px]',
                chip.className,
              )}
            >
              {feed === 'new' && (
                <i className="w-[5px] h-[5px] rounded-full bg-current animate-pulse-live" />
              )}
              {chip.label}
            </span>
          </div>
          <span className="text-[10px] text-muted">{incident.distance || 120} m</span>
        </div>
        <h3 className="mt-2 text-[13px]">{incident.title}</h3>
        <p className="text-[10px] text-muted mt-1">
          {incident.name} · {incidentStatusLabel(incident.status)}
        </p>
        <div className="flex items-center justify-between gap-[10px] mt-2">
          <span className="flex items-center gap-1 text-[10px] text-muted">
            <Icon name="clock" size="sm" className="w-3 h-3" />
            <Elapsed since={incident.started} />
          </span>
          <span className="flex items-center gap-1 text-[10px] text-brand">
            Ver alerta <Icon name="chev" size="sm" className="w-3 h-3" />
          </span>
        </div>
      </button>

      <div className="px-[15px] pb-[15px]">
        {incident.helpers.includes(me) ? (
          <div className="flex items-center gap-[6px] text-[10px] text-green">
            <Icon name="check2" size="sm" className="w-3 h-3" />
            Ofreciste tu ayuda · esperá coordinación de la central
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOfferHelp(incident.id)}
            className="w-full py-2 rounded-[10px] border border-line bg-canvas text-[10px] font-bold text-brand"
          >
            Ofrecer mi ayuda
          </button>
        )}
      </div>
    </div>
  );
}
