import { useState } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { incidentById } from '@/providers/demoSelectors';
import { incidentStatusLabel } from '@/services/demoData';
import { Sheet } from '@/components/common/Sheet';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Checkbox, FieldLabel, Select } from '@/components/common/Field';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { ChatBubble } from '@/components/chat/Chat';

/** Mensajería del incidente (canal de la central, no el chat privado del círculo). */
export function OperatorChatDialog() {
  const { state, dispatch } = useDemo();
  const a = incidentById(state, String(state.sheetData.id ?? state.selectedIncident));
  const target = (state.sheetData.target as 'central' | 'community') ?? 'central';
  const [text, setText] = useState('Estamos revisando tu alerta de prueba. ¿Podés responder por acá?');

  return (
    <Sheet
      title="Mensajería del incidente"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button onClick={() => dispatch({ type: 'operatorSend', text, target })}>
          Enviar mensaje de prueba
        </Button>
      }
    >
      <p className="text-[11px] text-muted leading-[1.75]">
        {a?.id ?? 'Canal de prueba'} · Solo mensajes ficticios. La central no accede al chat privado
        del círculo.
      </p>
      <div className="flex flex-col gap-[10px] my-4 max-h-[280px] overflow-auto">
        {state.chats[target].map((m, i) => (
          <ChatBubble key={`${m.time}-${i}`} message={m} mine={m.sender === 'operator'} />
        ))}
      </div>
      <FieldLabel htmlFor="opmessage">Mensaje para la persona</FieldLabel>
      <input id="opmessage" maxLength={500} value={text} onChange={(e) => setText(e.target.value)} />
    </Sheet>
  );
}

/** Revisión de un reporte desde la central. */
export function OperatorReportDialog() {
  const { state, dispatch } = useDemo();
  const r = state.reports.find((x) => x.id === state.sheetData.id);
  if (!r) return null;
  return (
    <Sheet
      title={r.id}
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <>
          <Button onClick={() => dispatch({ type: 'reviewReport', id: r.id })}>
            {r.status === 'Pendiente' ? 'Tomar reporte' : 'Marcar como revisado'}
          </Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'contactReport', id: r.id })}>
            Simular solicitud de contacto
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: 'archiveReport', id: r.id })}>
            Archivar reporte de prueba
          </Button>
        </>
      }
    >
      <Badge color={r.status === 'Pendiente' ? 'amber' : 'green'}>{r.status}</Badge>
      <h3 className="mt-4">{r.type}</h3>
      <p className="text-[12px] text-muted mt-3">{r.details}</p>
      <div className="p-[17px] mt-4 rounded-[20px] border border-line bg-paper">
        <p className="text-[12px] flex items-center gap-1">
          <Icon name="pin" size="sm" /> {r.place}
        </p>
        <p className="text-[12px] flex items-center gap-1 mt-3">
          <Icon name="chat" size="sm" /> {r.contact}
        </p>
        <p className="text-[12px] mt-3">{r.attachments.length} adjunto(s) ficticio(s)</p>
      </div>
      <Note icon="lock" color="gray">
        Este registro no constituye una denuncia policial formal. El canal seguro elegido debe
        respetarse.
      </Note>
    </Sheet>
  );
}

/** Asignación de un recurso operativo al incidente. */
export function AssignUnitDialog() {
  const { state, dispatch } = useDemo();
  const a = incidentById(state, String(state.sheetData.id ?? state.selectedIncident));
  const [unitId, setUnitId] = useState(a?.unit ?? state.units.find((u) => u.available)?.id ?? '');

  return (
    <Sheet
      title="Asignar un recurso"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button onClick={() => dispatch({ type: 'confirmUnit', id: a?.id, unitId })}>
          Confirmar asignación de prueba
        </Button>
      }
    >
      <p className="text-[11px] text-muted leading-[1.75]">
        {a?.id} · La asignación no confirma por sí sola que un móvil esté en camino.
      </p>
      <FieldLabel htmlFor="unitselect">Recurso de demostración</FieldLabel>
      <Select id="unitselect" value={unitId} onChange={(e) => setUnitId(e.target.value)}>
        {state.units.map((u) => (
          <option
            key={u.id}
            value={u.id}
            disabled={!u.available && u.id !== a?.unit}
          >
            {u.name} ·{' '}
            {u.available ? 'disponible' : u.id === a?.unit ? 'asignado a este caso' : 'ocupado'}
          </option>
        ))}
      </Select>
      <Note icon="beaker" color="gray">
        No se movilizan patrulleros, personal ni recursos reales.
      </Note>
    </Sheet>
  );
}

