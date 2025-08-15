'use client';

import { cn } from '@/lib/utils';
import type { Message } from '@/contexts/app-context';
import { User, Bot, FileText } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ChatMessageProps {
  message?: Message;
  isLoading?: boolean;
}

export default function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isAssistant = message?.role === 'assistant' || isLoading;

  if (isLoading) {
    return (
      <div className={cn('flex items-start gap-4')}>
        <Avatar className="h-9 w-9 border border-border">
          <AvatarFallback>
            <Bot className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center space-x-2 pt-2">
          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  if (!message) return null;

  return (
    <div className={cn('flex items-start gap-4', isAssistant ? '' : 'justify-end')}>
      {isAssistant && (
        <Avatar className="h-9 w-9 border border-border">
          <AvatarFallback>
            <Bot className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn(
        'max-w-[75%] space-y-2 rounded-lg px-4 py-3',
        isAssistant
          ? 'bg-card text-card-foreground'
          : 'bg-primary text-primary-foreground'
      )}>
        <div className="prose prose-sm max-w-none text-inherit whitespace-pre-wrap">{message.content}</div>
        {isAssistant && message.sources && message.sources.length > 0 && (
          <div className="pt-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="sources" className="border-b-0">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline p-2 -ml-2">
                  View Sources ({message.sources.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 mt-2">
                  {message.sources.map((source, index) => (
                    <div key={index} className="p-2 border rounded-md bg-background/50 text-sm">
                      <p className="font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        {source.documentName}
                      </p>
                      <blockquote className="mt-1 border-l-2 pl-2 italic text-muted-foreground">
                        "{source.snippet}"
                      </blockquote>
                    </div>
                  ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
       {!isAssistant && (
        <Avatar className="h-9 w-9 border border-border">
          <AvatarFallback>
            <User className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
