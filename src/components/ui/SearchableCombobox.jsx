import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Searchable dropdown — type to filter options; pick from list or keep typed value.
 */
export default function SearchableCombobox({
  label,
  value,
  onChange,
  onSearch,
  placeholder = 'Type to search...',
  emptyMessage = 'No matches found',
  loading = false,
  clearable = true,
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const loadOptions = useCallback(
    async (query) => {
      if (!onSearch) return;
      setFetching(true);
      try {
        const results = await onSearch(query);
        setOptions(results || []);
      } catch {
        setOptions([]);
      } finally {
        setFetching(false);
      }
    },
    [onSearch]
  );

  useEffect(() => {
    if (open) loadOptions(value);
  }, [open, loadOptions, value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const next = e.target.value;
    onChange(next);
    setOpen(true);
    setHighlightIndex(-1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadOptions(next), 200);
  };

  const selectOption = (option) => {
    const next = option.label || option.value || option.name || '';
    onChange(next);
    setOpen(false);
    setHighlightIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      loadOptions(value);
      return;
    }
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && highlightIndex >= 0 && options[highlightIndex]) {
      e.preventDefault();
      selectOption(options[highlightIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showDropdown = open && (options.length > 0 || fetching || (value && !fetching));

  return (
    <div ref={wrapperRef} className="relative">
      {label && <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            setOpen(true);
            loadOptions(value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input-field pr-8"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {fetching || loading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </span>
        {clearable && value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setOptions([]);
              loadOptions('');
              inputRef.current?.focus();
            }}
            className="absolute right-8 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Clear"
          >
            ×
          </button>
        )}
      </div>

      {showDropdown && (
        <ul
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {fetching && options.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-500">Searching...</li>
          )}
          {!fetching && options.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-500">{emptyMessage}</li>
          )}
          {options.map((option, index) => (
            <li key={option.id || option.value || option.label || index}>
              <button
                type="button"
                role="option"
                aria-selected={highlightIndex === index}
                className={`w-full px-3 py-2 text-left text-sm transition ${
                  highlightIndex === index ? 'bg-brand-50 text-brand-900' : 'hover:bg-slate-50'
                }`}
                onMouseEnter={() => setHighlightIndex(index)}
                onClick={() => selectOption(option)}
              >
                <span className="font-medium text-slate-900">{option.label || option.name}</span>
                {option.sublabel && (
                  <span className="mt-0.5 block text-xs text-slate-500">{option.sublabel}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
