// src/shared/components/Textarea/Textarea.tsx
'use client';

import React, { TextareaHTMLAttributes, forwardRef, useId } from 'react';
import styles from './Textarea.module.scss';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCharCount?: boolean;
  maxLength?: number;
  currentLength?: number;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id: customId,
      label,
      error,
      showCharCount,
      maxLength,
      currentLength = 0,
      required,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const errorId = `${id}-error`;

    const isLimitReached = maxLength !== undefined && currentLength >= maxLength;

    return (
      <div className={`${styles.formGroup} ${containerClassName || ''}`}>
        {label && (
          <div className={styles.labelWrapper}>
            <label htmlFor={id} className={styles.label}>
              {label}
              {required && <span className={styles.required} aria-hidden="true">*</span>}
            </label>
            {showCharCount && maxLength && (
              <span
                className={`${styles.charCount} ${isLimitReached ? styles.limitReached : ''}`}
                aria-live="polite"
              >
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          id={id}
          required={required}
          maxLength={maxLength}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={`${styles.textarea} ${error ? styles.hasError : ''} ${className || ''}`}
          {...props}
        />

        {error && (
          <div id={errorId} className={styles.errorMessage} role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
