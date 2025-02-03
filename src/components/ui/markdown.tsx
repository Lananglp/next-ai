import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript.min.js';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/components/prism-jsx.min.js';
import 'prismjs/components/prism-tsx.min.js';

export const NonMemoizedMarkdown = ({ children }: { children: string }) => {

  useEffect(() => {
    Prism.highlightAll();
  }, [children]);

  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <div className="relative mb-6 pt-[1.2rem]">
            <div className="absolute inset-x-0 top-0 w-[80dvw] md:max-w-[500px] bg-zinc-600 text-zinc-300 rounded-t-xl px-4 py-1">
              <p className="text-sm">{match[1] || 'plaintext'}</p>
            </div>
            <pre
                {...props}
                className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-2 rounded-b-xl mt-2 dark:bg-zinc-800`}
            >
                <code className={match[1]}>{children}</code>
            </pre>
        </div>
      ) : (
        <code
            className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-2 rounded`}
            {...props}
        >
            {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: any) => {
      return (
        <ol className="list-disc ms-6 mb-6" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }: any) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-disc ms-6 mb-6" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }: any) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    table: ({ node, children, ...props }: any) => {
      return (
        <div className="w-full overflow-x-auto mb-6">
            <table className="w-full" {...props}>
                {children}
            </table>
        </div>
      );
    },
    thead: ({ node, children, ...props }: any) => {
      return (
        <thead className="bg-zinc-100/50 dark:bg-zinc-900" {...props}>
          {children}
        </thead>
      );
    },
    tbody: ({ node, children, ...props }: any) => {
      return (
        <tbody className="bg-zinc-100/50 dark:bg-zinc-900" {...props}>
          {children}
        </tbody>
      );
    },
    tr: ({ node, children, ...props }: any) => {
      return (
        <tr {...props}>
          {children}
        </tr>
      );
    },
    td: ({ node, children, ...props }: any) => {
      return (
        <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700" {...props}>
          {children}
        </td>
      );
    },
    th: ({ node, children, ...props }: any) => {
      return (
        <th className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 font-semibold" {...props}>
          {children}
        </th>
      );
    },
    p: ({ node, children, ...props }: any) => {
      return (
        <p className="mb-6" {...props}>
          {children}
        </p>
      );
    },
    h1: ({ node, children, ...props }: any) => {
      return (
        <h1 className="text-3xl font-semibold mb-6" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }: any) => {
      return (
        <h2 className="text-2xl font-semibold mb-6" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }: any) => {
      return (
        <h3 className="text-xl font-semibold mb-6" {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ node, children, ...props }: any) => {
      return (
        <h4 className="text-lg font-semibold mb-6" {...props}>
          {children}
        </h4>
      );
    },
    h5: ({ node, children, ...props }: any) => {
      return (
        <h5 className="text-base font-semibold mb-6" {...props}>
          {children}
        </h5>
      );
    },
    h6: ({ node, children, ...props }: any) => {
      return (
        <h6 className="text-sm font-semibold mb-6" {...props}>
          {children}
        </h6>
      );
    },  
    blockquote: ({ node, children, ...props }: any) => {
      return (
        <blockquote className="mb-6" {...props}>
          {children}
        </blockquote>
      );
    },
    a: ({ node, children, ...props }: any) => {
      return (
        <a target="_blank" className="hover:text-blue-500 underline underline-offset-4 transition-colors duration-200" {...props}>
          {children}
        </a>
      );
    },
    img: ({ node, src, alt, ...props }: any) => {
      return (
        <img
          className="mb-6 w-1/2 md:w-1/3 aspect-square object-cover bg-zinc-950/10 dark:bg-white/10 rounded-lg"
          src={src}
          alt={alt}
          {...props}
        />
      );
    },
    hr: ({ node, ...props }: any) => {
      return <hr className="my-6" {...props} />;
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = React.memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);