import { cn } from '@/lib/cn';
import { Avatar } from '@/components/common/Avatar';
import { Icon } from '@/components/common/Icon';
import type { Contact } from '@/types/demo';

/** Fila de contacto del círculo de confianza. */
export function ContactCard({ contact, onOpen }: { contact: Contact; onOpen: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(contact.id)}
      className="flex items-center gap-[11px] w-full text-left py-[15px] border-b border-line last:border-b-0"
    >
      <Avatar name={contact.name} color={contact.color} />
      <span className="flex-1 min-w-0">
        <strong className="block text-[12px]">{contact.alias}</strong>
        <small className="block text-[10px] text-muted mt-1">
          {contact.name} · {contact.relation}
        </small>
      </span>
      <span className="flex flex-col items-center">
        <Icon
          name={contact.alerts ? 'bell' : 'eyeoff'}
          size="sm"
          className={contact.alerts ? 'text-brand' : 'text-muted'}
        />
        <small className="text-[8px] text-muted mt-0.5">
          {contact.alerts ? 'Recibe SOS' : 'Sin alertas'}
        </small>
      </span>
      <Icon name="chev" size="sm" className="text-muted" />
    </button>
  );
}

/** Selector de personas para el acompañamiento. */
export function PersonPick({
  contact,
  selected,
  onToggle,
}: {
  contact: Contact;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'relative flex flex-col items-center gap-2 p-3 rounded-[15px] border text-[10px]',
        selected ? 'border-brand bg-brand-soft' : 'border-line bg-paper',
      )}
    >
      {selected && (
        <span className="absolute right-1.5 top-1.5 flex items-center justify-center w-[18px] h-[18px] rounded-full bg-brand text-white">
          <Icon name="check" size="sm" className="w-3 h-3" />
        </span>
      )}
      <Avatar name={contact.name} color={contact.color} />
      <strong>{contact.alias}</strong>
    </button>
  );
}

/** Pila de avatares del círculo. */
export function ContactPreview({
  contacts,
  onOpen,
}: {
  contacts: Contact[];
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex items-center gap-[9px] w-full text-left p-3 rounded-[17px] border border-line bg-paper"
    >
      <span className="flex [&>*+*]:-ml-[10px]">
        {contacts.slice(0, 3).map((c) => (
          <Avatar key={c.id} name={c.name} color={c.color} size="sm" />
        ))}
      </span>
      <span className="flex-1 min-w-0">
        <strong className="block text-[10px]">{contacts.length} personas cerca de vos</strong>
        <small className="block text-[8px] text-muted mt-0.5">
          Se enteran solo cuando vos elegís.
        </small>
      </span>
      <Icon name="chev" size="sm" className="text-muted" />
    </button>
  );
}
