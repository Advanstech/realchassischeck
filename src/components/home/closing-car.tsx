'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';

export function ClosingCar() {
  const scene = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scene,
    offset: ['start end', 'end start'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.35 });
  const y = useTransform(progress, [0, 1], [96, -64]);

  return (
    <div ref={scene} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div style={{ y }} className="closing-car-parallax absolute inset-0">
        <Image
          src="/images/closing-car.png"
          alt=""
          width={1792}
          height={1024}
          sizes="100vw"
          quality={88}
          draggable={false}
          className="closing-car-image absolute bottom-0 left-[41%] h-auto w-[38rem] max-w-none -translate-x-1/2 select-none sm:left-1/2 sm:w-[64rem] lg:w-full"
          data-testid="closing-car"
        />
      </motion.div>
    </div>
  );
}
