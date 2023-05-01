import styles from './select.module.css';
import { useEffect, useRef, useState } from 'react';
export type SelectOption = {
  label: string;
  value: string | number;
};

type MultiSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};
type SelectProps = {
  options: SelectOption[];
} & (MultiSelectProps | SingleSelectProps);
export const Select = ({ multiple, options, value, onChange }: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [highLightedIndex, setHighLightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const selectOption = (option: SelectOption) => {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((v) => v !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  };

  const setHighLightedOption = (index: number) => {
    setHighLightedIndex(index);
  };

  const isOptionSelected = (option: SelectOption) => (multiple ? value.includes(option) : option === value);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target === containerRef.current) {
        switch (e.code) {
          case 'Enter':
          case 'Space':
            setOpen((prev) => !prev);
            if (open) selectOption(options[highLightedIndex]);
            break;
          case 'ArrowDown':
          case 'ArrowUp': {
            if (!open) {
              setOpen(true);
              break;
            }
            const nextIndex = e.code === 'ArrowDown' ? highLightedIndex + 1 : highLightedIndex - 1;
            if (nextIndex < 0 || nextIndex >= options.length) break;
            setHighLightedOption(nextIndex);
            break;
          }
          case 'Escape':
            setOpen(false);
            break;
        }
      }
    };

    containerRef.current?.addEventListener('keydown', handler);
    return () => {
      containerRef.current?.removeEventListener('keydown', handler);
    };
  }, [options, open, highLightedIndex]);

  return (
    <div ref={containerRef} onBlur={() => setOpen(false)} onClick={() => setOpen(!open)} tabIndex={0} className={styles.container}>
      <span className={styles.value}>
        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
                className={styles['option-badge']}
              >
                {v.label}
                <span className={styles['remove-btn']}>&times;</span>
              </button>
            ))
          : value?.label}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          multiple ? onChange([]) : onChange(undefined);
        }}
        className={styles['clear-btn']}
      >
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul
        className={`${styles.options} ${open && styles.show}`}
        onMouseLeave={() => {
          setOpen(false);
          setHighLightedOption(0);
        }}
      >
        {options.map((option, index) => (
          <li
            onMouseEnter={() => setHighLightedOption(index)}
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setOpen(false);
            }}
            key={option.value}
            className={`${styles.option} ${isOptionSelected(option) && styles.selected} ${highLightedIndex === index && styles.highlighted}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
