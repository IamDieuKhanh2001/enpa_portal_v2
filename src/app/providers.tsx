"use client"

import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { HeaderProvider } from './context/HeaderContext';

interface Props {
    children: ReactNode
}
const providers = ({ children }: Props) => {
    return (
        <React.Fragment>
            <HeaderProvider>
                {children}
                <ToastContainer />
            </HeaderProvider>
        </React.Fragment>
    )
}
export default providers