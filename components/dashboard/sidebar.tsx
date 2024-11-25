'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { title: 'Users', href: '/dashboard/users', icon: Users },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold">WindSurf</h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
                isActive 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
