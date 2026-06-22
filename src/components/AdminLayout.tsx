import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 min-h-screen flex flex-col relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
