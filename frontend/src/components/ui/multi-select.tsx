import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  disabledReason?: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Pilih opsi",
  label,
  disabled = false,
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = (optionValue: string) => {
    if (disabled) return;
    
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    onChange(newValue);
  };

  const handleRemove = (optionValue: string) => {
    if (disabled) return;
    
    const newValue = value.filter(v => v !== optionValue);
    onChange(newValue);
  };

  const selectedOptions = options.filter(option => value.includes(option.value));

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      
      <div className="relative" ref={dropdownRef}>
        {/* Trigger */}
        <div
          className={cn(
            "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50",
            error && "border-red-500 focus:ring-red-500",
            !disabled && "cursor-pointer hover:border-ring"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map(option => (
                <span
                  key={option.value}
                  className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(option.value);
                    }}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
        </div>
        
        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
            {options.map(option => {
              const isSelected = value.includes(option.value);
              
              return (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    isSelected && "bg-accent text-accent-foreground",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (!option.disabled && !disabled) {
                      handleToggle(option.value);
                    }
                  }}
                >
                  <div className="flex items-center space-x-2 w-full">
                    <Checkbox 
                      checked={isSelected}
                      disabled={option.disabled || disabled}
                      className="pointer-events-none"
                    />
                    <span>
                      {option.label}
                      {option.disabled && option.disabledReason && ` (${option.disabledReason})`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
