'use client';

import * as React from 'react';
import { useApp } from '@/hooks/use-app';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, PlusCircle, Trash2, User, Book } from 'lucide-react';

export default function DocumentManager() {
  const { username, documents, addDocument, removeDocument, logout } = useApp();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    
    if (documents.some(doc => doc.name === file.name)) {
        toast({
            variant: "destructive",
            title: "Upload Error",
            description: `A document named "${file.name}" already exists.`,
        });
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
    }

    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        addDocument({ name: file.name, content });
        toast({
          title: "Success",
          description: `Document "${file.name}" uploaded successfully.`,
        });
      } else {
        toast({
            variant: "destructive",
            title: "Upload Error",
            description: `Could not read the content of "${file.name}".`,
        });
      }
      if(fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "Upload Error",
            description: `Failed to read the file "${file.name}".`,
        });
        if(fileInputRef.current) fileInputRef.current.value = "";
    }
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-full flex-col bg-card border-r">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg">
              <Book className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">DocuChat</h1>
        </div>
      </div>

      <div className="flex-grow p-4">
        <h2 className="text-lg font-semibold mb-2">My Documents</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload documents to start asking questions.
        </p>

        <Button onClick={triggerFileInput} className="w-full mb-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.md,.text"
        />

        <ScrollArea className="h-[calc(100vh-320px)]">
          <div className="space-y-2 pr-4">
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center pt-8">No documents uploaded.</p>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 rounded-md bg-background hover:bg-muted/50">
                  <div className="flex items-center gap-3 truncate">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="truncate text-sm font-medium">{doc.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => removeDocument(doc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t mt-auto">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-semibold">{username}</span>
            </div>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>
      </div>
    </div>
  );
}
