import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Button } from '@/components/common/Button';
import { FieldLabel, Hint } from '@/components/common/Field';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Tile } from '@/components/common/Tile';
import { PersonPick } from '@/components/contacts/ContactCard';
import { VectorMap } from '@/components/map/VectorMap';

const durations = [
  { minutes: 15, label: '15 min' },
  { minutes: 60, label: '1 hora' },
  { minutes: 240, label: '4 horas' },
  { minutes: 0, label: 'Hasta parar' },
];

/**
 * "Acompañame": configuración del acompañamiento temporal.
 * Solo se comparte con las cuentas elegidas; nunca con la comunidad ni la central.
 */
export function ShareScreen() {
  const { state, dispatch } = useDemo();
  const draft = state.shareDraft ?? {
    recipients: [...state.share.recipients],
    minutes: state.share.minutes,
  };

  return (
    <Screen>
      <PageTop title="Acompañame" sub="Compartí tu camino, a tu manera" />

      <Tile tinted>
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-[52px] h-[52px] rounded-[16px] bg-white/45 text-brand">
            <Icon name="walk" size="lg" />
          </span>
          <div>
            <h3>Un poco más cerca.</h3>
            <p className="text-[12px] text-muted mt-2">Vos elegís con quién y por cuánto.</p>
          </div>
        </div>
      </Tile>

      <FieldLabel>¿Quién puede seguirte?</FieldLabel>
      <div className="grid grid-cols-3 gap-[10px]">
        {state.contacts.map((c) => (
          <PersonPick
            key={c.id}
            contact={c}
            selected={draft.recipients.includes(c.id)}
            onToggle={() => dispatch({ type: 'toggleSharePerson', id: c.id })}
          />
        ))}
      </div>
      {!state.contacts.length && (
        <Note icon="users">Agregá primero una persona a tu círculo.</Note>
      )}

      <FieldLabel>¿Durante cuánto tiempo?</FieldLabel>
      <div className="grid grid-cols-4 gap-[7px]">
        {durations.map((d) => (
          <button
            key={d.minutes}
            type="button"
            onClick={() => dispatch({ type: 'setShareMinutes', minutes: d.minutes })}
            className={`px-2 py-[9px] rounded-[12px] border text-[10px] font-[650] ${
              draft.minutes === d.minutes
                ? 'border-brand bg-brand-soft text-brand'
                : 'border-line bg-paper'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <VectorMap ctx="share" variant="mini" />
      </div>

      <Tile className="mt-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-green-soft text-green shrink-0">
            <Icon name="lock" />
          </span>
          <p className="text-[12px] text-muted">
            No se comparte con la comunidad ni con la central. Solo con las cuentas que elegís.
          </p>
        </div>
      </Tile>

      <Button
        block
        icon="eye"
        className="mt-5"
        disabled={!draft.recipients.length}
        onClick={() => dispatch({ type: 'startSharing' })}
      >
        Permitir seguir
      </Button>
      <Hint className="text-center">Podés retirar el permiso en cualquier momento.</Hint>
    </Screen>
  );
}
