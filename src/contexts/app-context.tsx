"use client";

import type { AnswerQuestionsOutput } from '@/ai/flows/answer-questions';
import * as React from 'react';
import { useRouter } from 'next/navigation';

export interface Document {
  id: string;
  name: string;
  content: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: React.ReactNode;
  sources?: AnswerQuestionsOutput['sources'];
  suggestedQuestions?: string[];
}

interface AppContextType {
  username: string | null;
  documents: Document[];
  messages: Message[];
  login: (username: string) => void;
  logout: () => void;
  addDocument: (doc: Omit<Document, 'id'>) => void;
  removeDocument: (docId: string) => void;
  addMessage: (message: Omit<Message, 'id'>) => string;
  updateMessage: (messageId: string, updates: Partial<Omit<Message, 'id'>>) => void;
  isInitialized: boolean;
}

export const AppContext = React.createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = React.useState<string | null>(null);
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    try {
        const storedUsername = sessionStorage.getItem('docuchat_username');
        if (storedUsername) {
            setUsername(storedUsername);
            setMessages([
              {
                id: 'initial-welcome-back',
                role: 'assistant',
                content: `Welcome back, ${storedUsername}! I'm ready to answer questions about your documents.`,
              },
            ]);
        }
    } catch (error) {
        console.error("Could not access sessionStorage:", error);
    }
    setIsInitialized(true);
  }, []);

  const login = (name: string) => {
    try {
        sessionStorage.setItem('docuchat_username', name);
    } catch (error) {
        console.error("Could not access sessionStorage:", error);
    }
    setUsername(name);
    setDocuments([]);
    setMessages([
      {
        id: 'initial-hello',
        role: 'assistant',
        content: `Hello ${name}! I'm DocuChat Secure. Upload some documents and I'll be happy to answer your questions.`,
      },
    ]);
    router.push('/');
  };

  const logout = () => {
    try {
        sessionStorage.removeItem('docuchat_username');
    } catch (error) {
        console.error("Could not access sessionStorage:", error);
    }
    setUsername(null);
    setDocuments([]);
    setMessages([]);
    router.push('/login');
  };

  const addDocument = (doc: Omit<Document, 'id'>) => {
    const newDoc = { ...doc, id: `doc-${Date.now()}-${Math.random()}` };
    setDocuments((prev) => [...prev, newDoc]);
  };

  const removeDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };
  
  const addMessage = (message: Omit<Message, 'id'>) => {
    const id = `msg-${Date.now()}-${Math.random()}`;
    const newMessage = { ...message, id };
    setMessages((prev) => [...prev, newMessage]);
    return id;
  };

  const updateMessage = (messageId: string, updates: Partial<Omit<Message, 'id'>>) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  };

  const value = {
    username,
    documents,
    messages,
    login,
    logout,
    addDocument,
    removeDocument,
    addMessage,
    updateMessage,
    isInitialized,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
