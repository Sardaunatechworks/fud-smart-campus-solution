import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Search, 
  PlusCircle, 
  Users, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  Bell,
  User as UserIcon,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const studentLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Lost Item Page', icon: PlusCircle, path: '/report-lost' },
    { name: 'Found Item Page', icon: Search, path: '/report-found' },
    { name: 'Team', icon: Users, path: '/team' },
  ];

  const adminLinks = [
    { name: 'Dashboard', icon: ShieldCheck, path: '/admin' },
    { name: 'Manage Lost Items', icon: AlertCircle, path: '/admin/items?type=lost' },
    { name: 'Manage Found Items', icon: Search, path: '/admin/items?type=found' },
    { name: 'Manage Students', icon: Users, path: '/admin/users' },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 lg:w-20'} overflow-hidden`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-fud-green rounded-lg flex items-center justify-center text-white font-bold shrink-0">
              F
            </div>
            {isOpen && <span className="font-bold text-lg text-slate-800 truncate">FUD Logo</span>}
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-fud-green text-white shadow-lg shadow-fud-green/20' 
                      : 'text-slate-500 hover:bg-slate-100 hover:text-fud-green'
                  }`}
                >
                  <link.icon size={20} />
                  {isOpen && <span className="font-medium">{link.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 p-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={20} />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Navbar: React.FC<{ sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-20 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 transition-all duration-300">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 bg-fud-green rounded-lg flex items-center justify-center text-white font-bold">F</div>
            <span className="font-bold text-slate-800">FUD Logo</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.fullName}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
              <UserIcon size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className={`pt-20 pb-10 px-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
