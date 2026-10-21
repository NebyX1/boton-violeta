import type { ReactNode } from 'react';
import { StudioHeader } from '@/components/layout/StudioHeader';
import { StudioStory } from '@/components/layout/StudioStory';
import { InspectorPanel } from '@/components/layout/InspectorPanel';

/**
 * Studio de diseño: teléfono simulado en el centro, narrativa a la izquierda
 * e inspector de la red a la derecha.
 * En pantallas angostas se ocultan las columnas laterales (como en el prototipo).
 */
export function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StudioHeader />
      <main className="flex justify-center gap-[35px] px-5 pt-[15px] pb-6 xl:grid xl:grid-cols-[minmax(220px,1fr)_408px_minmax(245px,1fr)] xl:gap-[49px] xl:max-w-[1400px] xl:px-[37px] xl:pb-9 xl:mx-auto">
        <StudioStory />
        {children}
        <InspectorPanel />
      </main>
    </>
  );
}
