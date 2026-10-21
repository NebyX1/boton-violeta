import { useDemo, useDemoState } from '@/providers/DemoStateProvider';
import { unreadCount } from '@/providers/demoSelectors';
import { Avatar } from '@/components/common/Avatar';
import { Icon } from '@/components/common/Icon';

/**
 * Cabecera de la app móvil: perfil a la izquierda, notificaciones a la derecha.
 */
export function AppHeader({
  name,
  sub = 'Qué bueno tenerte cerca',
}: {
  name: string;
  sub?: string;
}) {
  const { state, dispatch } = useDemo();
  const count = unreadCount(state);
  const isGuardian = useDemoState().role === 'guardian';

  return (
    <header className="flex items-center justify-between gap-[10px] mb-[21px]">
      <button
        type="button"
        onClick={() => dispatch({ type: 'go', screen: 'profile' })}
        className="flex items-center gap-2 text-left"
      >
        <Avatar name={name === 'Camila' ? 'Camila Ríos' : name} color={isGuardian ? 'peach' : ''} online />
        <div>
          <div className="text-[10px] text-muted">{sub}</div>
          <div className="font-display font-extrabold text-[17px] tracking-[-0.5px] leading-[1.3] mt-0.5">
            Hola, {name} <span className="text-[12px]">✦</span>
          </div>
        </div>
      </button>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Cambiar perfil"
          title="Cambiar perfil"
          onClick={() => dispatch({ type: 'go', screen: 'roles' })}
          className="flex items-center justify-center w-[38px] h-[38px] rounded-[13px] border border-line bg-paper text-brand"
        >
          <Icon name="users" size="sm" />
        </button>
        <button
          type="button"
          aria-label="Notificaciones"
          onClick={() => dispatch({ type: 'go', screen: 'activity' })}
          className="relative flex items-center justify-center w-[40px] h-[40px] rounded-[13px] border border-line bg-paper"
        >
          <Icon name="bell" />
          {count > 0 && (
            <span className="absolute right-[5px] top-[5px] flex items-center justify-center min-w-[13px] h-[13px] px-[3px] rounded-[10px] bg-red text-white text-[8px]">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
