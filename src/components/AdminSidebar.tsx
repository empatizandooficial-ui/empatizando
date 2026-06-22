import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BrainCircuit, 
  Settings, 
  Film, 
  Zap, 
  Library, 
  Compass,
  LogOut,
  HeartPulse,
  GripVertical
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_MENU = [
  { id: "dashboard", name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { id: "crm", name: "CRM Leads", path: "/admin/crm", icon: Users },
  { id: "agents", name: "Painel de Agentes", path: "/admin/agents", icon: BrainCircuit },
  { id: "professionals", name: "Especialistas", path: "/admin/professionals", icon: HeartPulse },
  { id: "settings", name: "Laboratório Neural", path: "/admin/settings", icon: Settings },
  { id: "hermes", name: "Laboratório OSINT", path: "/admin/hermes", icon: Compass },
  { id: "librarian", name: "O Bibliotecário", path: "/admin/librarian", icon: Library },
  { id: "studio", name: "Estúdio de Criação", path: "/admin/studio", icon: Film },
  { id: "automation", name: "Automação", path: "/admin/automation", icon: Zap },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem("admin-sidebar-order");
    if (saved) {
      try {
        const savedOrder = JSON.parse(saved);
        // Map saved order to actual items, appending any new items at the end
        const orderedItems = savedOrder
          .map((id: string) => DEFAULT_MENU.find(i => i.id === id))
          .filter(Boolean);
        const newItems = DEFAULT_MENU.filter(i => !savedOrder.includes(i.id));
        return [...orderedItems, ...newItems];
      } catch (e) {
        return DEFAULT_MENU;
      }
    }
    return DEFAULT_MENU;
  });

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragHandleId, setDragHandleId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const oldIndex = menuItems.findIndex(i => i.id === draggedId);
    const newIndex = menuItems.findIndex(i => i.id === targetId);

    const updatedMenu = [...menuItems];
    const [movedItem] = updatedMenu.splice(oldIndex, 1);
    updatedMenu.splice(newIndex, 0, movedItem);

    setMenuItems(updatedMenu);
    localStorage.setItem("admin-sidebar-order", JSON.stringify(updatedMenu.map(i => i.id)));
    setDraggedId(null);
  };

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
            <div
              key={item.id}
              draggable={dragHandleId === item.id}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item.id)}
              className={`flex items-center group/item ${draggedId === item.id ? "opacity-50" : "opacity-100"}`}
            >
              <div 
                className="px-1 text-stone-700 hover:text-stone-400 cursor-grab active:cursor-grabbing flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                onMouseEnter={() => setDragHandleId(item.id)}
                onMouseLeave={() => setDragHandleId(null)}
              >
                <GripVertical className="w-4 h-4" />
              </div>
              <Link
                to={item.path}
                draggable={false}
                className={`flex-1 flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20 shadow-inner"
                    : "hover:bg-stone-800 hover:text-stone-100 border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-stone-500"}`} />
                {item.name}
              </Link>
            </div>
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
