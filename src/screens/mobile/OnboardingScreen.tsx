import { useDemo } from '@/providers/DemoStateProvider';
import { Avatar } from '@/components/common/Avatar';
import { Button, TextButton } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Logo } from '@/components/common/Logo';

const slides: Array<{ t1: string; t2: string; text: string; icon: string }> = [
  {
    t1: 'Tu gente.',
    t2: 'Más cerca.',
    text: 'Una red de cuidado para cuando la necesitás. Tu círculo, la comunidad y la central, conectados.',
    icon: 'heart',
  },
  {
    t1: 'Tu ubicación.',
    t2: 'Tu decisión.',
    text: 'Vinculá cuentas sin compartir tu ubicación. Activá el seguimiento solo cuando lo elijas.',
    icon: 'lock',
  },
  {
    t1: 'Un botón.',
    t2: 'Muchas manos.',
    text: 'Pedí ayuda a tu círculo y elegí si también querés avisar a personas cercanas.',
    icon: 'radar',
  },
];

/** Introducción en 3 pasos con arte orbital. */
export function OnboardingScreen() {
  const { state, dispatch } = useDemo();
  const slide = slides[state.onboarding] ?? slides[0];

  return (
    <div className="px-[22px] pt-[21px] pb-[26px] animate-appear">
      <div className="flex items-center justify-between gap-[10px]">
        <Logo />
        <TextButton onClick={() => dispatch({ type: 'go', screen: 'roles' })}>Omitir</TextButton>
      </div>

      <div className="relative h-[280px] flex items-center justify-center mt-6">
        <span className="absolute w-[230px] h-[230px] rounded-full border border-brand/15" />
        <span className="absolute w-[168px] h-[168px] rounded-full border border-brand/25" />
        <div className="flex items-center justify-center w-[110px] h-[110px] rounded-[36px] bg-brand-soft text-brand">
          <Icon name={slide.icon} size="xl" />
        </div>
        <span className="absolute top-[23px] left-[22px]">
          <Avatar name="Elena Ríos" color="peach" />
        </span>
        <span className="absolute top-[130px] right-[16px]">
          <Avatar name="Sofía Acosta" color="mint" />
        </span>
        <span className="absolute bottom-[13px] left-[61px]">
          <Avatar name="Martín Ríos" color="blue" />
        </span>
      </div>

      <h1 className="text-center text-[28px] leading-[1.2] tracking-[-1px]">
        {slide.t1}
        <br />
        <span className="text-brand">{slide.t2}</span>
      </h1>
      <p className="text-center text-[12px] text-muted mt-4">{slide.text}</p>

      <div className="flex justify-center gap-2 mt-5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Introducción ${i + 1}`}
            onClick={() => dispatch({ type: 'setOnboarding', step: i })}
            className={`h-2 rounded-full transition-all ${
              i === state.onboarding ? 'w-5 bg-brand' : 'w-2 bg-brand-soft'
            }`}
          />
        ))}
      </div>

      <Button
        block
        className="mt-5"
        iconRight={state.onboarding === 2 ? undefined : 'arrow'}
        onClick={() => dispatch({ type: 'onboardingNext' })}
      >
        {state.onboarding === 2 ? 'Empezar' : 'Continuar'}
      </Button>

      <p className="text-center text-[9px] text-muted mt-4 leading-[1.6]">
        Cualquier persona puede formar parte de esta red.
        <br />
        Esta experiencia es una demostración.
      </p>
    </div>
  );
}
