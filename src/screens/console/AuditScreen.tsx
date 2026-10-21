import { useDemo } from '@/providers/DemoStateProvider';
import { csv, downloadText, formatTime } from '@/lib/format';
import { ConsolePageHead, ConsolePanel, DataTable, Td } from '@/components/console/ConsolePanel';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

/** Bitácora de actividad: consentimientos, recepción y acciones operativas. */
export function AuditScreen() {
  const { state, dispatch } = useDemo();

  return (
    <>
      <ConsolePageHead
        title="Bitácora de actividad"
        sub="Consentimientos, recepción y acciones operativas de esta sesión."
        action={
          <Button
            variant="outline"
            small
            icon="download"
            onClick={() => {
              downloadText(
                'Boton_Violeta_Bitacora_DEMO.csv',
                csv([
                  ['Hora de la sesión', 'Tipo', 'Evento ficticio'],
                  ...state.logs.map((e) => [new Date(e.time).toISOString(), e.type, e.text]),
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
        <DataTable headers={['Hora', 'Tipo', 'Evento']}>
          {state.logs.map((e, i) => (
            <tr key={`${e.time}-${i}`}>
              <Td className="whitespace-nowrap">{formatTime(e.time)}</Td>
              <Td>
                <Badge color="gray">{e.type}</Badge>
              </Td>
              <Td>{e.text}</Td>
            </tr>
          ))}
        </DataTable>
      </ConsolePanel>
    </>
  );
}
