import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Play, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  
  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const NavLinks = () => (
    <>
      <Link href="#features" className="text-slate-600 hover:text-primary transition-colors">
        Features
      </Link>
      <Link href="#pricing" className="text-slate-600 hover:text-primary transition-colors">
        Pricing
      </Link>
      <Link href="#about" className="text-slate-600 hover:text-primary transition-colors">
        About
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Play className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-slate-900">PayVidi</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <NavLinks />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:inline">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/freelancer'}>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden sm:inline-flex">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="gradient-primary text-white">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
            
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-4">
                  <NavLinks />
                  {!user && (
                    <>
                      <Button variant="ghost" asChild>
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button asChild className="gradient-primary text-white">
                        <Link href="/register">Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
