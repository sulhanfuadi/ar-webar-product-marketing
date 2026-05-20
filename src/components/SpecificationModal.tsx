import { useEffect } from 'react';
import type { ProductSpecification } from '../types/app';

interface SpecificationModalProps {
  open: boolean;
  title: string;
  specifications: ProductSpecification[];
  onClose: () => void;
}

export function SpecificationModal({ open, title, specifications, onClose }: SpecificationModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[65] bg-black/80">
      <div
        className="h-full w-full px-2 sm:flex sm:items-center sm:justify-center sm:p-4"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 0.5rem)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)',
        }}
      >
        <article className="mx-auto flex h-full w-full max-w-3xl flex-col rounded-[24px] border border-white/25 bg-black/80 p-3 shadow-apple backdrop-blur-xl sm:h-auto sm:max-h-[min(88dvh,760px)] sm:p-4">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.12em] text-white/60">Specification</p>
              <h2 className="mt-1 truncate text-xl font-semibold text-white sm:text-2xl">{title}</h2>
              <p className="mt-1 text-sm text-white/70">Key product information for quick discussion.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 min-w-20 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 text-base font-medium text-white transition hover:bg-white/20"
            >
              Close
            </button>
          </header>

          <div className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-white/20 bg-black/30 p-3 sm:p-4">
            {specifications.length > 0 ? (
              <ul className="space-y-2">
                {specifications.map((specification) => (
                  <li
                    key={`${specification.label}-${specification.value}`}
                    className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
                  >
                    <p className="text-xs uppercase tracking-[0.08em] text-white/60">{specification.label}</p>
                    <p className="mt-1 text-sm font-medium text-white">{specification.value}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/80">No specification data is configured for this product.</p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
