import { useDemo } from '@/providers/DemoStateProvider';
import { nearAlerts, activeProfile } from '@/providers/demoSelectors';
import { AppHeader } from '@/components/layout/AppHeader';
import { Screen } from '@/components/layout/PhoneFrame';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Tile } from '@/components/common/Tile';
import { Toggle } from '@/components/common/Toggle';
import { MapLabel, VectorMap } from '@/components/map/VectorMap';
import { IncidentCard } from '@/components/incidents/IncidentCard';
import { formatRadius } from '@/lib/geo';
import { SosCard } from '@/components/sos/SosCard';

/** Inicio de la perspectiva comunitaria (Nicolás): ayuda cercana sin exponerse. */
export function CommunityHomeScreen() {
  const { state, dispatch } = useDemo();
  const alerts = nearAlerts(state);
  const me = activeProfile(state)?.name ?? 'Nicolás Pérez';

  return (
    <Screen>
      <AppHeader name={me.split(' ')[0]} sub="La ayuda empieza cerca" />
      <Badge color="green">
        <Icon name="radar" size="sm" /> PERSPECTIVA DE COMUNIDAD
      </Badge>
      <h1 className="mt-5 text-[29px] leading-[1.2] tracking-[-1.25px]">
        Hay una forma
        <br />
        <em className="not-italic text-brand">de estar cerca.</em>
      </h1>
      <p className="mt-2 text-[10px] text-muted">
        Conectate con quienes piden apoyo a tu alrededor.
      </p>

      <SosCard />

      <Tile className="mt-5">
        <div className="flex items-center justify-between gap-[10px]">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-green-soft text-green">
              <Icon name="hand" />
            </span>
            <div>
              <strong className="text-[11px]">Disponible para ayudar</strong>
              <p className="text-[10px] text-muted">Preferencia de demostración</p>
            </div>
          </div>
          <Toggle
            on={state.helperAvailable}
            label="Disponible para ayudar"
            onToggle={() => dispatch({ type: 'toggleHelperAvailable' })}
          />
        </div>
      </Tile>

      <div className="mt-4">
        <VectorMap
          ctx="community"
          variant="big"
          label={
            <MapLabel
              icon={<i className="w-[6px] h-[6px] rounded-full bg-brand animate-pulse-live" />}
              title={`${alerts.length} alertas comunitarias`}
              sub={`Radio ${formatRadius(state.radius)} · datos ficticios`}
            />
          }
        />
      </div>

      <div className="flex items-center justify-between gap-2 mt-[23px] mb-3">
        <h3 className="text-[13px]">Alguien cerca necesita apoyo</h3>
      </div>
      <div className="flex flex-col gap-3">
        {alerts.map((a) => (
          <IncidentCard
            key={a.id}
            incident={a}
            onOpen={(id) => dispatch({ type: 'openIncident', id })}
          />
        ))}
        {!alerts.length && (
          <EmptyState
            title="Sin alertas visibles"
            text="No hay alertas comunitarias en este escenario."
            icon="shield"
          />
        )}
      </div>

      <div className="mt-4">
        <Note icon="heart" color="green">
          Ayudar puede ser ofrecer un lugar seguro o contactar a la central. No implica confrontar ni
          perseguir a nadie.
        </Note>
      </div>
    </Screen>
  );
}
