'use client';

import { createRef, useContext, createContext, RefObject } from 'react';
import { type LoadingBarRef } from 'react-top-loading-bar';

const NavigationContext = createContext<{
    ref: RefObject<LoadingBarRef> | null;
}>({ ref: null });

export const useLoadingBar = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error(
            'useLoadingBar must be used within a NavigationProvider',
        );
    }
    return context;
};

export const NavigationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const ref = createRef<LoadingBarRef>();
    return (
        <NavigationContext.Provider value={{ ref }}>
            {children}
        </NavigationContext.Provider>
    );
};
