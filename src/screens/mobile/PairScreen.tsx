import { useState } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { qrCodes } from '@/services/qrCodes';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Button } from '@/components/common/Button';
import { FieldLabel, Hint } from '@/components/common/Field';
import { Note } from '@/components/common/Note';
import { Segmented } from '@/components/common/Segmented';
import { Icon } from '@/components/common/Icon';
import { PairTtl } from '@/components/common/Clock';

/**
 * Vinculación por código QR (token ficticio).
 * El QR no contiene tu ubicación y esta demo no vincula dispositivos reales.
 */
export function PairScreen() {
  const { state, dispatch } = useDemo();
  const [manual, setManual] = useState('');

  return (
    <Screen>
      <PageTop title="Sumá a alguien cercano" sub="Una invitación, dos cuentas vinculadas" />

      <Segmented
        value={state.pairTab}
        onChange={(tab) => dispatch({ type: 'setPairTab', tab })}
        options={[
          { value: 'show', label: 'Mi código QR' },
          { value: 'scan', label: 'Escanear' },
        ]}
      />

      {state.pairTab === 'show' ? (
        <>
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-white rounded-[18px] border border-line">
              <div
                className="w-[132px] h-[132px]"
                dangerouslySetInnerHTML={{ __html: qrCodes[state.pairToken] }}
              />
            </div>
            <h3 className="mt-4">Invitá a tu círculo</h3>
            <p className="text-[12px] text-muted mt-2">
              Pedile a la otra persona que escanee
              <br />
              este QR desde su aplicación.
            </p>
            <div className="mt-3 px-4 py-2 rounded-[12px] bg-brand-soft text-brand font-display font-extrabold text-[20px] tracking-[4px]">
              {state.pairToken}
            </div>
            <p className="mt-2 text-[9px] text-muted">
              Código de prueba · <PairTtl started={state.pairStarted} /> para renovar
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Button
                variant="outline"
                small
                icon="copy"
                onClick={() => {
                  navigator.clipboard?.writeText(state.pairToken).then(
                    () => dispatch({ type: 'toast', text: 'Código de prueba copiado.' }),
                    () => dispatch({ type: 'openSheet', kind: 'copy' }),
                  );
                }}
              >
                Copiar
              </Button>
              <Button variant="outline" small icon="refresh" onClick={() => dispatch({ type: 'renewCode' })}>
                Renovar
              </Button>
            </div>
          </div>

          <div className="mt-5">
            <Note icon="qr">
              El QR contiene un token ficticio, no tu ubicación. Esta demo no vincula dispositivos
              reales.
            </Note>
          </div>
          <Button
            variant="secondary"
            block
            className="mt-4"
            onClick={() => dispatch({ type: 'pairDetected' })}
          >
            Simular una invitación recibida
          </Button>
        </>
      ) : (
        <>
          <div className="relative flex items-center justify-center h-[180px] mt-4 rounded-[18px] bg-[#241c30] overflow-hidden">
            <div className="w-[130px] h-[130px] rounded-[14px] border-2 border-white/70" />
            <Icon name="scan" size="xl" className="absolute text-white/80" />
          </div>
          <p className="text-center text-[12px] text-muted mt-3">
            Escáner simulado. No se utiliza tu cámara.
          </p>
          <Button
            block
            icon="scan"
            className="mt-4"
            onClick={() => dispatch({ type: 'pairDetected' })}
          >
            Simular lectura de un QR
          </Button>
          <div className="h-px bg-line my-[19px]" />
          <FieldLabel htmlFor="manualcode">O ingresar un código de demostración</FieldLabel>
          <input
            id="manualcode"
            inputMode="numeric"
            maxLength={6}
            placeholder={state.pairToken}
            autoComplete="off"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
          />
          <Hint>Para probar: {state.pairToken}</Hint>
          <Button
            variant="outline"
            block
            className="mt-3"
            onClick={() => dispatch({ type: 'pairManual', code: manual.trim() })}
          >
            Validar código
          </Button>
        </>
      )}
    </Screen>
  );
}
