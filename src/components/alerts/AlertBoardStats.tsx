import { cn } from '@/lib/cn';
import { Icon } from '@/components/common/Icon';

export interface AlertStat {
  value: number;
  label: string;
  icon: string;
  tone: 'red' | 'brand' | 'green';
}

const tones = {
  red: 'bg-red-soft text-red',
  brand: 'bg-brand-soft text-brand',
  green: 'bg-green-soft text-green',
};

/**
 * Resumen del mostrador de alertas recibidas de personas cercanas.
 */
export function AlertBoardStats({ stats }: { stats: AlertStat[] }) {
  return (
    <div className="grid grid-cols-3 gap-[10px]">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col gap-2 p-3 rounded-[15px] border border-line bg-paper"
        >
          <span
            className={cn(
              'flex items-center justify-center w-[28px] h-[28px] rounded-[9px]',
              tones[s.tone],
            )}
          >
            <Icon name={s.icon} size="sm" className="w-[15px] h-[15px]" />
          </span>
          <b className="font-display font-extrabold text-[19px] leading-none tracking-[-0.5px]">
            {String(s.value).padStart(2, '0')}
          </b>
          <small className="text-[8px] text-muted leading-[1.4]">{s.label}</small>
        </div>
      ))}
    </div>
  );
}
