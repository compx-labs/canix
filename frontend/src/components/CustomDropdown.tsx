interface CustomDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  dropdownKey: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function CustomDropdown({ 
  label, 
  value, 
  options, 
  onChange, 
  dropdownKey,
  isOpen,
  onToggle
}: CustomDropdownProps) {
  return (
    <div className="relative">
      <label className="block text-silver/60 text-xs mb-1 font-semibold uppercase">{label}</label>
      <button
        onClick={onToggle}
        className="w-full bg-graphite-50 border border-graphite-100 text-silver px-3 py-2 text-sm text-left focus:outline-none focus:border-crimson transition-colors flex items-center justify-between"
      >
        <span>{value}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-graphite-50 border border-crimson shadow-glow max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
              }}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-graphite-100 transition-colors ${
                value === option ? 'bg-graphite-100 text-crimson font-semibold' : 'text-silver'
              }`}
            >
              {value === option && (
                <span className="mr-2 text-crimson">✓</span>
              )}
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

