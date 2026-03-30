export default function MetaAdsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-32 bg-gray-200 rounded-xl" />
          <div className="h-4 w-40 bg-gray-100 rounded-xl mt-2" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-44 bg-gray-200 rounded-xl" />
          <div className="h-10 w-44 bg-gray-200 rounded-xl" />
          <div className="h-10 w-32 bg-gray-200 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-gray-200 rounded" />
              <div className="w-10 h-10 bg-gray-100 rounded-xl" />
            </div>
            <div className="h-9 w-24 bg-gray-200 rounded-xl mt-3" />
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-12">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-3 w-16 bg-gray-200 rounded" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-4 py-4 border-b border-gray-100 flex gap-12">
            {Array.from({ length: 9 }).map((_, j) => (
              <div key={j} className="h-4 w-20 bg-gray-100 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
