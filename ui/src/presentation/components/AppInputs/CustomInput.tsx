import TogglePasswordIcon from '../../../assets/TogglePasswordIcon';
import './AppInputs.scss';
import { ChangeEvent, FC, useState, useRef } from 'react';

interface InputProps {
  type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'date' | 'month';
  label?: string;
  value: string | number;
  name?: string;
  placeholder: string;
  errorMessage?: string | null;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  leadingIcon?: React.ReactNode;
}

const CustomInput: FC<InputProps> = ({
  type,
  label,
  value,
  name,
  placeholder,
  errorMessage,
  disabled,
  required,
  onChange,
  leadingIcon,
}) => {

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.focus(); // Focus the input
    inputRef.current?.click(); // Trigger a click event
  };

  const hasErrors: boolean = errorMessage != null && errorMessage.trim().length > 1;

  return (
    <div className={`input-wrapper`}>
      {label && <label htmlFor={label}>{label}{required && <span>*</span>}</label>}
      <div className="password-input" onClick={handleClick}>
        {leadingIcon && <div className="leading-icon">{leadingIcon}</div>}
        {!(disabled && (type === "month" || type === "date")) && <input
          type={(type === 'password' && passwordVisible) ? 'text' : type}
          id={label}
          value={value}
          ref={inputRef}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          className={`input ${leadingIcon ? "inputWithLeadingIcon" : ""} ${(errorMessage != null && errorMessage.trim().length > 1) ? "error-input" : ""}`}
        />}
        {type === 'password' && <div className="eye-icon" onClick={togglePasswordVisibility}>
          <TogglePasswordIcon isVisible={passwordVisible} />
        </div>}
      </div>

      {hasErrors && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default CustomInput;
