'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/hooks/use-app';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import DocumentManager from '@/components/document-manager';
import ChatInterface from '@/components/chat-interface';

export default function Home() {
  const { username, isInitialized } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (isInitialized && !username) {
      router.push('/login');
    }
  }, [isInitialized, username, router]);

  if (!isInitialized || !username) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar side="left" className="p-0">
        <DocumentManager />
      </Sidebar>
      <SidebarInset>
        <ChatInterface />
      </SidebarInset>
    </SidebarProvider>
  );
}
