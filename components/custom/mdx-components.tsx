import { cn } from '@/lib/utils';

const MdxComponents = {
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1
            className={cn(
                "mt-2 scroll-m-20 text-4xl font-bold tracking-tight text-foreground relative pb-4 mb-6 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-24 after:h-1 after:bg-brand-500 dark:after:bg-brand-400",
                className,
            )}
            {...props}
        />
    ),

    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2
            className={cn(
                'mt-12 scroll-m-20 text-3xl font-semibold tracking-tight text-foreground first:mt-0 border-b border-border pb-2',
                className,
            )}
            {...props}
        />
    ),

    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h3
            className={cn(
                'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight text-foreground',
                className,
            )}
            {...props}
        />
    ),

    p: ({
        className,
        ...props
    }: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p
            className={cn(
                'leading-7 text-foreground [&:not(:first-child)]:mt-6',
                className,
            )}
            {...props}
        />
    ),

    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
        <ul
            className={cn(
                'my-6 ml-6 list-disc text-foreground marker:text-brand-500 dark:marker:text-brand-400',
                className,
            )}
            {...props}
        />
    ),

    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
        <ol
            className={cn(
                'my-6 ml-6 list-decimal text-foreground marker:text-brand-500 dark:marker:text-brand-400',
                className,
            )}
            {...props}
        />
    ),

    li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
        <li className={cn('mt-2', className)} {...props} />
    ),

    blockquote: ({
        className,
        ...props
    }: React.HTMLAttributes<HTMLQuoteElement>) => (
        <blockquote
            className={cn(
                'mt-6 border-l-4 border-brand-500 dark:border-brand-400 pl-6 italic text-foreground bg-muted py-4 pr-4 rounded-r-md relative',
                className,
            )}
            {...props}
        >
            <div className="absolute top-4 left-2 opacity-10 text-brand-500 dark:text-brand-400">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
            </div>
            <div className="relative z-10">{props.children}</div>
        </blockquote>
    ),

    hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
        <hr
            className="my-8 border-none h-px bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 dark:from-brand-800 dark:via-brand-600 dark:to-brand-800"
            {...props}
        />
    ),

    a: ({
        className,
        ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a
            className={cn(
                'font-medium text-brand-600 dark:text-brand-400 underline underline-offset-4 hover:text-brand-800 dark:hover:text-brand-300 decoration-brand-300 dark:decoration-brand-600 hover:decoration-brand-500 dark:hover:decoration-brand-400 transition-colors',
                className,
            )}
            {...props}
        />
    ),

    img: ({
        className,
        alt,
        ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
        <figure className="my-8">
            <div className="overflow-hidden rounded-lg shadow-md border border-border">
                <img
                    className={cn(
                        'w-full h-auto transition-transform hover:scale-105 duration-300',
                        className,
                    )}
                    alt={alt || 'Blog image'}
                    {...props}
                />
            </div>
            {alt && (
                <figcaption className="text-center text-sm text-muted-foreground mt-2">
                    {alt}
                </figcaption>
            )}
        </figure>
    ),

    table: ({
        className,
        ...props
    }: React.TableHTMLAttributes<HTMLTableElement>) => (
        <div className="my-6 w-full overflow-y-auto rounded-lg border border-border">
            <table
                className={cn(
                    'w-full min-w-full divide-y divide-border',
                    className,
                )}
                {...props}
            />
        </div>
    ),

    th: ({
        className,
        ...props
    }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
        <th
            className={cn(
                'px-6 py-3 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
                className,
            )}
            {...props}
        />
    ),

    td: ({
        className,
        ...props
    }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
        <td
            className={cn(
                'px-6 py-4 whitespace-nowrap text-sm text-foreground border-b border-border',
                className,
            )}
            {...props}
        />
    ),

    code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
        <code
            className={cn(
                'relative rounded bg-muted py-[0.2rem] px-[0.3rem] font-mono text-sm text-brand-600 dark:text-brand-400',
                className,
            )}
            {...props}
        />
    ),

    pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
        <pre
            className={cn(
                'mt-6 mb-6 overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 p-4 border border-border',
                className,
            )}
            {...props}
        />
    ),

    Callout: ({
        className,
        children,
        icon,
        type = 'default',
        ...props
    }: any) => {
        const Icon =
            icon ||
            (() => {
                if (type === 'warning')
                    return (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    );

                if (type === 'info')
                    return (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    );

                if (type === 'success')
                    return (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                clipRule="evenodd"
                            />
                        </svg>
                    );

                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            });

        const styles = {
            default:
                'bg-brand-50 dark:bg-brand-950/50 border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-200',
            success:
                'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
            warning:
                'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
            info: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
        } as any;

        return (
            <div
                className={cn(
                    'my-6 rounded-lg border p-4 flex items-start',
                    styles[type],
                    className,
                )}
                {...props}
            >
                <div className="mr-3 mt-0.5 text-brand-500 dark:text-brand-400">
                    {Icon}
                </div>
                <div>{children}</div>
            </div>
        );
    },
};

export default MdxComponents;
