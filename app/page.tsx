'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to WindSurf Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sign in to access your dashboard and manage your business analytics.
        </p>
        <div className="space-x-4">
          <Button 
            onClick={() => router.push('/login')}
          >
            Sign In
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            View Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
