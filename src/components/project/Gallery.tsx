"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, ImageIcon, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { forwardRef, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { PlaceholderTag } from "@/components/ui/Placeholder";

export type GalleryItem = {
  src: string | null;
  placeholderLabel?: string;
  alt: string;
  caption?: string;
};

type Labels = { close: string; previous: string; next: string; zoom: string };

type Props = {
  items: GalleryItem[];
  labels: Labels;
  variant?: "browser" | "plain";
  columns?: 1 | 2;
  /** "cover" crops screenshots from the top; "contain" shows whole diagrams on white, unrecompressed. */
  fit?: "cover" | "contain";
};

export function Gallery({ items, labels, variant = "browser", columns = 2, fit = "cover" }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const available = items.map((item, i) => ({ item, i })).filter(({ item }) => item.src);

  return (
    <>
      <ul className={`grid gap-5 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
        {items.map((item, i) => {
          const media = item.src ? (
            <button
              type="button"
              onClick={() => setOpen(i)}
              className={`group relative block w-full overflow-hidden ${fit === "contain" ? "aspect-[4/3] bg-white" : "aspect-[2/1] bg-bg"}`}
              aria-label={`${labels.zoom}: ${item.alt}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                quality={90}
                unoptimized={fit === "contain"}
                sizes={columns === 2 ? "(min-width: 1024px) 640px, (min-width: 768px) 50vw, 100vw" : "(min-width: 1280px) 1100px, 100vw"}
                className={
                  fit === "contain"
                    ? "object-contain p-3 transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
                    : "object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
                }
              />
              <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full border border-line-strong bg-bg/80 text-fg opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Maximize2 size={15} aria-hidden="true" />
              </span>
            </button>
          ) : (
            <div className="bg-grid flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 bg-bg p-6 text-center">
              <ImageIcon size={22} className="text-subtle" aria-hidden="true" />
              <PlaceholderTag value={item.placeholderLabel ?? "ADD IMAGE"} />
              <span className="text-sm text-subtle">{item.alt}</span>
            </div>
          );
          return (
            <li key={i} className={columns === 2 && items.length % 2 === 1 && i === 0 ? "md:col-span-2" : ""}>
              <figure>
                {variant === "browser" ? <BrowserFrame>{media}</BrowserFrame> : <div className="overflow-hidden rounded-xl border border-line-strong">{media}</div>}
                {item.caption && <figcaption className="mt-3 text-sm text-muted">{item.caption}</figcaption>}
              </figure>
            </li>
          );
        })}
      </ul>

      <Lightbox
        index={open}
        onClose={() => setOpen(null)}
        onNavigate={(dir) => {
          if (open === null || available.length < 2) return;
          const pos = available.findIndex(({ i }) => i === open);
          const next = available[(pos + dir + available.length) % available.length];
          setOpen(next.i);
        }}
        item={open !== null ? items[open] : null}
        canNavigate={available.length > 1}
        fit={fit}
        labels={labels}
      />
    </>
  );
}

function Lightbox({
  index,
  item,
  onClose,
  onNavigate,
  canNavigate,
  labels,
  fit,
}: {
  index: number | null;
  item: GalleryItem | null;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
  canNavigate: boolean;
  labels: Labels;
  fit: "cover" | "contain";
}) {
  const reduce = useReducedMotion();
  // Zoom belongs to one image: navigating to another image resets it automatically.
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const zoomed = zoomedIndex !== null && zoomedIndex === index;
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const isOpen = index !== null && !!item?.src;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose, onNavigate],
  );

  useEffect(() => {
    if (!isOpen) return;
    previousFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
      previousFocus.current?.focus();
    };
  }, [isOpen, handleKey]);

  return (
    <AnimatePresence>
      {isOpen && item?.src && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          className="fixed inset-0 z-[100] flex flex-col bg-bg/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.1 : 0.25 }}
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
            <p className="truncate text-sm text-muted">{item.caption ?? item.alt}</p>
            <div className="flex items-center gap-1">
              <IconButton onClick={() => setZoomedIndex(zoomed ? null : index)} aria={labels.zoom}>
                {zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
              </IconButton>
              {canNavigate && (
                <>
                  <IconButton onClick={() => onNavigate(-1)} aria={labels.previous}>
                    <ChevronLeft size={18} />
                  </IconButton>
                  <IconButton onClick={() => onNavigate(1)} aria={labels.next}>
                    <ChevronRight size={18} />
                  </IconButton>
                </>
              )}
              <IconButton ref={closeRef} onClick={onClose} aria={labels.close}>
                <X size={18} />
              </IconButton>
            </div>
          </div>
          <div
            className={`relative flex-1 ${zoomed ? "overflow-auto" : "overflow-hidden"}`}
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div
              className={`${zoomed ? "relative h-[200%] w-[200%] min-w-[1600px]" : "absolute inset-4 md:inset-10"} ${fit === "contain" ? "rounded-lg bg-white" : ""}`}
            >
              {/* Full-resolution original in the lightbox: no recompression, sharpest text. */}
              <Image src={item.src} alt={item.alt} fill sizes="100vw" className={fit === "contain" ? "object-contain p-4" : "object-contain"} priority unoptimized />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const IconButton = forwardRef<HTMLButtonElement, { onClick: () => void; aria: string; children: ReactNode }>(
  function IconButton({ onClick, aria, children }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label={aria}
        className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
      >
        {children}
      </button>
    );
  },
);
