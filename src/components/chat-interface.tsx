'use client';

import * as React from 'react';
import { useApp } from '@/hooks/use-app';
import { useToast } from '@/hooks/use-toast';
import { answerQuestions } from '@/ai/flows/answer-questions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import ChatMessage from './chat-message';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ChatInterface() {
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { documents, messages, addMessage } = useApp();
  const { toast } = useToast();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    if (documents.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Documents',
        description: 'Please upload at least one document before asking a question.',
      });
      return;
    }

    const userMessageContent = input;
    addMessage({ role: 'user', content: userMessageContent });
    setInput('');
    setIsLoading(true);

    try {
      const response = await answerQuestions({
        documents: documents.map(({ name, content }) => ({ name, content })),
        question: userMessageContent,
      });

      addMessage({
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
      });
    } catch (error) {
      console.error('Error answering question:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
      });
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not get an answer from the AI.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="p-4 border-b flex items-center justify-between bg-background">
        <div>
          <h2 className="text-xl font-bold">Chat</h2>
          <p className="text-sm text-muted-foreground">Ask questions about your documents</p>
        </div>
      </header>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && <ChatMessage isLoading />}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <form
          onSubmit={handleSendMessage}
          className="relative"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="pr-12"
            disabled={isLoading}
            autoFocus
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button type="submit" size="icon" variant="ghost" disabled={!input.trim() || isLoading}>
                        <Send className="h-5 w-5" />
                        <span className="sr-only">Send</span>
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>
        </form>
      </div>
    </div>
  );
}
