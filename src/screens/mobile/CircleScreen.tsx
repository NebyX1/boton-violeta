import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Note } from '@/components/common/Note';
import { Button, IconButton } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icon';
import { SearchBox } from '@/components/common/SearchBox';
import { Tile } from '@/components/common/Tile';
import { ContactCard } from '@/components/contacts/ContactCard';

/**
 * Mi círculo: vínculos de confianza y seguimientos activos.
 * Vincular no comparte ubicación; cada permiso es individual y revocable.
 */
export function CircleScreen() {
  const { state, dispatch } = useDemo();
  const people = state.contacts.filter((c) =>
    (c.name + c.alias).toLowerCase().includes(state.contactSearch.toLowerCase()),
  );

  return (
    <Screen>
      <PageTop
        title="Tu círculo"
        sub="La confianza también se conecta"
        right={
          <IconButton
            icon="plus"
            label="Vincular una persona"
            onClick={() => dispatch({ type: 'go', screen: 'pair' })}
          />
        }
      />

      <Note icon="users">
        <strong>Vincular es elegir a tu gente.</strong>
        <br />
        No compartís ubicación por estar vinculada.
      </Note>

      <div className="flex border-b border-line mt-[18px] mb-[18px]">
        {(
          [
            ['people', `Mi gente (${state.contacts.length})`],
            ['sharing', 'Seguimientos'],
          ] as const
        ).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => dispatch({ type: 'setCircleTab', tab })}
            className={`flex-1 pb-2 text-[11px] font-bold border-b-2 ${
              state.circleTab === tab ? 'border-brand text-brand' : 'border-transparent text-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {state.circleTab === 'people' ? (
        <>
          <SearchBox
            value={state.contactSearch}
            onChange={(value) => dispatch({ type: 'setContactSearch', value })}
            placeholder="Buscar en tu círculo"
            label="Buscar contacto"
            className="mb-2"
          />
          <div>
            {people.map((c) => (
              <ContactCard
                key={c.id}
                contact={c}
                onOpen={(id) => dispatch({ type: 'openContact', id })}
              />
            ))}
            {!people.length && (
              <EmptyState title="Sin coincidencias" text="Probá con otro nombre." icon="search" />
            )}
          </div>
          <Button
            block
            icon="qr"
            className="mt-5"
            onClick={() => dispatch({ type: 'go', screen: 'pair' })}
          >
            Vincular por código QR
          </Button>
          <div className="mt-4">
            <Note icon="shield" color="gray">
              La invitación necesita aceptación de ambas cuentas. Podés desvincular a alguien en
              cualquier momento.
            </Note>
          </div>
        </>
      ) : (
        <>
          {state.share.active ? (
            <Tile tinted>
              <h3>Estás compartiendo</h3>
              <p className="text-[12px] text-muted mt-2">
                Con{' '}
                {state.share.recipients
                  .map((id) => state.contacts.find((c) => c.id === id)?.alias ?? 'Contacto')
                  .join(', ')}
                .
              </p>
              <Button
                block
                className="mt-4"
                onClick={() => dispatch({ type: 'go', screen: 'sharelive' })}
              >
                Administrar seguimiento
              </Button>
            </Tile>
          ) : (
            <EmptyState
              title="Tu ubicación es tuya"
              text="No hay seguimientos salientes. Activá una sesión cuando lo necesites."
            />
          )}

          <Tile className="mt-4">
            <h3 className="text-[13px]">Te están compartiendo</h3>
            {state.incoming?.active ? (
              <button
                type="button"
                onClick={() => dispatch({ type: 'viewIncoming' })}
                className="flex items-center gap-[11px] w-full text-left py-[15px] border-b border-line last:border-b-0"
              >
                <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-green-soft text-green">
                  <Icon name="radar" />
                </span>
                <span className="flex-1 min-w-0">
                  <strong className="block text-[12px]">Sofi activó una alerta</strong>
                  <small className="block text-[10px] text-muted mt-1">
                    Ubicación de prueba disponible
                  </small>
                </span>
                <Icon name="chev" size="sm" />
              </button>
            ) : (
              <p className="text-[12px] text-muted mt-3">Nadie comparte en este momento.</p>
            )}
          </Tile>

          <Button
            block
            icon="walk"
            className="mt-5"
            onClick={() => dispatch({ type: 'go', screen: 'share' })}
          >
            Iniciar acompañamiento
          </Button>
        </>
      )}
    </Screen>
  );
}
