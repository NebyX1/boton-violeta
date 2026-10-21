import { useState } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Button } from '@/components/common/Button';
import { Checkbox, FieldLabel, Select } from '@/components/common/Field';
import { Note } from '@/components/common/Note';

/** Alta simulada de cuenta (sin validación de identidad). */
export function RegisterScreen() {
  const { dispatch } = useDemo();
  const [name, setName] = useState('Camila Ríos');
  const [email, setEmail] = useState('camila@ejemplo.invalid');
  const [city, setCity] = useState('Minas, Lavalleja');
  const [accountType, setAccountType] = useState('Persona adulta');
  const [consent, setConsent] = useState(false);

  return (
    <Screen>
      <PageTop title="Crear mi cuenta" sub="Alta simulada · sin validación de identidad" />

      <h1 className="text-[25px]">
        Tu red empieza
        <br />
        <span className="text-brand">con vos.</span>
      </h1>

      <FieldLabel htmlFor="regname">Nombre de ejemplo</FieldLabel>
      <input
        id="regname"
        maxLength={60}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <FieldLabel htmlFor="regemail">Correo de ejemplo</FieldLabel>
      <input
        id="regemail"
        type="email"
        maxLength={100}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <FieldLabel htmlFor="regcity">Localidad</FieldLabel>
      <Select id="regcity" value={city} onChange={(e) => setCity(e.target.value)}>
        <option>Minas, Lavalleja</option>
        <option>Solís de Mataojo</option>
        <option>José Pedro Varela</option>
        <option>Mariscala</option>
        <option>Otra localidad</option>
      </Select>

      <FieldLabel htmlFor="regage">Tipo de cuenta de prueba</FieldLabel>
      <Select id="regage" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
        <option>Persona adulta</option>
        <option>Adolescente · escenario de prueba</option>
      </Select>

      <Checkbox className="mt-6" checked={consent} onChange={setConsent}>
        Entiendo que esta es una cuenta ficticia y que los datos no se envían a un servicio real.
      </Checkbox>

      <Button
        block
        className="mt-6"
        onClick={() => dispatch({ type: 'createAccount', name, email, city, accountType, consent })}
      >
        Crear cuenta de prueba
      </Button>

      <div className="mt-4">
        <Note icon="lock">
          La vinculación familiar tampoco otorga seguimiento automático en una cuenta adolescente.
          El consentimiento sigue siendo explícito.
        </Note>
      </div>
    </Screen>
  );
}
