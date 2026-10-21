import { cn } from '@/lib/cn';
import { Icon } from '@/components/common/Icon';

/** Campo de búsqueda con icono. */
export function SearchBox({
  value,
  onChange,
  placeholder,
  label,
  className,
  compact = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn('relative', className)}>
      <Icon
        name="search"
        size="sm"
        className={cn('absolute left-[10px] text-muted', compact ? 'top-[10px] w-[15px] h-[15px]' : 'top-1/2 -translate-y-1/2')}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className={cn('bg-paper border border-line rounded-[13px]', compact && 'text-[10px] py-[10px] pl-[33px]')}
        style={compact ? undefined : { paddingLeft: 33 }}
      />
    </div>
  );
}
