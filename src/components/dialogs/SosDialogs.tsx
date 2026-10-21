import { useEffect, useState } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { alertContacts } from '@/providers/demoSelectors';
import { Sheet } from '@/components/common/Sheet';
import { Button } from '@/components/common/Button';
import { Checkbox, FieldLabel, Select } from '@/components/common/Field';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';

function AudienceRow({
  icon,
  title,
  sub,
  on,
  fixed,
  onToggle,
}: {
  icon: string;
  title: string;
  sub: string;
  on: boolean;
  fixed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-center gap-[10px] p-[13px] mt-[10px] border border-line rounded-[15px]">
      <span className="flex items-center justify-center w-[33px] h-[33px] rounded-[10px] bg-brand-soft text-brand shrink-0">
        <Icon name={icon} size="sm" />
      </span>
      <div className="flex-1 min-w-0">
        <strong className="block text-[11px]">{title}</strong>
        <p className="text-[9px] text-muted mt-[3px]">{sub}</p>
      </div>
      {fixed ? (
        <span className="text-[9px] font-[750] text-brand bg-brand-soft px-[9px] py-[5px] rounded-[25px]">
          Siempre
        </span>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={title}
          onClick={onToggle}
          className={`relative w-[42px] h-[24px] rounded-[20px] shrink-0 ${on ? 'bg-brand' : 'bg-[#dcd5e4]'}`}
        >
          <i
            className={`absolute left-[3px] top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-[0_2px_3px_#0001] transition-transform ${
              on ? 'translate-x-[18px]' : ''
            }`}
          />
        </button>
      )}
    </div>
  );
}

/** Elección de audiencia del SOS (central, círculo y comunidad). */
export function SosOptionsDialog() {
  const { state, dispatch } = useDemo();
  const [publicConsent, setPublicConsent] = useState(false);
  const close = () => dispatch({ type: 'closeSheet' });

  return (
    <Sheet
      title="¿A quién avisamos?"
      onClose={close}
      actions={
        <>
          <Button icon="radar" onClick={() => dispatch({ type: 'startCountdown', publicConsent })}>
            Activar alerta de prueba
          </Button>
          <Button variant="ghost" onClick={close}>
            Ahora no
          </Button>
        </>
      }
    >
      <p className="text-[11px] text-muted leading-[1.75]">
        Elegí la audiencia de este SOS de prueba. La central es el destino principal.
      </p>
      <AudienceRow
        icon="monitor"
        title="Central de coordinación"
        sub="Recibe y gestiona el incidente simulado."
        on
        fixed
      />
      <AudienceRow
        icon="users"
        title="Mi círculo de confianza"
        sub={`${alertContacts(state).length} contacto(s) habilitado(s) para SOS.`}
        on={state.audience.family}
        onToggle={() => dispatch({ type: 'toggleAudienceFamily' })}
      />
      <AudienceRow
        icon="radar"
        title="Personas cercanas"
        sub="Tu ubicación exacta será visible mientras el SOS siga activo."
        on={state.audience.public}
        onToggle={() => dispatch({ type: 'toggleAudiencePublic' })}
      />
      {state.audience.public ? (
        <Checkbox className="mt-4" checked={publicConsent} onChange={setPublicConsent}>
          Autorizo mostrar mi ubicación exacta a quienes vean esta alerta comunitaria de prueba.
        </Checkbox>
      ) : (
        <Note icon="lock" color="gray">
          Por defecto no se publica tu ubicación a la comunidad.
        </Note>
      )}
    </Sheet>
  );
}

/** Ya hay un SOS activo. */
export function AlreadySosDialog() {
  const { dispatch } = useDemo();
  return (
    <Sheet
      title="Ya tenés una alerta activa"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button onClick={() => dispatch({ type: 'viewSos' })}>Ver mi alerta</Button>
      }
    >
      <Note icon="radar">
        Podés cambiar la difusión comunitaria o detener el seguimiento desde tu alerta.
      </Note>
    </Sheet>
  );
}

/** Cuenta regresiva de 3 segundos antes de activar el SOS. */
export function CountdownDialog() {
  const { state, dispatch } = useDemo();
  const count = Number(state.sheetData.count ?? 3);

  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'countdownTick' }), 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <Sheet
      title="Preparando tu alerta"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button variant="outline" onClick={() => dispatch({ type: 'closeSheet' })}>
          Cancelar activación
        </Button>
      }
    >
      <div className="text-center py-5">
        <div className="flex items-center justify-center w-[162px] h-[162px] mx-auto rounded-full border-[3px] border-[#e4d4f5] bg-[#fbf7ff] font-display font-extrabold text-[82px] text-brand">
          {count}
        </div>
        <h2 className="mt-4">Vamos a avisar a tu red.</h2>
        <p className="text-[12px] text-muted mt-3">
          Esta es una demostración.
          <br />
          Podés cancelar antes de que se active.
        </p>
      </div>
    </Sheet>
  );
}

/** Confirmación para detener el SOS ("¿estás a salvo?"). */
export function StopSosDialog() {
  const { state, dispatch } = useDemo();
  const [reason, setReason] = useState('Estoy en un lugar seguro');

  return (
    <Sheet
      title="¿Estás a salvo?"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <>
          <Button icon="lock" onClick={() => dispatch({ type: 'stopSos', reason })}>
            Detener seguimiento
          </Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'closeSheet' })}>
            Mantener la alerta
          </Button>
        </>
      }
    >
      <p className="text-[11px] text-muted leading-[1.75]">
        Detener corta la ubicación compartida con tu círculo y la comunidad. La central conserva el
        incidente para cerrar su actuación de prueba.
      </p>
      {state.share.active && (
        <Note icon="lock">También se finalizará tu acompañamiento voluntario.</Note>
      )}
      <FieldLabel htmlFor="stopreason">Motivo de finalización</FieldLabel>
      <Select id="stopreason" value={reason} onChange={(e) => setReason(e.target.value)}>
        <option>Estoy en un lugar seguro</option>
        <option>Fue una activación de prueba</option>
        <option>No quiero seguir compartiendo</option>
      </Select>
    </Sheet>
  );
}

/** Consentimiento explícito para difundir la alerta a la comunidad. */
export function PublicShareDialog() {
  const { dispatch } = useDemo();
  return (
    <Sheet
      title="Compartir con personas cercanas"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <>
          <Button onClick={() => dispatch({ type: 'confirmPublic' })}>
            Compartir mi ubicación exacta
          </Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'closeSheet' })}>
            Mantener privada
          </Button>
        </>
      }
    >
      <Note icon="radar">
        Quienes reciban esta alerta comunitaria podrán ver tu ubicación exacta mientras esté activa.
        Podés retirar el permiso en cualquier momento.
      </Note>
    </Sheet>
  );
}
