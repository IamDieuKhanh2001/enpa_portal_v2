"use client"

import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

interface Props {
    children: ReactNode
}
const providers = ({ children }: Props) => {
    return (
        <React.Fragment>
            {children}
            <ToastContainer />
        </React.Fragment>
    )
}
export default providers