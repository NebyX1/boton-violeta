import { iconPaths } from '@/lib/iconPaths';
import { cn } from '@/lib/cn';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

const sizes: Record<IconSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-[22px] h-[22px]',
  lg: 'w-[30px] h-[30px]',
  xl: 'w-[42px] h-[42px]',
};

/** Icono de trazo (24×24). Equivalente portable a `react-native-svg`. */
export function Icon({
  name,
  size = 'md',
  className,
}: {
  name: string;
  size?: IconSize;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn(
        'shrink-0 stroke-current fill-none [stroke-width:1.7] [stroke-linecap:round] [stroke-linejoin:round]',
        sizes[size],
        className,
      )}
      dangerouslySetInnerHTML={{ __html: iconPaths[name] ?? iconPaths.shield }}
    />
  );
}
