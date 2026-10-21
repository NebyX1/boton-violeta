import { useDemo } from '@/providers/DemoStateProvider';
import { received } from '@/providers/demoSelectors';
import { incidentStatusLabel } from '@/services/demoData';
import { csv, downloadText } from '@/lib/format';
import { ConsolePageHead, ConsolePanel, DataTable, Td } from '@/components/console/ConsolePanel';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

/** Listado completo de incidentes de la sesión. */
export function IncidentsScreen() {
  const { state, dispatch } = useDemo();

  return (
    <>
      <ConsolePageHead
        title="Incidentes de la sesión"
        sub="Alertas, estados y cierres de demostración."
        action={
          <Button
            variant="outline"
            small
            icon="download"
            onClick={() => {
              downloadText(
                'Boton_Violeta_Incidentes_DEMO.csv',
                csv([
                  ['ID', 'Persona ficticia', 'Tipo', 'Estado', 'Seguimiento', 'Recurso'],
                  ...state.incidents.filter(received).map((a) => [
                    a.id,
                    a.name,
                    a.type,
                    incidentStatusLabel(a.status),
                    a.active ? 'Activo' : 'Detenido',
                    a.unit ?? '',
                  ]),
                ]),
                'text/csv;charset=utf-8',
              );
              dispatch({ type: 'toast', text: 'Archivo de demostración generado.' });
            }}
          >
            Exportar CSV
          </Button>
        }
      />
      <ConsolePanel>
        <DataTable headers={['ID', 'Persona', 'Situación', 'Estado', 'Seguimiento', 'Acción']}>
          {state.incidents
            .filter(received)
            .slice()
            .reverse()
            .map((a) => (
              <tr key={a.id}>
                <Td>{a.id}</Td>
                <Td>{a.name}</Td>
                <Td>{a.type}</Td>
                <Td>
                  <Badge color={a.status === 'resolved' ? 'green' : 'brand'}>
                    {incidentStatusLabel(a.status)}
                  </Badge>
                </Td>
                <Td>{a.active ? 'Activo (demo)' : 'Detenido'}</Td>
                <Td>
                  <Button
                    variant="secondary"
                    small
                    onClick={() => dispatch({ type: 'selectIncident', id: a.id })}
                  >
                    Abrir
                  </Button>
                </Td>
              </tr>
            ))}
        </DataTable>
      </ConsolePanel>
    </>
  );
}
