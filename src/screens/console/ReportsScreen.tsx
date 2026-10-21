import { useDemo } from '@/providers/DemoStateProvider';
import { ConsolePageHead, ConsolePanel, DataTable, Td } from '@/components/console/ConsolePanel';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';

/** Reportes y solicitudes recibidas (canal no urgente). */
export function ReportsScreen() {
  const { state, dispatch } = useDemo();

  return (
    <>
      <ConsolePageHead
        title="Reportes y solicitudes"
        sub="Canal no urgente. No constituye una denuncia policial formal."
        action={
          <Button variant="outline" small icon="plus" onClick={() => dispatch({ type: 'seedReport' })}>
            Agregar ejemplo
          </Button>
        }
      />
      {state.reports.length ? (
        <ConsolePanel>
          <DataTable headers={['ID', 'Situación', 'Contacto seguro', 'Estado', 'Acción']}>
            {state.reports
              .slice()
              .reverse()
              .map((r) => (
                <tr key={r.id}>
                  <Td>{r.id}</Td>
                  <Td>{r.type}</Td>
                  <Td>{r.contact}</Td>
                  <Td>
                    <Badge color={r.status === 'Pendiente' ? 'amber' : 'green'}>{r.status}</Badge>
                  </Td>
                  <Td>
                    <Button
                      variant="secondary"
                      small
                      onClick={() => dispatch({ type: 'openOperatorReport', id: r.id })}
                    >
                      Revisar
                    </Button>
                  </Td>
                </tr>
              ))}
          </DataTable>
        </ConsolePanel>
      ) : (
        <ConsolePanel>
          <EmptyState
            title="Sin reportes por revisar"
            text="Creá un reporte desde la app o agregá un ejemplo de prueba."
            icon="file"
          />
        </ConsolePanel>
      )}
    </>
  );
}
