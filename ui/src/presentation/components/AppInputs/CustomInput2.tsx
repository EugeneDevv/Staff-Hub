import TogglePasswordIcon from '../../../assets/TogglePasswordIcon';
import './AppInputs.scss';
import { ChangeEvent, FC, useState } from 'react';

interface InputProps {
  type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'date';
  label?: string;
  value: string | number;
  name: string;
  placeholder: string;
  errorMessage: string | null;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  leadingIcon?: React.ReactNode;
}

const CustomInput2: FC<InputProps> = ({
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
  return (
    <div className="input-wrapper">
      {label && <label className='customInput' htmlFor={label}>{label}{required && <span>*</span>}</label>}
      <div className="password-input">
        {leadingIcon && <div className="leading-icon">{leadingIcon}</div>}
        <input
          type={(type === 'password' && passwordVisible) ? 'text' : type}
          id={label}
          value={value}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          className={`input ${leadingIcon ? "inputWithLeadingIcon" : ""} ${(errorMessage != null && errorMessage.trim().length > 1) ? "error-input" : ""}`}
        />
        {type === 'password' && <div className="eye-icon" onClick={togglePasswordVisibility}>
          <TogglePasswordIcon isVisible={passwordVisible} />
        </div>}
      </div>

      {(errorMessage != null && errorMessage.trim().length > 1) && <p className="error">{errorMessage ?? "Input field can't be empty!"}</p>}
    </div>
  );
};

export default CustomInput2;