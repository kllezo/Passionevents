import Image from "next/image";
import Link from "next/link";
import { brand } from "@/content/media";

export default function NotFound() {
  return (
    <main id="main" className="paper-grain grid min-h-screen place-items-center bg-ivory px-5 text-center text-ink">
      <div>
        <Image src={brand.logoSmall.src} alt="Passion Events" width={brand.logoSmall.width} height={brand.logoSmall.height} className="mx-auto h-auto w-32" />
        <p className="eyebrow mt-10 text-rose-deep">404</p>
        <h1 className="mt-4 font-serif text-6xl font-light md:text-8xl">
          This page has <em className="text-rose-deep">wandered off.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-stone">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm font-semibold uppercase tracking-[0.18em]">
          <Link href="/" className="rounded-full bg-ink px-7 py-4 text-ivory">
            Back home
          </Link>
          <Link href="/concerts" className="rounded-full border border-ink/20 px-7 py-4">
            Passion Live
          </Link>
        </div>
      </div>
    </main>
  );
}
