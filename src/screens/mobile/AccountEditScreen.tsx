import { useState } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Button } from '@/components/common/Button';
import { FieldLabel, Select } from '@/components/common/Field';
import { Note } from '@/components/common/Note';

/** Edición de datos de la cuenta ficticia (solo en esta pestaña). */
export function AccountEditScreen() {
  const { state, dispatch } = useDemo();
  const [form, setForm] = useState({ ...state.profile });

  return (
    <Screen>
      <PageTop title="Mis datos" sub="Solo usá datos ficticios en esta demo" />

      <Note icon="beaker">
        Estos campos permanecen en esta pestaña. No se verifican documentos, teléfonos ni correos.
      </Note>

      <FieldLabel htmlFor="pname">Nombre visible</FieldLabel>
      <input
        id="pname"
        maxLength={60}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <FieldLabel htmlFor="pemail">Correo de ejemplo</FieldLabel>
      <input
        id="pemail"
        type="email"
        maxLength={100}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <FieldLabel htmlFor="pphone">Teléfono de ejemplo</FieldLabel>
      <input
        id="pphone"
        maxLength={25}
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <FieldLabel htmlFor="pcity">Localidad</FieldLabel>
      <input
        id="pcity"
        maxLength={80}
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
      />

      <FieldLabel htmlFor="pcontact">Contacto seguro</FieldLabel>
      <Select
        id="pcontact"
        value={form.contact}
        onChange={(e) => setForm({ ...form, contact: e.target.value })}
      >
        <option>Solo mensajes</option>
        <option>Llamar con autorización</option>
        <option>No llamar</option>
      </Select>

      <Button
        block
        className="mt-6"
        onClick={() =>
          dispatch({
            type: 'saveProfile',
            profile: {
              ...form,
              name: form.name.trim(),
              email: form.email.trim(),
            },
          })
        }
      >
        Guardar cambios de prueba
      </Button>
    </Screen>
  );
}
