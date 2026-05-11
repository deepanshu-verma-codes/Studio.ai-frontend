"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Terminal, Globe, Cpu } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatTime = (): string => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date());
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

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
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.text || "Uplink confirmed, but no data received.",
          time: formatTime(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ **System Error:** Connection to the neural node failed.",
          time: formatTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans antialiased overflow-hidden selection:bg-white/20">
      {/* Sidebar - Liquid Glass */}
      <aside className="hidden lg:flex w-80 flex-col liquid-glass border-r border-white/5 m-4 rounded-[2rem]">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <Link href="/">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <Terminal className="text-black w-6 h-6" />
              </div>
            </Link>
            <span className="font-['Instrument_Serif'] text-2xl tracking-tight italic">
              Studio.ai
            </span>
          </div>

          <button className="w-full py-4 px-6 liquid-glass hover:bg-white/5 rounded-2xl text-white/70 text-sm font-medium transition-all flex items-center gap-3 border border-white/10 group">
            <span className="text-xl group-hover:scale-125 transition-transform">
              +
            </span>{" "}
            New Exploration
          </button>
        </div>

        <div className="mt-auto p-8 flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity cursor-default">
          <Globe size={14} />
          <p className="text-[9px] uppercase tracking-[0.3em]">
            Protocol: Active
          </p>
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
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.25em]">
              Gemini 1.5 Flash Neural Node
            </span>
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
                    Transmission ready
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
                            <li className="ml-4 mb-2 list-decimal">
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
                      {m.role === "user" ? "Node: Deepanshu" : "Node: Gemini"} •{" "}
                      {m.time}
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
    </div>
  );
}
