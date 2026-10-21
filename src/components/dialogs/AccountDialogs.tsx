import { useState } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { Sheet } from '@/components/common/Sheet';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { FieldLabel } from '@/components/common/Field';
import { Note } from '@/components/common/Note';

/** Selección de cuenta de prueba (Google simulado). */
export function GoogleDialog() {
  const { dispatch } = useDemo();
  return (
    <Sheet
      title="Elegí una cuenta de prueba"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button onClick={() => dispatch({ type: 'finishLogin' })}>Continuar como Camila</Button>
      }
    >
      <div className="p-[17px] rounded-[20px] border border-line bg-paper">
        <div className="flex items-center gap-3">
          <Avatar name="Camila Ríos" />
          <div>
            <h3>Camila Ríos</h3>
            <p className="text-[12px] text-muted mt-2">camila@ejemplo.invalid</p>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-muted leading-[1.75] mt-4">
        Acceso simulado. No se abre Google ni se solicitan credenciales reales.
      </p>
    </Sheet>
  );
}

/** Recuperación de acceso simulada. */
export function RecoverDialog() {
  const { dispatch } = useDemo();
  const [email, setEmail] = useState('camila@ejemplo.invalid');
  return (
    <Sheet
      title="Recuperar acceso"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button onClick={() => dispatch({ type: 'recoverSend', email })}>
          Simular envío de recuperación
        </Button>
      }
    >
      <p className="text-[11px] text-muted leading-[1.75]">
        Flujo de demostración. No se envía ningún correo real.
      </p>
      <FieldLabel htmlFor="recoveremail">Correo de ejemplo</FieldLabel>
      <input
        id="recoveremail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </Sheet>
  );
}

/** Confirmación de salida de la cuenta de prueba. */
export function LogoutDialog() {
  const { dispatch } = useDemo();
  return (
    <Sheet
      title="Salir de la cuenta de prueba"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <>
          <Button onClick={() => dispatch({ type: 'confirmLogout' })}>Volver al acceso</Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'closeSheet' })}>
            Permanecer
          </Button>
        </>
      }
    >
      <Note icon="info">
        Esta acción vuelve al acceso de demostración. No cierra una alerta activa ni cambia permisos
        de seguimiento.
      </Note>
    </Sheet>
  );
}

/** Teclado de llamada simulado. */
export function KeypadDialog() {
  const { state, dispatch } = useDemo();
  const digits = String(state.sheetData.digits ?? '');
  return (
    <Sheet
      title="Teclado simulado"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button variant="outline" onClick={() => dispatch({ type: 'closeSheet' })}>
          Volver a la llamada
        </Button>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => dispatch({ type: 'dial', digit: n })}
            className="py-3 rounded-[12px] border border-line bg-paper text-[20px]"
          >
            {n}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[9px] text-muted leading-[1.6]">
        {digits || 'Sin tonos ni conexión telefónica.'}
      </p>
    </Sheet>
  );
}
