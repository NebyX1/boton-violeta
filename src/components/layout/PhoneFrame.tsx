import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useDemo } from '@/providers/DemoStateProvider';
import { StatusBar } from '@/components/layout/StatusBar';
import { DemoBar } from '@/components/layout/DemoBar';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { HomeIndicator } from '@/components/layout/HomeIndicator';

/**
 * Simulador de dispositivo nativo.
 * El tema oscuro, el tamaño de texto y el contraste se aplican con clases
 * acotadas a este marco, igual que en el prototipo.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const { state, dispatch } = useDemo();
  const { device, theme, large, contrast, online, screen, role } = state;

  return (
    <section
      aria-label="Simulación de aplicación móvil"
      className={cn(
        'relative flex flex-col isolate overflow-hidden w-[408px] h-[844px] max-h-[calc(100dvh-130px)] min-h-[690px] border-[7px] bg-canvas phone-shadow',
        device === 'android' ? 'rounded-[34px]' : 'rounded-[46px]',
        theme === 'dark' ? 'dark border-[#503b61]' : 'border-white',
        large && 'text-[13px]',
        contrast && 'contrast',
        state.reduced && 'reduced',
      )}
    >
      <StatusBar device={device} online={online} />
      <DemoBar onClick={() => dispatch({ type: 'demoTools' })} />
      <div className="flex-1 overflow-auto no-scrollbar overscroll-contain">{children}</div>
      {screen !== 'onboarding' && screen !== 'roles' && screen !== 'lockscreen' && (
        <BottomTabBar
          role={role}
          screen={screen}
          onNavigate={(s) => dispatch({ type: 'nav', screen: s })}
        />
      )}
      <HomeIndicator device={device} />
    </section>
  );
}

/** Contenedor de una pantalla de la app. */
export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-[22px] pt-[21px] pb-[26px] animate-appear', className)}>{children}</div>
  );
}
