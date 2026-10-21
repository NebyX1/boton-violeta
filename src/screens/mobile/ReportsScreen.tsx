import { useDemo } from '@/providers/DemoStateProvider';
import { formatTime } from '@/lib/format';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icon';

/** Listado de reportes de prueba de la cuenta. */
export function ReportsScreen() {
  const { state, dispatch } = useDemo();

  return (
    <Screen>
      <PageTop title="Mis reportes" sub="Solicitudes y comprobantes de prueba" />

      {state.reports.length ? (
        state.reports.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => dispatch({ type: 'openReportDetail', id: r.id })}
            className="flex items-start gap-[11px] w-full text-left p-3 mb-3 rounded-[15px] border border-line bg-paper"
          >
            <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-brand-soft text-brand shrink-0">
              <Icon name="file" />
            </span>
            <span className="flex-1 min-w-0">
              <strong className="block text-[12px]">{r.type}</strong>
              <p className="text-[10px] text-muted mt-1">
                {r.id} · {r.status}
              </p>
              <time className="block text-[9px] text-muted mt-1">
                {formatTime(r.created)} · reporte de prueba
              </time>
            </span>
            <Icon name="chev" size="sm" className="text-muted" />
          </button>
        ))
      ) : (
        <EmptyState
          title="Todavía no hay reportes"
          text="Podés informar una situación sin activar una alerta comunitaria."
          icon="file"
        />
      )}

      <Button block className="mt-6" onClick={() => dispatch({ type: 'newReport' })}>
        Crear un reporte de prueba
      </Button>
    </Screen>
  );
}
