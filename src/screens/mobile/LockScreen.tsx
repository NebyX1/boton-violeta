import { useEffect, useRef, useState } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { activeProfile } from '@/providers/demoSelectors';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';

const HOLD_MS = 5000;
const TICK_MS = 50;
const RING = 70;
const CIRCUMFERENCE = 2 * Math.PI * RING;

/**
 * Pantalla bloqueada (modo sleep) de ejemplo.
 * Si la opción está activada, el botón de SOS aparece al encender la pantalla.
 * Se activa solo si se mantiene presionado durante 5 segundos fijos.
 */
export function LockScreen() {
  const { state, dispatch } = useDemo();
  const profile = activeProfile(state);
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const started = useRef<number | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, []);

  const stopTimer = () => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    started.current = null;
  };

  const reset = () => {
    stopTimer();
    setHolding(false);
    if (!done) setProgress(0);
  };

  const complete = () => {
    stopTimer();
    setHolding(false);
    setDone(true);
    setProgress(1);
    dispatch({ type: 'sosFromLock' });
  };

  const start = () => {
    if (!state.lockButton || holding || done) return;
    setHolding(true);
    setDone(false);
    setProgress(0);
    started.current = Date.now();
    timer.current = window.setInterval(() => {
      const elapsed = Date.now() - (started.current ?? Date.now());
      const p = Math.min(1, elapsed / HOLD_MS);
      setProgress(p);
      if (p >= 1) complete();
    }, TICK_MS);
  };

  const remaining = Math.max(0, Math.ceil((HOLD_MS - progress * HOLD_MS) / 1000));
  const clock = new Date();
  const hh = String(clock.getHours()).padStart(2, '0');
  const mm = String(clock.getMinutes()).padStart(2, '0');
  const date = clock.toLocaleDateString('es-UY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#2c1b3f] px-[22px] pt-6 pb-7 text-white">
      <span className="pointer-events-none absolute -top-24 -right-16 h-[260px] w-[260px] rounded-full bg-[#7b4bb3]/40 blur-[40px]" />
      <span className="pointer-events-none absolute bottom-[-60px] left-[-60px] h-[230px] w-[230px] rounded-full bg-[#c44a7a]/25 blur-[50px]" />

      <div className="relative flex items-center justify-between gap-2">
        <span className="flex items-center gap-[5px] rounded-full bg-white/10 px-[9px] py-[5px] text-[8px] font-bold tracking-[1.1px]">
          <Icon name="lock" size="sm" className="h-3 w-3" />
          PANTALLA BLOQUEADA · DEMO
        </span>
        <span className="text-[8px] text-white/60">{profile?.name}</span>
      </div>

      <div className="relative mt-7 text-center">
        <p className="text-[52px] font-extrabold leading-none tracking-[-2px]">
          {hh}
          <span className="opacity-50">:</span>
          {mm}
        </p>
        <p className="mt-1 text-[10px] capitalize text-white/60">{date}</p>
      </div>

      <div className="relative mt-8 flex flex-1 flex-col items-center">
        <p className="text-center text-[9px] uppercase tracking-[1.4px] text-white/50">
          Mantené 5 segundos para pedir ayuda
        </p>

        <div className="relative mt-5 flex h-[190px] w-[190px] items-center justify-center">
          <span
            className={`absolute inset-[6px] rounded-full border border-white/10 ${
              state.lockButton && !done ? 'animate-pulse-live' : ''
            }`}
          />
          <svg viewBox="0 0 170 170" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="85" cy="85" r={RING} fill="none" stroke="rgba(255,255,255,.13)" strokeWidth="8" />
            <circle
              cx="85"
              cy="85"
              r={RING}
              fill="none"
              stroke={done ? '#63c7a5' : '#ff5d86'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
              className="transition-[stroke] duration-200"
            />
          </svg>

          <button
            type="button"
            aria-label="Mantener presionado 5 segundos para activar el SOS"
            aria-disabled={!state.lockButton}
            onPointerDown={(e) => {
              try {
                e.currentTarget.setPointerCapture(e.pointerId);
              } catch {
                /* Captura no disponible (entornos de prueba). */
              }
              start();
            }}
            onPointerUp={reset}
            onPointerCancel={reset}
            onPointerLeave={reset}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                start();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === ' ' || e.key === 'Enter') reset();
            }}
            className={`relative z-10 flex h-[137px] w-[137px] select-none flex-col items-center justify-center gap-1 rounded-full border-[6px] text-white shadow-[0_16px_34px_#00000055] transition-transform ${
              state.lockButton
                ? done
                  ? 'border-[#63c7a5]/50 bg-[#2f8f72]'
                  : 'border-white/20 bg-gradient-to-br from-[#d8396a] to-[#9e2350] active:scale-[0.98]'
                : 'cursor-not-allowed border-white/10 bg-white/10 opacity-50'
            }`}
          >
            <Icon name={done ? 'check2' : 'hand'} className="h-7 w-7 [stroke-width:1.5]" />
            <b className="text-[25px] font-extrabold leading-none tracking-[1px]">
              {done ? 'ENVIADO' : 'SOS'}
            </b>
            <span className="text-[7px] tracking-[1.3px] opacity-80">
              {!state.lockButton
                ? 'DESACTIVADO'
                : holding
                  ? `SOLTÁ Y CANCELA · ${remaining}`
                  : 'PEDIR AYUDA'}
            </span>
          </button>

          {holding && (
            <span className="absolute -bottom-1 rounded-full bg-black/45 px-3 py-1 text-[9px] font-bold">
              {progress >= 1 ? 'Activando…' : `${remaining} s`}
            </span>
          )}
        </div>

        <p className="mt-4 max-w-[260px] text-center text-[10px] leading-relaxed text-white/65">
          {done
            ? 'El SOS de prueba quedó activo y tu círculo recibió el aviso.'
            : state.lockButton
              ? 'No hace falta abrir la app. Si soltás antes de 5 segundos, se cancela.'
              : 'Activá la opción para que el botón aparezca al encender la pantalla.'}
        </p>
      </div>

      <div className="relative mt-3">
        <Note icon="shield" color="gray">
          Demostración: la pantalla y el botón son simulados. El SOS se activa con una pulsación
          sostenida de 5 segundos fijos para evitar llamados accidentales.
        </Note>
      </div>

      <button
        type="button"
        onClick={() => dispatch({ type: 'go', screen: 'home' })}
        className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] border border-white/15 bg-white/[0.06] py-[11px] text-[10px] font-bold text-white/80"
      >
        <Icon name="chev" size="sm" className="h-3 w-3 rotate-180" />
        Desbloquear y volver a la app
      </button>
    </div>
  );
}
