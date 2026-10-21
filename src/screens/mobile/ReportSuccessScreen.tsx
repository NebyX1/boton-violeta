import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Tile } from '@/components/common/Tile';

/** Confirmación del reporte de prueba con comprobante. */
export function ReportSuccessScreen() {
  const { state, dispatch } = useDemo();

  return (
    <Screen>
      <PageTop title="Reporte creado" sub="Solo dentro de la demostración" />
      <div className="flex items-center justify-center w-[75px] h-[75px] mx-auto rounded-[25px] bg-brand-soft text-brand">
        <Icon name="check2" size="xl" />
      </div>
      <h1 className="text-center text-[25px] mt-5">Te estamos escuchando.</h1>
      <p className="text-center text-[12px] text-muted mt-3">
        Tu reporte ficticio quedó disponible en
        <br />
        la consola de coordinación de esta demo.
      </p>

      <Tile className="mt-6 text-center">
        <span className="text-[9px] tracking-[1.6px] font-[750] text-muted uppercase">
          COMPROBANTE DE PRUEBA
        </span>
        <h2 className="mt-2">{state.lastReport}</h2>
        <div className="mt-3">
          <Badge color="amber">Pendiente de revisión</Badge>
        </div>
      </Tile>

      <Button
        block
        className="mt-6"
        onClick={() => dispatch({ type: 'openReportDetail', id: state.lastReport ?? undefined })}
      >
        Ver mi reporte
      </Button>
      <Button variant="outline" block icon="monitor" className="mt-2" onClick={() => dispatch({ type: 'reportsConsole' })}>
        Verlo desde la central
      </Button>
      <Button variant="ghost" block className="mt-2" onClick={() => dispatch({ type: 'nav', screen: 'home' })}>
        Volver al inicio
      </Button>
    </Screen>
  );
}
