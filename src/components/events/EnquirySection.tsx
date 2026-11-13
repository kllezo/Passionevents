import { Mail, MessageCircle, Phone } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import { EnquiryForm } from "@/components/shared/EnquiryForm";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "./SectionLabel";
import { SprigGroup } from "./botanical/Sprig";
import { buildSprig } from "./botanical/geometry";
import type { ENQUIRY_CATEGORIES } from "@/lib/constants";

const sprig = buildSprig({
  p0: { x: 10, y: 420 },
  p1: { x: 80, y: 260 },
  p2: { x: 30, y: 140 },
  p3: { x: 160, y: 10 },
  seed: 64,
  leafCount: 10,
  bloomCount: 5,
});

export function EnquirySection({
  index = "09",
  defaultCategory,
  title,
}: {
  index?: string;
  defaultCategory?: (typeof ENQUIRY_CATEGORIES)[number];
  title?: React.ReactNode;
}) {
  const wa = whatsappLink();
  const { phone, email } = site.contact;
  return (
    <section id="enquire" className="paper-grain relative scroll-mt-24 overflow-hidden bg-paper py-24 md:py-40" aria-labelledby="enquire-title">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 md:gap-16 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionLabel index={index}>Enquire</SectionLabel>
            <RevealText as="h2" id="enquire-title" className="mt-8 font-serif text-[clamp(2.6rem,4.6vw,4.8rem)] font-light leading-[0.98] text-ink">
              {title ?? (
                <>
                  Let&apos;s make your next event <em className="text-rose-deep">unforgettable.</em>
                </>
              )}
            </RevealText>
            <p className="mt-8 max-w-sm text-lg leading-relaxed text-stone">
              Tell us a little about your event. Big or small, it starts with a conversation.
            </p>
            <dl className="mt-10 space-y-4 text-[0.95rem]">
              <div>
                <dt className="eyebrow text-rose-deep">Contact</dt>
                <dd className="mt-1 font-serif text-2xl text-ink">{site.contactPerson}</dd>
              </div>
              <div>
                <dt className="eyebrow text-rose-deep">Based in</dt>
                <dd className="mt-1 text-ink">
                  {site.baseCity} · Events across {site.region}
                </dd>
              </div>
              {(phone || email || wa) && (
                <div className="pt-2">
                  <dt className="sr-only">Reach us</dt>
                  <dd className="space-y-2">
                  {phone && (
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="link-underline flex items-center gap-2 max-lg:inline-flex max-lg:rounded-full max-lg:border max-lg:border-ink/15 max-lg:bg-ivory max-lg:px-5 max-lg:py-3">
                      <Phone className="size-4" /> {phone}
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="link-underline flex items-center gap-2">
                      <Mail className="size-4" /> {email}
                    </a>
                  )}
                  {wa && (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="link-underline flex items-center gap-2">
                      <MessageCircle className="size-4" /> Chat on WhatsApp
                    </a>
                  )}
                  </dd>
                </div>
              )}
            </dl>
            <svg viewBox="0 0 200 440" className="pointer-events-none mt-10 hidden h-64 w-auto opacity-80 lg:block" aria-hidden="true">
              <SprigGroup g={sprig} strokeWidth={1.3} />
            </svg>
          </div>
        </div>
        <div className="max-lg:-mx-1 max-lg:rounded-[1.75rem] max-lg:bg-ivory max-lg:p-5 max-lg:shadow-[0_30px_70px_-45px_rgb(94_52_64/0.6)] max-lg:ring-1 max-lg:ring-rose/15 sm:max-lg:p-8 lg:col-span-7 lg:col-start-6">
          <EnquiryForm theme="events" source="events" defaultCategory={defaultCategory} whatsappHref={wa} />
        </div>
      </div>
    </section>
  );
}
