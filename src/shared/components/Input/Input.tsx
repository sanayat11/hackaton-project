// src/shared/components/Input/Input.tsx
'use client';

import React, { InputHTMLAttributes, forwardRef, useId } from 'react';
import styles from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: customId,
      label,
      hint,
      error,
      prefixIcon,
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
    const hintId = `${id}-hint`;

    return (
      <div className={`${styles.formGroup} ${containerClassName || ''}`}>
        {label && (
          <div className={styles.labelWrapper}>
            <label htmlFor={id} className={styles.label}>
              {label}
              {required && <span className={styles.required} aria-hidden="true">*</span>}
            </label>
            {hint && <span id={hintId} className={styles.hint}>{hint}</span>}
          </div>
        )}

        <div className={styles.inputWrapper}>
          {prefixIcon && <span className={styles.prefixIcon}>{prefixIcon}</span>}
          <input
            ref={ref}
            id={id}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
            }
            className={`${styles.input} ${error ? styles.hasError : ''} ${
              prefixIcon ? styles.hasPrefix : ''
            } ${className || ''}`}
            {...props}
          />
        </div>

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

Input.displayName = 'Input';
