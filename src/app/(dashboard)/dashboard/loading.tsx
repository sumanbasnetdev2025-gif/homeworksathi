export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="h-10 bg-[#111827] rounded-xl w-64 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-5 h-28 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-5 h-32 animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1e2d47] rounded-xl p-4 h-16 animate-pulse" />
        ))}
      </div>
    </div>
  )
}