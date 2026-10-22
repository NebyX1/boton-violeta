import { useState } from 'react';
import { useDemo } from '@/providers/DemoStateProvider';
import { navigateTo } from '@/lib/routes';
import { guardianCriteria, guardianScore } from '@/services/demoData';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import type { GuardianApplication, GuardianApplicationStatus } from '@/types/demo';

const statusMeta: Record<GuardianApplicationStatus, { label: string; color: 'amber' | 'brand' | 'green' | 'red' }> = {
  pending: { label: 'Pendiente', color: 'amber' },
  review: { label: 'En revisión', color: 'brand' },
  approved: { label: 'Aprobada', color: 'green' },
  rejected: { label: 'Rechazada', color: 'red' },
};

const availabilityOptions = [
  'Mañanas',
  'Tardes',
  'Noches',
  'Fines de semana',
  'Disponibilidad variable',
];

function recommendation(score: number) {
  if (score >= 100) return { label: 'Cumple todos los criterios', color: 'green' as const };
  if (score >= 80) return { label: 'Revisar antecedentes faltantes', color: 'amber' as const };
  return { label: 'No cumple los criterios mínimos', color: 'red' as const };
}

/**
 * Web independiente del registro de vigilantes autorizados.
 * Comparte el estado de la demo: lo que se aprueba acá aparece como
 * dispositivo disponible en la app y en la consola institucional.
 */
