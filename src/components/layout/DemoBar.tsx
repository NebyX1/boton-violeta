import { Icon } from '@/components/common/Icon';

/** Barra superior de aviso: esto es una demo y no envía emergencias. */
export function DemoBar({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-[6px] min-h-[24px] px-2 py-[3px] text-[7px] tracking-[1.1px] font-[750] text-[#a289bb] bg-[#f0e9f9] dark:bg-[#3d2a50] dark:text-[#b99ace] uppercase shrink-0"
    >
      <Icon name="beaker" className="w-[11px] h-[11px]" />
      Demo interactiva · no envía emergencias
      <Icon name="chev" className="w-[11px] h-[11px]" />
    </button>
  );
}
