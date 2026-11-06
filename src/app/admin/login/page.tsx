import Image from "next/image";
import { brand } from "@/content/media";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main id="main" className="grid min-h-screen place-items-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-10 flex flex-col items-center text-center">
          <Image src={brand.logoSmall.src} alt="Passion Events" width={brand.logoSmall.width} height={brand.logoSmall.height} className="h-auto w-28" preload />
          <h1 className="mt-6 font-serif text-4xl">Studio dashboard</h1>
          <p className="mt-2 text-sm text-stone">Sign in to manage events, shows and enquiries.</p>
        </div>
        <div className="rounded-3xl border border-[#e8e0d4] bg-white p-8 shadow-[0_30px_80px_-40px_rgb(23_19_17/0.3)]">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
