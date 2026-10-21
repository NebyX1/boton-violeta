import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { Logo } from '@/components/common/Logo';
import { Icon } from '@/components/common/Icon';

const roles = [
  {
    role: 'self',
    icon: 'mobile',
    title: 'Persona',
    subtitle: 'Usar mi app para pedir ayuda y cuidar mi red.',
    color: 'bg-brand-soft text-brand',
  },
  {
    role: 'guardian',
    icon: 'users',
    title: 'Vigilante del círculo familiar',
    subtitle: 'Acompañar a alguien de mi círculo, siempre con su permiso.',
    color: 'bg-[#fff0e8] text-[#b65b36]',
  },
  {
    role: 'community',
    icon: 'radar',
    title: 'Vigilante de la comunidad',
    subtitle: 'Ver pedidos SOS cercanos y ofrecer ayuda con cuidado.',
    color: 'bg-red-soft text-red',
  },
] as const;

/** Elección del perfil inicial; los tres perfiles conservan acceso al SOS. */
export function RoleSelectionScreen() {
  const { state, dispatch } = useDemo();

  return (
    <Screen className="min-h-full flex flex-col">
      <Logo />
      <div className="mt-8">
        <p className="text-[9px] font-extrabold tracking-[1.5px] text-brand">BOTÓN VIOLETA</p>
        <h1 className="mt-2 text-[26px] leading-tight tracking-[-0.8px]">
          ¿Cómo querés <span className="text-brand">participar?</span>
        </h1>
        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          Elegí un perfil para empezar. Podés cambiarlo cuando quieras; desde cualquiera podés pedir
          ayuda con SOS.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {roles.map((item) => (
          <button
            key={item.role}
            type="button"
            onClick={() => dispatch({ type: 'setRole', role: item.role })}
            className={`flex w-full items-center gap-3 rounded-[18px] border p-4 text-left transition hover:border-brand hover:shadow-sm ${
              state.role === item.role ? 'border-brand bg-brand-soft/40' : 'border-line bg-paper'
            }`}
          >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${item.color}`}>
              <Icon name={item.icon} />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[12px]">{item.title}</strong>
              <small className="mt-1 block text-[9px] leading-relaxed text-muted">{item.subtitle}</small>
            </span>
            <Icon name="chev" size="sm" className="text-muted" />
          </button>
        ))}
      </div>

      <p className="mt-auto pt-6 text-center text-[9px] leading-relaxed text-muted">
        Los perfiles son perspectivas distintas de la misma red. Cambiar de perfil no activa ni
        comparte tu ubicación.
      </p>
    </Screen>
  );
}
