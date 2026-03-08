/**
 * Lightweight skeleton placeholder for lazy-loaded home sections.
 * Keeps layout stable and avoids CLS while content loads.
 */
export function SectionSkeleton() {
    return (
        <div
            className="min-h-[280px] animate-pulse rounded-2xl bg-gradient-to-br from-muted/60 to-muted/40 border border-border/40"
            aria-hidden
        />
    );
}
