import type { ComponentType } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { GlobalOverlay, PhoneOverlay, Sheet } from '@/components/common/Sheet';
import {
  AboutDialog,
  DemoToolsDialog,
  FaqDialog,
  GalleryDialog,
  ReadinessDialog,
  ResetDialog,
} from '@/components/dialogs/DemoDialogs';
import {
  AlreadySosDialog,
  CountdownDialog,
  PublicShareDialog,
  SosOptionsDialog,
  StopSosDialog,
} from '@/components/dialogs/SosDialogs';
import {
  CopyCodeDialog,
  IncomingDialog,
  PairDialog,
  UnlinkDialog,
} from '@/components/dialogs/ContactDialogs';
import { GpsDialog, StopShareDialog } from '@/components/dialogs/ShareDialogs';
import {
  HelpOfferDialog,
  HelpStatusDialog,
  PlaceDialog,
  RadiusDialog,
} from '@/components/dialogs/CommunityDialogs';
import {
  GoogleDialog,
  KeypadDialog,
  LogoutDialog,
  RecoverDialog,
} from '@/components/dialogs/AccountDialogs';
import {
  AssignmentsDialog,
  AssignUnitDialog,
  ClosureDetailDialog,
  ClosureDialog,
  LayersDialog,
  NewUnitDialog,
  OperatorChatDialog,
  OperatorReportDialog,
  PersonDialog,
  UnitInfoDialog,
} from '@/components/dialogs/ConsoleDialogs';

const dialogs: Record<string, ComponentType> = {
  'sos-options': SosOptionsDialog,
  already: AlreadySosDialog,
  countdown: CountdownDialog,
  'stop-sos': StopSosDialog,
  public: PublicShareDialog,
  'demo-tools': DemoToolsDialog,
  gallery: GalleryDialog,
  about: AboutDialog,
  faq: FaqDialog,
  readiness: ReadinessDialog,
  reset: ResetDialog,
  pair: PairDialog,
  unlink: UnlinkDialog,
  copy: CopyCodeDialog,
  incoming: IncomingDialog,
  gps: GpsDialog,
  stopshare: StopShareDialog,
  radius: RadiusDialog,
  'help-offer': HelpOfferDialog,
  helpstatus: HelpStatusDialog,
  place: PlaceDialog,
  google: GoogleDialog,
  recover: RecoverDialog,
  logout: LogoutDialog,
  keypad: KeypadDialog,
  'operator-chat': OperatorChatDialog,
  'operator-report': OperatorReportDialog,
  assign: AssignUnitDialog,
  closure: ClosureDialog,
  'closure-detail': ClosureDetailDialog,
  person: PersonDialog,
  'unit-info': UnitInfoDialog,
  assignments: AssignmentsDialog,
  newunit: NewUnitDialog,
  layers: LayersDialog,
};

/**
 * Capa de diálogos: dentro del teléfono para las perspectivas móviles,
 * y como diálogo global para la consola institucional.
 */
export function DialogHost() {
  const { state } = useDemo();
  if (!state.sheet) return null;
  const Dialog = dialogs[state.sheet];
  if (!Dialog) return null;

  return state.role === 'operator' ? (
    <GlobalOverlay>
      <Dialog />
    </GlobalOverlay>
  ) : (
    <PhoneOverlay>
      <Dialog />
    </PhoneOverlay>
  );
}

/** Fallback de diálogo sin contenido específico. */
export function EmptyDialog({ title }: { title: string }) {
  const { dispatch } = useDemo();
  return (
    <Sheet title={title} onClose={() => dispatch({ type: 'closeSheet' })}>
      <p />
    </Sheet>
  );
}
