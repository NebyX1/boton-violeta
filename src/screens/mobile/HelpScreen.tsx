import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';

const faqs: Array<{ key: string; icon: string; title: string; sub: string }> = [
  { key: 'sos', icon: 'radar', title: '¿Cómo activo un SOS?', sub: 'Audiencia, cuenta regresiva y confirmaciones' },
  { key: 'circle', icon: 'users', title: '¿Cómo vinculo a mi familia?', sub: 'QR, invitación y aceptación' },
  { key: 'privacy', icon: 'lock', title: '¿Quién ve mi ubicación?', sub: 'Solo quien vos autorizás' },
  { key: 'offline', icon: 'wifi', title: '¿Qué pasa sin conexión?', sub: 'Pendiente no significa recibido' },
  { key: 'report', icon: 'file', title: '¿Un reporte es una denuncia?', sub: 'Diferencias en esta demostración' },
  { key: 'help', icon: 'hand', title: '¿Cómo puedo ayudar?', sub: 'Colaboración sin exponerse' },
];

/** Centro de ayuda con las preguntas frecuentes de la demo. */
export function HelpScreen() {
  const { dispatch } = useDemo();

  return (
    <Screen>
      <PageTop title="Estamos para ayudarte" sub="Guía de la experiencia" />

      <div className="px-4 border border-line rounded-[19px] bg-paper">
        {faqs.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => dispatch({ type: 'faq', faq: f.key })}
            className="flex items-center gap-[11px] w-full text-left py-[15px] border-b border-line last:border-b-0"
          >
            <span className="flex items-center justify-center w-[31px] h-[31px] rounded-[13px] bg-brand-soft text-brand shrink-0">
              <Icon name={f.icon} size="sm" />
            </span>
            <span className="flex-1 min-w-0">
              <strong className="block text-[12px]">{f.title}</strong>
              <small className="block text-[10px] text-muted mt-1">{f.sub}</small>
            </span>
            <Icon name="chev" size="sm" className="text-muted" />
          </button>
        ))}
      </div>

      <Button block className="mt-6" onClick={() => dispatch({ type: 'gallery' })}>
        Recorrer todas las pantallas
      </Button>
      <Button
        variant="outline"
        block
        className="mt-2"
        onClick={() => dispatch({ type: 'go', screen: 'onboarding' })}
      >
        Ver introducción
      </Button>

      <div className="mt-4">
        <Note icon="beaker" color="gray">
          Botón Violeta es una propuesta de diseño. No es un canal de emergencia habilitado.
        </Note>
      </div>
    </Screen>
  );
}
