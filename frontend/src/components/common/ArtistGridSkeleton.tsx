export const ArtistGridSkeleton = () => (
  <section className="mb-4 w-full">
    <div className="w-full grid grid-cols-6 sm:grid-cols-8 gap-3 items-start mb-4 animate-pulse">
      <div className="flex flex-col items-center gap-1">
        <div className="aspect-square max-w-[56px] w-full rounded border-2 border-dashed border-slate-200" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="aspect-square max-w-[56px] w-full bg-slate-200 rounded" />
          <div className="h-2.5 w-10 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  </section>
);
