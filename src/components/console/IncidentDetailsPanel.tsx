import { useDemo } from '@/providers/DemoStateProvider';
import { incidentById, received } from '@/providers/demoSelectors';
import { incidentStatusLabel } from '@/services/demoData';
import type { ReactNode } from 'react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Elapsed } from '@/components/common/Clock';
import { EmptyState } from '@/components/common/EmptyState';
import { Note } from '@/components/common/Note';
import { Timeline } from '@/components/common/Timeline';
import { Avatar } from '@/components/common/Avatar';

const steps = ['received', 'taken', 'assigned', 'enroute', 'onscene', 'resolved'];

function DetailCell({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <span className="block text-[8px] text-[#b095c0]">{label}</span>
      <strong className="block text-[10px] font-semibold mt-[5px]">{value}</strong>
    </div>
  );
}

/** Panel de detalle operativo del incidente seleccionado. */
export function IncidentDetailsPanel() {
  const { state, dispatch } = useDemo();
  const a = incidentById(state, state.selectedIncident);

  if (!a || !received(a)) {
    return <EmptyState title="Elegí un incidente" text="Su información operativa aparecerá aquí." icon="radar" />;
  }

  const step = steps.indexOf(a.status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-[17px] max-h-[594px] overflow-auto">
      <div>
        <div className="flex items-center justify-between gap-[10px]">
          <Badge
            color={a.status === 'resolved' ? 'green' : !a.operator ? 'red' : 'brand'}
          >
            {a.active
              ? incidentStatusLabel(a.status)
              : a.status === 'resolved'
                ? 'Resuelta'
                : 'Seguimiento detenido'}
          </Badge>
          <span className="text-[10px] text-muted">{a.id}</span>
        </div>
        <h2 className="mt-4 text-[21px] leading-[1.3] tracking-[-0.5px]">{a.title}</h2>
        <div className="flex items-center gap-[10px] mt-[17px]">
          <Avatar name={a.name} color={a.kind === 'medical' ? 'mint' : 'pink'} />
          <div>
            <strong className="block text-[11px]">{a.name}</strong>
            <small className="block text-[9px] text-muted mt-1">
              Identidad ficticia · {a.owner === 'self' ? 'cuenta de Camila' : 'escenario de ejemplo'}
            </small>
          </div>
        </div>

        <div className="flex gap-1 my-[18px]" aria-hidden="true">
          {steps.map((s, i) => (
            <i
              key={s}
              className={`h-1 flex-1 rounded-[5px] ${i <= step ? 'bg-[#b28adb]' : 'bg-[#eee4f6]'}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-[19px]">
          <DetailCell label="TIEMPO DESDE AVISO" value={<Elapsed since={a.started} />} />
          <DetailCell label="CANAL SEGURO" value={a.noTalk ? 'Solo mensajes' : 'Mensajes primero'} />
          <DetailCell
            label="UBICACIÓN"
            value={
              a.pos
                ? a.active
                  ? 'Última recibida · demo'
                  : 'Última conocida · detenida'
                : 'No disponible'
            }
          />
          <DetailCell label="VISIBILIDAD" value={a.public ? 'Comunidad + central' : 'Privada / central'} />
          <DetailCell label="OPERADORA" value={a.operator ?? 'Sin asignar'} />
          <DetailCell label="RECURSO" value={a.unit ?? 'No asignado'} />
        </div>

        {a.pos && (
          <p className="mt-3 text-[9px] text-muted">
            Coordenadas ficticias: <span>{a.pos.map((p) => p.toFixed(5)).join(', ')}</span>
          </p>
        )}
        {a.escalated && (
          <div className="mt-3">
            <Note icon="clock" color="amber">
              Sin confirmación a tiempo. Escalamiento de prueba registrado.
            </Note>
          </div>
        )}
        {!a.active && a.status !== 'resolved' && (
          <div className="mt-3">
            <Note icon="lock" color="gray">
              La persona detuvo el seguimiento. No llegan nuevas posiciones; falta registrar el cierre
              operativo.
            </Note>
          </div>
        )}

        <div className="flex flex-col gap-[7px] my-[19px]">
          {a.status === 'resolved' ? (
            <Button variant="secondary" small onClick={() => dispatch({ type: 'closureDetail', id: a.id })}>
              Ver cierre registrado
            </Button>
          ) : (
            <>
              {!a.operator ? (
                <Button small icon="check2" onClick={() => dispatch({ type: 'takeIncident', id: a.id })}>
                  Tomar incidente
                </Button>
              ) : (
                <Button small icon="car" onClick={() => dispatch({ type: 'assignUnit', id: a.id })}>
                  {a.unit ? 'Cambiar recurso' : 'Asignar recurso'}
                </Button>
              )}
              {a.operator && a.unit && a.status !== 'onscene' && (
                <Button
                  variant="outline"
                  small
                  onClick={() => dispatch({ type: 'advanceIncident', id: a.id })}
                >
                  {a.status === 'enroute' ? 'Confirmar llegada al lugar' : 'Confirmar recurso en camino'}
                </Button>
              )}
              <Button
                variant="outline"
                small
                icon="chat"
                onClick={() => dispatch({ type: 'openOperatorChat', id: a.id })}
              >
                Mensajería del incidente
              </Button>
              {a.owner === 'self' && a.active ? (
                <Button variant="ghost" small onClick={() => dispatch({ type: 'requestClose', id: a.id })}>
                  Solicitar confirmación de cierre
                </Button>
              ) : (
                <Button variant="ghost" small onClick={() => dispatch({ type: 'closeIncident', id: a.id })}>
                  Registrar cierre del incidente
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-[11px] mb-4">Trazabilidad</h3>
        <Timeline events={a.events} />
        <div className="mt-4">
          <Note icon="beaker" color="gray">
            Aceptar o asignar un recurso aquí es una acción simulada. No representa un despacho real.
          </Note>
        </div>
      </div>
    </div>
  );
}
