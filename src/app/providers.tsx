"use client"

import React, { ReactNode } from 'react';
import { HeaderProvider } from './context/HeaderContext';
import { Toaster } from 'sonner';

interface Props {
    children: ReactNode
}
const providers = ({ children }: Props) => {
    return (
        <React.Fragment>
            <HeaderProvider>
                {children}
            </HeaderProvider>
            <Toaster
                position="top-right"
                richColors={true}
                closeButton={true}
            />
        </React.Fragment>
    )
}
export default providers