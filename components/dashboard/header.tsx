'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, User, LogOut, Settings, Menu } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useMobileMenu } from "@/contexts/mobile-menu-context";

export function Header() {
  const { user, logout } = useAuth();
  const { toggle } = useMobileMenu();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-14 md:h-16 items-center px-4">
        {/* Mobile Menu Button - visible on mobile, hidden on desktop */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 md:hidden"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1 flex items-center space-x-4">
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search anything..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search button - visible on mobile only */}
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
          </Button>
          
          <div className="relative group">
            <Button variant="ghost" className="h-8 flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <div className="text-start hidden md:block">
                  <p className="text-sm font-medium line-clamp-1">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{user?.role || 'Guest'}</p>
                </div>
              </div>
            </Button>
            
            <div className="absolute right-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-100 ease-in-out z-50">
              <div className="bg-white rounded-md shadow-lg border py-1">
                <Link href="/dashboard/profile" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                <Link href="/dashboard/settings" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
