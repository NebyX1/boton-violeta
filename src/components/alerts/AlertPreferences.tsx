import { useDemo } from '@/providers/DemoStateProvider';
import { formatRadius } from '@/lib/geo';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Toggle } from '@/components/common/Toggle';

/**
 * Preferencias de recepción de alertas cercanas.
 * Recibir alertas no comparte tu ubicación: solo te avisa de lo que ocurre cerca.
 */
export function AlertPreferences() {
  const { state, dispatch } = useDemo();

  return (
    <div className="p-[15px] rounded-[18px] border border-line bg-paper">
      <div className="flex items-center gap-[10px]">
        <span className="flex items-center justify-center w-[34px] h-[34px] rounded-[11px] bg-brand-soft text-brand shrink-0">
          <Icon name="bell" size="sm" className="w-[19px] h-[19px]" />
        </span>
        <div className="flex-1 min-w-0">
          <strong className="block text-[11px]">Recibir alertas de personas cercanas</strong>
          <small className="block text-[9px] text-muted mt-[3px]">
            Avisos de tu zona · radio {formatRadius(state.radius)}
          </small>
        </div>
        <Toggle
          on={state.receiveNear}
          label="Recibir alertas de personas cercanas"
          onToggle={() => dispatch({ type: 'toggleReceiveNear' })}
        />
      </div>
      <div className="mt-3">
        <Note icon="lock" color="gray">
          Recibir alertas no comparte tu ubicación ni te convierte en personal de respuesta. Podés
          silenciarlas cuando quieras.
        </Note>
      </div>
    </div>
  );
}
