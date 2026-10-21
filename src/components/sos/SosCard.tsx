import { useDemo } from '@/providers/DemoStateProvider';
import { alertContacts, liveAlert } from '@/providers/demoSelectors';
import { Icon } from '@/components/common/Icon';

/**
 * Tarjeta principal del SOS con botón orbital.
 * Un toque abre la configuración de audiencia; con alerta activa la revisa.
 */
export function SosCard() {
  const { state, dispatch } = useDemo();
  const alert = liveAlert(state);

  return (
    <section className="relative overflow-hidden text-center mt-[21px] px-4 pt-[17px] pb-4 rounded-[25px] border border-[#e3d6f3] dark:border-[#674481] sos-card-gradient">
      <div className="flex justify-between text-[7px] font-[750] tracking-[1.4px] text-[#aa8dbd] dark:text-[#c8aadf]">
        <span>CUANDO LO NECESITES</span>
        <span>✦ BOTÓN VIOLETA</span>
      </div>

      <div className="relative w-[198px] h-[195px] mx-auto mt-[6px] flex items-center justify-center">
        <span className="absolute inset-[3px] rounded-full border border-[#9663d91a]" />
        <span className="absolute inset-[21px] rounded-full border border-[#9663d929]" />
        <button
          type="button"
          onClick={() => dispatch({ type: alert ? 'viewSos' : 'sosOptions' })}
          aria-label={alert ? 'Ver SOS activo' : 'Configurar y activar SOS de prueba'}
          className="relative z-10 w-[137px] h-[137px] rounded-full border-[7px] border-[#b389eb38] sos-button-gradient text-white shadow-[0_12px_25px_#7c45c933,inset_0_0_0_1px_#bc96ee44] flex flex-col items-center justify-center gap-[6px] transition-transform hover:scale-[1.035]"
        >
          <Icon name={alert ? 'radar' : 'hand'} className="w-[30px] h-[30px] [stroke-width:1.4]" />
          <b className="font-display font-extrabold text-[30px] leading-none tracking-[1px]">SOS</b>
          <span className="text-[7px] tracking-[1.6px] opacity-80">
            {alert ? 'ALERTA ACTIVA' : 'PEDIR AYUDA'}
          </span>
        </button>
      </div>

      <p className="text-[10px] font-[650] text-[#8e6caa] dark:text-[#c8aadf] -mt-0.5">
        {alert ? 'Tu alerta de prueba sigue activa' : 'Tocá para activar una alerta'}
      </p>

      <button
        type="button"
        onClick={() => dispatch({ type: 'sosOptions' })}
        className="flex items-center gap-[6px] mx-auto mt-[13px] px-[10px] py-[7px] rounded-[30px] border border-white/67 bg-white/50 text-[8px] text-[#9c7fb1] dark:bg-white/5 dark:border-white/10 dark:text-[#c2a2db]"
      >
        <Icon name="shield" className="w-[13px] h-[13px]" />
        Central
        {state.audience.family ? ` + ${alertContacts(state).length} contactos` : ''}
        {state.audience.public ? ' + comunidad' : ''}
        <Icon name="chev" className="w-[13px] h-[13px]" />
      </button>
    </section>
  );
}
