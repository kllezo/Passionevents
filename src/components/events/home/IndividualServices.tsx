"use client";

import Image from "next/image";
import { Pic } from "@/components/shared/Pic";
import { useEffect, useRef, useState } from "react";
import { serviceGroups } from "@/content/events";
import { gsap, media } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";
import { EventsButton } from "../Button";

/**
 * Bookable services as an editorial index. On desktop a framed photograph
 * follows the cursor and crossfades as you move between rows.
 */
export function IndividualServices({ showIntro = true, index = "04" }: { showIntro?: boolean; index?: string }) {
  const listRef = useRef<HTMLUListElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [follow, setFollow] = useState(false);

  useEffect(() => {
    const ok = window.matchMedia(`${media.desktop} and ${media.finePointer}`);
    const update = () => setFollow(ok.matches);
    update();
    ok.addEventListener("change", update);
    return () => ok.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!follow) return;
    const f = floatRef.current!;
    const list = listRef.current!;
    gsap.set(f, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
    const x = gsap.quickTo(f, "x", { duration: 0.7, ease: "power3" });
    const y = gsap.quickTo(f, "y", { duration: 0.7, ease: "power3" });
    const r = gsap.quickTo(f, "rotate", { duration: 0.9, ease: "power3" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      const b = list.getBoundingClientRect();
      x(e.clientX - b.left);
      y(e.clientY - b.top);
      r(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    };
    const enter = () => gsap.to(f, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "expo.out" });
    const leave = () => {
      gsap.to(f, { autoAlpha: 0, scale: 0.6, duration: 0.5, ease: "expo.out" });
      setActive(null);
    };
    list.addEventListener("pointermove", move);
    list.addEventListener("pointerenter", enter);
    list.addEventListener("pointerleave", leave);
    return () => {
      list.removeEventListener("pointermove", move);
      list.removeEventListener("pointerenter", enter);
      list.removeEventListener("pointerleave", leave);
    };
  }, [follow]);

  return (
    <section className="relative bg-ivory py-28 md:py-40" aria-labelledby="services-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        {showIntro && (
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SectionLabel index={index}>Individual services</SectionLabel>
              <RevealText as="h2" id="services-title" className="mt-8 font-serif text-[clamp(2.8rem,6.6vw,7rem)] font-light leading-[0.92] tracking-[-0.02em] text-ink">
                One team. <em className="text-rose-deep">Every detail.</em> Every experience.
              </RevealText>
            </div>
            <div className="grid gap-8 self-end sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
              <div className="border-t border-ink/15 pt-5">
                <p className="font-serif text-2xl italic text-ink">Book a single service</p>
                <p className="mt-2 text-stone">Need only décor, a photographer, a band or the cars? Book exactly what you need.</p>
              </div>
              <div className="border-t border-ink/15 pt-5">
                <p className="font-serif text-2xl italic text-ink">Or hand us everything</p>
                <p className="mt-2 text-stone">End-to-end planning and execution — every vendor, every guest, every cue.</p>
              </div>
            </div>
          </div>
        )}

        <ul ref={listRef} className="relative mt-20 border-t border-ink/15" aria-label="Services you can book">
          {serviceGroups.map((g, i) => (
            <li
              key={g.title}
              onPointerEnter={() => setActive(i)}
              className="group relative grid gap-4 border-b border-ink/15 py-7 md:grid-cols-12 md:items-center md:py-9"
            >
              <span className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-rose transition-transform duration-700 ease-[var(--ease-silk)] group-hover:scale-x-100" />
              <span className="font-serif text-sm italic text-rose md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex items-center gap-4 md:col-span-5">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-full md:hidden">
                  <Pic image={g.image} alt="" sizes="56px" className="" />
                </span>
                <h3 className="font-serif text-[clamp(1.8rem,3.4vw,3.2rem)] leading-none text-ink transition-all duration-700 ease-[var(--ease-silk)] group-hover:translate-x-3 group-hover:italic group-hover:text-rose-deep">
                  {g.title}
                </h3>
              </div>
              <p className="text-[0.95rem] leading-relaxed text-stone md:col-span-6 md:text-right">{g.items.join(" · ")}</p>
            </li>
          ))}

          {follow && (
            <div ref={floatRef} className="pointer-events-none absolute left-0 top-0 z-10 h-[300px] w-[240px] overflow-hidden rounded-t-full rounded-b-2xl shadow-2xl" aria-hidden="true">
              {serviceGroups.map((g, i) => (
                <Image
                  key={g.title}
                  src={g.image.src}
                  alt=""
                  fill
                  sizes="240px"
                  className={`object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-silk)] ${active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
                />
              ))}
            </div>
          )}
        </ul>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-xl text-stone">
            Also available: guest management, car rentals, anchors, return gifts and anything else your event needs — just ask.
          </p>
          <EventsButton href="/services" variant="outline" cursor="View">
            All services
          </EventsButton>
        </div>
      </div>
    </section>
  );
}
