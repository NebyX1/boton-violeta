import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { ChatComposer, ChatThread, QuickReplies } from '@/components/chat/Chat';
import { Note } from '@/components/common/Note';

const channelNames: Record<string, string> = {
  central: 'Central Violeta',
  circle: 'Tu círculo',
  community: 'Apoyo comunitario',
};

/** Mensajería simulada por canal (central, círculo o comunidad). */
export function ChatScreen() {
  const { state, dispatch } = useDemo();
  const target = state.chatTarget;
  const name =
    target === 'circle' && state.role === 'guardian' ? 'Camila' : (channelNames[target] ?? 'Chat');

  return (
    <Screen>
      <PageTop title={name} sub="Mensajería simulada · sin servicio real" />
      <Note icon="lock" color="gray">
        No ingreses datos reales. Los mensajes se mantienen solo en esta pestaña.
      </Note>

      <div className="flex flex-col gap-[10px] my-4">
        <ChatThread target={target} />
      </div>

      <QuickReplies onSend={(text) => dispatch({ type: 'quickMessage', text })} />
      <div className="mt-3">
        <ChatComposer onSend={(text) => dispatch({ type: 'sendMessage', text })} />
      </div>
    </Screen>
  );
}
