'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
    const [completion, setCompletion] = useState(0);

    useEffect(() => {
        function updateScrollCompletion() {
            // Get the scroll position and document height
            const currentProgress = window.scrollY;
            const scrollHeight =
                document.body.scrollHeight - window.innerHeight;

            if (scrollHeight) {
                setCompletion(
                    Number((currentProgress / scrollHeight).toFixed(2)) * 100,
                );
            }
        }

        // Add scroll event listener
        window.addEventListener('scroll', updateScrollCompletion);

        // Update initially
        updateScrollCompletion();

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('scroll', updateScrollCompletion);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-50 bg-border/20">
            <div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-300 dark:from-brand-600 dark:to-brand-400 transition-all duration-300"
                style={{ width: `${completion}%` }}
            />
        </div>
    );
}
