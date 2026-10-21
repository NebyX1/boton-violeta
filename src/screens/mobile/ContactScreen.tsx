import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Note } from '@/components/common/Note';
import { Tile } from '@/components/common/Tile';
import { Toggle } from '@/components/common/Toggle';
import { Icon } from '@/components/common/Icon';

/** Permisos del vínculo: control persona por persona. */
export function ContactScreen() {
  const { state, dispatch } = useDemo();
  const c = state.contacts.find((x) => x.id === state.context);

  if (!c) {
    return (
      <Screen>
        <PageTop title="Mi círculo" />
        <EmptyState
          title="Vínculo no disponible"
          text="Esta cuenta ya no está vinculada."
          icon="users"
        />
      </Screen>
    );
  }

  const sharing = state.share.active && state.share.recipients.includes(c.id);

  return (
    <Screen>
      <PageTop title="Permisos del vínculo" sub="Tu control, persona por persona" />

      <div className="flex flex-col items-center text-center">
        <Avatar name={c.name} color={c.color} size="xl" />
        <h2 className="mt-3">{c.alias}</h2>
        <p className="text-[12px] text-muted mt-2">
          {c.name} · {c.relation}
        </p>
        <div className="mt-3">
          <Badge color="green">Vínculo aceptado</Badge>
        </div>
      </div>

      <Tile className="mt-6">
        <div className="flex items-center gap-[11px] py-[15px] border-b border-line">
          <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-brand-soft text-brand shrink-0">
            <Icon name="bell" />
          </span>
          <div className="flex-1 min-w-0">
            <strong className="block text-[12px]">Recibir mis alertas SOS</strong>
            <small className="block text-[10px] text-muted mt-1 leading-[1.6]">
              Solo al activar el botón.
              <br />
              Sin ubicación permanente.
            </small>
          </div>
          <Toggle
            on={c.alerts}
            label="Recibir mis alertas"
            onToggle={() => dispatch({ type: 'toggleContactAlerts', id: c.id })}
          />
        </div>
        <div className="flex items-center gap-[11px] py-[15px]">
          <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-green-soft text-green shrink-0">
            <Icon name="pin" />
          </span>
          <div className="flex-1 min-w-0">
            <strong className="block text-[12px]">Permitir seguir</strong>
            <small className="block text-[10px] text-muted mt-1 leading-[1.6]">
              {sharing
                ? 'Permiso temporal activo. Podés revocarlo.'
                : 'No tiene acceso a tu ubicación cotidiana.'}
            </small>
          </div>
          <Toggle
            on={sharing}
            label="Permitir seguimiento"
            onToggle={() => dispatch({ type: 'toggleContactShare', id: c.id })}
          />
        </div>
      </Tile>

      <div className="mt-4">
        <Note icon="lock">
          El permiso es unidireccional: compartir con {c.alias} no te permite rastrear su teléfono.
        </Note>
      </div>

      <Button
        variant="outline"
        block
        icon="chat"
        className="mt-5"
        onClick={() => dispatch({ type: 'openChat', target: 'circle' })}
      >
        Enviar mensaje
      </Button>
      <Button
        variant="ghost"
        block
        icon="trash"
        className="mt-3"
        onClick={() => dispatch({ type: 'unlinkConfirm', id: c.id })}
      >
        Desvincular contacto
      </Button>
    </Screen>
  );
}
