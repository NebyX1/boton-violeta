import { useState } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Button, TextButton } from '@/components/common/Button';
import { FieldLabel } from '@/components/common/Field';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';

/** Acceso de demostración (sin autenticación real). */
export function LoginScreen() {
  const { dispatch } = useDemo();
  const [email, setEmail] = useState('camila@ejemplo.invalid');
  const [password, setPassword] = useState('demovioleta');

  return (
    <Screen>
      <PageTop title="Bienvenida a tu red" sub="Acceso de demostración" />

      <div className="relative h-[183px] flex items-center justify-center">
        <span className="absolute w-[172px] h-[172px] rounded-full border border-brand/15" />
        <span className="absolute w-[125px] h-[125px] rounded-full border border-brand/25" />
        <div className="flex items-center justify-center w-[82px] h-[82px] rounded-[27px] bg-brand-soft text-brand">
          <Icon name="heart" size="lg" />
        </div>
      </div>

      <h1 className="text-center text-[28px]">
        Empecemos
        <br />
        <span className="text-brand">por cuidarnos.</span>
      </h1>
      <p className="text-center text-[12px] text-muted mt-4">
        Ingresá a la cuenta ficticia de Camila
        <br />
        y explorá la experiencia completa.
      </p>

      <Button
        variant="outline"
        block
        className="mt-6"
        onClick={() => dispatch({ type: 'googleLogin' })}
      >
        <span className="font-bold text-[20px] text-[#4285f4] font-sans">G</span> Continuar con
        Google
      </Button>

      <div className="flex items-center gap-3 mt-5">
        <span className="flex-1 h-px bg-line" />
        <span className="text-[10px] text-muted">O CON CORREO</span>
        <span className="flex-1 h-px bg-line" />
      </div>

      <FieldLabel htmlFor="loginemail">Correo de ejemplo</FieldLabel>
      <input
        id="loginemail"
        type="email"
        autoComplete="off"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FieldLabel htmlFor="loginpass">Contraseña de prueba</FieldLabel>
      <input
        id="loginpass"
        type="password"
        autoComplete="off"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        block
        className="mt-5"
        onClick={() => dispatch({ type: 'emailLogin', email, password })}
      >
        Ingresar a la demo
      </Button>

      <div className="flex items-center justify-between mt-3">
        <TextButton onClick={() => dispatch({ type: 'recover' })}>Recuperar acceso</TextButton>
        <TextButton onClick={() => dispatch({ type: 'go', screen: 'register' })}>
          Crear cuenta
        </TextButton>
      </div>

      <div className="mt-5">
        <Note icon="beaker" color="gray">
          No hay autenticación real. No uses tus credenciales personales.
        </Note>
      </div>
    </Screen>
  );
}
