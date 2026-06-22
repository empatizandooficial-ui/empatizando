import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BrainCircuit, 
  Settings, 
  Film, 
  Zap, 
  Library, 
  Compass,
  LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "CRM Leads", path: "/admin/crm", icon: Users },
    { name: "Painel de Agentes", path: "/admin/agents", icon: BrainCircuit },
    { name: "Laboratório Neural", path: "/admin/settings", icon: Settings },
    { name: "Laboratório OSINT", path: "/admin/hermes", icon: Compass },
    { name: "O Bibliotecário", path: "/admin/librarian", icon: Library },
    { name: "Estúdio de Criação", path: "/admin/studio", icon: Film },
    { name: "Automação", path: "/admin/automation", icon: Zap },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-stone-900 text-stone-300 flex flex-col fixed left-0 top-0 border-r border-stone-800 z-50">
      <div className="p-6 border-b border-stone-800">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="font-heading font-bold text-lg text-white tracking-wide">
            Comando Central
          </h1>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20 shadow-inner"
                  : "hover:bg-stone-800 hover:text-white border border-transparent"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-stone-500"}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-stone-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5" />
          Sair do Painel
        </button>
      </div>
    </aside>
  );
}
