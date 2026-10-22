import { Icon } from '@/components/common/Icon';
import { Logo } from '@/components/common/Logo';
import { cn } from '@/lib/cn';
import { useDemo } from '@/providers/DemoStateProvider';
import type { Role } from '@/types/demo';

const roles: Array<{ role: Role; icon: string; label: string }> = [
  { role: 'self', icon: 'mobile', label: 'Mi app' },
  { role: 'guardian', icon: 'users', label: 'Círculo' },
  { role: 'community', icon: 'radar', label: 'Comunidad' },
  { role: 'operator', icon: 'monitor', label: 'Central' },
];

/** Selector de perspectiva (las cuatro miradas conectadas de la red). */
export function RoleSwitcher() {
  const { state, dispatch } = useDemo();
  const onLock = state.role !== 'operator' && state.screen === 'lockscreen';
  return (
    <div className="flex gap-[3px] p-[5px] bg-[#e9e4f0] rounded-[16px]" aria-label="Cambiar perspectiva">
      {roles.map((r) => (
        <button
          key={r.role}
          type="button"
          onClick={() => dispatch({ type: 'setRole', role: r.role })}
          className={cn(
            'flex items-center gap-2 px-[15px] py-[10px] rounded-[12px] text-[11px] font-bold',
            state.role === r.role && !onLock
              ? 'bg-white text-brand shadow-[0_3px_12px_#44266a0a]'
              : 'text-[#92829e]',
          )}
        >
          <Icon name={r.icon} className="w-[17px] h-[17px]" />
          <span className="hidden sm:inline">{r.label}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => dispatch({ type: 'go', screen: 'lockscreen' })}
        aria-label="Pantalla bloqueada de ejemplo"
        title="Pantalla bloqueada de ejemplo"
        className={cn(
          'flex items-center gap-2 px-[15px] py-[10px] rounded-[12px] text-[11px] font-bold',
          onLock ? 'bg-white text-brand shadow-[0_3px_12px_#44266a0a]' : 'text-[#92829e]',
        )}
      >
        <Icon name="lock" className="w-[17px] h-[17px]" />
        <span className="hidden sm:inline">Bloqueado</span>
      </button>
    </div>
  );
}

/** Barra superior del studio (navbar). */
export function StudioHeader() {
  return (
    <header className="flex items-center justify-between gap-[18px] h-[91px] px-[22px] max-w-[1490px] mx-auto">
      <Logo />
      <RoleSwitcher />
      <span className="hidden md:inline-flex items-center gap-[5px] px-[9px] py-[5px] rounded-[25px] bg-[#f0ecf5] text-[#9686a4] text-[9px] font-[750] whitespace-nowrap">
        <Icon name="beaker" size="sm" />
        PROTOTIPO INTERACTIVO
      </span>
    </header>
  );
}
