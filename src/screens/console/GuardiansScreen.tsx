import { useDemo } from '@/providers/DemoStateProvider';
import { navigateTo, REGISTRY_PATH } from '@/lib/routes';
import { guardianCriteria } from '@/services/demoData';
import { ConsolePageHead, ConsolePanel, DataTable, StatCard, Td } from '@/components/console/ConsolePanel';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Note } from '@/components/common/Note';
import type { GuardianApplicationStatus } from '@/types/demo';

const statusColor: Record<GuardianApplicationStatus, 'amber' | 'brand' | 'green' | 'red'> = {
  pending: 'amber',
  review: 'brand',
  approved: 'green',
  rejected: 'red',
};

const statusLabel: Record<GuardianApplicationStatus, string> = {
  pending: 'Pendiente',
  review: 'En revisión',
  approved: 'Aprobada',
  rejected: 'Rechazada',
};

/**
 * Revisión institucional de postulaciones al registro de vigilantes.
 * La postulación se carga en la web independiente y se resuelve acá.
 */
export function GuardiansScreen() {
  const { state, dispatch } = useDemo();
  const apps = state.guardianApps.filter(
    (a) => state.guardianFilter === 'all' || a.status === state.guardianFilter,
  );
  const pending = state.guardianApps.filter((a) => a.status === 'pending' || a.status === 'review').length;
  const approved = state.guardianApps.filter((a) => a.status === 'approved').length;
  const activeGuardians = state.profiles.filter((p) => p.role === 'community').length;

  return (
    <>
      <ConsolePageHead
        title="Vigilantes comunitarios"
        sub="Altas, criterios y postulaciones del registro (datos ficticios)."
        action={
          <Button variant="outline" small icon="users" onClick={() => navigateTo(REGISTRY_PATH)}>
            Abrir registro
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3 mb-4">
        <StatCard value={pending} label="Postulaciones por revisar" sub="Pendientes o en revisión" icon="clock" tone="amber" />
        <StatCard value={approved} label="Altas aprobadas" sub="En esta sesión de prueba" icon="check2" tone="green" />
        <StatCard value={activeGuardians} label="Vigilantes disponibles" sub="Dispositivos comunitarios" icon="shield" tone="brand" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ['all', 'Todas'],
            ['pending', 'Pendientes'],
            ['review', 'En revisión'],
            ['approved', 'Aprobadas'],
            ['rejected', 'Rechazadas'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => dispatch({ type: 'setGuardianFilter', filter: value })}
            className={`rounded-full border px-3 py-[6px] text-[10px] font-bold transition ${
              state.guardianFilter === value
                ? 'border-brand bg-brand text-white'
                : 'border-[#e7ddee] bg-white text-[#8d76a0] hover:border-brand/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ConsolePanel title={`Postulaciones (${apps.length})`}>
        <DataTable headers={['ID', 'Persona', 'Zona', 'Criterios', 'Puntaje', 'Estado', 'Acciones']}>
          {apps.map((app) => (
            <tr key={app.id}>
              <Td>{app.id}</Td>
              <Td>
                <strong className="block text-[11px]">{app.name}</strong>
                <small className="text-[9px] text-[#a48ab5]">{app.phone}</small>
              </Td>
              <Td>
                {app.neighborhood}
                <small className="block text-[9px] text-[#a48ab5]">{app.availability}</small>
              </Td>
              <Td>
                <div className="flex gap-1">
                  {guardianCriteria.map((c) => (
                    <span
                      key={c.key}
                      title={c.label}
                      className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold ${
                        app[c.key] ? 'bg-green-soft text-green' : 'bg-[#f0ecf5] text-[#b49dc2]'
                      }`}
                    >
                      {app[c.key] ? '✓' : '–'}
                    </span>
                  ))}
                </div>
              </Td>
              <Td>
                <span className="font-bold">{app.score}</span>
                <small className="text-[9px] text-[#a48ab5]">/100</small>
              </Td>
              <Td>
                <Badge color={statusColor[app.status]}>{statusLabel[app.status].toUpperCase()}</Badge>
              </Td>
              <Td>
                <div className="flex flex-wrap gap-[5px]">
                  <Button
                    small
                    variant="success"
                    onClick={() => dispatch({ type: 'reviewGuardianApp', id: app.id, status: 'approved' })}
                    disabled={app.status === 'approved'}
                  >
                    Alta
                  </Button>
                  <Button
                    small
                    variant="secondary"
                    onClick={() => dispatch({ type: 'reviewGuardianApp', id: app.id, status: 'review' })}
                    disabled={app.status === 'review'}
                  >
                    Revisar
                  </Button>
                  <Button
                    small
                    variant="danger"
                    onClick={() => dispatch({ type: 'reviewGuardianApp', id: app.id, status: 'rejected' })}
                    disabled={app.status === 'rejected'}
                  >
                    Rechazar
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
        {!apps.length && (
          <p className="px-5 py-8 text-center text-[10px] text-[#a48ab5]">
            No hay postulaciones con este filtro.
          </p>
        )}
      </ConsolePanel>

      <div className="mt-4">
        <Note icon="shield" color="gray">
          Aprobar una postulación agrega un dispositivo comunitario disponible en la app. Los
          criterios son de demostración: identidad verificada, referencias vecinales y formación
          básica, con un puntaje base por postulación completa.
        </Note>
      </div>
    </>
  );
}
