import { useDemo } from '@/providers/DemoStateProvider';
import { activeProfile } from '@/providers/demoSelectors';
import { navigateTo, REGISTRY_PATH } from '@/lib/routes';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button, IconButton } from '@/components/common/Button';
import { MenuRow } from '@/components/common/Tile';

/** Mi cuenta: menú de la cuenta propia o de las perspectivas asociadas. */
export function ProfileScreen() {
  const { state, dispatch } = useDemo();
  const profile = activeProfile(state);
  const name = profile?.name ?? state.profile.name;
  const own = state.role === 'self';

  return (
    <Screen>
      <PageTop
        title="Mi cuenta"
        sub="Tu espacio. Tus decisiones."
        right={
          <IconButton
            icon="settings"
            label="Ajustes"
            onClick={() => dispatch({ type: 'go', screen: 'settings' })}
          />
        }
      />

      <div className="flex items-center gap-4 mb-4">
        <Avatar name={name} color={state.role === 'guardian' ? 'peach' : ''} size="lg" />
        <div>
          <h2>{name}</h2>
          <p className="text-[12px] text-muted mt-2">{profile?.relation ?? 'Minas, Lavalleja'}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge color="gray">CUENTA DE PRUEBA</Badge>
            {profile && <Badge>{profile.label.toUpperCase()}</Badge>}
          </div>
        </div>
      </div>

      {own ? (
        <>
          <div className="px-4 border border-line rounded-[19px] bg-paper">
            <MenuRow
              icon="user"
              title="Mis datos"
              sub="Identidad y forma de contacto"
              onClick={() => dispatch({ type: 'go', screen: 'accountedit' })}
            />
            <MenuRow
              icon="users"
              title="Cuentas vinculadas"
              sub={`${state.contacts.length} personas de confianza`}
              onClick={() => dispatch({ type: 'go', screen: 'circle' })}
            />
            <MenuRow
              icon="eye"
              title="Permitir seguir"
              sub={state.share.active ? 'Hay un permiso temporal activo' : 'Ubicación privada por defecto'}
              onClick={() => dispatch({ type: 'go', screen: state.share.active ? 'sharelive' : 'share' })}
            />
            <MenuRow
              icon="qr"
              title="Mi código QR"
              sub="Vincular sin compartir ubicación"
              onClick={() => dispatch({ type: 'go', screen: 'pair' })}
            />
          </div>
          <div className="px-4 mt-4 border border-line rounded-[19px] bg-paper">
            <MenuRow
              icon="lock"
              title="Privacidad y seguridad"
              sub="Quién puede ver qué"
              onClick={() => dispatch({ type: 'go', screen: 'privacy' })}
            />
            <MenuRow
              icon="mobile"
              title="Permisos del dispositivo"
              sub="Ubicación, avisos y cámara"
              onClick={() => dispatch({ type: 'go', screen: 'permissions' })}
            />
            <MenuRow
              icon="sun"
              title="Apariencia y accesibilidad"
              sub="Tema, texto y movimiento"
              onClick={() => dispatch({ type: 'go', screen: 'settings' })}
            />
            <MenuRow
              icon="file"
              title="Mis reportes"
              sub="Estados y comprobantes de prueba"
              onClick={() => dispatch({ type: 'go', screen: 'reports' })}
            />
          </div>
        </>
      ) : (
        <div className="px-4 border border-line rounded-[19px] bg-paper">
          <MenuRow
            icon={state.role === 'guardian' ? 'pin' : 'radar'}
            title={state.role === 'guardian' ? 'Seguir a Camila' : 'Ayuda cercana'}
            sub={state.role === 'guardian' ? 'Solo con permiso o alerta' : 'Alertas públicas de prueba'}
            onClick={() => dispatch({ type: 'go', screen: state.role === 'guardian' ? 'follow' : 'near' })}
          />
          <MenuRow
            icon="sun"
            title="Apariencia y accesibilidad"
            sub="Preferencias visuales de la demo"
            onClick={() => dispatch({ type: 'go', screen: 'settings' })}
          />
          <MenuRow
            icon="chat"
            title="Mensajes"
            sub="Comunicación de prueba"
            onClick={() =>
              dispatch({ type: 'openChat', target: state.role === 'guardian' ? 'circle' : 'community' })
            }
          />
        </div>
      )}

      <div className="px-4 mt-4 border border-line rounded-[19px] bg-paper">
        <MenuRow
          icon="lock"
          title="Pantalla bloqueada y SOS"
          sub={state.lockButton ? 'Botón activo al encender la pantalla' : 'Botón desactivado'}
          onClick={() => dispatch({ type: 'go', screen: 'lockscreen' })}
        />
        <MenuRow
          icon="users"
          title="Cambiar perfil"
          sub="Persona · círculo familiar · comunidad"
          onClick={() => dispatch({ type: 'go', screen: 'roles' })}
        />
        <MenuRow
          icon="shield"
          title="Registro de vigilantes"
          sub="Web independiente de altas comunitarias"
          onClick={() => navigateTo(REGISTRY_PATH)}
        />
        <MenuRow
          icon="help"
          title="Centro de ayuda"
          sub="Cómo funciona Botón Violeta"
          onClick={() => dispatch({ type: 'go', screen: 'help' })}
        />
        <MenuRow
          icon="beaker"
          title="Panel de demostración"
          sub="Cambiar de rol y probar escenarios"
          onClick={() => dispatch({ type: 'demoTools' })}
        />
        <MenuRow
          icon="info"
          title="Acerca de este prototipo"
          sub="Diseño, alcance y referencias"
          onClick={() => dispatch({ type: 'about' })}
        />
      </div>

      <Button
        variant="ghost"
        block
        icon="logout"
        className="mt-5"
        onClick={() => dispatch({ type: 'logout' })}
      >
        Salir de la cuenta de prueba
      </Button>
      <p className="text-center text-[9px] text-muted">Botón Violeta · Concepto Lavalleja · v0.1</p>
    </Screen>
  );
}
