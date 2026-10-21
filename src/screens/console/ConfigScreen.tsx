import { useState } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { ConsolePageHead } from '@/components/console/ConsolePanel';
import { Button } from '@/components/common/Button';
import { FieldLabel, Hint } from '@/components/common/Field';
import { Note } from '@/components/common/Note';
import { Tile } from '@/components/common/Tile';
import { Toggle } from '@/components/common/Toggle';

/** Configuración de la demostración (solo afecta esta sesión). */
export function ConfigScreen() {
  const { state, dispatch } = useDemo();
  const [radius, setRadius] = useState(state.config.radius);
  const [ack, setAck] = useState(state.config.ack);
  const [escalate, setEscalate] = useState(state.config.escalate);

  return (
    <>
      <ConsolePageHead
        title="Configuración de la demo"
        sub="Los valores afectan únicamente esta sesión del prototipo."
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
        <Tile className="!p-[23px]">
          <h3>Distribución comunitaria</h3>
          <FieldLabel htmlFor="cfg-radius">Radio predeterminado (metros)</FieldLabel>
          <select
            id="cfg-radius"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          >
            {[250, 500, 1000, 2000].map((v) => (
              <option key={v} value={v}>
                {v} m
              </option>
            ))}
          </select>
          <Hint>Se aplicará al explorador de alertas de esta demo.</Hint>
          <div className="flex items-center gap-[11px] py-[15px] mt-3 border-b border-line">
            <div className="flex-1 min-w-0">
              <strong className="block text-[12px]">Alertas comunitarias</strong>
              <small className="block text-[10px] text-muted mt-1">
                Habilitación operativa de prueba.
              </small>
            </div>
            <Toggle
              on={state.config.community}
              label="Alertas comunitarias habilitadas"
              onToggle={() => dispatch({ type: 'toggleConfigCommunity' })}
            />
          </div>
          <div className="mt-4">
            <Note icon="lock" color="gray">
              El radio de una alerta nunca convierte a todos los usuarios de la zona en personas
              rastreables.
            </Note>
          </div>
        </Tile>

        <Tile className="!p-[23px]">
          <h3>Atención y escalamiento</h3>
          <FieldLabel htmlFor="cfg-ack">Umbral de atención (segundos)</FieldLabel>
          <input
            id="cfg-ack"
            type="number"
            min={10}
            max={600}
            value={ack}
            onChange={(e) => setAck(Number(e.target.value))}
          />
          <FieldLabel htmlFor="cfg-escalate">Escalar si no se asume (segundos)</FieldLabel>
          <input
            id="cfg-escalate"
            type="number"
            min={15}
            max={900}
            value={escalate}
            onChange={(e) => setEscalate(Number(e.target.value))}
          />
          <Hint>
            El escalamiento añade un evento de prueba a la bitácora; no llama ni notifica a servicios
            reales.
          </Hint>
        </Tile>
      </div>

      <Button
        className="mt-5"
        onClick={() => dispatch({ type: 'saveConfig', radius, ack, escalate })}
      >
        Guardar configuración de prueba
      </Button>
    </>
  );
}
