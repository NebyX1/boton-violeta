import { useDemo } from '@/providers/DemoStateProvider';
import { downloadText, formatTime } from '@/lib/format';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Tile } from '@/components/common/Tile';
import { Timeline } from '@/components/common/Timeline';

/** Detalle del reporte con trazabilidad y comprobante exportable. */
export function ReportDetailScreen() {
  const { state, dispatch } = useDemo();
  const r = state.reports.find((x) => x.id === state.context) ?? state.reports.find((x) => x.id === state.lastReport);

  if (!r) {
    return (
      <Screen>
        <PageTop title="Reporte" />
        <EmptyState
          title="No hay un reporte seleccionado"
          text="Creá un ejemplo para recorrer el flujo."
          icon="file"
        />
        <Button block onClick={() => dispatch({ type: 'newReport' })}>
          Crear reporte
        </Button>
      </Screen>
    );
  }

  return (
    <Screen>
      <PageTop title={r.id} sub="Comprobante de demostración" />

      <Badge color={r.status === 'Pendiente' ? 'amber' : 'green'}>{r.status}</Badge>
      <h2 className="mt-5">{r.type}</h2>

      <Tile className="mt-5">
        <p className="text-[12px]">{r.details}</p>
        <div className="h-px bg-line my-[19px]" />
        <p className="text-[12px] text-muted flex items-center gap-1">
          <Icon name="pin" size="sm" /> {r.place}
        </p>
        <p className="text-[12px] text-muted flex items-center gap-1 mt-2">
          <Icon name="chat" size="sm" /> {r.contact}
        </p>
        <p className="text-[12px] text-muted mt-2">{r.attachments.length} adjunto(s) ficticio(s)</p>
      </Tile>

      <Tile className="mt-4">
        <h3 className="text-[13px]">Seguimiento del reporte</h3>
        <div className="mt-4">
          <Timeline
            events={[
              { time: r.created, text: 'Reporte de prueba creado' },
              ...(r.reviewed
                ? [
                    {
                      time: r.reviewed,
                      text:
                        r.status === 'En revisión'
                          ? 'En revisión por la central de demostración'
                          : 'Estado del reporte: ' + r.status,
                    },
                  ]
                : []),
            ]}
          />
        </div>
        <p className="text-[9px] text-muted mt-2">
          Creado {formatTime(r.created)} · datos ficticios
        </p>
      </Tile>

      <Button
        variant="outline"
        block
        icon="chat"
        className="mt-5"
        onClick={() => dispatch({ type: 'openChat', target: 'central' })}
      >
        Consultar a la central
      </Button>
      <Button
        variant="secondary"
        block
        icon="download"
        className="mt-2"
        onClick={() => {
          downloadText(
            r.id + '_DEMO.txt',
            `BOTÓN VIOLETA · COMPROBANTE FICTICIO\nNo constituye una denuncia real.\n\n${r.id}\nTipo: ${r.type}\nEstado: ${r.status}\nLugar ficticio: ${r.place}\nRelato: ${r.details}\nContacto seguro: ${r.contact}\n`,
          );
          dispatch({ type: 'toast', text: 'Archivo de demostración generado.' });
        }}
      >
        Exportar comprobante de prueba
      </Button>

      <div className="mt-4">
        <Note icon="beaker" color="gray">
          Este comprobante no acredita una denuncia real ni una actuación institucional.
        </Note>
      </div>
    </Screen>
  );
}