/** Registro de cierre operativo. */
export function ClosureDialog() {
  const { state, dispatch } = useDemo();
  const id = String(state.sheetData.id ?? state.selectedIncident);
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Sheet
      title="Registrar el cierre"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button
          disabled={!confirmed}
          onClick={() => dispatch({ type: 'confirmClosure', id, note })}
        >
          Cerrar incidente de prueba
        </Button>
      }
    >
      <p className="text-[11px] text-muted leading-[1.75]">
        {id} · Documentá el resultado ficticio de esta intervención.
      </p>
      <FieldLabel htmlFor="closurenote">Resultado de la actuación de prueba</FieldLabel>
      <textarea
        id="closurenote"
        maxLength={800}
        placeholder="Ejemplo: la persona confirmó que está a salvo."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Checkbox className="mt-4" checked={confirmed} onChange={setConfirmed}>
        Confirmo que se verificó el cierre en este escenario simulado.
      </Checkbox>
    </Sheet>
  );
}

/** Detalle del cierre registrado. */
export function ClosureDetailDialog() {
  const { state, dispatch } = useDemo();
  const a = incidentById(state, String(state.sheetData.id ?? state.selectedIncident));
  return (
    <Sheet
      title={`Cierre de ${a?.id ?? ''}`}
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={<Button onClick={() => dispatch({ type: 'closeSheet' })}>Entendido</Button>}
    >
      <Badge color="green">Resuelta</Badge>
      <p className="text-[11px] text-muted leading-[1.75] mt-4">
        {a?.closure ?? 'Cierre de demostración.'}
      </p>
      <p className="text-[10px] text-muted mt-2">
        {a?.closedAt
          ? new Intl.DateTimeFormat('es-UY', { hour: '2-digit', minute: '2-digit', hour12: false }).format(
              new Date(a.closedAt),
            )
          : ''}{' '}
        · Datos ficticios
      </p>
    </Sheet>
  );
}

/** Ficha de persona de demostración. */
export function PersonDialog() {
  const { state, dispatch } = useDemo();
  const id = String(state.sheetData.id ?? '');
  const c = state.contacts.find((x) => x.id === id);
  const p =
    id === 'self'
      ? {
          name: state.profile.name,
          role: 'Solicitante',
          note: 'La ubicación solo se habilita en un incidente comunicado.',
        }
      : id === 'community'
        ? {
            name: 'Nicolás Pérez',
            role: 'Comunidad',
            note: 'Puede ofrecer apoyo a alertas comunitarias.',
          }
        : {
            name: c?.name ?? 'Contacto',
            role: 'Círculo de confianza',
            note: 'Un vínculo no otorga acceso de rastreo a la central.',
          };

  return (
    <Sheet
      title={p.name}
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button variant="outline" onClick={() => dispatch({ type: 'closeSheet' })}>
          Cerrar ficha
        </Button>
      }
    >
      <div className="flex items-center gap-3">
        <Avatar name={p.name} size="lg" />
        <div>
          <h3>{p.role}</h3>
          <p className="text-[12px] text-muted mt-2">Cuenta ficticia</p>
        </div>
      </div>
      <Note icon="lock">{p.note}</Note>
      <p className="text-[11px] text-muted leading-[1.75] mt-4">
        No hay acceso a ubicaciones familiares, credenciales ni información real de identidad.
      </p>
    </Sheet>
  );
}

