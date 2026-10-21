import { useDemo } from '@/providers/DemoStateProvider';
import { ConsolePageHead } from '@/components/console/ConsolePanel';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Divider } from '@/components/common/Tile';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Toggle } from '@/components/common/Toggle';

/** Recursos operativos con disponibilidad simulada. */
export function ResourcesScreen() {
  const { state, dispatch } = useDemo();

  return (
    <>
      <ConsolePageHead
        title="Recursos operativos"
        sub="Disponibilidad simulada, sin vinculación a flotas reales."
        action={
          <Button variant="outline" small icon="plus" onClick={() => dispatch({ type: 'newUnit' })}>
            Agregar recurso
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[17px]">
        {state.units.map((u) => (
          <article key={u.id} className="p-[22px] bg-white border border-[#e7ddee] rounded-[19px]">
            <div className="flex items-center justify-between gap-[10px]">
              <span
                className={`flex items-center justify-center w-[39px] h-[39px] rounded-[13px] ${
                  u.available ? 'bg-green-soft text-green' : 'bg-brand-soft text-brand'
                }`}
              >
                <Icon name={u.id.startsWith('A') ? 'users' : 'car'} />
              </span>
              <Badge color={u.available ? 'green' : 'gray'}>
                {u.available ? 'Disponible' : 'Ocupado'}
              </Badge>
            </div>
            <h3 className="mt-4">{u.name}</h3>
            <p className="text-[11px] text-muted mt-[7px]">{u.type}</p>
            <Divider />
            <div className="flex items-center justify-between gap-[10px]">
              <span className="text-[12px] text-muted">Disponible para asignación</span>
              <Toggle
                on={u.available}
                label={`Disponibilidad de ${u.name}`}
                onToggle={() => dispatch({ type: 'toggleUnitAvailability', id: u.id })}
              />
            </div>
            <Button
              variant="outline"
              small
              block
              className="mt-4"
              onClick={() => dispatch({ type: 'unitAssignments', id: u.id })}
            >
              Ver asignaciones
            </Button>
          </article>
        ))}
      </div>

      <div className="mt-5">
        <Note icon="car" color="gray">
          La disponibilidad de un recurso no equivale a su movilización. La asignación y el estado en
          camino se confirman por separado.
        </Note>
      </div>
    </>
  );
}
