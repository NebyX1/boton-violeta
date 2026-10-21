import { cn } from '@/lib/cn';
import { useDemo } from '@/providers/DemoStateProvider';
import { received } from '@/providers/demoSelectors';
import { Avatar } from '@/components/common/Avatar';
import { Icon } from '@/components/common/Icon';

const navItems: Array<{ tab: 'overview' | 'incidents' | 'reports' | 'people' | 'resources' | 'audit' | 'config'; icon: string; label: string }> = [
  { tab: 'overview', icon: 'layout', label: 'Centro de control' },
  { tab: 'incidents', icon: 'radar', label: 'Incidentes' },
  { tab: 'reports', icon: 'file', label: 'Reportes' },
  { tab: 'people', icon: 'users', label: 'Personas' },
  { tab: 'resources', icon: 'car', label: 'Recursos' },
  { tab: 'audit', icon: 'activity', label: 'Bitácora' },
  { tab: 'config', icon: 'settings', label: 'Configuración' },
];

/** Barra lateral fija de la consola institucional (navbar operativa). */
export function ConsoleRail() {
  const { state, dispatch } = useDemo();
  const openIncidents = state.incidents.filter((a) => a.status !== 'resolved' && received(a)).length;

  return (
    <aside className="fixed inset-y-0 left-0 w-[74px] lg:w-[208px] z-50 flex flex-col gap-[19px] px-3 lg:px-[17px] py-7 pb-5 bg-console text-[#baa4ce]">
      <div className="flex items-center gap-[10px] mx-2 mb-[22px]">
        <span className="flex items-center justify-center w-[35px] h-[35px] rounded-[11px] bg-[#9869e4] text-white">
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="w-[22px] h-[22px]">
            <path
              d="m6 10 10 17L26 10M11 7l5 9 5-9"
              stroke="currentColor"
              strokeWidth="3.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="hidden lg:block font-display text-[16px] font-extrabold text-white leading-none">
          botón violeta
          <small className="block font-sans text-[7px] tracking-[1.8px] text-[#967da9] mt-1.5">
            COORDINACIÓN
          </small>
        </div>
      </div>

      <div className="hidden lg:block px-3 text-[8px] font-bold tracking-[1.7px] text-[#886d9c]">
        ESPACIO OPERATIVO
      </div>

      <nav className="flex flex-col gap-[5px]" aria-label="Secciones de la consola">
        {navItems.map((item) => (
          <button
            key={item.tab}
            type="button"
            onClick={() => dispatch({ type: 'setConsoleTab', tab: item.tab })}
            className={cn(
              'flex items-center gap-[11px] text-left p-3 rounded-[12px] text-[10px] min-h-[42px] justify-center lg:justify-start',
              state.consoleTab === item.tab
                ? 'bg-console-soft text-white'
                : 'text-[#b29ac5] hover:bg-[#452e5b]',
            )}
          >
            <Icon name={item.icon} className="w-[18px] h-[18px]" />
            <span className="hidden lg:inline">{item.label}</span>
            {item.tab === 'incidents' && (
              <span className="hidden lg:inline ml-auto px-[5px] py-px rounded bg-[#78519a] text-[#f0e1fc] text-[9px]">
                {openIncidents}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="hidden lg:block text-[9px] leading-[1.8] border border-[#513565] rounded-[13px] p-[13px] text-[#a78abb]">
        <Icon name="lock" className="block w-[17px] h-[17px] text-[#c39aee] mb-[7px]" />
        Solo los incidentes comunicados muestran ubicación. Las sesiones familiares permanecen
        privadas.
      </div>

      <div className="flex items-center gap-[9px] mt-auto pt-[18px] border-t border-[#50345f]">
        <Avatar name="Mariana Duarte" size="sm" className="border-0 bg-[#56396d] text-[#dfc3f5]" />
        <div className="hidden lg:block flex-1 min-w-0">
          <strong className="block text-[10px] text-[#e9d7f4]">Mariana Duarte</strong>
          <small className="text-[8px] text-[#9c81ad]">Operadora de prueba</small>
        </div>
        <Icon name="shield" size="sm" className="hidden lg:block" />
      </div>
    </aside>
  );
}
