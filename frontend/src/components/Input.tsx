import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-white font-bold mb-sm">
          {label}
        </label>
      )}
      <input 
        className={`input-base ${error ? 'border-neon-red' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-neon-red text-sm mt-xs font-bold">{error}</p>
      )}
    </div>
  )
}
