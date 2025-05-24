
interface DoodleInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
}

const DoodleInput: React.FC<DoodleInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`
        w-full px-4 py-3 rounded-xl border-3 border-doodle-blue
        bg-doodle-paper text-doodle-sketch font-comic
        focus:outline-none focus:border-doodle-purple focus:ring-2 focus:ring-doodle-purple/20
        transition-all duration-200 hover:border-doodle-purple/60
        placeholder:text-doodle-light-sketch
        ${className}
      `}
    />
  );
};

export default DoodleInput;