'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, AlertTriangle, MessageSquare, User, Sparkles } from 'lucide-react';
import { getChatResponse, type ChatInput, type ChatOutput } from '@/ai/flows/chat-flow';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Add a welcome message from the assistant when the page loads
    setMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: 'আসসালামু আলাইকুম! আমি সেবক, আপনার সেবাপ্ল্যান এআই সহকারী। অন্ত্যেষ্টিক্রিয়া পরিকল্পনা বা আমাদের পরিষেবা সম্পর্কে আপনার কোনো প্রশ্ন থাকলে জিজ্ঞাসা করতে পারেন।'
      }
    ]);
    inputRef.current?.focus();
  }, []);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const chatHistoryForAI = messages.slice(-10).map(msg => ({ // Send last 10 messages as history
      role: msg.role === 'user' ? 'user' : 'model', // Map 'assistant' to 'model' for AI
      text: msg.content
    }));

    try {
      const aiInput: ChatInput = {
        userInput: userMessage.content,
        history: chatHistoryForAI,
      };
      const result: ChatOutput = await getChatResponse(aiInput);
      const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: result.aiResponse };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'একটি অজানা ত্রুটি ঘটেছে।';
      setError(`বার্তা পাঠাতে সমস্যা হয়েছে: ${errorMessage}`);
      toast({
        title: "ত্রুটি",
        description: `বার্তা পাঠাতে সমস্যা হয়েছে: ${errorMessage}`,
        variant: "destructive",
      });
      // Optionally add the failed user message back to input or keep it in messages with an error state
      // For now, we keep it in messages and show a general error
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center border-b">
          <Sparkles className="h-10 w-10 mx-auto text-primary mb-2" />
          <CardTitle className="text-2xl font-headline">এআই চ্যাট সহকারী - সেবক</CardTitle>
          <CardDescription>
            আপনার প্রশ্ন জিজ্ঞাসা করুন অথবা সেবাপ্ল্যান সম্পর্কিত তথ্য জানুন।
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[50vh] p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end space-x-2",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Sparkles className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-4 py-2 text-sm shadow",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    )}
                  >
                    {message.content.split('\n').map((line, i) => (
                      <span key={i}>{line}{i !== message.content.split('\n').length - 1 && <br />}</span>
                    ))}
                  </div>
                  {message.role === 'user' && (
                     <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-end space-x-2 justify-start">
                   <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Sparkles className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  <div className="max-w-[70%] rounded-lg px-4 py-3 text-sm shadow bg-muted text-muted-foreground rounded-bl-none flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ভাবছি...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {error && (
            <div className="p-4 border-t bg-destructive/10 text-destructive">
              <div className="flex items-center text-sm">
                <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          )}

        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="এখানে আপনার বার্তা লিখুন..."
              className="flex-1"
              disabled={isLoading}
              autoComplete="off"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
              <span className="ml-2 sr-only md:not-sr-only">পাঠান</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
