import { useState } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { cn } from '@/lib/cn';
import { Chip, Chips } from '@/components/common/Segmented';
import { Icon } from '@/components/common/Icon';
import type { ChatMessage, ChatTarget } from '@/types/demo';

const senderLabel: Record<string, string> = {
  operator: 'Central · ',
  guardian: 'Elena · ',
  community: 'Nicolás · ',
};

/** Burbuja de mensaje. */
export function ChatBubble({ message, mine }: { message: ChatMessage; mine: boolean }) {
  return (
    <div
      className={cn(
        'max-w-[85%] px-3 py-2 rounded-[16px] text-[11px] leading-[1.6]',
        mine
          ? 'ml-auto bg-brand text-white rounded-br-[6px] dark:text-[#281832]'
          : 'bg-paper border border-line rounded-bl-[6px]',
      )}
    >
      {message.text}
      <small className={cn('block text-[8px] mt-1', mine ? 'opacity-80' : 'text-muted')}>
        {senderLabel[message.sender] ?? ''}
        {new Intl.DateTimeFormat('es-UY', { hour: '2-digit', minute: '2-digit', hour12: false }).format(
          new Date(message.time),
        )}{' '}
        {mine ? '✓✓' : ''}
      </small>
    </div>
  );
}

/** Respuestas rápidas predefinidas. */
export function QuickReplies({ onSend }: { onSend: (text: string) => void }) {
  return (
    <Chips>
      <Chip label="No puedo hablar" active={false} onClick={() => onSend('No puedo hablar. Escribime por acá.')} />
      <Chip label="Estoy a salvo" active={false} onClick={() => onSend('Estoy en un lugar seguro.')} />
    </Chips>
  );
}

/** Composer de mensajes simulados (sin servicio real). */
export function ChatComposer({
  onSend,
  placeholder = 'Escribí un mensaje de prueba…',
}: {
  onSend: (text: string) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState('');
  return (
    <form
      className="flex items-center gap-2 p-2 rounded-[16px] border border-line bg-paper"
      onSubmit={(e) => {
        e.preventDefault();
        onSend(text);
        setText('');
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={500}
        placeholder={placeholder}
        aria-label="Mensaje de prueba"
        autoComplete="off"
        className="border-0 bg-transparent px-2 py-1"
      />
      <button
        type="submit"
        aria-label="Enviar mensaje"
        className="flex items-center justify-center w-[40px] h-[40px] rounded-[13px] border border-line bg-paper shrink-0"
      >
        <Icon name="send" />
      </button>
    </form>
  );
}

/** Vista de mensajería simulada de un canal. */
export function ChatThread({ target }: { target: ChatTarget }) {
  const { state } = useDemo();
  const messages = state.chats[target] ?? [];
  return (
    <div className="flex flex-col gap-[10px]">
      {messages.map((m, i) => (
        <ChatBubble key={`${m.time}-${i}`} message={m} mine={m.sender === state.role} />
      ))}
      {!messages.length && (
        <p className="text-center text-[10px] text-muted mt-6">
          Empezá una conversación de prueba.
        </p>
      )}
    </div>
  );
}
