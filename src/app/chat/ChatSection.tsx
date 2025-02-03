'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useChat } from 'ai/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CircleX, Cog, Gem, LoaderCircle, MoveDown, RotateCw, Send, UserRound, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Markdown } from '@/components/ui/markdown';

function ChatSection() {

    const { messages, input, handleSubmit, isLoading, setInput, error, reload, stop } = useChat({
        api: '/api/ask-to-ai',
        // body: {
        //     model: selectedModel ? selectedModel.name : initialModel.name,
        //     provider: selectedModel ? selectedModel.provider : initialModel.provider,
        //     tokenUsage: yourTokenUsage
        // },
        onFinish: (message, { usage, finishReason }) => {
            // console.log('Finished streaming message:', message);
            console.log('Token usage:', usage.totalTokens);
            // console.log('Finish reason:', finishReason);
            // setYourTokenUsage(usage.totalTokens);
        },
        onError: error => {
            // const isError: any = error?.message;
            // if (isError.error) {
            //     console.error('isError:', JSON.parse(isError.error) || isError);
            //     setErrorMessage(isError.error);
            // } else {
            //     console.error('An error occurred:', error?.message || error);
            // }
        },
        onResponse: response => {
            // console.log('Received HTTP response from server:', response);
        },
    });
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [textareaHeight, setTextareaHeight] = useState<number>(0);
    const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        adjustTextareaHeight();
    };

    const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (!input.trim()) return;
        // handleAddHistory("user", input);
        try {
            await handleSubmit(e);
        } catch (error) {
            console.error('Error fetching AI response:', error);
        } finally {
            if (textareaRef.current) {
                textareaRef.current.blur();
            }
            scrollToBottom();
        }
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height to recalculate
            const maxHeight = 10 * parseFloat(getComputedStyle(textareaRef.current).lineHeight);
            const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
            textareaRef.current.style.height = `${newHeight}px`;
            setTextareaHeight(newHeight);
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [input]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                textareaRef.current &&
                document.activeElement !== textareaRef.current
            ) {
                if (!event.ctrlKey && !event.altKey && !event.metaKey) {
                    if (/^[a-zA-Z0-9]$/.test(event.key)) {
                        textareaRef.current.focus();
                    }
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const checkMobileDevice = () => {
            const userAgent = navigator.userAgent || navigator.vendor;
            if (/android|iphone|ipad|ipod/i.test(userAgent)) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        checkMobileDevice();
    }, []);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    const isMessage = messages.length > 0;

    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
                setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 5);
            }

        };

        if (scrollRef.current) {
            scrollRef.current.addEventListener("scroll", handleScroll);
            handleScroll();
        }

        return () => {
            if (scrollRef.current) {
                scrollRef.current.removeEventListener("scroll", handleScroll);
            }
        };
    }, [scrollRef, isMessage]);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="h-full flex-1 rounded-xl bg-muted/50 md:min-h-min p-4 lg:p-6">
                {/* {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <React.Fragment key={index}>
                            {msg.role === 'user' && (
                                <div className='flex justify-end mb-3'>
                                    <p className={`whitespace-pre-wrap bg-zinc-600 dark:bg-zinc-600/15 text-white dark:text-zinc-300 backdrop-blur-sm min-w-64 md:min-w-80 max-w-[calc(100%-8rem)] rounded-2xl shadow-lg shadow-black/5 px-4 md:px-6 py-2 md:py-4 my-2`}>
                                        {msg.content}
                                    </p>
                                </div>
                            )}
                            {msg.role === 'assistant' && (
                                <div className='mb-3'>
                                    <div className='flex items-center gap-2'>
                                        <div className="relative bg-zinc-700 text-zinc-300 rounded-full dark:shadow-lg dark:shadow-black/25 aspect-square w-7 h-7">
                                            <UserRound className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4" />
                                        </div>
                                        <h6 className='font-semibold dark:font-normal dark:text-white'>Lanang Lanusa</h6>
                                    </div>
                                    <div className='mt-3 ms-3'>
                                        <Markdown>{msg.content}</Markdown>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <div className='mb-3'>
                        <div className='flex items-center gap-2'>
                            <div className="relative bg-zinc-700 text-zinc-300 rounded-full dark:shadow-lg dark:shadow-black/25 aspect-square w-7 h-7">
                                <UserRound className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4" />
                            </div>
                            <h6 className='font-semibold dark:font-normal dark:text-white'>Lanang Lanusa</h6>
                        </div>
                        <div className='mt-3 ms-3'>
                            <Markdown>hello, is there anything you want to ask me?</Markdown>
                        </div>
                    </div>
                )}
                {loading ? (
                    <div>
                        <div className='px-8'>
                            <div className='hidden dark:block w-3 h-3 dot-loader' />
                            <div className='block dark:hidden w-3 h-3 dot-loader-dark' />
                        </div>
                    </div>
                ) : (
                    error && (
                        <div>
                            <div className='flex items-center gap-2'>
                                <div className="relative bg-zinc-700 text-zinc-300 rounded-full dark:shadow-lg dark:shadow-black/25 aspect-square w-7 h-7">
                                    <Cog className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4" />
                                </div>
                                <h6 className='font-semibold dark:font-normal dark:text-white'>System</h6>
                            </div>
                            <div className='px-3 mt-2'>
                                <p className='mb-3'>
                                    <X className='inline text-red-500 h-5 w-5 mb-0.5 me-1' />
                                    {error.message}
                                </p>
                            </div>
                        </div>
                    )
                )} */}
                <div className='flex justify-end mb-6'>
                    <p className={`whitespace-pre-wrap bg-zinc-600 dark:bg-zinc-800 text-white dark:text-zinc-300 backdrop-blur-sm min-w-64 md:min-w-80 max-w-[calc(100%-8rem)] rounded-lg shadow-lg shadow-black/10 px-4 md:px-6 py-2 md:py-4`}>
                        Lorem, ipsum dolor sit amet consectetur adipisicing.
                    </p>
                </div>
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <React.Fragment key={index}>
                            {msg.role === 'user' && (
                                <div className='flex justify-end mb-6'>
                                    <p className={`whitespace-pre-wrap bg-zinc-600 dark:bg-zinc-800 text-white dark:text-zinc-300 backdrop-blur-sm min-w-64 md:min-w-80 max-w-[calc(100%-8rem)] rounded-lg shadow-lg shadow-black/10 px-4 md:px-6 py-2 md:py-4`}>
                                        {msg.content}
                                    </p>
                                </div>
                            )}
                            {msg.role === 'assistant' && (
                                <div className='mb-6 flex gap-4'>
                                    <div className="relative bg-zinc-700 text-zinc-300 rounded-full shadow-lg dark:shadow-black/10 aspect-square w-7 h-7">
                                        <Gem className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4" />
                                    </div>
                                    <div className='mt-0.5'>
                                        <Markdown>{msg.content}</Markdown>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <div className='mb-6 flex gap-4'>
                        <div className="relative bg-zinc-700 text-zinc-300 rounded-full shadow-lg dark:shadow-black/10 aspect-square w-7 h-7">
                            <Gem className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4" />
                        </div>
                        <div className='mt-0.5'>
                            <Markdown>hello, is there anything you want to ask me?</Markdown>
                        </div>
                    </div>
                )}
                {isLoading ? (
                    <div>
                        <div className='px-8'>
                            <div className='hidden dark:block w-3 h-3 dot-loader' />
                            <div className='block dark:hidden w-3 h-3 dot-loader-dark' />
                        </div>
                    </div>
                ) : (
                    error && (
                        <div>
                            <div className='flex items-center gap-2'>
                                <div className="relative bg-zinc-700 text-zinc-300 rounded-full dark:shadow-lg dark:shadow-black/25 aspect-square w-7 h-7">
                                    <Cog className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4" />
                                </div>
                                <h6 className='font-semibold dark:font-normal dark:text-white'>System</h6>
                            </div>
                            <div className='px-3 mt-2'>
                                <p className='mb-3'>
                                    <X className='inline text-red-500 h-5 w-5 mb-0.5 me-1' />
                                    {error.message}
                                </p>
                            </div>
                        </div>
                    )
                )}
            </div>
            <div className="relative flex-none w-full pt-10">
                {!isAtBottom &&
                    <div onClick={scrollToBottom} style={{ bottom: `${textareaHeight + 96}px` }} className="absolute start-1/2 -translate-x-1/2 z-10 backdrop-blur-sm bg-zinc-100/75 hover:bg-zinc-100 dark:bg-zinc-700/75 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white rounded-full shadow-lg p-2 transition duration-200 hover:scale-105 hover:cursor-pointer">
                        <MoveDown className='h-4 w-4' />
                    </div>
                }
                <div className='absolute z-10 inset-x-0 flex justify-between items-center gap-2' style={{ bottom: `${textareaHeight + 36}px` }}>
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Model : {selectedModel ? listModels.find((model) => model.name === selectedModel.name)?.title : initialModel.name}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {listModels.map((model, index) => (
                                <DropdownMenuItem key={index} onClick={() => setSelectedModel(model)} className={`${model.name === selectedModel.name ? 'bg-zinc-200/50 dark:bg-zinc-800/50' : ''}`} disabled={model.status === 'inactive' ? true : false}>
                                    {model.title}
                                    {model.name === initialModel.name && <span className='text-xs text-zinc-600 dark:text-zinc-500'>(default)</span>}
                                    {model.status === 'inactive' && <span className='text-xs text-zinc-600 dark:text-zinc-500'>(not available)</span>}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className='rounded-full px-4'>
                                Model : Deepseek R1
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                Deepseek R1
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Gemini 1.5 Flash
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Llama 3.3
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className='flex items-center gap-2'>
                        {isLoading &&
                            <Button onClick={() => stop()} title='Stop Generate' variant={'outline'} size={'sm'} className='rounded-full'>
                                <CircleX />Stop
                            </Button>
                        }
                        {error &&
                            <Button onClick={() => reload()} title='Regenerate' variant={'outline'} size={'sm'} className='rounded-full'>
                                <RotateCw />Reload
                            </Button>
                        }
                    </div>
                </div>
                <form className='relative rounded-xl overflow-hidden' onSubmit={handleSendMessage}>
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputChange}
                        className="ps-4 pt-6 pb-2 pe-16 rounded-xl resize-none border-none bg-muted/50"
                        placeholder="Ask something about me..."
                        rows={2}
                        // disabled={isLoading}
                        onKeyDown={(e) => {
                            if (!isMobile && e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="absolute bottom-3 right-3 rounded-xl w-12 h-12 disabled:opacity-50 hover:scale-105 transition duration-200"
                    >
                        {isLoading ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <Send />
                        )}
                    </Button>
                </form>
                <p className='text-xs text-zinc-500 dark:text-zinc-600 text-center mt-2'>Use it wisely, sometimes AI can be wrong.</p>
            </div>
        </div>
    )
}

export default ChatSection