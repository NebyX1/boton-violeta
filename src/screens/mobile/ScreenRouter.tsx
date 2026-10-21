import { useDemoState } from '@/providers/DemoStateProvider';
import type { ComponentType } from 'react';
import type { ScreenName } from '@/types/demo';
import { HomeScreen } from '@/screens/mobile/HomeScreen';
import { GuardianHomeScreen } from '@/screens/mobile/GuardianHomeScreen';
import { CommunityHomeScreen } from '@/screens/mobile/CommunityHomeScreen';
import { NearScreen } from '@/screens/mobile/NearScreen';
import { CircleScreen } from '@/screens/mobile/CircleScreen';
import { ContactScreen } from '@/screens/mobile/ContactScreen';
import { PairScreen } from '@/screens/mobile/PairScreen';
import { ShareScreen } from '@/screens/mobile/ShareScreen';
import { ShareLiveScreen } from '@/screens/mobile/ShareLiveScreen';
import { FollowScreen } from '@/screens/mobile/FollowScreen';
import { ActivityScreen } from '@/screens/mobile/ActivityScreen';
import { ProfileScreen } from '@/screens/mobile/ProfileScreen';
import { AccountEditScreen } from '@/screens/mobile/AccountEditScreen';
import { SettingsScreen } from '@/screens/mobile/SettingsScreen';
import { PrivacyScreen } from '@/screens/mobile/PrivacyScreen';
import { PermissionsScreen } from '@/screens/mobile/PermissionsScreen';
import { ReportScreen } from '@/screens/mobile/ReportScreen';
import { ReportsScreen } from '@/screens/mobile/ReportsScreen';
import { ReportDetailScreen } from '@/screens/mobile/ReportDetailScreen';
import { ReportSuccessScreen } from '@/screens/mobile/ReportSuccessScreen';
import { SosScreen } from '@/screens/mobile/SosScreen';
import { EndedScreen } from '@/screens/mobile/EndedScreen';
import { IncidentScreen } from '@/screens/mobile/IncidentScreen';
import { ChatScreen } from '@/screens/mobile/ChatScreen';
import { OnboardingScreen } from '@/screens/mobile/OnboardingScreen';
import { LoginScreen } from '@/screens/mobile/LoginScreen';
import { RegisterScreen } from '@/screens/mobile/RegisterScreen';
import { CallScreen } from '@/screens/mobile/CallScreen';
import { HelpScreen } from '@/screens/mobile/HelpScreen';
import { PlacesScreen } from '@/screens/mobile/PlacesScreen';
import { RoleSelectionScreen } from '@/screens/mobile/RoleSelectionScreen';

const screens: Record<ScreenName, ComponentType> = {
  home: HomeScreen,
  near: NearScreen,
  alerts: NearScreen,
  circle: CircleScreen,
  contact: ContactScreen,
  pair: PairScreen,
  share: ShareScreen,
  sharelive: ShareLiveScreen,
  follow: FollowScreen,
  activity: ActivityScreen,
  profile: ProfileScreen,
  accountedit: AccountEditScreen,
  settings: SettingsScreen,
  privacy: PrivacyScreen,
  permissions: PermissionsScreen,
  report: ReportScreen,
  reports: ReportsScreen,
  reportdetail: ReportDetailScreen,
  reportsuccess: ReportSuccessScreen,
  sos: SosScreen,
  ended: EndedScreen,
  incident: IncidentScreen,
  chat: ChatScreen,
  onboarding: OnboardingScreen,
  roles: RoleSelectionScreen,
  login: LoginScreen,
  register: RegisterScreen,
  call: CallScreen,
  help: HelpScreen,
  places: PlacesScreen,
};

/**
 * Encaminador de pantallas de la app móvil.
 * El "home" cambia según la perspectiva activa (persona, familiar o comunidad).
 */
export function ScreenRouter() {
  const state = useDemoState();
  if (state.screen === 'home') {
    const Home =
      state.role === 'guardian'
        ? GuardianHomeScreen
        : state.role === 'community'
          ? CommunityHomeScreen
          : HomeScreen;
    return <Home />;
  }
  const Screen = screens[state.screen] ?? HomeScreen;
  return <Screen />;
}
