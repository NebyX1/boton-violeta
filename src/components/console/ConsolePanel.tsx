import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/common/Icon';

/** Panel de la consola institucional. */
export function ConsolePanel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn('bg-white border border-[#e7ddee] rounded-[20px] overflow-hidden min-w-0', className)}>
      {title && (
        <header className="flex items-center justify-between px-4 pt-[18px] pb-[14px] border-b border-[#f0e9f6]">
          <h3 className="text-[12px]">{title}</h3>
          {action}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/** Encabezado de página de la consola. */
export function ConsolePageHead({
  title,
  sub,
  action,
}: {
  title: string;
  sub: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-[15px] mb-5">
      <div>
        <h2 className="text-[21px]">{title}</h2>
        <p className="text-[11px] text-muted mt-1.5">{sub}</p>
      </div>
      {action}
    </div>
  );
}

/** Tarjeta de indicador. */
export function StatCard({
  value,
  label,
  sub,
  icon,
  tone = 'brand',
}: {
  value: number;
  label: string;
  sub: string;
  icon: string;
  tone?: 'brand' | 'green' | 'red' | 'gray';
}) {
  const tones = {
    brand: 'bg-brand-soft text-brand',
    green: 'bg-green-soft text-green',
    red: 'bg-red-soft text-red',
    gray: 'bg-[#f0ecf5] text-[#9686a4]',
  };
  return (
    <div className="flex items-center justify-between gap-[10px] px-5 py-[18px] bg-white border border-[#e7ddee] rounded-[17px]">
      <div>
        <b className="block font-display font-extrabold text-[29px] leading-[1.2] tracking-[-1px]">
          {String(value).padStart(2, '0')}
        </b>
        <span className="block text-[9px] text-[#a48ab5] mt-[5px]">{label}</span>
        <small className="block text-[8px] text-[#b49dc2] mt-1.5">{sub}</small>
      </div>
      <span className={cn('flex items-center justify-center w-[39px] h-[39px] rounded-[13px]', tones[tone])}>
        <Icon name={icon} />
      </span>
    </div>
  );
}

/** Tabla institucional. */
export function DataTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-[18px] py-[14px] text-[8px] uppercase tracking-[1px] text-[#ad91bd] bg-[#fcfafd] border-b border-[#eee3f5]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/** Celda de tabla. */
export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <td className={cn('px-[18px] py-4 border-b border-[#f2eaf7] text-[10px] last:border-b-0', className)}>
      {children}
    </td>
  );
}
