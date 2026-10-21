import { useDemo } from '@/providers/DemoStateProvider';
import { places } from '@/services/demoData';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { VectorMap } from '@/components/map/VectorMap';

/** Espacios de apoyo ficticios para explorar el diseño. */
export function PlacesScreen() {
  const { dispatch } = useDemo();

  return (
    <Screen>
      <PageTop title="Espacios de apoyo" sub="Puntos de encuentro ficticios" />

      <VectorMap ctx="places" variant="big" />

      <div className="mt-2">
        {places.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => dispatch({ type: 'openPlace', id: p.id })}
            className="flex items-center gap-[11px] w-full text-left py-[15px] border-b border-line last:border-b-0"
          >
            <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-green-soft text-green shrink-0">
              <Icon name="store" />
            </span>
            <span className="flex-1 min-w-0">
              <strong className="block text-[12px]">{p.name}</strong>
              <small className="block text-[10px] text-muted mt-1">
                Punto ficticio de apoyo · {p.distance} m
              </small>
            </span>
            <Icon name="chev" size="sm" className="text-muted" />
          </button>
        ))}
      </div>

      <div className="mt-4">
        <Note icon="store" color="gray">
          Estos puntos no representan comercios ni instituciones reales adheridas. Se incluyen
          únicamente para explorar el diseño.
        </Note>
      </div>
    </Screen>
  );
}
