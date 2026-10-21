import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { xy } from '@/lib/geo';
import { useDemo } from '@/providers/DemoStateProvider';
import { followHasPosition } from '@/providers/demoSelectors';
import { buildMarkers, markerColors } from '@/components/map/mapMarkers';
import { StreetPlan } from '@/components/map/StreetPlan';
import { LeafletLayer } from '@/components/map/LeafletLayer';
import { Icon } from '@/components/common/Icon';

type MapVariant = '' | 'mini' | 'big' | 'fill';

const variantClass: Record<MapVariant, string> = {
  '': 'h-[264px] rounded-[21px]',
  mini: 'h-[155px] rounded-[17px]',
  big: 'h-[330px] rounded-[21px]',
  fill: 'h-full min-h-[390px] rounded-[18px]',
};

/**
 * Mapa interactivo ilustrativo.
 * El plano vectorial funciona sin conexión; la cartografía real (Leaflet +
 * OpenStreetMap) es opcional y sigue usando marcadores ficticios.
 */
export function VectorMap({
  ctx,
  variant = '',
  label,
  className,
}: {
  ctx: string;
  variant?: MapVariant;
  label?: ReactNode;
  className?: string;
}) {
  const { state, dispatch } = useDemo();
  const worldRef = useRef<SVGGElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    x: number;
    y: number;
    z: number;
    dx: number;
    dy: number;
    moved: boolean;
  } | null>(null);

  const tr = state.mapTransforms[ctx] ?? { x: 0, y: 0, z: 1 };
  const markers = buildMarkers(state, ctx);
  const showTrail =
    ['active', 'share', 'follow'].includes(ctx) &&
    state.trail.length >= 1 &&
    (ctx !== 'follow' || followHasPosition(state));

  const worldTransform = (t: { x: number; y: number; z: number }) =>
    `translate(500 400) translate(${t.x} ${t.y}) scale(${t.z}) translate(-500 -400)`;

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest('[data-marker]')) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      x: tr.x,
      y: tr.y,
      z: tr.z,
      dx: 0,
      dy: 0,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
    const b = e.currentTarget.getBoundingClientRect();
    const scale = Math.min(1000 / b.width, 800 / b.height);
    drag.dx = dx * scale;
    drag.dy = dy * scale;
    worldRef.current?.setAttribute(
      'transform',
      worldTransform({ x: drag.x + drag.dx, y: drag.y + drag.dy, z: drag.z }),
    );
  };

  const onPointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag?.moved) return;
    /* El desplazamiento final se guarda en el estado del mapa. */
    dispatch({ type: 'mapPan', ctx, dx: drag.dx, dy: drag.dy });
  };

  const onMarkerAction = (marker: (typeof markers)[number]) => {
    if (!marker.action) return;
    if (marker.action === 'incident') dispatch({ type: 'openIncident', id: marker.id });
    else if (marker.action === 'select-incident') dispatch({ type: 'selectIncident', id: marker.id });
    else if (marker.action === 'place') dispatch({ type: 'openPlace', id: marker.id });
    else if (marker.action === 'unit-info') dispatch({ type: 'unitInfo' });
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden isolate border border-[#e5dced] bg-[#eeebf2]',
        variantClass[variant],
        className,
      )}
    >
      <svg
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid slice"
        aria-label="Mapa interactivo ilustrativo; ubicaciones ficticias"
        className="block w-full h-full bg-[#eeebf2] cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <g ref={worldRef} className="world" transform={worldTransform(tr)}>
          <StreetPlan />
          {showTrail && (
            <polyline
              points={state.trail.map((p) => xy(p).join(',')).join(' ')}
              fill="none"
              stroke="#b095dc"
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray="2 13"
            />
          )}
          {markers.map((m) => {
            const [x, y] = xy(m.pos);
            const c = markerColors[m.color];
            return (
              <g
                key={`${m.id}-${m.color}`}
                transform={`translate(${x},${y})`}
                data-marker={m.id}
                role={m.action ? 'button' : undefined}
                tabIndex={m.action ? 0 : undefined}
                aria-label={m.name ?? 'Ver alerta'}
                onClick={() => onMarkerAction(m)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onMarkerAction(m);
                  }
                }}
                className={m.action ? 'cursor-pointer' : ''}
              >
                {m.urgent && (
                  <>
                    <circle r={47} fill="#d52f55" opacity={0.16}>
                      <animate attributeName="r" values="38;52;38" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.22;0.04;0.22" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                    <circle r={33} fill="#d52f55" opacity={0.2} />
                  </>
                )}
                <circle r={m.urgent ? 27 : 24} fill={c} stroke="white" strokeWidth={m.urgent ? 6 : 5} />
                <text y={m.urgent ? 7 : 6} textAnchor="middle" fill="white" fontSize={m.urgent ? 19 : 16} fontWeight={800}>
                  {m.urgent ? '!' : m.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {state.mapReal && <LeafletLayer ctx={ctx} markers={markers} trail={showTrail ? state.trail : null} />}

      <div className="absolute left-3 right-3 top-3 z-[450] flex items-start justify-between gap-2 pointer-events-none [&>*]:pointer-events-auto">
        <span className="flex items-center gap-[5px] px-[9px] py-[7px] rounded-[10px] bg-[#ffffffed] border border-white/85 backdrop-blur-[8px] text-[#927ca2] text-[8px] font-[750] shadow-[0_4px_10px_#42295008]">
          <Icon name={state.online ? 'pin' : 'offline'} size="sm" className="w-3 h-3" />
          {ctx === 'active' ? 'GPS SIMULADO' : ctx === 'follow' ? 'PERMISO ACTIVO' : 'MINAS · DEMO'}
        </span>
        <button
          type="button"
          onClick={() => dispatch({ type: 'openSheet', kind: 'layers' })}
          className="flex items-center gap-[5px] px-[9px] py-[7px] rounded-[10px] bg-[#ffffffed] border border-white/85 backdrop-blur-[8px] text-[#927ca2] text-[8px] font-[750] shadow-[0_4px_10px_#42295008]"
        >
          <Icon name="layers" size="sm" className="w-3 h-3" />
          {state.mapReal ? 'Real' : 'Plano'}
        </button>
      </div>

      <div className="absolute right-3 bottom-[31px] z-[450] flex flex-col gap-[5px]">
        <button
          type="button"
          aria-label="Acercar mapa"
          onClick={() => dispatch({ type: 'mapZoom', ctx, delta: 1 })}
          className="flex items-center justify-center w-[31px] h-[31px] rounded-[9px] bg-[#ffffffed] border border-[#e9deef] text-[#9272ae] shadow-[0_3px_10px_#42295008]"
        >
          <Icon name="plus" size="sm" />
        </button>
        <button
          type="button"
          aria-label="Alejar mapa"
          onClick={() => dispatch({ type: 'mapZoom', ctx, delta: -1 })}
          className="flex items-center justify-center w-[31px] h-[31px] rounded-[9px] bg-[#ffffffed] border border-[#e9deef] text-[#9272ae] shadow-[0_3px_10px_#42295008]"
        >
          <Icon name="minus" size="sm" />
        </button>
        <button
          type="button"
          aria-label="Centrar mapa"
          onClick={() => dispatch({ type: 'mapCenter', ctx })}
          className="flex items-center justify-center w-[31px] h-[31px] rounded-[9px] bg-[#ffffffed] border border-[#e9deef] text-[#9272ae] shadow-[0_3px_10px_#42295008]"
        >
          <Icon name="locate" size="sm" />
        </button>
      </div>

      {label && (
        <div className="absolute left-3 bottom-[29px] z-[440] flex items-center gap-2 border border-[#eee5f5] bg-white rounded-[12px] px-[11px] py-[9px] shadow-[0_5px_15px_#4329580d]">
          {label}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-[450] pointer-events-none flex items-center justify-between px-2 py-[3px] map-credit-blur text-[6.5px] text-[#aa97b9]">
        <span>Plano ilustrativo · no usar para navegar</span>
        <span>SIMULACIÓN</span>
      </div>
    </div>
  );
}

/** Contenido compacto de la etiqueta del mapa. */
export function MapLabel({ icon, title, sub }: { icon: ReactNode; title: string; sub: ReactNode }) {
  return (
    <>
      {icon}
      <div>
        <strong className="block text-[9px]">{title}</strong>
        <small className="block text-[8px] text-[#ac95b9] mt-0.5">{sub}</small>
      </div>
    </>
  );
}
