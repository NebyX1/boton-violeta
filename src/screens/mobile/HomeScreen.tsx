import { useDemo } from '@/providers/DemoStateProvider';
import { alertContacts, liveAlert, nearbyFeed } from '@/providers/demoSelectors';
import { incidentStatusLabel } from '@/services/demoData';

import { AppHeader } from '@/components/layout/AppHeader';
import { Screen } from '@/components/layout/PhoneFrame';
import { Note } from '@/components/common/Note';
import { Icon } from '@/components/common/Icon';
import { TextButton } from '@/components/common/Button';
import { Elapsed } from '@/components/common/Clock';
import { SosCard } from '@/components/sos/SosCard';
import { ContactPreview } from '@/components/contacts/ContactCard';
import { MapLabel, VectorMap } from '@/components/map/VectorMap';

/**
 * Inicio de la cuenta propia (Camila).
 * El botón SOS es el centro de la experiencia; la ubicación es privada por defecto.
 */
export function HomeScreen() {
  const { state, dispatch } = useDemo();
  const alert = liveAlert(state);
  const shared = state.share.active;

  return (
    <Screen>
      <AppHeader name={state.profile.name.split(' ')[0]} />

      {!state.online && (
        <div className="mb-4">
          <Note icon="offline" color="amber">
            Sin conexión de prueba. Una alerta nueva queda pendiente, no recibida.
          </Note>
        </div>
      )}

      {alert && (
        <button
          type="button"
          onClick={() => dispatch({ type: 'go', screen: 'sos' })}
          className="flex items-center gap-[10px] w-full p-3 rounded-[14px] bg-red-soft text-left"
        >
          <Icon name="radar" className="text-red" />
          <span className="flex-1 min-w-0">
            <strong className="block text-[11px]">SOS de prueba activo</strong>
            <small className="block text-[9px] text-muted mt-0.5">
              {incidentStatusLabel(alert.status)} · <Elapsed since={alert.started} />
            </small>
          </span>
          <Icon name="chev" size="sm" />
        </button>
      )}

      <button
        type="button"
        onClick={() => dispatch({ type: 'go', screen: shared ? 'sharelive' : 'privacy' })}
        className="inline-flex items-center gap-[6px] mt-3 px-[9px] py-[6px] rounded-[30px] bg-green-soft text-green text-[8px] font-[650]"
      >
        <Icon name={shared || alert ? 'eye' : 'lock'} className="w-3 h-3" />
        {shared
          ? `Compartiendo con ${state.share.recipients.length} persona(s)`
          : alert
            ? 'Tu alerta está activa'
            : 'Tu ubicación es privada'}
        <Icon name="chev" className="w-3 h-3" />
      </button>

      <h1 className="mt-5 text-[29px] leading-[1.2] tracking-[-1.25px]">
        No tenés que
        <br />
        <em className="not-italic text-brand">estar sola.</em>
      </h1>
      <p className="mt-2 text-[10px] text-muted">Tu red de cuidado está a un botón de distancia.</p>

      <SosCard />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          type="button"
          onClick={() => dispatch({ type: 'go', screen: shared ? 'sharelive' : 'share' })}
          className="flex flex-col items-start gap-3 p-[15px] rounded-[18px] border border-line bg-paper text-left"
        >
          <span className="flex items-center justify-center w-[34px] h-[34px] rounded-[11px] bg-brand-soft text-brand">
            <Icon name="walk" size="sm" className="w-[19px] h-[19px]" />
          </span>
          <div>
            <strong className="block text-[11px]">{shared ? 'Te acompañan' : 'Acompañame'}</strong>
            <small className="block text-[9px] text-muted mt-[3px]">Compartí un trayecto</small>
          </div>
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'newReport' })}
          className="flex flex-col items-start gap-3 p-[15px] rounded-[18px] border border-line bg-paper text-left"
        >
          <span className="flex items-center justify-center w-[34px] h-[34px] rounded-[11px] bg-green-soft text-green">
            <Icon name="file" size="sm" className="w-[19px] h-[19px]" />
          </span>
          <div>
            <strong className="block text-[11px]">Informar un hecho</strong>
            <small className="block text-[9px] text-muted mt-[3px]">Reporte o denuncia</small>
          </div>
        </button>
      </div>

      {nearbyFeed(state).some((a) => a.kind === 'medical') && (
        <button
          type="button"
          onClick={() => dispatch({ type: 'go', screen: 'near' })}
          className="flex items-center gap-[10px] w-full text-left p-3 mt-3 rounded-[14px] bg-red-soft"
        >
          <Icon name="medical" className="text-red shrink-0" />
          <span className="flex-1 min-w-0">
            <strong className="block text-[11px]">
              {nearbyFeed(state).filter((a) => a.kind === 'medical').length} alerta
              {nearbyFeed(state).filter((a) => a.kind === 'medical').length > 1 ? 's' : ''} de
              asistencia cerca de vos
            </strong>
            <small className="block text-[9px] text-muted mt-0.5">
              Personas que necesitan ayuda ahora. Tocá para verlas y ofrecer apoyo.
            </small>
          </span>
          <Icon name="chev" size="sm" className="text-muted" />
        </button>
      )}

      <div className="flex items-center justify-between gap-2 mt-[23px] mb-3">
        <h3 className="text-[13px]">Tu círculo de confianza</h3>
        <TextButton onClick={() => dispatch({ type: 'go', screen: 'circle' })}>
          Ver todo <Icon name="arrow" size="sm" />
        </TextButton>
      </div>
      <ContactPreview
        contacts={state.contacts}
        onOpen={() => dispatch({ type: 'go', screen: 'circle' })}
      />

      <div className="flex items-center justify-between gap-2 mt-[23px] mb-3">
        <h3 className="text-[13px]">Una comunidad que acompaña</h3>
        <TextButton onClick={() => dispatch({ type: 'go', screen: 'near' })}>
          Explorar <Icon name="arrow" size="sm" />
        </TextButton>
      </div>
      <VectorMap
        ctx="home"
        variant="mini"
        label={
          <MapLabel
            icon={<Icon name="store" size="sm" className="w-3 h-3 text-green" />}
            title="Espacios de apoyo"
            sub="2 puntos ficticios para explorar"
          />
        }
      />

      <div className="mt-4">
        <Note icon="beaker" color="gray">
          Demostración con personas y ubicaciones ficticias. No hay servicios de emergencia
          conectados.
        </Note>
      </div>

      <p className="sr-only">{alertContacts(state).length} contactos habilitados para SOS.</p>
    </Screen>
  );
}
