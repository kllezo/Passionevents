"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import { InstagramIcon } from "@/components/shared/InstagramIcon";

/**
 * Phones & tablets only: a floating glass dock with the actions people take
 * most — plan an event, call, WhatsApp / Instagram. It glides in once the
 * hero is passed and steps aside over the enquiry form and the footer, so it
 * never covers what it points to.
 */
export function MobileDock() {
  const [show, setShow] = useState(false);
  const { phone, instagram } = site.contact;
  const wa = whatsappLink();

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const blockers = Array.from(document.querySelectorAll<HTMLElement>("#enquire, footer, #mobile-menu[aria-hidden='false']"));
      const covered = blockers.some((b) => {
        const r = b.getBoundingClientRect();
        return r.top < vh * 0.92 && r.bottom > 0;
      });
      setShow(y > vh * 0.75 && !covered);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-center px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-700 ease-[var(--ease-silk)] lg:hidden ${
        show ? "translate-y-0 opacity-100" : "translate-y-[140%] opacity-0"
      }`}
      aria-hidden={!show}
      inert={!show}
    >
      <nav
        aria-label="Quick actions"
        className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/50 bg-ivory/75 p-1.5 shadow-[0_20px_50px_-20px_rgb(94_52_64/0.55),inset_0_1px_0_rgb(255_255_255/0.7)] backdrop-blur-xl backdrop-saturate-150"
      >
        <Link
          href="/contact#enquire"
          className="group inline-flex items-center gap-3 rounded-full bg-ink py-3 pl-5 pr-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ivory"
        >
          Plan your event
          <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-coral to-rose text-ink transition-transform duration-500 group-active:rotate-45">
            <ArrowUpRight className="size-3.5" />
          </span>
        </Link>
        {phone && (
          <a href={`tel:${phone.replace(/\s/g, "")}`} aria-label={`Call ${phone}`} className="grid size-11 place-items-center rounded-full text-ink transition-colors active:bg-blush/60">
            <Phone className="size-[1.1rem]" />
          </a>
        )}
        {wa ? (
          <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="grid size-11 place-items-center rounded-full text-ink transition-colors active:bg-blush/60">
            <MessageCircle className="size-[1.1rem]" />
          </a>
        ) : (
          instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Passion Events on Instagram" className="grid size-11 place-items-center rounded-full text-ink transition-colors active:bg-blush/60">
              <InstagramIcon className="size-[1.1rem]" />
            </a>
          )
        )}
      </nav>
    </div>
  );
}
