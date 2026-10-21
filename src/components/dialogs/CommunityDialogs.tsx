import { useState } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { places } from '@/services/demoData';
import { Sheet } from '@/components/common/Sheet';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { FieldLabel, Select } from '@/components/common/Field';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';

/** Filtro de radio para alertas cercanas. */
export function RadiusDialog() {
  const { state, dispatch } = useDemo();
  const [radius, setRadius] = useState(state.radius);

  return (
    <Sheet
      title="Tu comunidad cercana"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button onClick={() => dispatch({ type: 'applyRadius', radius })}>Aplicar radio</Button>
      }
    >
      <p className="text-[11px] text-muted leading-[1.75]">
        Elegí hasta dónde explorar alertas de prueba.
      </p>
      <FieldLabel htmlFor="radiusvalue">Radio de búsqueda</FieldLabel>
      <Select id="radiusvalue" value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
        {[250, 500, 1000, 2000].map((v) => (
          <option key={v} value={v}>
            {v} metros
          </option>
        ))}
      </Select>
      <Note icon="map" color="gray">
        Las distancias son ficticias y sirven para probar el filtrado.
      </Note>
    </Sheet>
  );
}

/** Ofrecimiento de ayuda comunitaria. */
export function HelpOfferDialog() {
  const { state, dispatch } = useDemo();
  const [helpType, setHelpType] = useState('Acompañamiento desde un lugar seguro');
  const id = String(state.sheetData.id ?? '');

  return (
    <Sheet
      title="¿Cómo podés acompañar?"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <>
          <Button onClick={() => dispatch({ type: 'acceptHelp', id, helpType })}>
            Ofrecer mi ayuda de prueba
          </Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'closeSheet' })}>
            Volver
          </Button>
        </>
      }
    >
      <p className="text-[11px] text-muted leading-[1.75]">
        Ofrecer ayuda no equivale a tener una intervención asignada. Coordiná antes de actuar.
      </p>
      <FieldLabel htmlFor="helptype">Puedo ofrecer</FieldLabel>
      <Select id="helptype" value={helpType} onChange={(e) => setHelpType(e.target.value)}>
        <option>Acompañamiento desde un lugar seguro</option>
        <option>Un espacio seguro cercano</option>
        <option>Información para la central</option>
      </Select>
      <Note icon="shield" color="green">
        No confrontes ni persigas a nadie. La central mantiene la coordinación.
      </Note>
    </Sheet>
  );
}

/** Estado del ofrecimiento de ayuda. */
export function HelpStatusDialog() {
  const { state, dispatch } = useDemo();
  const a = state.incidents.find((x) => x.id === state.sheetData.id);
  return (
    <Sheet
      title="Tu ayuda está ofrecida"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button onClick={() => dispatch({ type: 'openChat', target: 'community' })}>
          Abrir canal de coordinación
        </Button>
      }
    >
      <Note icon="hand" color="green">
        La central ve tu ofrecimiento. Esperá coordinación antes de acercarte a una situación de
        riesgo.
      </Note>
      <p className="text-[12px] text-muted mt-4">
        {a?.helpType ?? 'Acompañamiento de prueba'}
      </p>
    </Sheet>
  );
}

/** Detalle de un espacio de apoyo ficticio. */
export function PlaceDialog() {
  const { state, dispatch } = useDemo();
  const p = places.find((x) => x.id === state.sheetData.id);
  if (!p) return null;
  return (
    <Sheet
      title={p.name}
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <>
          <Button onClick={() => dispatch({ type: 'requestPlace', id: p.id })}>
            Simular solicitud de recepción
          </Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'go', screen: 'places' })}>
            Ver puntos en el mapa
          </Button>
        </>
      }
    >
      <Badge color="green">PUNTO FICTICIO</Badge>
      <p className="text-[11px] text-muted leading-[1.75] mt-4">
        Espacio de apoyo incluido para explorar el diseño. No representa un local real adherido.
      </p>
      <div className="p-[17px] mt-3 rounded-[20px] border border-line bg-paper">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-[39px] h-[39px] rounded-[13px] bg-green-soft text-green">
            <Icon name="store" />
          </span>
          <div>
            <h3 className="text-[13px]">Recibir a alguien a resguardo</h3>
            <p className="text-[10px] text-muted mt-2">Disponibilidad y personal simulados.</p>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
