import { cn } from '@/lib/utils'
import React from 'react'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
}
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    'block text-sm font-medium text-gray-800 mb-1 whitespace-nowrap',
                    className,
                )}
                {...props}
            >
                {children}
            </label>
        );
    }
)

export default Label;
