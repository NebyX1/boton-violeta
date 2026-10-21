import { useState } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { Sheet } from '@/components/common/Sheet';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { FieldLabel, Select } from '@/components/common/Field';
import { Note } from '@/components/common/Note';

/** Invitación de vinculación detectada (QR o código manual). */
export function PairDialog() {
  const { dispatch } = useDemo();
  const [alias, setAlias] = useState('Bruno');
  const [relation, setRelation] = useState('Amistad');

  return (
    <Sheet
      title="Una nueva persona en tu círculo"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <>
          <Button onClick={() => dispatch({ type: 'pairAccept', alias, relation })}>
            Aceptar y vincular
          </Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'closeSheet' })}>
            Rechazar invitación
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center">
        <Avatar name="Bruno Silva" color="blue" size="lg" />
        <h3 className="mt-3">Bruno Silva</h3>
        <p className="text-[12px] text-muted mt-2">Invitación de demostración</p>
        <div className="mt-3">
          <Badge color="green">Bruno aceptó invitarte</Badge>
        </div>
      </div>
      <FieldLabel htmlFor="pairalias">¿Cómo querés guardarlo?</FieldLabel>
      <input
        id="pairalias"
        maxLength={30}
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
      />
      <FieldLabel htmlFor="pairrelation">Vínculo</FieldLabel>
      <Select id="pairrelation" value={relation} onChange={(e) => setRelation(e.target.value)}>
        <option>Amistad</option>
        <option>Familiar</option>
        <option>Persona de confianza</option>
      </Select>
      <Note icon="lock">
        Aceptar el vínculo no comparte tu ubicación. El seguimiento requiere otro permiso explícito.
      </Note>
    </Sheet>
  );
}

/** Confirmación de desvinculación. */
export function UnlinkDialog() {
  const { state, dispatch } = useDemo();
  const c = state.contacts.find((x) => x.id === state.sheetData.id);
  if (!c) return null;
  return (
    <Sheet
      title={`¿Desvincular a ${c.alias}?`}
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <>
          <Button variant="danger" onClick={() => dispatch({ type: 'unlink', id: c.id })}>
            Desvincular contacto
          </Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'closeSheet' })}>
            Conservar vínculo
          </Button>
        </>
      }
    >
      <Note icon="lock">
        Se retirarán sus permisos de seguimiento y recepción de SOS. No obtiene acceso por conservar
        un QR anterior.
      </Note>
    </Sheet>
  );
}

/** Código de vinculación para copiar manualmente. */
export function CopyCodeDialog() {
  const { state, dispatch } = useDemo();
  return (
    <Sheet
      title="Código de prueba"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={<Button onClick={() => dispatch({ type: 'closeSheet' })}>Cerrar</Button>}
    >
      <input readOnly value={state.pairToken} aria-label="Código para copiar" />
    </Sheet>
  );
}

/** Alerta entrante de Sofi. */
export function IncomingDialog() {
  const { dispatch } = useDemo();
  return (
    <Sheet
      title="Sofi activó un SOS"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <>
          <Button onClick={() => dispatch({ type: 'viewIncoming' })}>Ver su alerta</Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'closeSheet' })}>
            Ver después
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-3">
        <Avatar name="Sofía Acosta" color="mint" size="lg" />
        <div>
          <h3>Sofía Acosta</h3>
          <p className="text-[12px] text-muted mt-2">Tu amiga · alerta de prueba</p>
        </div>
      </div>
      <p className="text-[11px] text-muted leading-[1.75] mt-5">
        Sofi eligió avisarte y compartir su ubicación durante esta alerta simulada.
      </p>
    </Sheet>
  );
}
