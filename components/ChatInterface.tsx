"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUp, Terminal, Globe, Cpu, LogOut, History, Zap, Sparkles, User as UserIcon, Settings
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface Message {
  role: "user" | "assistant";
  content: string;
  time?: string;
}

interface Chat {
  id: string;
  title: string;
  created_at: string;
}

interface Usage {
  used: number;
  limit: number;
}

export default function ChatInterface({ user }: { user: User }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatTime = (): string => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date());
  };

  useEffect(() => {
    fetchChats();
    fetchUsage();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const fetchChats = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats`, {
      headers: { 
        Authorization: `Bearer ${session?.access_token}` 
      }
    });
    if (response.ok) {
      const data = await response.json();
      setChats(data);
    }
  };

  const fetchUsage = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usage`, {
      headers: { 
        Authorization: `Bearer ${session?.access_token}` 
      }
    });
    if (response.ok) {
      const data = await response.json();
      setUsage(data);
    }
  };

  const loadChat = async (chatId: string) => {
    setLoading(true);
    setCurrentChatId(chatId);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`, {
        headers: { 
          Authorization: `Bearer ${session?.access_token}` 
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to load chat:", err);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setInput("");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          chatId: currentChatId 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.text,
            time: formatTime(),
          },
        ]);
        if (!currentChatId) {
          setCurrentChatId(data.chatId);
          fetchChats();
        }
        setUsage(data.usage);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ **Error:** ${error.message || "Uplink failed."}`,
          time: formatTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const usagePercentage = usage ? Math.min((usage.used / usage.limit) * 100, 100) : 0;

  return (
    <div className="flex h-screen bg-black text-white font-sans antialiased overflow-hidden selection:bg-white/20">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-80 flex-col liquid-glass border-r border-white/5 m-4 rounded-[2rem]">
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <Link href="/">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <Terminal className="text-black w-6 h-6" />
                </div>
              </Link>
              <span className="font-['Instrument_Serif'] text-2xl tracking-tight italic">
                Studio.ai
              </span>
            </div>
          </div>

          <button 
            onClick={startNewChat}
            className="w-full py-4 px-6 liquid-glass hover:bg-white/5 rounded-2xl text-white/70 text-sm font-medium transition-all flex items-center gap-3 border border-white/10 group mb-8"
          >
            <Sparkles className="w-4 h-4 text-blue-400 group-hover:scale-125 transition-transform" />
            New Exploration
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 mb-8 pr-2 custom-scrollbar">
            <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <History size={12} /> Recent Synapses
            </h3>
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all truncate ${
                  currentChatId === chat.id ? "bg-white/10 text-white border border-white/10" : "text-white/40 hover:bg-white/5 hover:text-white/60"
                }`}
              >
                {chat.title}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {/* Token Usage Card */}
            {usage && (
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em]">Neural Credits</span>
                  <Zap size={12} className="text-yellow-400" />
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${usagePercentage}%` }}
                    className={`h-full ${usagePercentage > 90 ? 'bg-red-500' : usagePercentage > 70 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                  ></motion.div>
                </div>
                <div className="flex justify-between text-[10px] text-white/20">
                  <span>{usage.used} used</span>
                  <span>{usage.limit} limit</span>
                </div>
              </div>
            )}

            <button 
              onClick={handleSignOut}
              className="flex items-center gap-3 text-white/30 hover:text-red-400 transition-colors text-xs font-medium px-4"
            >
              <LogOut size={14} /> Log Out System
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative m-4 lg:ml-0 overflow-hidden">
        {/* Header Pill */}
        <header className="h-20 liquid-glass rounded-3xl mb-4 border border-white/5 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 bg-white rounded-full animate-ping opacity-40"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                Neural Node Status: Active
              </span>
              <span className="text-[10px] text-white/20 truncate max-w-[200px]">
                Ident: {user.email}
              </span>
            </div>
          </div>
          <Cpu className="text-white/20 w-5 h-5" />
        </header>

        {/* Message Canvas */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-2 space-y-10 scrollbar-hide"
        >
          <div className="max-w-4xl mx-auto py-10">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-40 text-center space-y-6"
                >
                  <h2 className="text-6xl md:text-8xl font-['Instrument_Serif'] text-white">
                    Know it then <em className="italic text-white/50">all</em>.
                  </h2>
                  <p className="text-white/20 text-xs tracking-[0.4em] uppercase">
                    Transmission ready for {user.email?.split('@')[0]}
                  </p>
                </motion.div>
              ) : (
                messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col mb-12 ${m.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[90%] md:max-w-[80%] rounded-[2.5rem] px-8 py-7 shadow-2xl transition-all ${
                        m.role === "user"
                          ? "bg-white text-black font-medium selection:bg-black/10"
                          : "liquid-glass border border-white/10 text-white/90 prose prose-invert max-w-none"
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }: any) {
                            const match = /language-(\w+)/.exec(
                              className || "",
                            );
                            return !inline && match ? (
                              <div className="my-6 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code
                                className="bg-white/10 px-2 py-0.5 rounded text-indigo-300 font-mono text-sm"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          p: ({ children }) => (
                            <p className="mb-4 last:mb-0 leading-relaxed text-[17px]">
                              {children}
                            </p>
                          ),
                          li: ({ children }) => (
                            <li className="ml-4 mb-2 list-disc">
                              {children}
                            </li>
                          ),
                          strong: ({ children }) => (
                            <span className="text-white font-bold">
                              {children}
                            </span>
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                    <span className="text-[9px] text-white/20 mt-4 px-4 font-bold uppercase tracking-[0.2em]">
                      {m.role === "user" ? `Node: ${user.email?.split('@')[0]}` : "Node: Gemini"} {m.time ? `• ${m.time}` : ""}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="liquid-glass border border-white/10 rounded-full px-8 py-4">
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Pill */}
        <div className="pt-6">
          <form
            onSubmit={sendMessage}
            className="max-w-3xl mx-auto relative group pb-4"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-transparent to-transparent rounded-[3rem] blur opacity-0 group-focus-within:opacity-30 transition duration-1000"></div>
            <div className="relative">
              <input
                className="w-full liquid-glass border border-white/10 rounded-[3rem] pl-10 pr-20 py-7 text-white outline-none focus:border-white/40 transition-all text-lg placeholder:text-white/10"
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
                placeholder="Enter prompt..."
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all flex items-center justify-center disabled:bg-white/5 disabled:text-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                disabled={loading || !input.trim()}
              >
                <ArrowUp size={24} strokeWidth={3} />
              </button>
            </div>
          </form>
          <div className="flex justify-center gap-10 py-2 opacity-20">
            <p className="text-[8px] uppercase tracking-[0.5em]">Vision</p>
            <p className="text-[8px] uppercase tracking-[0.5em]">Craft</p>
          </div>
        </div>
      </main>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
