export default function LeadsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="h-7 w-32 bg-gray-200 rounded-xl" />
          <div className="h-4 w-48 bg-gray-100 rounded-xl mt-2" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-10 w-36 bg-gray-200 rounded-xl" />
          <div className="h-10 w-36 bg-gray-200 rounded-xl" />
          <div className="h-10 w-44 bg-gray-200 rounded-xl" />
          <div className="h-10 w-32 bg-gray-200 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
          </div>
          <div className="h-9 w-20 bg-gray-200 rounded-xl mt-3" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="text-left px-4 py-3 whitespace-nowrap">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-24 bg-gray-100 rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center sm:justify-between gap-3">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-8 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
