import { useDemo } from '@/providers/DemoStateProvider';
import { Screen } from '@/components/layout/PhoneFrame';
import { PageTop } from '@/components/layout/PageTop';
import { Icon } from '@/components/common/Icon';
import { Note } from '@/components/common/Note';
import { Segmented } from '@/components/common/Segmented';
import { Toggle } from '@/components/common/Toggle';

const accessibility: Array<{ key: 'large' | 'contrast' | 'reduced'; icon: string; title: string; sub: string }> = [
  { key: 'large', icon: 'access', title: 'Texto más grande', sub: 'Más legibilidad en las pantallas.' },
  { key: 'contrast', icon: 'eye', title: 'Contraste reforzado', sub: 'Más contraste en textos y bordes.' },
  { key: 'reduced', icon: 'pause', title: 'Reducir movimiento', sub: 'Desactivar transiciones decorativas.' },
];

/** Apariencia y accesibilidad: tema, tamaño de texto, contraste y movimiento. */
export function SettingsScreen() {
  const { state, dispatch } = useDemo();

  return (
    <Screen>
      <PageTop title="A tu manera" sub="Diseño que se adapta a vos" />

      <span className="block mt-[19px] mb-2 text-[12px] font-bold">Apariencia</span>
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            ['light', 'sun', 'Claro'],
            ['dark', 'moon', 'Oscuro'],
          ] as const
        ).map(([theme, icon, label]) => (
          <button
            key={theme}
            type="button"
            onClick={() => dispatch({ type: 'setTheme', theme })}
            className={`flex flex-col items-center gap-3 p-[17px] rounded-[20px] border tile-shadow ${
              state.theme === theme ? 'bg-brand-soft border-transparent' : 'bg-paper border-line'
            }`}
          >
            <Icon name={icon} size="lg" className="text-brand" />
            <strong className="text-[12px]">{label}</strong>
          </button>
        ))}
      </div>

      <span className="block mt-[19px] mb-2 text-[12px] font-bold">Accesibilidad</span>
      <div className="px-4 border border-line rounded-[19px] bg-paper">
        {accessibility.map((item) => (
          <div key={item.key} className="flex items-center gap-[11px] py-[15px] border-b border-line last:border-b-0">
            <span className="flex items-center justify-center w-[31px] h-[31px] rounded-[13px] bg-brand-soft text-brand shrink-0">
              <Icon name={item.icon} size="sm" />
            </span>
            <div className="flex-1 min-w-0">
              <strong className="block text-[12px]">{item.title}</strong>
              <small className="block text-[10px] text-muted mt-1 leading-[1.6]">{item.sub}</small>
            </div>
            <Toggle
              on={state[item.key]}
              label={item.title}
              onToggle={() => dispatch({ type: 'toggleSetting', key: item.key })}
            />
          </div>
        ))}
      </div>

      <span className="block mt-[19px] mb-2 text-[12px] font-bold">Privacidad del SOS</span>
      <Segmented
        value={state.alertVisibility}
        onChange={(value) => dispatch({ type: 'setAlertVisibility', value })}
        options={[
          { value: 'circle', label: 'Solo mi círculo' },
          { value: 'community', label: 'Mi círculo + comunidad' },
        ]}
      />
      <p className="mt-2 text-[9px] leading-relaxed text-muted">
        {state.alertVisibility === 'circle'
          ? 'Cuando pidas ayuda, solo tus contactos de confianza y la central verán la alerta.'
          : 'Cuando pidas ayuda, los dispositivos comunitarios dentro del radio también verán el pedido.'}
      </p>

      <span className="block mt-[19px] mb-2 text-[12px] font-bold">Interfaz de dispositivo</span>
      <Segmented
        value={state.device}
        onChange={(device) => dispatch({ type: 'setDevice', device })}
        options={[
          { value: 'ios', label: 'iPhone' },
          { value: 'android', label: 'Android' },
        ]}
      />

      <div className="mt-6">
        <Note icon="mobile" color="gray">
          Los estilos reproducen una experiencia móvil. Esta demo es React web, no una app Expo
          instalada.
        </Note>
      </div>
    </Screen>
  );
}
