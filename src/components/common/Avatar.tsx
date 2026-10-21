import { cn } from '@/lib/cn';

export type AvatarColor = 'peach' | 'mint' | 'blue' | 'pink' | '';
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const palette: Record<string, string> = {
  '': 'bg-[#e9ddf9] text-[#8656bd]',
  peach: 'bg-[#f7e0d2] text-[#ad785e]',
  mint: 'bg-[#dfede4] text-[#648e79]',
  blue: 'bg-[#e0e8f5] text-[#6b8ab3]',
  pink: 'bg-[#f6dfea] text-[#b77194]',
};

const sizes: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-[10px] border-2',
  md: 'w-[43px] h-[43px] text-[13px] border-[3px]',
  lg: 'w-[69px] h-[69px] text-[22px] border-4',
  xl: 'w-[89px] h-[89px] text-[28px] border-4',
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join('');
}

/** Avatar con iniciales. En React Native se reemplaza por un componente equivalente. */
export function Avatar({
  name,
  color = '',
  size = 'md',
  online = false,
  className,
}: {
  name: string;
  color?: AvatarColor;
  size?: AvatarSize;
  online?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center relative shrink-0 rounded-full border-paper font-display font-extrabold',
        palette[color] ?? palette[''],
        sizes[size],
        className,
      )}
    >
      {initials(name)}
      {online && (
        <i className="absolute -bottom-0 -right-[2px] w-[10px] h-[10px] border-2 border-white bg-[#5a9a7e] rounded-full" />
      )}
    </span>
  );
}

/** Pila de avatares superpuestos. */
export function AvatarStack({ children }: { children: React.ReactNode }) {
  return <div className="flex [&>*+*]:-ml-[10px]">{children}</div>;
}
