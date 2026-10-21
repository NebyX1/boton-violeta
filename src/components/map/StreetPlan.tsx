import { useMemo } from 'react';

/**
 * Plano vectorial ilustrativo (funciona sin conexión).
 * La geometría es esquemática: no representa calles reales ni sirve para navegar.
 */
export function StreetPlan() {
  const blocks = useMemo(() => {
    const out: React.ReactNode[] = [];
    for (let y = -2; y < 13; y++) {
      for (let x = -2; x < 16; x++) {
        out.push(
          <rect
            key={`${x}-${y}`}
            x={x * 85 + 8}
            y={y * 80 + 8}
            width={66}
            height={61}
            rx={5}
            fill={(x + y) % 7 === 0 ? '#ddd6e8' : (x + y) % 5 === 0 ? '#e8e0ee' : '#e4dfeb'}
            stroke="#dcd4e5"
          />,
        );
      }
    }
    return out;
  }, []);

  return (
    <>
      <g transform="rotate(-24 500 400)">
        {blocks}
        <rect x={348} y={248} width={151} height={141} rx={9} fill="#d2e4d8" />
        <path d="M348 248 499 389M499 248 348 389" stroke="#edf5eb" strokeWidth={7} />
        <circle cx={424} cy={318} r={14} fill="#bcd4c3" />
        <text x={361} y={330} fontSize={12} fill="#8aac94">
          PLAZA · DEMO
        </text>
        <path d="M-80 472H1300M505-150V1100" stroke="#d9cde9" strokeWidth={27} />
        <path d="M-80 472H1300M505-150V1100" stroke="#fbf8fd" strokeWidth={18} />
        <text x={610} y={477} fontSize={14} fill="#b2a1c0" letterSpacing="1">
          CORREDOR DE PRUEBA
        </text>
        <text x={176} y={232} fontSize={14} fill="#b2a1c0" letterSpacing="1">
          SECTOR CENTRO
        </text>
      </g>
      <path
        d="M890-20C760 130 1020 180 890 320S1060 570 1050 890"
        stroke="#d3dce8"
        strokeWidth={30}
        fill="none"
      />
      <path
        d="M890-20C760 130 1020 180 890 320S1060 570 1050 890"
        stroke="#e2eaf3"
        strokeWidth={18}
        fill="none"
      />
      <text x={60} y={735} fontSize={23} fill="#baa7cb" letterSpacing="4" fontWeight={700}>
        MINAS
      </text>
      <text x={60} y={755} fontSize={11} fill="#b4a2c5" letterSpacing="1">
        ESCENARIO ILUSTRATIVO
      </text>
    </>
  );
}
