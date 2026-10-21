/** Formateo y exportación de la demostración. */

/** Duración en mm:ss a partir de milisegundos. */
export function duration(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/** Hora local hh:mm (es-UY). */
export function formatTime(t: number): string {
  return new Intl.DateTimeFormat('es-UY', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(t));
}

/** Filas a CSV con separador ";" y BOM, con escape anti-inyección. */
export function csv(rows: unknown[][]): string {
  return (
    '\uFEFF' +
    rows
      .map((r) =>
        r
          .map((v) => {
            let s = String(v ?? '');
            if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
            return '"' + s.replace(/"/g, '""') + '"';
          })
          .join(';'),
      )
      .join('\r\n')
  );
}

/** Descarga un archivo de demostración generado en el navegador. */
export function downloadText(
  name: string,
  text: string,
  type = 'text/plain;charset=utf-8',
): void {
  const blob = new Blob([text], { type });
  const u = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = u;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
