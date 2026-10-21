import { useDemo } from '@/providers/DemoStateProvider';
import { liveAlert, received } from '@/providers/demoSelectors';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Tile } from '@/components/common/Tile';

/**
 * Privacidad: qué ve cada audiencia en este momento.
 * No hay seguimiento permanente por estar registrada o tener cuentas vinculadas.
 */
export function PrivacyScreen() {
  const { state, dispatch } = useDemo();
  const a = liveAlert(state);

  const audiences: Array<{ icon: string; title: string; sub: string; on: boolean }> = [
    {
      icon: 'users',
      title: 'Tu círculo',
      sub: 'Por SOS o permiso individual.',
      on: !!((a?.family && received(a)) || state.share.active),
    },
    {
      icon: 'radar',
      title: 'Personas cercanas',
      sub: 'Solo si elegís alerta comunitaria.',
      on: !!(a?.public && received(a)),
    },
    {
      icon: 'monitor',
      title: 'Central',
      sub: 'Durante un incidente comunicado.',
      on: !!(a && received(a)),
    },
  ];

  return (
    <Screen>
      <PageTop title="Vos tenés el control" sub="Privacidad, clara y visible" />

      <Tile tinted className="text-center">
        <span className="flex items-center justify-center w-[57px] h-[57px] mx-auto mb-3 rounded-[18px] bg-white/45 text-brand">
          <Icon name={state.share.active || a ? 'eye' : 'lock'} size="lg" />
        </span>
        <h2 className="text-[20px]">
          {state.share.active || a ? 'Compartís por tu decisión' : 'Tu ubicación es privada'}
        </h2>
        <p className="text-[12px] text-muted mt-2">
          No hay seguimiento permanente por estar registrada o tener cuentas vinculadas.
        </p>
      </Tile>

      <div className="flex items-center justify-between gap-2 mt-[23px] mb-3">
        <h3 className="text-[13px]">Quién puede ver tu ubicación</h3>
      </div>
      <Tile>
        {audiences.map((item) => (
          <div key={item.title} className="flex items-center gap-[11px] py-[15px] border-b border-line last:border-b-0">
            <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-brand-soft text-brand shrink-0">
              <Icon name={item.icon} />
            </span>
            <div className="flex-1 min-w-0">
              <strong className="block text-[12px]">{item.title}</strong>
              <small className="block text-[10px] text-muted mt-1">{item.sub}</small>
            </div>
            <Badge color={item.on ? 'green' : 'gray'}>{item.on ? 'Activo' : 'Sin acceso'}</Badge>
          </div>
        ))}
      </Tile>

      <div className="px-4 mt-4 border border-line rounded-[19px] bg-paper">
        <button
          type="button"
          onClick={() => dispatch({ type: 'sosOptions' })}
          className="flex items-center gap-[11px] w-full text-left py-[15px] border-b border-line"
        >
          <span className="flex items-center justify-center w-[31px] h-[31px] rounded-[13px] bg-brand-soft text-brand">
            <Icon name="bell" size="sm" />
          </span>
          <span className="flex-1 min-w-0">
            <strong className="block text-[12px]">Audiencia de mi SOS</strong>
            <small className="block text-[10px] text-muted mt-1">Configurá a quién avisar</small>
          </span>
          <Icon name="chev" size="sm" className="text-muted" />
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'go', screen: 'circle' })}
          className="flex items-center gap-[11px] w-full text-left py-[15px] border-b border-line"
        >
          <span className="flex items-center justify-center w-[31px] h-[31px] rounded-[13px] bg-brand-soft text-brand">
            <Icon name="users" size="sm" />
          </span>
          <span className="flex-1 min-w-0">
            <strong className="block text-[12px]">Administrar cada vínculo</strong>
            <small className="block text-[10px] text-muted mt-1">Permisos y desvinculación</small>
          </span>
          <Icon name="chev" size="sm" className="text-muted" />
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'go', screen: state.share.active ? 'sharelive' : 'share' })}
          className="flex items-center gap-[11px] w-full text-left py-[15px]"
        >
          <span className="flex items-center justify-center w-[31px] h-[31px] rounded-[13px] bg-brand-soft text-brand">
            <Icon name="clock" size="sm" />
          </span>
          <span className="flex-1 min-w-0">
            <strong className="block text-[12px]">Sesión de seguimiento</strong>
            <small className="block text-[10px] text-muted mt-1">
              {state.share.active ? 'Sesión activa' : 'No estás compartiendo'}
            </small>
          </span>
          <Icon name="chev" size="sm" className="text-muted" />
        </button>
      </div>

      <div className="mt-5">
        <Note icon="lock" color="gray">
          Los datos de este prototipo viven solo en la memoria de esta pestaña. Recargar borra la
          sesión. No ingreses información real ni sensible.
        </Note>
      </div>
      <Button
        variant="outline"
        block
        className="mt-4"
        onClick={() => dispatch({ type: 'resetConfirm' })}
      >
        Borrar y reiniciar esta demostración
      </Button>
    </Screen>
  );
}
