import type { ReactNode } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { incidentStatusLabel } from '@/services/demoData';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/common/Badge';
import { Elapsed } from '@/components/common/Clock';
import { Icon } from '@/components/common/Icon';
import type { Incident } from '@/types/demo';

/** Tarjeta de incidente / alerta cercana. */
export function IncidentCard({
  incident,
  central = false,
  onOpen,
}: {
  incident: Incident;
  central?: boolean;
  onOpen: (id: string) => void;
}) {
  const { state } = useDemo();
  const a = incident;
  return (
    <button
      type="button"
      onClick={() => onOpen(a.id)}
      className={cn(
        'w-full text-left p-[15px] rounded-[18px] border border-line bg-paper relative overflow-hidden',
        a.kind === 'medical' && 'border-l-[3px] border-l-green',
        a.kind !== 'medical' && 'border-l-[3px] border-l-red',
        central && state.selectedIncident === a.id && 'ring-2 ring-brand/40',
      )}
    >
      <div className="flex items-center justify-between gap-[10px]">
        <Badge color={a.kind === 'medical' ? 'green' : 'red'}>
          {a.kind === 'medical' ? 'ASISTENCIA' : 'AYUDA CERCANA'}
        </Badge>
        <span className="text-muted text-[10px]">
          {central ? a.id : (a.distance || 120) + ' m'}
        </span>
      </div>
      <h3 className="mt-2">{a.title}</h3>
      <p className="text-[11px] text-muted mt-1">
        {a.name} · {a.active ? incidentStatusLabel(a.status) : 'Seguimiento detenido'}
      </p>
      <div className="flex items-center justify-between gap-[10px] mt-3">
        <span className="flex items-center gap-1 text-[10px] text-muted">
          <Icon name="clock" size="sm" /> <Elapsed since={a.started} />
        </span>
        <span className="flex items-center gap-1 text-[10px] text-brand">
          {central ? (a.operator ? 'Asignado' : 'Sin asignar') : 'Ver alerta'}
          <Icon name="chev" size="sm" />
        </span>
      </div>
    </button>
  );
}

/** Banner de alerta activa (SOS propio o de un contacto). */
export function AlertBanner({
  icon,
  title,
  sub,
  onClick,
  right,
}: {
  icon: string;
  title: string;
  sub: ReactNode;
  onClick?: () => void;
  right?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[10px] w-full p-3 rounded-[14px] border border-red-soft bg-red-soft text-left"
    >
      <Icon name={icon} className="text-red" />
      <span className="flex-1 min-w-0">
        <strong className="block text-[11px]">{title}</strong>
        <small className="block text-[9px] text-muted mt-0.5">{sub}</small>
      </span>
      {right ?? <Icon name="chev" size="sm" />}
    </button>
  );
}
