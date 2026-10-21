import type { ReactNode } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { ConsoleRail } from '@/components/console/ConsoleRail';
import { Badge } from '@/components/common/Badge';
import { Button, IconButton } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';

const titles: Record<string, string> = {
  overview: 'Centro de coordinación',
  incidents: 'Incidentes',
  reports: 'Reportes',
  people: 'Personas',
  resources: 'Recursos',
  audit: 'Bitácora',
  config: 'Configuración',
};

/** Esqueleto de la consola institucional desktop. */
export function ConsoleLayout({ children }: { children: ReactNode }) {
  const { state, dispatch } = useDemo();

  return (
    <main className="flex min-h-[100dvh] bg-[#f5f2f9]">
      <ConsoleRail />
      <section className="flex-1 min-w-0 ml-[74px] lg:ml-[208px] px-5 lg:px-[29px] py-[27px]">
        <header className="flex items-center justify-between gap-[15px] mb-[22px]">
          <div>
            <h1 className="text-[25px] tracking-[-0.9px]">
              {titles[state.consoleTab] ?? 'Centro de coordinación'}
            </h1>
            <p className="text-[10px] text-[#a48cb3] mt-[5px]">
              Lavalleja · Espacio institucional · Sesión de demostración
            </p>
          </div>
          <div className="flex items-center gap-[10px]">
            <Badge color="green" live>
              OPERATIVA SIMULADA
            </Badge>
            <Button
              variant="outline"
              small
              icon="mobile"
              onClick={() => dispatch({ type: 'setRole', role: 'self' })}
            >
              Volver a la app
            </Button>
            <IconButton
              icon="beaker"
              label="Herramientas de demostración"
              onClick={() => dispatch({ type: 'demoTools' })}
            />
          </div>
        </header>

        <div className="flex items-center gap-[7px] px-3 py-[9px] border border-[#e5d9f1] rounded-[11px] bg-[#eee6f8] text-[#a084b6] text-[9px] mb-5">
          <Icon name="beaker" size="sm" />
          Entorno de prueba. No hay integración con Policía, 911 ni otros servicios. Todas las
          personas y posiciones son ficticias.
        </div>

        {children}

        <footer className="flex items-center justify-between gap-3 pt-4 text-[8px] text-[#ae95bd]">
          <span className="flex items-center gap-[5px]">
            <i className="w-[6px] h-[6px] rounded-full bg-[#438773]" /> Estado local de demostración ·
            Flask no conectado
          </span>
          <span className="flex items-center gap-[5px]">
            <Icon name="lock" size="sm" /> Accesos y acciones simulados en bitácora
          </span>
          <button
            type="button"
            onClick={() => dispatch({ type: 'about' })}
            className="text-[8px] text-brand"
          >
            Diseño y alcance
          </button>
        </footer>
      </section>
    </main>
  );
}
