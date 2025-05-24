interface DoodleIconProps {
  icon: string;
  className?: string;
  animated?: boolean;
}

const DoodleIcon: React.FC<DoodleIconProps> = ({ icon, className = '', animated = false }) => {
  const icons = {
    lightbulb: (
      <svg viewBox="0 0 100 100" className={`${className} ${animated ? 'animate-bounce-gentle' : ''}`}>
        <path
          d="M50 15 C35 15, 25 25, 25 40 C25 50, 30 55, 35 65 L65 65 C70 55, 75 50, 75 40 C75 25, 65 15, 50 15 Z"
          fill="#fdcb6e"
          stroke="#6c5ce7"
          strokeWidth="3"
          className="animate-doodle-draw"
        />
        <rect x="40" y="65" width="20" height="10" fill="#fd79a8" stroke="#6c5ce7" strokeWidth="2" />
        <line x1="45" y1="20" x2="47" y2="10" stroke="#6c5ce7" strokeWidth="3" />
        <line x1="65" y1="25" x2="72" y2="18" stroke="#6c5ce7" strokeWidth="3" />
        <line x1="35" y1="25" x2="28" y2="18" stroke="#6c5ce7" strokeWidth="3" />
      </svg>
    ),
    collaboration: (
      <svg viewBox="0 0 100 100" className={`${className} ${animated ? 'animate-wiggle' : ''}`}>
        <circle cx="30" cy="30" r="12" fill="#74b9ff" stroke="#6c5ce7" strokeWidth="2" />
        <circle cx="70" cy="30" r="12" fill="#fd79a8" stroke="#6c5ce7" strokeWidth="2" />
        <path d="M20 50 Q50 30, 80 50" fill="none" stroke="#6c5ce7" strokeWidth="3" />
        <circle cx="50" cy="70" r="15" fill="#00cec9" stroke="#6c5ce7" strokeWidth="2" />
        <path d="M35 60 Q50 80, 65 60" fill="none" stroke="#6c5ce7" strokeWidth="3" />
      </svg>
    ),
    shapes: (
      <svg viewBox="0 0 100 100" className={className}>
        <rect x="15" y="15" width="25" height="25" fill="#55efc4" stroke="#6c5ce7" strokeWidth="2" transform="rotate(15 27.5 27.5)" />
        <circle cx="70" cy="25" r="15" fill="#fdcb6e" stroke="#6c5ce7" strokeWidth="2" />
        <polygon points="20,75 35,55 50,75" fill="#fd79a8" stroke="#6c5ce7" strokeWidth="2" />
        <ellipse cx="75" cy="70" rx="18" ry="12" fill="#a29bfe" stroke="#6c5ce7" strokeWidth="2" />
      </svg>
    ),
    arrow: (
      <svg viewBox="0 0 100 100" className={className}>
        <path d="M20 50 Q50 20, 80 50" fill="none" stroke="#6c5ce7" strokeWidth="4" markerEnd="url(#arrowhead)" />
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6c5ce7" />
          </marker>
        </defs>
      </svg>
    )
  };

  return icons[icon as keyof typeof icons] || null;
};

export default DoodleIcon;