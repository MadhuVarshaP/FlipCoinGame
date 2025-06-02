"use client"

export default function BackgroundGrid() {
  return (
    <>
      <div className="fixed inset-0 grid-pattern opacity-20" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-900 blur-[128px]" />
          <div className="absolute top-3/4 left-3/4 h-[400px] w-[400px] rounded-full bg-cyan-900 blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] rounded-full bg-pink-900 blur-[128px]" />
        </div>
      </div>
    </>
  )
}
