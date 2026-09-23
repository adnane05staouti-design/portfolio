"use client";

import { useEffect, useState } from "react";

export function TableOfContents({ items, title }: { items: { id: string; title: string }[]; title: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={title} className="sticky top-24">
      <p className="eyebrow mb-4">{title}</p>
      <ol className="space-y-0.5 border-l border-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={`-ml-px block border-l py-1.5 pl-4 text-sm transition-colors ${
                active === item.id ? "border-accent text-fg" : "border-transparent text-subtle hover:text-fg"
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
