'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4">
        <div className="flex-1 flex items-center space-x-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search anything..."
              className="pl-10 w-full"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
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
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.role || 'Guest'}</p>
                </div>
              </div>
            </Button>
            
            <div className="absolute right-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-100 ease-in-out">
              <div className="bg-white rounded-md shadow-lg border py-1">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div className="h-px bg-gray-200 my-1" />
                <Link href="/dashboard/settings" className="flex items-center px-3 py-2 text-sm hover:bg-gray-100">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-sm hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
