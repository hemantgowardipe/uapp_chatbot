'use client';

import * as React from 'react';
import { useApp } from '@/hooks/use-app';
import { useToast } from '@/hooks/use-toast';
import { answerQuestions } from '@/ai/flows/answer-questions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles } from 'lucide-react';
import ChatMessage from './chat-message';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ChatInterface() {
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { documents, messages, addMessage, updateMessage } = useApp();
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

  const processQuestion = async (question: string) => {
    if (documents.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Documents',
        description: 'Please upload at least one document before asking a question.',
      });
      return;
    }
    
    setIsLoading(true);
    addMessage({ role: 'user', content: question });

    // Hide suggestions on previous messages
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && lastMessage.suggestedQuestions) {
        updateMessage(lastMessage.id, { suggestedQuestions: [] });
      }
    }
    
    const assistantMessageId = addMessage({ role: 'assistant', content: '' });

    try {
      const finalResponse = await answerQuestions({
        documents: documents.map(({ name, content, images }) => ({ name, content, images })),
        question: question,
      });

      updateMessage(assistantMessageId, {
        content: finalResponse.answer,
        sources: finalResponse.sources,
        suggestedQuestions: finalResponse.suggestedQuestions,
      });

    } catch (error) {
      console.error('Error answering question:', error);
      updateMessage(assistantMessageId, {
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

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const question = input;
    setInput('');
    await processQuestion(question);
  };
  
  const handleSuggestedQuestion = async (question: string) => {
    if (isLoading) return;
    await processQuestion(question);
  }

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
            <ChatMessage
              key={message.id}
              message={message}
              onSuggestedQuestion={handleSuggestedQuestion}
              isProcessing={isLoading}
            />
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
