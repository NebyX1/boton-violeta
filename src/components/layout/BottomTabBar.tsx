import { Icon } from '@/components/common/Icon';
import { cn } from '@/lib/cn';
import { nearbyFeed } from '@/providers/demoSelectors';
import { useDemo } from '@/providers/DemoStateProvider';
import type { Role, ScreenName } from '@/types/demo';

interface TabItem {
  screen: ScreenName;
  icon: string;
  label: string;
}

const tabItems: Record<Exclude<Role, 'operator'>, TabItem[]> = {
  self: [
    { screen: 'home', icon: 'home', label: 'Inicio' },
    { screen: 'near', icon: 'map', label: 'Cerca' },
    { screen: 'circle', icon: 'users', label: 'Mi círculo' },
    { screen: 'activity', icon: 'bell', label: 'Actividad' },
    { screen: 'profile', icon: 'user', label: 'Mi cuenta' },
  ],
  guardian: [
    { screen: 'home', icon: 'home', label: 'Inicio' },
    { screen: 'follow', icon: 'pin', label: 'Seguir' },
    { screen: 'chat', icon: 'chat', label: 'Mensajes' },
    { screen: 'profile', icon: 'user', label: 'Cuenta' },
  ],
  community: [
    { screen: 'home', icon: 'home', label: 'Inicio' },
    { screen: 'near', icon: 'map', label: 'Cerca' },
    { screen: 'activity', icon: 'bell', label: 'Actividad' },
    { screen: 'profile', icon: 'user', label: 'Cuenta' },
  ],
};

const extraActive: Record<string, ScreenName[]> = {
  circle: ['contact', 'pair', 'share', 'sharelive'],
  near: ['incident', 'places'],
  profile: ['settings', 'permissions', 'privacy', 'accountedit', 'help'],
};

function isActive(tab: ScreenName, screen: ScreenName): boolean {
  return screen === tab || (extraActive[tab]?.includes(screen) ?? false);
}

/**
 * Barra de navegación inferior (footer/tab).
 * Es el equivalente web del tab bar nativo; en React Native sería un
 * `tabBar` de React Navigation con las mismas pantallas.
 */
export function BottomTabBar({
  role,
  screen,
  onNavigate,
}: {
  role: Role;
  screen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}) {
  const { state } = useDemo();
  const nearbyHelpCount = nearbyFeed(state).length;
  if (role === 'operator') return null;
  return (
    <nav
      aria-label="Navegación principal"
      className="flex justify-around bg-paper border-t border-line px-[6px] pt-2 pb-[5px] z-30 shrink-0"
    >
      {tabItems[role].map((item) => (
        <button
          key={item.screen}
          type="button"
          onClick={() => onNavigate(item.screen)}
          className={cn(
            'flex flex-col items-center gap-1 flex-1 py-0.5 text-[8px] font-[650]',
            item.screen === 'near' && nearbyHelpCount > 0
              ? 'text-[#c91f45]'
              : isActive(item.screen, screen)
                ? 'text-brand'
                : 'text-[#ab9db8]',
          )}
        >
          <span
            className={cn(
              'relative flex items-center justify-center w-11 h-[27px] rounded-[11px] transition-colors',
              isActive(item.screen, screen) && 'bg-brand-soft',
              item.screen === 'near' && nearbyHelpCount > 0 && 'bg-[#d52f55] text-white shadow-[0_3px_12px_#d52f5555]',
            )}
          >
            {item.screen === 'near' && nearbyHelpCount > 0 && (
              <span className="absolute inset-0 rounded-[11px] border-2 border-[#d52f55] animate-ping opacity-40" />
            )}
            <Icon
              name={item.screen === 'near' && nearbyHelpCount > 0 ? 'radar' : item.icon}
              className="relative z-[1] w-[19px] h-[19px]"
            />
            {item.screen === 'near' && nearbyHelpCount > 0 && (
              <span
                aria-label={`${nearbyHelpCount} pedidos de ayuda cerca`}
                aria-live="polite"
                className="absolute -right-[7px] -top-[8px] flex min-w-[19px] h-[19px] items-center justify-center rounded-full border-2 border-paper bg-[#b71339] px-1 text-[9px] font-extrabold leading-none text-white shadow-md animate-pulse-live"
              >
                {nearbyHelpCount > 9 ? '9+' : nearbyHelpCount}
              </span>
            )}
          </span>
          <span className={cn(item.screen === 'near' && nearbyHelpCount > 0 && 'text-[#b71339] font-extrabold')}>
            {item.screen === 'near' && nearbyHelpCount > 0 ? '¡SOS CERCA!' : item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
