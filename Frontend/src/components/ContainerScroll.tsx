"use client";
import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion, MotionValue } from "motion/react";

export default function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scaleRange = isMobile ? [0.9, 1] : [1.04, 1];

  const rotate = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center p-2 md:p-6">
      <div className="relative w-full py-4 md:py-8" style={{ perspective: "1000px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale}>{children}</Card>
      </div>
    </div>
  );
}

function Header({ translate, titleComponent }: { translate: MotionValue<number>; titleComponent: React.ReactNode }) {
  return (
    <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl text-center mb-6 md:mb-8">
      {titleComponent}
    </motion.div>
  );
}

function Card({ rotate, scale, children }: { rotate: MotionValue<number>; scale: MotionValue<number>; children: React.ReactNode }) {
  return (
    <motion.div
      style={{ rotateX: rotate, scale, boxShadow: "0 0 #00000026, 0 9px 20px #0000001f, 0 37px 37px #0000001a" }}
      className="mx-auto mt-4 h-[18rem] w-full max-w-5xl rounded-2xl border border-zinc-300 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 md:h-[24rem] md:p-4"
    >
      <div className="h-full w-full overflow-auto rounded-xl bg-white dark:bg-zinc-900">
        {children}
      </div>
    </motion.div>
  );
}
