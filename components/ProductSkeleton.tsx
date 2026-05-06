export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      {/* Image */}
      <div className="skeleton w-full aspect-[4/3]" />
      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div className="skeleton h-2.5 sm:h-3 w-1/3 rounded" />
        <div className="skeleton h-3 sm:h-4 w-full rounded" />
        <div className="skeleton h-3 sm:h-4 w-4/5 rounded" />
        <div className="skeleton h-3 sm:h-4 w-1/2 rounded" />
        <div className="flex gap-2 pt-1">
          <div className="skeleton h-7 sm:h-8 flex-1 rounded-lg" />
          <div className="skeleton h-7 sm:h-8 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
