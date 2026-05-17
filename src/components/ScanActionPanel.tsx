import { useMemo, useState } from 'react';
import type { ProductAction, ProductConfig } from '../types/app';

interface ScanActionPanelProps {
  product: ProductConfig;
}

function actionClass(style: ProductAction['style']) {
  if (style === 'primary') {
    return 'border border-apple-accent bg-apple-accent text-white';
  }

  if (style === 'secondary') {
    return 'border border-white/30 bg-white/10 text-white';
  }

  return 'border border-white/30 bg-transparent text-white';
}

export function ScanActionPanel({ product }: ScanActionPanelProps) {
  const initialMedia = product.mediaPreviews[0];
  const [activeMediaId, setActiveMediaId] = useState<string>(initialMedia?.id ?? '2d');

  const activeMedia = useMemo(
    () => product.mediaPreviews.find((preview) => preview.id === activeMediaId) ?? initialMedia,
    [activeMediaId, initialMedia, product.mediaPreviews],
  );

  if (!activeMedia) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-50">
      <article className="pointer-events-auto mx-auto w-full max-w-3xl rounded-[24px] border border-white/25 bg-black/60 p-4 shadow-apple backdrop-blur-xl">
        <p className="text-[11px] uppercase tracking-[0.12em] text-white/60">{product.scanPanel.eyebrow}</p>
        <h2 className="mt-1 text-lg font-semibold leading-tight text-white">{product.scanPanel.title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-white/75">{product.scanPanel.subtitle}</p>

        <section className="mt-3">
          <h3 className="text-[11px] uppercase tracking-[0.12em] text-white/60">{product.scanPanel.actionsHeading}</h3>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {product.actions.map((action) => (
              <a
                key={action.id}
                href={action.url}
                target="_blank"
                rel="noreferrer"
                className={`flex h-10 items-center justify-center rounded-full px-3 text-sm font-medium transition hover:brightness-105 ${actionClass(action.style)}`}
              >
                {action.label}
              </a>
            ))}
          </div>
        </section>

        <section className="mt-4">
          <h3 className="text-[11px] uppercase tracking-[0.12em] text-white/60">{product.scanPanel.mediaHeading}</h3>

          <div className="mt-2 inline-flex rounded-full border border-white/25 bg-black/40 p-1">
            {product.mediaPreviews.map((preview) => (
              <button
                key={preview.id}
                type="button"
                onClick={() => setActiveMediaId(preview.id)}
                className={`h-8 min-w-14 rounded-full px-3 text-sm transition ${
                  activeMediaId === preview.id ? 'bg-apple-accent text-white' : 'text-white/70'
                }`}
              >
                {preview.label}
              </button>
            ))}
          </div>

          <div className="mt-3 rounded-2xl border border-white/20 bg-black/30 p-3">
            <h4 className="text-sm font-semibold text-white">{activeMedia.headline}</h4>
            <p className="mt-1 text-xs leading-relaxed text-white/70">{activeMedia.description}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-white/80">
              {activeMedia.points.map((point) => (
                <li key={point}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </article>
    </div>
  );
}
