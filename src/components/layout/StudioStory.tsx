import { Icon } from '@/components/common/Icon';
import { Segmented } from '@/components/common/Segmented';
import { useDemo } from '@/providers/DemoStateProvider';

const titles: Record<string, [string, string]> = {
  guardian: ['Estar cerca.', 'Sin invadir.'],
  community: ['Una comunidad.', 'Muchas manos.'],
  self: ['Tu gente.', 'Más cerca.'],
};

/** Columna narrativa del studio (izquierda). */
export function StudioStory() {
  const { state, dispatch } = useDemo();
  const [t1, t2] = titles[state.role] ?? titles.self;

  return (
    <aside className="hidden xl:block max-w-[330px]">
      <div className="flex items-center gap-2 text-[9px] tracking-[2px] font-[750] text-[#927da8]">
        <i className="block w-[6px] h-[6px] rounded-full bg-current" />
        LAVALLEJA · CONCEPTO 01
      </div>
      <h1 className="mt-[23px] font-display font-extrabold text-[clamp(40px,3.7vw,56px)] leading-[1.13] tracking-[-2.8px]">
        {t1}
        <br />
        <em className="not-italic text-brand">{t2}</em>
      </h1>
      <p className="mt-[23px] text-[13px] leading-[1.95] text-[#95879f] max-w-[265px]">
        Una red que se activa cuando vos lo decidís. Tu círculo, tu comunidad y la ayuda, en un mismo
        lugar.
      </p>
      <div className="h-[3px] w-9 bg-[#c6b1e4] rounded-[3px] my-[27px]" />
      <div className="flex flex-col gap-4 text-[11px] text-[#8d7b9b]">
        <div className="flex items-center gap-2">
          <Icon name="lock" className="w-[18px] h-[18px] text-[#a084c3]" /> Privacidad hasta que vos
          elijas
        </div>
        <div className="flex items-center gap-2">
          <Icon name="users" className="w-[18px] h-[18px] text-[#a084c3]" /> Personas de confianza,
          conectadas
        </div>
        <div className="flex items-center gap-2">
          <Icon name="radar" className="w-[18px] h-[18px] text-[#a084c3]" /> Ayuda cerca, cuando la
          necesitás
        </div>
      </div>
      <div className="flex gap-[30px] mt-[29px]">
        <div>
          <b className="block font-display text-[25px] tracking-[-1px]">04</b>
          <small className="text-[#a394ae] text-[9px]">perspectivas conectadas</small>
        </div>
        <div>
          <b className="block font-display text-[25px] tracking-[-1px]">01</b>
          <small className="text-[#a394ae] text-[9px]">red para cuidarnos</small>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-7 text-[10px] text-[#a18eaf]">
        Dispositivo
        <Segmented
          className="max-w-[180px]"
          value={state.device}
          onChange={(device) => dispatch({ type: 'setDevice', device })}
          options={[
            { value: 'ios', label: 'iPhone' },
            { value: 'android', label: 'Android' },
          ]}
        />
      </div>
      <p className="text-[9px] text-[#b0a0bc] leading-[1.9] mt-[22px]">
        Experiencia visual para Expo + NativeWind.
        <br />
        Prototipo React. Backend Flask no conectado.
      </p>
    </aside>
  );
}
