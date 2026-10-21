import type { ReactNode } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { IconButton } from '@/components/common/Button';

/** Encabezado de pantalla secundaria con botón de regreso. */
export function PageTop({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  const { dispatch } = useDemo();
  return (
    <div className="flex items-center gap-[11px] mb-[22px]">
      <IconButton
        icon="back"
        label="Volver"
        onClick={() => dispatch({ type: 'back' })}
        className="w-[35px] h-[35px] rounded-[11px]"
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-[19px]">{title}</h2>
        {sub && <small className="block text-[9px] text-muted mt-1">{sub}</small>}
      </div>
      {right}
    </div>
  );
}
