import { useDemoState } from '@/providers/DemoStateProvider';
import { duration, formatTime } from '@/lib/format';

/** Cronómetro de sesión (mm:ss) que se actualiza con el reloj de la demo. */
export function Elapsed({ since, className }: { since: number | null; className?: string }) {
  const { now } = useDemoState();
  return (
    <span className={className}>{duration(now - (since ?? now))}</span>
  );
}

/** Marca de tiempo hh:mm. */
export function TimeText({ time }: { time: number }) {
  return <>{formatTime(time)}</>;
}

/** Antigüedad de la última posición simulada. */
export function LocationAge({ lastPosition }: { lastPosition: number }) {
  const { now, permissions, online } = useDemoState();
  const age = Math.floor((now - lastPosition) / 1000);
  return (
    <>
      {!permissions.location
        ? 'Sin posición nueva · permiso desactivado'
        : !online
          ? `Última conocida · hace ${age} s`
          : `Actualizada hace ${age} s · demo`}
    </>
  );
}

/** Cuenta regresiva del código de vinculación (5 minutos). */
export function PairTtl({ started }: { started: number }) {
  const { now } = useDemoState();
  return <>{duration(Math.max(0, 300000 - (now - started)))}</>;
}