export function GuardianRegistryPage() {
  const { state, dispatch } = useDemo();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    neighborhood: '',
    availability: 'Mañanas',
    motivation: '',
    identity: false,
    references: false,
    training: false,
  });
  const [sent, setSent] = useState<string | null>(null);

  const score = guardianScore(form);
  const filtered = state.guardianApps.filter(
    (a) => state.guardianFilter === 'all' || a.status === state.guardianFilter,
  );

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.neighborhood.trim()) {
      setSent('Completá nombre, teléfono y barrio para enviar la postulación.');
      return;
    }
    dispatch({ type: 'submitGuardianApplication', data: form });
    setSent(`Postulación de ${form.name.trim()} enviada. Queda pendiente de revisión.`);
    setForm({
      name: '',
      phone: '',
      email: '',
      neighborhood: '',
      availability: 'Mañanas',
      motivation: '',
      identity: false,
      references: false,
      training: false,
    });
  };

  return (
    <div className="min-h-[100dvh] bg-[#f7f4fb] text-[#3d2b4d]">
      <header className="border-b border-[#e7dcf3] bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-brand text-white shadow-sm">
              <Icon name="shield" />
            </span>
            <div>
              <strong className="block text-[14px] leading-tight">Botón Violeta</strong>
              <small className="text-[9px] uppercase tracking-[1.4px] text-[#a289b8]">
                Registro de vigilantes comunitarios
              </small>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="gray">WEB INDEPENDIENTE · DEMO</Badge>
            <Button variant="outline" small icon="mobile" onClick={() => navigateTo('/')}>
              Volver a la app
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-5 py-8">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-[6px] rounded-full bg-[#efe6fa] px-3 py-1 text-[9px] font-bold uppercase tracking-[1.2px] text-brand">
              <Icon name="users" size="sm" className="h-3 w-3" />
              Convocatoria abierta
            </span>
            <h1 className="mt-4 font-display text-[38px] leading-[1.08] tracking-[-1.6px]">
              Ser vigilante es un
              <br />
              <span className="text-brand">compromiso</span>, no un cargo.
            </h1>
            <p className="mt-4 max-w-[540px] text-[13px] leading-relaxed text-[#7b648d]">
              Vecinas y vecinos pueden postularse para acompañar pedidos de ayuda de la comunidad.
              La autorización se evalúa con criterios públicos y verificables. Aprobar una
              postulación no habilita a confrontar a nadie: habilita a recibir alertas y ofrecer
              apoyo coordinado.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {guardianCriteria.map((c) => (
                <div key={c.key} className="rounded-[16px] border border-[#e7dcf3] bg-white p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#efe6fa] text-brand">
                    <Icon name={c.key === 'identity' ? 'user' : c.key === 'references' ? 'users' : 'heart'} size="sm" />
                  </span>
                  <strong className="mt-3 block text-[11px]">{c.label}</strong>
                  <small className="mt-1 block text-[10px] text-[#9b86ac]">{c.points} puntos</small>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[16px] border border-[#f0d9c4] bg-[#fdf3e9] p-4 text-[11px] leading-relaxed text-[#8a6134]">
              <strong className="mb-1 block">Criterios de prueba (a definir en la versión final)</strong>
              Identidad verificada, dos referencias vecinales y formación básica. El puntaje base
              (40) reconoce que la postulación está completa. Las decisiones son de esta demo y no
              constituyen un antecedente real.
            </div>

            <div className="mt-6 rounded-[20px] border border-[#e7dcf3] bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[16px]">Postulaciones recibidas</h2>
                  <p className="text-[10px] text-[#9b86ac]">
                    Revisá, aprobá o rechazá. Los cambios se ven al instante en la app.
                  </p>
                </div>
                <Badge color="gray">{state.guardianApps.length}</Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(
                  [
                    ['all', 'Todas'],
                    ['pending', 'Pendientes'],
                    ['review', 'En revisión'],
                    ['approved', 'Aprobadas'],
                    ['rejected', 'Rechazadas'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => dispatch({ type: 'setGuardianFilter', filter: value })}
                    className={`rounded-full border px-3 py-[6px] text-[10px] font-bold transition ${
                      state.guardianFilter === value
                        ? 'border-brand bg-brand text-white'
                        : 'border-[#e7dcf3] bg-white text-[#7b648d] hover:border-brand/50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {filtered.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onReview={(status) => dispatch({ type: 'reviewGuardianApp', id: app.id, status })}
                  />
                ))}
                {!filtered.length && (
                  <p className="rounded-[14px] border border-dashed border-[#e0d3ee] p-6 text-center text-[11px] text-[#9b86ac]">
                    No hay postulaciones en este filtro.
                  </p>
                )}
              </div>
            </div>
          </div>

          <aside className="rounded-[22px] border border-[#e7dcf3] bg-white p-5 shadow-[0_14px_40px_#5b2d7d0d] lg:sticky lg:top-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[18px]">Quiero ser vigilante</h2>
                <p className="text-[10px] text-[#9b86ac]">Formulario de postulación · datos ficticios</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#efe6fa] text-brand">
                <Icon name="plus" size="sm" />
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Nombre y apellido" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Vecina de prueba" />
              <Field label="Teléfono" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="099 000 000" />
              <Field label="Correo" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="vecina@ejemplo.invalid" />
              <Field label="Barrio o zona" value={form.neighborhood} onChange={(v) => setForm({ ...form, neighborhood: v })} placeholder="Centro" />
            </div>

            <label className="mt-3 block">
              <span className="mb-1 block text-[10px] font-bold text-[#7b648d]">Disponibilidad</span>
              <select
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
                className="w-full rounded-[12px] border border-[#e7dcf3] bg-[#fbf9fe] px-3 py-[9px] text-[11px] outline-none focus:border-brand"
              >
                {availabilityOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-3 block">
              <span className="mb-1 block text-[10px] font-bold text-[#7b648d]">¿Por qué querés participar?</span>
              <textarea
                value={form.motivation}
                onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                rows={3}
                placeholder="Contanos brevemente cómo podrías acompañar."
                className="w-full resize-none rounded-[12px] border border-[#e7dcf3] bg-[#fbf9fe] px-3 py-[9px] text-[11px] outline-none focus:border-brand"
              />
            </label>

            <div className="mt-4 flex flex-col gap-2">
              {guardianCriteria.map((c) => (
                <label
                  key={c.key}
                  className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-[#eee5f7] bg-[#fbf9fe] px-3 py-[10px]"
                >
                  <input
                    type="checkbox"
                    checked={form[c.key]}
                    onChange={(e) => setForm({ ...form, [c.key]: e.target.checked })}
                    className="h-4 w-4 accent-[#8b5cc7]"
                  />
                  <span className="flex-1 text-[11px]">{c.label}</span>
                  <span className="text-[9px] font-bold text-[#9b86ac]">+{c.points}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 rounded-[14px] bg-[#f7f2fd] p-3">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span>Puntaje de prueba</span>
                <span className="text-brand">{score} / 100</span>
              </div>
              <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-[#e7dcf3]">
                <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${score}%` }} />
              </div>
              <small className="mt-2 block text-[9px] text-[#9b86ac]">
                {recommendation(score).label}. La decisión final la toma el equipo de la demo.
              </small>
            </div>

            <Button block icon="send" className="mt-4" onClick={submit}>
              Enviar postulación
            </Button>

            {sent && (
              <p className="mt-3 rounded-[12px] bg-[#e9f6f0] px-3 py-[10px] text-[10px] leading-relaxed text-[#2f7a62]">
                {sent}
              </p>
            )}

            <p className="mt-3 text-[9px] leading-relaxed text-[#a18cb2]">
              No ingreses datos reales. Esta web no envía información a ninguna institución ni
              consulta antecedentes reales.
            </p>
          </aside>
        </section>
      </main>

      <footer className="border-t border-[#e7dcf3] px-5 py-5 text-center text-[9px] text-[#a18cb2]">
        Botón Violeta · Registro de vigilantes · Maqueta de demostración
      </footer>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold text-[#7b648d]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[12px] border border-[#e7dcf3] bg-[#fbf9fe] px-3 py-[9px] text-[11px] outline-none focus:border-brand"
      />
    </label>
  );
}

function ApplicationCard({
  app,
  onReview,
}: {
  app: GuardianApplication;
  onReview: (status: GuardianApplicationStatus) => void;
}) {
  const meta = statusMeta[app.status];
  const rec = recommendation(app.score);
  return (
    <article className="rounded-[16px] border border-[#ece2f6] bg-[#fcfaff] p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <strong className="text-[12px]">{app.name}</strong>
          <p className="text-[10px] text-[#9b86ac]">
            {app.id} · {app.neighborhood} · {app.availability}
          </p>
        </div>
        <Badge color={meta.color}>{meta.label.toUpperCase()}</Badge>
      </div>

      <p className="mt-2 text-[10px] leading-relaxed text-[#7b648d]">{app.motivation}</p>

      <div className="mt-3 flex flex-wrap gap-1">
        {guardianCriteria.map((c) => (
          <span
            key={c.key}
            className={`rounded-full px-2 py-[3px] text-[8px] font-bold ${
              app[c.key] ? 'bg-[#e9f6f0] text-[#2f7a62]' : 'bg-[#f4eef9] text-[#a18cb2]'
            }`}
          >
            {app[c.key] ? '✓' : '–'} {c.label}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#ece2f6]">
          <div
            className={`h-full rounded-full ${
              app.score >= 100 ? 'bg-[#4fa985]' : app.score >= 80 ? 'bg-[#d9a13b]' : 'bg-[#d0526f]'
            }`}
            style={{ width: `${app.score}%` }}
          />
        </div>
        <span className="text-[9px] font-bold">{app.score}/100</span>
        <Badge color={rec.color}>{rec.label}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          small
          variant="success"
          icon="check"
          onClick={() => onReview('approved')}
          disabled={app.status === 'approved'}
        >
          Dar de alta
        </Button>
        <Button
          small
          variant="secondary"
          icon="clock"
          onClick={() => onReview('review')}
          disabled={app.status === 'review'}
        >
          Poner en revisión
        </Button>
        <Button
          small
          variant="danger"
          icon="close"
          onClick={() => onReview('rejected')}
          disabled={app.status === 'rejected'}
        >
          Rechazar
        </Button>
      </div>
    </article>
  );
}
