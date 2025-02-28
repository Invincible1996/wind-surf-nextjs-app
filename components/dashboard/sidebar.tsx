'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  X,
  Palette,
} from 'lucide-react';
import { useMobileMenu } from '@/contexts/mobile-menu-context';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { title: 'Canvas', href: '/dashboard/canvas', icon: Palette },
  { title: 'Users', href: '/dashboard/users', icon: Users },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
  { title: 'Color Converter', href: '/dashboard/color-converter', icon: Palette }, // New menu item
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useMobileMenu();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0" // Always visible on desktop
      )}>
        <div className="flex h-full flex-col">
          <div className="flex h-14 md:h-16 items-center justify-between px-4">
            <h1 className="text-2xl font-bold px-2">WindSurf</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white hover:text-white/80"
              onClick={close}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 space-y-1 px-4 py-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => close()} // Close menu when clicking a link on mobile
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-gray-800 text-white" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
