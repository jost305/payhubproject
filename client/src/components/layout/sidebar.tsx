import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CreditCard, 
  Settings, 
  BarChart3,
  Play,
  LogOut,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const navigationItems = user?.role === 'admin' ? [
    { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/admin', label: 'Users', icon: Users },
    { href: '/dashboard/admin', label: 'Projects', icon: FileText },
    { href: '/dashboard/admin', label: 'Payments', icon: CreditCard },
    { href: '/dashboard/admin', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/admin', label: 'Settings', icon: Settings },
  ] : [
    { href: '/dashboard/freelancer', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/freelancer', label: 'Projects', icon: FileText },
    { href: '/dashboard/freelancer', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/freelancer', label: 'Settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Play className="text-white text-sm" />
          </div>
          <span className="text-xl font-bold text-slate-900">PayVidi</span>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>

      <Separator />

      {/* User Info */}
      <div className="p-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Account</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-600 hover:text-slate-900"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-slate-200 ${className}`}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
