import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { en } from "@/dictionaries/en";
import { fr } from "@/dictionaries/fr";

/** 404 — shown in both languages because not-found cannot read route params. */
export default function NotFound() {
  return (
    <main id="main" className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-5 text-center">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      <div>
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-4 text-h2 font-semibold">{en.notFound.title}</h1>
        <p className="mt-2 text-lg text-muted">{fr.notFound.title}</p>
        <p className="mx-auto mt-6 max-w-md text-muted">{en.notFound.text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/en" className={buttonClass("primary", "lg")}>
            <ArrowLeft size={17} aria-hidden="true" />
            {en.notFound.home}
          </Link>
          <Link href="/fr" className={buttonClass("secondary", "lg")}>
            {fr.notFound.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
