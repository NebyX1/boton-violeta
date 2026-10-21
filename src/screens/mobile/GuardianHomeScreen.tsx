import { useDemo } from '@/providers/DemoStateProvider';
import { followAllowed, followHasPosition, liveAlert, received } from '@/providers/demoSelectors';
import { AppHeader } from '@/components/layout/AppHeader';
import { Screen } from '@/components/layout/PhoneFrame';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button, TextButton } from '@/components/common/Button';
import { Elapsed } from '@/components/common/Clock';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Tile } from '@/components/common/Tile';
import { VectorMap } from '@/components/map/VectorMap';
import { SosCard } from '@/components/sos/SosCard';

/**
 * Inicio de la cuenta familiar (Elena).
 * Solo ve lo que Camila decide compartir: vincular no habilita el rastreo.
 */
export function GuardianHomeScreen() {
  const { state, dispatch } = useDemo();
  const alert = liveAlert(state);
  const alerting = !!(alert && received(alert) && alert.family && alert.recipients?.includes('elena'));
  const allowed = followAllowed(state);

  return (
    <Screen>
      <AppHeader name="Elena" sub="Tu círculo, a un toque" />
      <Badge>
        <Icon name="users" size="sm" /> PERSPECTIVA DE FAMILIAR
      </Badge>
      <h1 className="mt-5 text-[29px] leading-[1.2] tracking-[-1.25px]">
        Cerca de quienes
        <br />
        <em className="not-italic text-brand">más querés.</em>
      </h1>
      <p className="mt-2 text-[10px] text-muted">Elena ve solo lo que Camila decide compartir.</p>

      <SosCard />

      {alerting && (
        <div className="flex items-center gap-[10px] p-3 mt-5 rounded-[14px] bg-red-soft">
          <Icon name="bell" className="text-red" />
          <div className="flex-1 min-w-0">
            <strong className="block text-[11px]">Camila activó un SOS</strong>
            <small className="block text-[9px] text-muted mt-0.5">
              Alerta de prueba · <Elapsed since={alert!.started} />
            </small>
          </div>
          <Badge color="red" live>
            NUEVA
          </Badge>
        </div>
      )}

      <Tile className="mt-5">
        <div className="flex items-center gap-3">
          <Avatar name={state.profile.name} size="lg" />
          <div>
            <h3>{state.profile.name.split(' ')[0]}</h3>
            <p className="text-[12px] text-muted mt-2">Cuenta vinculada · familiar</p>
            <div className="mt-2">
              <Badge color={allowed ? 'green' : 'gray'}>
                {allowed ? 'Compartiendo ubicación' : 'Ubicación privada'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-5">
          {allowed ? (
            <>
              {followHasPosition(state) ? (
                <VectorMap ctx="follow" variant="mini" />
              ) : (
                <Note icon="pin" color="amber">
                  Alerta recibida sin coordenadas. No se muestra una posición inventada.
                </Note>
              )}
              <Button
                block
                icon="pin"
                className="mt-3"
                onClick={() => dispatch({ type: 'go', screen: 'follow' })}
              >
                Ver ubicación en vivo
              </Button>
              {alerting && (
                <Button
                  variant="secondary"
                  block
                  className="mt-2"
                  onClick={() => dispatch({ type: 'familyAck' })}
                >
                  {alert!.familyAck ? 'Recepción confirmada' : 'Confirmar que vi la alerta'}
                </Button>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-2 p-4 rounded-[16px] bg-canvas text-center">
                <Icon name="lock" className="text-brand" />
                <strong className="text-[11px]">Camila no está compartiendo</strong>
                <p className="text-[9px] text-muted">
                  Vincularse no habilita el rastreo.
                  <br />
                  Ella conserva el control.
                </p>
              </div>
              <Button
                variant="outline"
                block
                icon="send"
                className="mt-3"
                onClick={() => dispatch({ type: 'requestLocation' })}
              >
                Pedirle que comparta
              </Button>
            </>
          )}
        </div>
      </Tile>

      <Tile className="mt-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-brand-soft text-brand">
            <Icon name="chat" />
          </span>
          <div>
            <h3 className="text-[13px]">Un mensaje también acompaña</h3>
            <p className="text-[12px] text-muted mt-2">Un canal con tu círculo.</p>
          </div>
        </div>
        <Button
          variant="secondary"
          block
          className="mt-4"
          onClick={() => dispatch({ type: 'openChat', target: 'circle' })}
        >
          Escribirle a Camila
        </Button>
      </Tile>

      <div className="mt-4">
        <Note icon="lock">
          Si Camila detiene el seguimiento, su ubicación desaparece de esta vista. El parentesco no
          reemplaza el consentimiento.
        </Note>
      </div>

      <TextButton className="mt-4" onClick={() => dispatch({ type: 'setRole', role: 'self' })}>
        <Icon name="mobile" size="sm" /> Volver a la cuenta de Camila
      </TextButton>
    </Screen>
  );
}
