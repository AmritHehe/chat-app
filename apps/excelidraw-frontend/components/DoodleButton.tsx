interface DoodleButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

const DoodleButton: React.FC<DoodleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  type = 'button'
}) => {
  const baseStyles = "font-gamja font-bold transition-all duration-200 transform hover:scale-105 hover:rotate-1 active:scale-95 border-3 border-solid";
  
  const variants = {
    primary: "bg-doodle-purple text-white border-doodle-purple hover:bg-doodle-light-purple doodle-shadow",
    secondary: "bg-doodle-yellow text-doodle-sketch border-doodle-yellow hover:bg-yellow-300",
    outline: "bg-transparent text-doodle-purple border-doodle-purple hover:bg-doodle-purple hover:text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default DoodleButton;