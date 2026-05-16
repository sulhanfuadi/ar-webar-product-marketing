import { useMemo, useState } from 'react';
import type { ProductAction, ProductConfig } from '../types/app';

interface ScanActionPanelProps {
  product: ProductConfig;
}

function actionClass(style: ProductAction['style']) {
  if (style === 'primary') {
    return 'bg-apple-accent text-white border border-apple-accent';
  }

  if (style === 'secondary') {
    return 'bg-apple-bg text-apple-text border border-apple-stroke';
  }

  return 'bg-white text-apple-text border border-apple-stroke';
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
      <article className="pointer-events-auto mx-auto w-full max-w-3xl rounded-[28px] border border-white/65 bg-white/88 p-4 shadow-apple backdrop-blur-xl">
        <p className="text-[11px] uppercase tracking-[0.12em] text-apple-muted">{product.scanPanel.eyebrow}</p>
        <h2 className="mt-1 text-xl font-semibold leading-tight text-apple-text">{product.scanPanel.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-apple-muted">{product.scanPanel.subtitle}</p>

        <section className="mt-4">
          <h3 className="text-[11px] uppercase tracking-[0.12em] text-apple-muted">{product.scanPanel.actionsHeading}</h3>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {product.actions.map((action) => (
              <a
                key={action.id}
                href={action.url}
                target="_blank"
                rel="noreferrer"
                className={`flex h-10 items-center justify-center rounded-full px-3 text-sm font-medium ${actionClass(action.style)}`}
              >
                {action.label}
              </a>
            ))}
          </div>
        </section>

        <section className="mt-4">
          <h3 className="text-[11px] uppercase tracking-[0.12em] text-apple-muted">{product.scanPanel.mediaHeading}</h3>

          <div className="mt-2 inline-flex rounded-full border border-apple-stroke bg-apple-bg p-1">
            {product.mediaPreviews.map((preview) => (
              <button
                key={preview.id}
                type="button"
                onClick={() => setActiveMediaId(preview.id)}
                className={`h-8 min-w-14 rounded-full px-3 text-sm ${
                  activeMediaId === preview.id ? 'bg-apple-accent text-white' : 'text-apple-text'
                }`}
              >
                {preview.label}
              </button>
            ))}
          </div>

          <div className="mt-2 rounded-2xl border border-apple-stroke bg-apple-bg p-3">
            <h4 className="text-sm font-semibold text-apple-text">{activeMedia.headline}</h4>
            <p className="mt-1 text-xs leading-relaxed text-apple-muted">{activeMedia.description}</p>
            <ul className="mt-2 space-y-1.5 text-xs text-apple-text">
              {activeMedia.points.map((point) => (
                <li key={point} className="rounded-lg bg-white px-2.5 py-1.5">
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
