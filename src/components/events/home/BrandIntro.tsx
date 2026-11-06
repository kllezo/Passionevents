import Image from "next/image";
import { stock } from "@/content/media";
import { ImageReveal, Parallax, ScrubWords } from "@/motion/primitives";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";
import { EventsButton } from "../Button";

export function BrandIntro() {
  return (
    <section className="relative overflow-hidden bg-ivory py-28 md:py-40" aria-labelledby="intro-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="01">The studio</SectionLabel>
            <h2 id="intro-title" className="sr-only">
              About Passion Events
            </h2>
            <ScrubWords
              className="mt-10 font-serif text-[clamp(2rem,4.2vw,4.1rem)] font-light leading-[1.12] tracking-[-0.01em] text-ink"
              text="Passion Events creates and manages events of every kind — weddings, corporate events, private celebrations, destination events and live concerts. Whether it is fifty guests or five thousand, we bring the same care to every detail."
            />
            <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:gap-14">
              <RevealText as="p" className="max-w-md text-lg leading-relaxed text-stone">
                Book a single service or hand us the whole celebration. One team plans, designs, coordinates and runs the day — so you get to enjoy it.
              </RevealText>
              <EventsButton href="/about" variant="outline" cursor="Read">
                Our story
              </EventsButton>
            </div>
          </div>

          {/* Layered editorial images */}
          <div className="relative h-[560px] md:h-[720px] lg:col-span-5">
            <Parallax speed={6} className="absolute right-0 top-0 h-[78%] w-[72%]">
              <ImageReveal shape="arch" className="arch h-full w-full" parallax={6}>
                <Image src={stock.ceremonyStage.src} alt={stock.ceremonyStage.alt} fill sizes="(max-width: 1024px) 70vw, 30vw" className="object-cover" />
              </ImageReveal>
            </Parallax>
            <Parallax speed={22} className="absolute bottom-[4%] left-0 h-[42%] w-[48%]">
              <ImageReveal shape="up" delay={0.2} className="h-full w-full rounded-[1.5rem] border-[6px] border-ivory shadow-2xl">
                <Image src={stock.vaseBloom.src} alt={stock.vaseBloom.alt} fill sizes="(max-width: 1024px) 50vw, 20vw" className="object-cover" />
              </ImageReveal>
            </Parallax>
            <Parallax speed={-10} className="absolute bottom-0 right-[6%]">
              <p className="font-script text-6xl text-coral md:text-7xl">every detail</p>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
}
