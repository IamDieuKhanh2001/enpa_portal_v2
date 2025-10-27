import React from 'react'

interface PageTitleProps {
    children: React.ReactNode
}
const PageTitle = ({ children }: PageTitleProps) => {
    return (
        <>
            <div className="bg-white shadow-md h-20 flex justify-between items-center px-4 sm:px-8">
                <h1 className="text-lg sm:text-xl font-bold text-[#3F3A39]">
                    {children}
                </h1>
            </div>
        </>
    )
}

export default PageTitle
