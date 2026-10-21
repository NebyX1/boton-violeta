import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Button, TextButton } from '@/components/common/Button';
import { Checkbox, FieldLabel, Hint, Select } from '@/components/common/Field';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Segmented } from '@/components/common/Segmented';
import { Tile } from '@/components/common/Tile';

/**
 * Reporte / denuncia: canal no urgente en 3 pasos.
 * Este formulario no es el botón de emergencia ni formaliza una denuncia.
 */
export function ReportScreen() {
  const { state, dispatch } = useDemo();
  const d = state.draft;
  const n = state.reportStep;

  return (
    <Screen>
      <PageTop title="Informar un hecho" sub={`Paso ${n} de 3 · reporte de prueba`} />

      <div className="flex gap-1 mb-4" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <i key={i} className={`h-1 flex-1 rounded-[5px] ${i <= n ? 'bg-brand' : 'bg-brand-soft'}`} />
        ))}
      </div>

      {n === 1 && (
        <>
          <h2>Contanos qué sucede</h2>
          <p className="text-[12px] text-muted mt-2">
            Este formulario no es el botón de emergencia.
          </p>

          <FieldLabel>¿Para quién es el reporte?</FieldLabel>
          <Segmented
            value={d.person}
            onChange={(person) => dispatch({ type: 'setReportPerson', person })}
            options={[
              { value: 'me', label: 'Para mí' },
              { value: 'other', label: 'Para otra persona' },
            ]}
          />

          <FieldLabel htmlFor="rtype">Tipo de situación</FieldLabel>
          <Select
            id="rtype"
            value={d.type}
            onChange={(e) => dispatch({ type: 'setDraft', field: 'type', value: e.target.value })}
          >
            <option>Situación de violencia</option>
            <option>Acoso o intimidación</option>
            <option>Pedido de orientación</option>
            <option>Otro hecho</option>
          </Select>

          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="rdetails">¿Qué querés informar?</FieldLabel>
            <TextButton onClick={() => dispatch({ type: 'reportExample' })}>Usar ejemplo</TextButton>
          </div>
          <textarea
            id="rdetails"
            maxLength={2000}
            placeholder="Usá un relato ficticio para probar el formulario."
            value={d.details}
            onChange={(e) => dispatch({ type: 'setDraft', field: 'details', value: e.target.value })}
          />
          <Hint>Mínimo 10 caracteres. No ingreses datos reales.</Hint>

          <FieldLabel htmlFor="rplace">Lugar de referencia</FieldLabel>
          <input
            id="rplace"
            maxLength={140}
            value={d.place}
            onChange={(e) => dispatch({ type: 'setDraft', field: 'place', value: e.target.value })}
          />

          <FieldLabel htmlFor="rwhen">¿Cuándo ocurrió?</FieldLabel>
          <Select
            id="rwhen"
            value={d.when}
            onChange={(e) => dispatch({ type: 'setDraft', field: 'when', value: e.target.value })}
          >
            <option>Hoy</option>
            <option>Ayer</option>
            <option>Esta semana</option>
            <option>Otro momento</option>
          </Select>
        </>
      )}

      {n === 2 && (
        <>
          <h2>Lo que querés compartir</h2>
          <p className="text-[12px] text-muted mt-2">
            Podés agregar ejemplos. No se accede a archivos reales.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              type="button"
              onClick={() => dispatch({ type: 'attachPhoto' })}
              className="flex flex-col items-start gap-3 p-[15px] rounded-[18px] border border-line bg-paper text-left"
            >
              <span className="flex items-center justify-center w-[34px] h-[34px] rounded-[11px] bg-brand-soft text-brand">
                <Icon name="image" size="sm" className="w-[19px] h-[19px]" />
              </span>
              <div>
                <strong className="block text-[11px]">Foto de ejemplo</strong>
                <small className="block text-[9px] text-muted mt-[3px]">Adjunto ficticio</small>
              </div>
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'toggleRecording' })}
              className="flex flex-col items-start gap-3 p-[15px] rounded-[18px] border border-line bg-paper text-left"
            >
              <span
                className={`flex items-center justify-center w-[34px] h-[34px] rounded-[11px] ${
                  state.recording ? 'bg-red-soft text-red' : 'bg-brand-soft text-brand'
                }`}
              >
                <Icon name={state.recording ? 'pause' : 'mic'} size="sm" className="w-[19px] h-[19px]" />
              </span>
              <div>
                <strong className="block text-[11px]">
                  {state.recording ? 'Finalizar nota' : 'Nota de voz'}
                </strong>
                <small className="block text-[9px] text-muted mt-[3px]">
                  {state.recording ? 'Simulación en curso' : 'Sin usar micrófono'}
                </small>
              </div>
            </button>
          </div>

          {d.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {d.attachments.map((f, i) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-[6px] px-[10px] py-2 rounded-[12px] border border-line bg-paper text-[10px]"
                >
                  <Icon name="file" size="sm" />
                  {f}
                  <button
                    type="button"
                    aria-label="Quitar adjunto"
                    onClick={() => dispatch({ type: 'removeAttachment', index: i })}
                  >
                    <Icon name="close" size="sm" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <FieldLabel htmlFor="rcontact">¿Cómo es seguro contactarte?</FieldLabel>
          <Select
            id="rcontact"
            value={d.contact}
            onChange={(e) => dispatch({ type: 'setDraft', field: 'contact', value: e.target.value })}
          >
            <option>Solo por mensaje en la app</option>
            <option>Mensaje en horario acordado</option>
            <option>Llamada, con autorización previa</option>
            <option>Por ahora no quiero contacto</option>
          </Select>

          <div className="mt-5">
            <Note icon="lock">
              La persona mantiene el control del canal de contacto. No se envían detalles del reporte
              a familiares ni a la comunidad.
            </Note>
          </div>
        </>
      )}

      {n === 3 && (
        <>
          <h2>Revisá antes de enviar</h2>
          <p className="text-[12px] text-muted mt-2">
            Solo se generará un registro de demostración.
          </p>

          <Tile className="mt-5">
            <div className="flex items-center justify-between gap-[10px]">
              <strong className="text-[12px]">{d.type}</strong>
              <TextButton onClick={() => dispatch({ type: 'reportEdit' })}>Editar</TextButton>
            </div>
            <p className="text-[12px] text-muted mt-3">{d.details}</p>
            <div className="h-px bg-line my-[19px]" />
            <p className="text-[12px] flex items-center gap-1">
              <Icon name="pin" size="sm" /> {d.place}
            </p>
            <p className="text-[12px] flex items-center gap-1 mt-2">
              <Icon name="clock" size="sm" /> {d.when}
            </p>
            <p className="text-[12px] flex items-center gap-1 mt-2">
              <Icon name="chat" size="sm" /> {d.contact}
            </p>
            <p className="text-[12px] flex items-center gap-1 mt-2">
              <Icon name="file" size="sm" /> {d.attachments.length} adjunto(s) ficticio(s)
            </p>
          </Tile>

          <Checkbox
            className="mt-5"
            checked={d.consent}
            onChange={(checked) => dispatch({ type: 'setDraft', field: 'consent', value: checked })}
          >
            Entiendo que es una simulación. No se formaliza una denuncia policial ni se solicita una
            intervención real.
          </Checkbox>
        </>
      )}

      <Button
        block
        className="mt-6"
        iconRight={n < 3 ? 'arrow' : undefined}
        onClick={() => dispatch({ type: n === 3 ? 'submitReport' : 'reportNext' })}
      >
        {n === 3 ? 'Enviar reporte de prueba' : 'Continuar'}
      </Button>

      {n > 1 ? (
        <Button variant="ghost" block className="mt-2" onClick={() => dispatch({ type: 'reportPrev' })}>
          Volver al paso anterior
        </Button>
      ) : (
        <Button variant="secondary" block className="mt-2" onClick={() => dispatch({ type: 'sosOptions' })}>
          Necesito ayuda ahora
        </Button>
      )}

      <div className="mt-3">
        <Note icon="info" color="gray">
          Un reporte no reemplaza una alerta inmediata. Este prototipo no está conectado a ningún
          organismo.
        </Note>
      </div>
    </Screen>
  );
}
