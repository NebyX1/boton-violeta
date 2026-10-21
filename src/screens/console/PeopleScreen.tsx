import { useDemo } from '@/providers/DemoStateProvider';
import { liveAlert, received } from '@/providers/demoSelectors';
import { ConsolePageHead, ConsolePanel, DataTable, Td } from '@/components/console/ConsolePanel';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Note } from '@/components/common/Note';

/** Personas de demostración. La central no puede abrir seguimientos familiares privados. */
export function PeopleScreen() {
  const { state, dispatch } = useDemo();

  const people = [
    { name: state.profile.name, role: 'Solicitante', color: '' as const, id: 'self' },
    ...state.contacts.map((c) => ({ name: c.name, role: 'Círculo de confianza', color: c.color, id: c.id })),
    { name: 'Nicolás Pérez', role: 'Comunidad', color: 'blue' as const, id: 'community' },
  ];

  return (
    <>
      <ConsolePageHead
        title="Personas de demostración"
        sub="La central no puede abrir seguimientos familiares privados."
        action={<Badge color="red">ACCESO RESTRINGIDO</Badge>}
      />
      <ConsolePanel>
        <DataTable headers={['Cuenta', 'Rol', 'Estado', 'Ubicación institucional', 'Acción']}>
          {people.map((p) => (
            <tr key={p.id}>
              <Td>
                <div className="flex items-center gap-2">
                  <Avatar name={p.name} color={p.color} size="sm" />
                  {p.name}
                </div>
              </Td>
              <Td>{p.role}</Td>
              <Td>
                <Badge color="gray">Cuenta ficticia</Badge>
              </Td>
              <Td>
                {p.id === 'self' && liveAlert(state) && received(liveAlert(state))
                  ? 'Incidente abierto'
                  : 'No disponible'}
              </Td>
              <Td>
                <Button
                  variant="outline"
                  small
                  onClick={() => dispatch({ type: 'personInfo', id: p.id })}
                >
                  Ver ficha
                </Button>
              </Td>
            </tr>
          ))}
        </DataTable>
      </ConsolePanel>
      <div className="mt-5">
        <Note icon="lock">
          Vincular una cuenta, activar un permiso familiar o registrarse no habilita el rastreo desde
          la central.
        </Note>
      </div>
    </>
  );
}
