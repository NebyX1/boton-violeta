import { useDemo } from '@/providers/DemoStateProvider';
import { nearAlerts, watchedAlert } from '@/providers/demoSelectors';
import { formatTime } from '@/lib/format';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Chip, Chips } from '@/components/common/Segmented';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { IconButton } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { IncidentCard } from '@/components/incidents/IncidentCard';

/** Actividad: notificaciones, alertas entrantes y reportes en un solo lugar. */
export function ActivityScreen() {
  const { state, dispatch } = useDemo();
  const watched = watchedAlert(state);
  const list = state.notifications.filter(
    (n) => (n.role ?? 'self') === state.role && (state.activityFilter !== 'unread' || !n.read),
  );

  return (
    <Screen>
      <PageTop
        title="Tu actividad"
        sub="Lo importante, en un mismo lugar"
        right={
          <IconButton
            icon="check2"
            label="Marcar todo como leído"
            onClick={() => dispatch({ type: 'readAll' })}
          />
        }
      />

      <Chips className="mb-4">
        <Chip
          label="Todas"
          active={state.activityFilter === 'all'}
          onClick={() => dispatch({ type: 'setActivityFilter', filter: 'all' })}
        />
        <Chip
          label="Sin leer"
          active={state.activityFilter === 'unread'}
          onClick={() => dispatch({ type: 'setActivityFilter', filter: 'unread' })}
        />
        {state.role === 'self' && (
          <Chip label="Mis reportes" active={false} onClick={() => dispatch({ type: 'go', screen: 'reports' })} />
        )}
      </Chips>

      {state.role === 'guardian' && watched && (
        <button
          type="button"
          onClick={() => dispatch({ type: 'go', screen: 'follow' })}
          className="flex items-start gap-[11px] w-full text-left p-3 mb-3 rounded-[16px] border-2 border-[#d52f55] bg-[#ffe4ea] shadow-[0_8px_20px_#d52f5522]"
        >
          <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-[#d52f55] text-white shrink-0">
            <Icon name="bell" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="flex items-center gap-1 text-[8px] font-extrabold tracking-[0.8px] text-[#b71339]">
              <i className="h-[5px] w-[5px] rounded-full bg-[#d52f55] animate-pulse-live" />
              SOS ACTIVO
            </span>
            <strong className="mt-[2px] block text-[13px] text-[#8f1836]">
              {watched.name.split(' ')[0]} necesita ayuda
            </strong>
            <p className="text-[10px] text-[#a34a63] mt-1">
              Activó una alerta de prueba. Tenés acceso temporal a su ubicación.
            </p>
            <span className="mt-1 block text-[9px] font-bold text-[#b71339]">
              Ver la alerta completa →
            </span>
          </span>
          <Badge color="red" live>
            NUEVA
          </Badge>
        </button>
      )}

      {state.role === 'community' && (
        <div className="flex flex-col gap-3 mb-3">
          {nearAlerts(state).map((i) => (
            <IncidentCard
              key={i.id}
              incident={i}
              onOpen={(id) => dispatch({ type: 'openIncident', id })}
            />
          ))}
        </div>
      )}

      {state.role === 'self' && state.incoming?.active && (
        <button
          type="button"
          onClick={() => dispatch({ type: 'viewIncoming' })}
          className="flex items-start gap-[11px] w-full text-left p-3 mb-3 rounded-[15px] border border-line bg-paper"
        >
          <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-red-soft text-red shrink-0">
            <Icon name="radar" />
          </span>
          <span className="flex-1 min-w-0">
            <strong className="block text-[12px]">Sofi activó un SOS</strong>
            <p className="text-[10px] text-muted mt-1">
              Una amiga de tu círculo solicita ayuda.
            </p>
            <time className="block text-[9px] text-muted mt-1">Hace un momento · demo</time>
          </span>
        </button>
      )}

      {list.map((n) => (
        <button
          key={n.id}
          type="button"
          onClick={() => dispatch({ type: 'openNotification', id: n.id })}
          className={`flex items-start gap-[11px] w-full text-left p-3 mb-3 rounded-[15px] border border-line bg-paper ${
            n.read ? '' : 'border-brand-soft bg-brand-soft/40'
          }`}
        >
          <span
            className={`flex items-center justify-center w-[39px] h-[39px] rounded-[13px] shrink-0 ${
              n.icon === 'bell' ? 'bg-red-soft text-red' : 'bg-brand-soft text-brand'
            }`}
          >
            <Icon name={n.icon} />
          </span>
          <span className="flex-1 min-w-0">
            <strong className="block text-[12px]">{n.title}</strong>
            <p className="text-[10px] text-muted mt-1">{n.text}</p>
            <time className="block text-[9px] text-muted mt-1">
              {formatTime(n.time)} · demostración
            </time>
          </span>
          {!n.read && <i className="w-[6px] h-[6px] rounded-full bg-brand mt-[5px]" />}
        </button>
      ))}

      {!list.length && state.role === 'self' && !state.incoming?.active && (
        <EmptyState title="Todo al día" text="No quedan notificaciones en esta vista." icon="check2" />
      )}
      {!list.length && state.role === 'guardian' && !watched && (
        <EmptyState
          title="Sin avisos pendientes"
          text="Camila puede avisarte mediante su SOS."
          icon="bell"
        />
      )}
    </Screen>
  );
}
