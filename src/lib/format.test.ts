import { describe, expect, it } from 'vitest';
import { csv, duration, formatTime } from '@/lib/format';

describe('format', () => {
  it('formatea duraciones en mm:ss', () => {
    expect(duration(0)).toBe('00:00');
    expect(duration(65_000)).toBe('01:05');
    expect(duration(-5)).toBe('00:00');
  });

  it('formatea horas locales es-UY', () => {
    const t = new Date(2026, 0, 1, 9, 41).getTime();
    expect(formatTime(t)).toBe('09:41');
  });

  it('genera CSV con separador ";" y escape anti-inyección', () => {
    const out = csv([
      ['ID', 'Nombre'],
      ['=cmd', 'Ana "La"'],
    ]);
    expect(out.startsWith('\uFEFF')).toBe(true);
    expect(out).toContain('"ID";"Nombre"');
    expect(out).toContain('"\'=cmd"');
    expect(out).toContain('"Ana ""La"""');
  });
});