/** Información del marcador de recurso en el mapa. */
export function UnitInfoDialog() {
  const { dispatch } = useDemo();
  return (
    <Sheet
      title="Recurso de prueba"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button onClick={() => dispatch({ type: 'setConsoleTab', tab: 'resources' })}>
          Ver recursos operativos
        </Button>
      }
    >
      <Note icon="car" color="gray">
        Marcador ilustrativo. No representa una posición policial real ni un servicio de despacho
        conectado.
      </Note>
    </Sheet>
  );
}

/** Asignaciones actuales de un recurso. */
export function AssignmentsDialog() {
  const { state, dispatch } = useDemo();
  const u = state.units.find((x) => x.id === state.sheetData.id);
  const assigned = state.incidents.filter((a) => a.unit === u?.id && a.status !== 'resolved');

  return (
    <Sheet
      title={u?.name ?? 'Recurso'}
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button variant="outline" onClick={() => dispatch({ type: 'closeSheet' })}>
          Volver a recursos
        </Button>
      }
    >
      {assigned.length ? (
        assigned.map((a) => (
          <div key={a.id} className="p-[17px] mt-3 rounded-[20px] border border-line bg-paper">
            <h3>{a.id}</h3>
            <p className="text-[12px] text-muted mt-2">
              {a.title} · {incidentStatusLabel(a.status)}
            </p>
            <Button
              variant="secondary"
              small
              className="mt-3"
              onClick={() => dispatch({ type: 'selectIncident', id: a.id })}
            >
              Abrir incidente
            </Button>
          </div>
        ))
      ) : (
        <Note icon="car" color="gray">
          Sin asignaciones. El recurso no está vinculado a un incidente abierto.
        </Note>
      )}
    </Sheet>
  );
}

/** Alta de recurso ficticio. */
export function NewUnitDialog() {
  const { dispatch } = useDemo();
  const [name, setName] = useState('');
  const [unitType, setUnitType] = useState('Móvil de prueba');

  return (
    <Sheet
      title="Agregar recurso de prueba"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button onClick={() => dispatch({ type: 'createUnit', name, unitType })}>
          Crear recurso ficticio
        </Button>
      }
    >
      <FieldLabel htmlFor="unitname">Nombre</FieldLabel>
      <input
        id="unitname"
        maxLength={50}
        placeholder="Equipo de apoyo Norte"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <FieldLabel htmlFor="unittype">Tipo</FieldLabel>
      <Select id="unittype" value={unitType} onChange={(e) => setUnitType(e.target.value)}>
        <option>Móvil de prueba</option>
        <option>Equipo de apoyo</option>
        <option>Punto de recepción</option>
      </Select>
    </Sheet>
  );
}

/** Elección de capa cartográfica. */
export function LayersDialog() {
  const { dispatch } = useDemo();
  return (
    <Sheet title="Elegí el mapa" onClose={() => dispatch({ type: 'closeSheet' })}>
      <p className="text-[11px] text-muted leading-[1.75]">
        Los marcadores y las distancias siempre son ficticios. El plano funciona sin conexión; la
        cartografía real requiere internet.
      </p>
      <div className="flex flex-col gap-3 mt-4">
        <button
          type="button"
          onClick={() => dispatch({ type: 'setMapLayer', layer: 'vector' })}
          className="flex items-center gap-3 p-[17px] rounded-[20px] border border-line bg-paper text-left"
        >
          <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-brand-soft text-brand">
            <Icon name="map" />
          </span>
          <div>
            <h3 className="text-[13px]">Plano ilustrativo</h3>
            <p className="text-[10px] text-muted mt-2">
              Incluido en la demo · disponible sin internet
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'setMapLayer', layer: 'real' })}
          className="flex items-center gap-3 p-[17px] rounded-[20px] border border-line bg-paper text-left"
        >
          <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-green-soft text-green">
            <Icon name="layers" />
          </span>
          <div>
            <h3 className="text-[13px]">Mapa real · OpenStreetMap</h3>
            <p className="text-[10px] text-muted mt-2">
              Leaflet y cartografía en línea · datos de prueba
            </p>
          </div>
        </button>
      </div>
    </Sheet>
  );
}
