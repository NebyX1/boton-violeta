import { useDemo } from '@/providers/DemoStateProvider';
import { Avatar } from '@/components/common/Avatar';
import { Elapsed } from '@/components/common/Clock';
import { Icon } from '@/components/common/Icon';
import { cn } from '@/lib/cn';

/** Llamada simulada con la central (sin conexión telefónica ni micrófono). */
export function CallScreen() {
  const { state, dispatch } = useDemo();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[560px] px-6 text-center bg-canvas">
      <Avatar name="CV" size="xl" />
      <h1 className="mt-5">Central Violeta</h1>
      <p className="text-[12px] text-muted mt-2">Llamada simulada · no se marca el 911</p>
      <div className="mt-5 text-[20px] font-display font-extrabold text-brand">
        <Elapsed since={state.callStart ?? state.now} />
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button
          type="button"
          aria-label="Silenciar micrófono simulado"
          onClick={() => dispatch({ type: 'toggleCallMute' })}
          className={cn(
            'flex items-center justify-center w-[52px] h-[52px] rounded-full bg-brand-soft text-brand',
            state.mutedCall && 'bg-[#a57cdb] text-[#291738]',
          )}
        >
          <Icon name={state.mutedCall ? 'eyeoff' : 'mic'} />
        </button>
        <button
          type="button"
          aria-label="Altavoz simulado"
          onClick={() => dispatch({ type: 'toggleCallSpeaker' })}
          className={cn(
            'flex items-center justify-center w-[52px] h-[52px] rounded-full bg-brand-soft text-brand',
            state.speakerCall && 'bg-[#a57cdb] text-[#291738]',
          )}
        >
          <Icon name="volume" />
        </button>
        <button
          type="button"
          aria-label="Teclado de llamada simulado"
          onClick={() => dispatch({ type: 'callKeypad' })}
          className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-brand-soft text-brand"
        >
          <Icon name="qr" />
        </button>
      </div>

      <button
        type="button"
        aria-label="Finalizar llamada simulada"
        onClick={() => dispatch({ type: 'hangup' })}
        className="flex items-center justify-center w-[64px] h-[64px] rounded-full bg-red text-white mt-8"
      >
        <Icon name="phone" size="lg" />
      </button>

      <p className="text-[10px] text-muted mt-6">
        Sin conexión telefónica.
        <br />
        No se usa el micrófono.
      </p>
    </div>
  );
}
