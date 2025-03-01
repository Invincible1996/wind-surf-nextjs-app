import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { MobileMenuProvider } from '@/contexts/mobile-menu-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileMenuProvider>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        
        <div className="flex-1 flex flex-col w-full md:pl-64">
          <Header />
          <main className="flex-1 overflow-y-auto p-2 md:p-4">
            <div className="container mx-auto max-w-[1920px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </MobileMenuProvider>
  );
}
