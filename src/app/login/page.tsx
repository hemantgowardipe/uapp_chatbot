'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Book } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = React.useState('');
  const { login, username: currentUsername, isInitialized } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (isInitialized && currentUsername) {
      router.push('/');
    }
  }, [isInitialized, currentUsername, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };

  if (!isInitialized || currentUsername) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <div className="p-3 mb-4 bg-primary text-primary-foreground rounded-full">
            <Book className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold text-primary">DocuChat Secure</h1>
        <p className="text-muted-foreground mt-2">Enter your name to start a secure session.</p>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Please enter your name to continue.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Name</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Start Session
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
