import { useDemo } from '@/providers/DemoStateProvider';
import {
  liveAlert,
  received,
} from '@/providers/demoSelectors';
import { incidentStatusLabel } from '@/services/demoData';
import { Badge } from '@/components/common/Badge';
import { Icon } from '@/components/common/Icon';

function FlowNode({
  icon,
  title,
  sub,
  on,
}: {
  icon: string;
  title: string;
  sub: string;
  on: boolean;
}) {
  return (
    <div className="flex items-center gap-[10px] py-2">
      <span className="flex items-center justify-center w-[34px] h-[34px] rounded-[11px] bg-[#f3eef9] dark:bg-[#48305f] shrink-0">
        <Icon name={icon} className="w-[17px] h-[17px] text-brand" />
      </span>
      <div>
        <b className="block text-[10px]">{title}</b>
        <small className="block text-[9px] text-[#a18daf] mt-0.5">{sub}</small>
      </div>
      <i
        className={
          on
            ? 'ml-auto w-[6px] h-[6px] rounded-full bg-[#5c9e87] shadow-[0_0_0_4px_#5c9e8713]'
            : 'ml-auto w-[6px] h-[6px] rounded-full bg-[#d9d0e4]'
        }
      />
    </div>
  );
}

function Connector() {
  return <div className="h-[11px] border-l border-dashed border-[#d7c6e5] ml-[17px]" />;
}

/**
 * Inspector del studio: estado de la red en vivo y atajos de demostración.
 * Refleja quién ve qué, según los permisos otorgados.
 */
export function InspectorPanel() {
  const { state, dispatch } = useDemo();
  const a = liveAlert(state);
  const familySees = !!(a?.family && received(a));
  const communitySees = !!(a?.public && received(a));
  const sharing = state.share.active;

  return (
    <aside className="hidden lg:block w-full lg:max-w-[270px] xl:max-w-[306px] justify-self-end">
      <div className="p-5 bg-white/70 dark:bg-[#30263f]/70 border border-[#e4dceb] dark:border-[#4b375c] rounded-[22px] backdrop-blur-[15px]">
        <div className="flex items-center justify-between mb-[18px] text-[11px] font-bold">
          La red, en este momento
          <Badge color="green" live>
            EN VIVO
          </Badge>
        </div>
        <FlowNode
          icon="mobile"
          title="Camila · cuenta de prueba"
          sub={a ? 'SOS activado' : sharing ? 'Acompañamiento activo' : 'Ubicación privada'}
          on={!!a || sharing}
        />
        <Connector />
        <FlowNode
          icon="users"
          title="Círculo de confianza"
          sub={
            familySees
              ? 'Alerta disponible para su círculo'
              : sharing
                ? `${state.share.recipients.length} cuenta(s) autorizada(s)`
                : 'Sin acceso a su ubicación'
          }
          on={familySees || sharing}
        />
        <Connector />
        <FlowNode
          icon="radar"
          title="Comunidad cercana"
          sub={communitySees ? 'Alerta pública visible' : 'No ve la ubicación de Camila'}
          on={communitySees}
        />
        <Connector />
        <FlowNode
          icon="monitor"
          title="Central de coordinación"
          sub={a ? incidentStatusLabel(a.status) : 'Sin incidente de Camila'}
          on={!!a && received(a)}
        />
        <div className="flex items-start gap-2 pt-3 mt-3 border-t border-[#ede5f4] dark:border-[#4b375c] text-[9px] leading-[1.7] text-[#9e8bab] min-h-[36px]">
          <Icon name="activity" size="sm" className="mt-px" />
          {state.logs[0]?.text}
        </div>
      </div>

      <div className="p-5 mt-4 bg-white/70 dark:bg-[#30263f]/70 border border-[#e4dceb] dark:border-[#4b375c] rounded-[22px] backdrop-blur-[15px]">
        <div className="flex items-center justify-between mb-[18px] text-[11px] font-bold">
          Probá la experiencia
          <Icon name="beaker" size="sm" className="text-brand" />
        </div>
        <div className="flex flex-col gap-[6px]">
          <button
            type="button"
            onClick={() => dispatch({ type: 'demoFull' })}
            className="flex items-center gap-2 p-[11px] rounded-[10px] bg-[#f7f3fb] dark:bg-[#48305f] text-[#907ca1] dark:text-[#c2a2db] text-[10px] text-left hover:bg-[#ece3f7]"
          >
            <Icon name="play" size="sm" /> Iniciar un SOS comunitario de prueba
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'toggleIncoming' })}
            className="flex items-center gap-2 p-[11px] rounded-[10px] bg-[#f7f3fb] dark:bg-[#48305f] text-[#907ca1] dark:text-[#c2a2db] text-[10px] text-left hover:bg-[#ece3f7]"
          >
            <Icon name="bell" size="sm" />
            {state.incoming?.active ? 'Finalizar' : 'Recibir'} alerta de Sofi
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'toggleNetwork' })}
            className="flex items-center gap-2 p-[11px] rounded-[10px] bg-[#f7f3fb] dark:bg-[#48305f] text-[#907ca1] dark:text-[#c2a2db] text-[10px] text-left hover:bg-[#ece3f7]"
          >
            <Icon name={state.online ? 'offline' : 'wifi'} size="sm" />
            {state.online ? 'Simular pérdida de conexión' : 'Restablecer conexión'}
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'gallery' })}
            className="flex items-center gap-2 p-[11px] rounded-[10px] bg-[#f7f3fb] dark:bg-[#48305f] text-[#907ca1] dark:text-[#c2a2db] text-[10px] text-left hover:bg-[#ece3f7]"
          >
            <Icon name="layout" size="sm" /> Explorar todas las pantallas
          </button>
        </div>
        <div className="flex justify-center gap-[10px] mt-3">
          <button
            type="button"
            onClick={() => dispatch({ type: 'about' })}
            className="text-[9px] p-[5px] text-[#a08bb0]"
          >
            Sobre la demo
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'resetConfirm' })}
            className="text-[9px] p-[5px] text-[#a08bb0]"
          >
            Reiniciar
          </button>
        </div>
      </div>

      <p className="flex items-center justify-center gap-2 mt-[14px] text-[9px] text-[#ac9bb9]">
        <Icon name="lock" size="sm" /> Datos ficticios. Sin servicios conectados.
      </p>
    </aside>
  );
}
