import { useDemo } from '@/providers/DemoStateProvider';
import { activeProfile, followAllowed, followHasPosition, watchedAlert } from '@/providers/demoSelectors';
import { AppHeader } from '@/components/layout/AppHeader';
import { Screen } from '@/components/layout/PhoneFrame';
import { Badge } from '@/components/common/Badge';
import { Button, TextButton } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Tile } from '@/components/common/Tile';
import { VectorMap } from '@/components/map/VectorMap';
import { SosCard } from '@/components/sos/SosCard';
import { FamilyAlertCard } from '@/components/incidents/FamilyAlertCard';

/**
 * Inicio de la cuenta familiar.
 * Si alguien del círculo activa un SOS, la alerta ocupa el lugar principal,
 * en rojo y con ubicación. Si no hay alerta, muestra solo lo compartido.
 */
export function GuardianHomeScreen() {
  const { state, dispatch } = useDemo();
  const alert = watchedAlert(state);
  const me = activeProfile(state);
  const alerting = !!alert;
  const allowed = followAllowed(state);
  const myName = me?.name ?? 'Elena Ríos';

  return (
    <Screen>
      <AppHeader name={myName.split(' ')[0]} sub="Tu círculo, a un toque" />
      <Badge color={alerting ? 'red' : 'brand'}>
        <Icon name={alerting ? 'bell' : 'users'} size="sm" />
        {alerting ? 'ALERTA DEL CÍRCULO' : 'PERSPECTIVA DE FAMILIAR'}
      </Badge>

      {alerting ? (
        <FamilyAlertCard />
      ) : (
        <>
          <h1 className="mt-5 text-[29px] leading-[1.2] tracking-[-1.25px]">
            Cerca de quienes
            <br />
            <em className="not-italic text-brand">más querés.</em>
          </h1>
          <p className="mt-2 text-[10px] text-muted">
            {myName.split(' ')[0]} ve solo lo que la otra persona decide compartir.
          </p>
        </>
      )}

      <SosCard />

      {!alerting && (
        <Tile className="mt-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-[46px] h-[46px] rounded-[15px] bg-brand-soft text-brand">
              <Icon name="users" />
            </span>
            <div>
              <h3>Tu círculo de confianza</h3>
              <p className="text-[12px] text-muted mt-2">
                {allowed ? 'Cuenta vinculada · compartiendo' : 'Cuenta vinculada · sin ubicación'}
              </p>
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
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-2 p-4 rounded-[16px] bg-canvas text-center">
                  <Icon name="lock" className="text-brand" />
                  <strong className="text-[11px]">La ubicación es privada</strong>
                  <p className="text-[9px] text-muted">
                    Vincularse no habilita el rastreo.
                    <br />
                    La otra persona conserva el control.
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
      )}

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
          Escribir a tu círculo
        </Button>
      </Tile>

      <div className="mt-4">
        <Note icon="lock">
          Si la persona detiene el seguimiento, su ubicación desaparece de esta vista. El parentesco
          no reemplaza el consentimiento.
        </Note>
      </div>

      <TextButton className="mt-4" onClick={() => dispatch({ type: 'go', screen: 'roles' })}>
        <Icon name="users" size="sm" /> Cambiar de perfil o dispositivo
      </TextButton>
    </Screen>
  );
}
