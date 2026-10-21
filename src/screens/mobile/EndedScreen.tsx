import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Tile } from '@/components/common/Tile';

/** Confirmación tras detener el seguimiento: la ubicación vuelve a ser privada. */
export function EndedScreen() {
  const { dispatch } = useDemo();

  return (
    <Screen>
      <PageTop title="Seguimiento detenido" sub="Volvés a tener el control" />
      <div className="flex items-center justify-center w-[75px] h-[75px] mx-auto rounded-[25px] bg-brand-soft text-brand">
        <Icon name="shield" size="xl" />
      </div>
      <h1 className="text-center text-[26px] leading-[1.2] mt-5">
        Tu ubicación
        <br />
        vuelve a ser privada.
      </h1>
      <p className="text-center text-[12px] text-muted mt-4">
        La comunidad y tu círculo ya no reciben
        <br />
        nuevas posiciones de esta alerta.
      </p>

      <Tile className="mt-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-brand-soft text-brand">
            <Icon name="monitor" />
          </span>
          <div>
            <h3 className="text-[13px]">La central registra el cierre</h3>
            <p className="text-[10px] text-muted mt-2">
              Detener el seguimiento no borra el incidente recibido.
            </p>
          </div>
        </div>
      </Tile>

      <Button block className="mt-6" onClick={() => dispatch({ type: 'nav', screen: 'home' })}>
        Volver al inicio
      </Button>
      <Button
        variant="outline"
        block
        className="mt-2"
        onClick={() => dispatch({ type: 'setRole', role: 'guardian' })}
      >
        Ver lo que ahora ve mi familiar
      </Button>

      <div className="mt-4">
        <Note icon="lock" color="gray">
          La sesión voluntaria de acompañamiento también se detuvo al finalizar este SOS de prueba.
        </Note>
      </div>
    </Screen>
  );
}
