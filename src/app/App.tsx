import { DemoStateProvider, useDemo } from '@/providers/DemoStateProvider';
import { StudioLayout } from '@/components/layout/StudioLayout';
import { PhoneFrame } from '@/components/layout/PhoneFrame';
import { ConsoleLayout } from '@/components/console/ConsoleLayout';
import { DashboardScreen } from '@/screens/console/DashboardScreen';
import { IncidentsScreen } from '@/screens/console/IncidentsScreen';
import { ReportsScreen as ConsoleReportsScreen } from '@/screens/console/ReportsScreen';
import { PeopleScreen } from '@/screens/console/PeopleScreen';
import { ResourcesScreen } from '@/screens/console/ResourcesScreen';
import { AuditScreen } from '@/screens/console/AuditScreen';
import { ConfigScreen } from '@/screens/console/ConfigScreen';
import { ScreenRouter } from '@/screens/mobile/ScreenRouter';
import { DialogHost } from '@/components/dialogs/DialogHost';
import { Toast } from '@/components/common/Toast';

function ConsoleView() {
  const { state } = useDemo();
  const tabs = {
    overview: DashboardScreen,
    incidents: IncidentsScreen,
    reports: ConsoleReportsScreen,
    people: PeopleScreen,
    resources: ResourcesScreen,
    audit: AuditScreen,
    config: ConfigScreen,
  } as const;
  const Tab = tabs[state.consoleTab] ?? DashboardScreen;
  return (
    <ConsoleLayout>
      <Tab />
    </ConsoleLayout>
  );
}

function DemoView() {
  const { state } = useDemo();
  if (state.role === 'operator') {
    return (
      <>
        <ConsoleView />
        <DialogHost />
        {state.toast && <Toast text={state.toast} variant="global" />}
      </>
    );
  }

  return (
    <StudioLayout>
      <PhoneFrame>
        <ScreenRouter />
        <DialogHost />
        {state.toast && <Toast text={state.toast} variant="phone" />}
      </PhoneFrame>
    </StudioLayout>
  );
}

/**
 * Botón Violeta · prototipo interactivo de una red de cuidado para Lavalleja.
 * Personas, alertas, ubicaciones y servicios ficticios; no es un canal de emergencia.
 */
export default function App() {
  return (
    <DemoStateProvider>
      <DemoView />
    </DemoStateProvider>
  );
}
