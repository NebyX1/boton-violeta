import { useDemo } from '@/providers/DemoStateProvider';
import { activeProfile } from '@/providers/demoSelectors';
import { navigateTo, REGISTRY_PATH } from '@/lib/routes';
import { Screen } from '@/components/layout/PhoneFrame';
import { Logo } from '@/components/common/Logo';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import type { Role } from '@/types/demo';

const groups: Array<{ role: Extract<Role, 'self' | 'guardian' | 'community'>; title: string; icon: string }> = [
  { role: 'self', title: 'Personas', icon: 'mobile' },
  { role: 'guardian', title: 'Vigilantes del círculo familiar', icon: 'users' },
  { role: 'community', title: 'Vigilantes de la comunidad', icon: 'radar' },
];

/**
 * Elección de perfil/dispositivo.
 * Todos los perfiles pueden pedir ayuda con el SOS y cambiar de rol en cualquier momento.
 */
export function RoleSelectionScreen() {
  const { state, dispatch } = useDemo();
  const current = activeProfile(state);

  return (
    <Screen className="min-h-full flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <Logo />
        <Badge color="gray">DEMO · {state.profiles.length} PERFILES</Badge>
      </div>

      <div className="mt-6">
        <p className="text-[9px] font-extrabold tracking-[1.5px] text-brand">ELEGÍ UN DISPOSITIVO</p>
        <h1 className="mt-2 text-[26px] leading-tight tracking-[-0.8px]">
          ¿Cómo querés <span className="text-brand">participar?</span>
        </h1>
        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          Cada perfil simula un dispositivo vinculado a la misma red. Desde cualquiera podés pedir
          ayuda y cambiar de perspectiva cuando quieras.
        </p>
      </div>

      {groups.map((group) => {
        const list = state.profiles.filter((p) => p.role === group.role);
        if (!list.length) return null;
        return (
          <section key={group.role} className="mt-5">
            <h3 className="mb-2 flex items-center gap-[6px] text-[11px]">
              <Icon name={group.icon} size="sm" className="text-brand" />
              {group.title}
              <span className="ml-auto text-[9px] font-normal text-muted">{list.length}</span>
            </h3>
            <div className="flex flex-col gap-2">
              {list.map((p) => {
                const selected = p.id === current?.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => dispatch({ type: 'selectProfile', id: p.id })}
                    className={`flex w-full items-center gap-[10px] rounded-[16px] border p-[11px] text-left transition ${
                      selected ? 'border-brand bg-brand-soft/40' : 'border-line bg-paper hover:border-brand/50'
                    }`}
                  >
                    <Avatar name={p.name} color={p.color} />
                    <span className="min-w-0 flex-1">
                      <strong className="block text-[11px]">{p.name}</strong>
                      <small className="block text-[9px] text-muted">
                        {p.relation} · {p.city}
                      </small>
                      <small className="mt-[3px] block text-[8px] leading-snug text-muted/80">
                        {p.note}
                      </small>
                    </span>
                    {selected ? (
                      <Badge color="green">ACTIVO</Badge>
                    ) : (
                      <Icon name="chev" size="sm" className="text-muted" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      <Button
        variant="outline"
        block
        icon="shield"
        className="mt-5"
        onClick={() => navigateTo(REGISTRY_PATH)}
      >
        Registro de vigilantes comunitarios
      </Button>

      <p className="mt-auto pt-5 text-center text-[9px] leading-relaxed text-muted">
        Cambiar de perfil no activa ni comparte tu ubicación. Los avisos que recibe cada dispositivo
        dependen de los vínculos y de la visibilidad que elija la persona al pedir ayuda.
      </p>
    </Screen>
  );
}
