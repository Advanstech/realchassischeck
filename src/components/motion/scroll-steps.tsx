'use client';

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { VinJourneyVisual } from '@/components/home/vin-journey-visual';
import { cn } from '@/lib/cn';

export interface ScrollStep {
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
}

/** A sticky product demonstration on wide screens; complete stacked chapters elsewhere. */
export function ScrollSteps({ steps, id }: { readonly steps: ReadonlyArray<ScrollStep>; readonly id: string }) {
  const t = useTranslations('how');
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const railScale = useSpring(scrollYProgress, { stiffness: 180, damping: 34, restDelta: 0.001 });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(value * steps.length + 0.0001)));
    setActive(next);
  });

  return (
    <div id={id}>
      <ol className="flex flex-col gap-6 lg:hidden">
        {steps.map((step, index) => (
          <li key={step.title} className="panel-raised overflow-hidden p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="num grid size-9 shrink-0 place-items-center rounded-full bg-brand text-small font-bold text-on-brand">
                {index + 1}
              </span>
              <p className="text-eyebrow font-bold uppercase text-link">{step.kicker}</p>
            </div>
            <h3 className="mt-4 text-h2 font-bold text-brand">{step.title}</h3>
            <p className="mt-3 text-small text-text-muted">{step.body}</p>
            <div className="mt-6">
              <VinJourneyVisual active={index} compact />
            </div>
          </li>
        ))}
      </ol>

      <div ref={track} data-testid="how-track" className="relative hidden h-[280vh] lg:block">
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center py-6">
          <div className="grid w-full grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] items-center gap-12 xl:gap-20">
            <div aria-hidden="true">
              <p className="text-eyebrow font-semibold uppercase text-link">{t('sceneEyebrow')}</p>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={steps[active]?.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: reduce ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-5 min-h-48"
                >
                  <p className="text-eyebrow font-bold uppercase text-cta-ink">{t('stepLabel', { number: active + 1 })}</p>
                  <h3 className="mt-3 text-h1 font-extrabold text-brand">{steps[active]?.title}</h3>
                  <p className="mt-4 max-w-[42ch] text-body text-text-muted">{steps[active]?.body}</p>
                </motion.div>
              </AnimatePresence>

              <ol className="mt-7 flex flex-col">
                {steps.map((step, index) => (
                  <li key={step.kicker} className="flex items-center gap-4 border-t border-hairline py-3">
                    <span
                      className={cn(
                        'num text-small font-bold transition-colors duration-300',
                        index === active ? 'text-cta-ink' : 'text-text-muted',
                      )}
                    >
                      0{index + 1}
                    </span>
                    <span
                      className={cn(
                        'text-small font-semibold transition-colors duration-300',
                        index === active ? 'text-brand' : 'text-text-muted',
                      )}
                    >
                      {step.kicker}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-5 h-1 w-full max-w-xs overflow-hidden rounded-full bg-border">
                <motion.div className="h-full origin-left rounded-full bg-cta" style={{ scaleX: railScale }} />
              </div>
            </div>

            <div className="relative min-h-[34rem]">
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -16 }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <VinJourneyVisual active={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* All instructions stay available to assistive technology in the pinned layout. */}
      <div className="hidden lg:block">
        <ol className="sr-only">
          {steps.map((step, index) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <p>{t('stepLabel', { number: index + 1 })}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
