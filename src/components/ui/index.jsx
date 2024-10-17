import React from 'react';

// Card
export const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-4 py-5 border-b border-gray-200 sm:px-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`px-4 py-5 sm:p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`px-4 py-4 sm:px-6 ${className}`} {...props}>
    {children}
  </div>
);

// Input
export const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${className}`}
    ref={ref}
    {...props}
  />
));

// Button
export const Button = ({ children, className = '', ...props }) => (
  <button
    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// ScrollArea
export const ScrollArea = ({ children, className = '', ...props }) => (
  <div className={`overflow-auto ${className}`} {...props}>
    {children}
  </div>
);

// Avatar
export const Avatar = ({ src, alt, fallback, className = '', ...props }) => (
  <div className={`relative inline-block ${className}`} {...props}>
    {src ? (
      <img
        src={src}
        alt={alt}
        className="h-10 w-10 rounded-full"
      />
    ) : (
      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
        {fallback}
      </div>
    )}
  </div>
);

export const AvatarImage = ({ src, alt, className = '', ...props }) => (
  <img
    src={src}
    alt={alt}
    className={`h-10 w-10 rounded-full ${className}`}
    {...props}
  />
);

export const AvatarFallback = ({ children, className = '', ...props }) => (
  <div className={`h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 ${className}`} {...props}>
    {children}
  </div>
);

// Popover components
export const Popover = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const PopoverTrigger = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const PopoverContent = ({ children, className = '', ...props }) => (
  <div className={`bg-white shadow-lg rounded-md p-4 ${className}`} {...props}>
    {children}
  </div>
);

// AlertDialog components
export const AlertDialog = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const AlertDialogContent = ({ children, className = '', ...props }) => (
  <div className={`bg-white shadow-lg rounded-md p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const AlertDialogHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const AlertDialogTitle = ({ children, className = '', ...props }) => (
  <h2 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h2>
);

export const AlertDialogDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props}>
    {children}
  </p>
);

export const AlertDialogFooter = ({ children, className = '', ...props }) => (
  <div className={`mt-6 flex justify-end space-x-2 ${className}`} {...props}>
    {children}
  </div>
);

export const AlertDialogCancel = ({ children, className = '', ...props }) => (
  <button
    className={`px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const AlertDialogAction = ({ children, className = '', ...props }) => (
  <button
    className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
    {...props}
  >
    {children}
  </button>
);
