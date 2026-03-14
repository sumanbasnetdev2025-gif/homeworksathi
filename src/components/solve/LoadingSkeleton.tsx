export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-[#1a2235] rounded-lg" />
        <div className="h-4 bg-[#1a2235] rounded w-32" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#111827] border border-[#1e2d47] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 bg-[#1a2235] rounded-lg" />
            <div className="h-4 bg-[#1a2235] rounded flex-1 max-w-[200px]" />
          </div>
          <div className="pl-10 space-y-2">
            <div className="h-3 bg-[#1a2235] rounded w-full" />
            <div className="h-3 bg-[#1a2235] rounded w-4/5" />
            <div className="h-3 bg-[#1a2235] rounded w-3/5" />
          </div>
        </div>
      ))}
      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5">
        <div className="h-3 bg-[#1a2235] rounded w-24 mb-3" />
        <div className="h-5 bg-[#1a2235] rounded w-48" />
      </div>
    </div>
  )
}