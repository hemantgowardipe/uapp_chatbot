'use client';

import { cn } from '@/lib/utils';
import type { Message } from '@/contexts/app-context';
import { User, Bot, FileText, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui/button';
import Image from 'next/image';

interface ChatMessageProps {
  message?: Message;
  isLoading?: boolean;
  isProcessing?: boolean;
  onSuggestedQuestion?: (question: string) => void;
}

export default function ChatMessage({ message, isLoading = false, isProcessing = false, onSuggestedQuestion }: ChatMessageProps) {
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
  
  const hasSuggestions = isAssistant && message.suggestedQuestions && message.suggestedQuestions.length > 0;

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
        'max-w-[75%] space-y-2',
        !hasSuggestions && 'rounded-lg px-4 py-3',
        !hasSuggestions && (isAssistant ? 'bg-card' : 'bg-primary text-primary-foreground')
      )}>
        <div className={cn(
          'rounded-lg px-4 py-3',
          (isAssistant ? 'bg-card text-card-foreground' : 'bg-primary text-primary-foreground'),
        )}>
          {typeof message.content === 'string' && isAssistant ? (
              <ReactMarkdown
                className="prose prose-sm max-w-none text-inherit prose-p:whitespace-pre-wrap"
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary underline" />,
                  p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />,
                  ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 mb-2" />,
                  ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 mb-2" />,
                  li: ({node, ...props}) => <li {...props} className="mb-1" />,
                  blockquote: ({node, ...props}) => <blockquote {...props} className="border-l-4 border-muted-foreground/50 pl-4 italic" />,
                  code: ({node, inline, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline ? (
                      <code {...props} className="block bg-background/50 p-2 rounded-md my-2 whitespace-pre-wrap">{children}</code>
                    ) : (
                      <code {...props} className="bg-muted px-1 py-0.5 rounded-sm font-mono">{children}</code>
                    )
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
          ) : (
            <div className="prose prose-sm max-w-none text-inherit whitespace-pre-wrap">{message.content}</div>
          )}
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
                      <div key={index} className="p-2 border rounded-md bg-background/50 text-sm space-y-2">
                        <p className="font-semibold flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          {source.documentName}
                        </p>
                        {source.snippet && (
                          <blockquote className="border-l-2 pl-2 italic text-muted-foreground">
                            "{source.snippet}"
                          </blockquote>
                        )}
                        {source.image && (
                           <Image 
                            src={source.image.trimEnd()} 
                            alt={`Source image from ${source.documentName}`}
                            width={500}
                            height={300}
                            className="rounded-md border object-contain"
                           />
                        )}
                      </div>
                    ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
        
        {hasSuggestions && (
          <div className="pt-2 space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground px-2">
              <Sparkles className="h-4 w-4" />
              Suggested Questions
            </h4>
            <div className="flex flex-wrap gap-2">
              {message.suggestedQuestions?.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestedQuestion?.(q)}
                  className="text-left h-auto"
                  disabled={isProcessing}
                >
                  {q}
                </Button>
              ))}
            </div>
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
