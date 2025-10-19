import { useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const OtpInput = ({
  value,
  onChange,
  length = 4,
  disabled = false,
  autoFocus = true
}: OtpInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, digit: string) => {
    // Only allow digits
    if (digit && !/^\d$/.test(digit)) {
      return;
    }

    const newValue = [...value];
    newValue[index] = digit;
    onChange(newValue);

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newValue = [...value];
        newValue[index] = '';
        onChange(newValue);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    const digits = pastedData.replace(/\D/g, '').slice(0, length).split('');

    if (digits.length > 0) {
      const newValue = [...value];
      digits.forEach((digit, idx) => {
        if (idx < length) {
          newValue[idx] = digit;
        }
      });
      onChange(newValue);

      // Focus the next empty input or the last one
      const nextEmptyIndex = newValue.findIndex((v, i) => !v && i < length);
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-14 text-center text-2xl font-bold rounded-xl",
            "border-2 transition-all duration-200",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            value[index] && "border-primary bg-primary/5"
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
};
