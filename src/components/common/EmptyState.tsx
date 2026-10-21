import { cn } from '@/lib/cn';
import { Icon } from '@/components/common/Icon';

/** Estado vacío con arte centrado. */
export function EmptyState({
  title,
  text,
  icon = 'lock',
  className,
}: {
  title: string;
  text: string;
  icon?: string;
  className?: string;
}) {
  return (
    <div className={cn('px-[17px] py-8 text-center', className)}>
      <div className="flex items-center justify-center w-[75px] h-[75px] mx-auto mb-[19px] rounded-[25px] bg-brand-soft text-brand">
        <Icon name={icon} size="xl" />
      </div>
      <h3>{title}</h3>
      <p className="text-[12px] text-muted mt-[10px]">{text}</p>
    </div>
  );
}
