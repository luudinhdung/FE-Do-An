import React, { InputHTMLAttributes } from "react";

interface PropTypes extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  classNameWrap: string;
  classNameError: string;
  classNameInput: string;
  classNameShow: string;
  type: string;
  name: string;
  placeholder: string;
  register: any;
  errorMessage?: string;
  errors?: any;
  handleShowPassword?: () => void;
}

function InputAuth({
  className,
  classNameWrap,
  classNameError,
  classNameInput,
  classNameShow,
  type,
  name,
  placeholder,
  register,
  errorMessage,
  errors,
  handleShowPassword,
}: PropTypes) {
  return (
    <div className={className}>
      <div className={classNameWrap}>
        <input type={type} placeholder={placeholder} className={classNameInput} {...register(name)} />
        <button type="button" className={classNameShow} onClick={handleShowPassword}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path
              d="M12.5 8.61116C12.132 8.61691 11.7667 8.67537 11.4153 8.78477C11.5778 9.07064 11.6644 9.39342 11.6667 9.72227C11.6667 9.97762 11.6164 10.2305 11.5187 10.4664C11.4209 10.7023 11.2777 10.9166 11.0971 11.0972C10.9166 11.2778 10.7022 11.421 10.4663 11.5187C10.2304 11.6164 9.97757 11.6667 9.72222 11.6667C9.39336 11.6644 9.07059 11.5779 8.78471 11.4153C8.55917 12.1976 8.58546 13.0309 8.85985 13.7974C9.13425 14.5638 9.64284 15.2245 10.3136 15.6858C10.9843 16.1472 11.7832 16.3858 12.5971 16.3679C13.411 16.3499 14.1987 16.0764 14.8484 15.5859C15.4982 15.0955 15.9772 14.413 16.2176 13.6353C16.458 12.8575 16.4475 12.0238 16.1877 11.2522C15.928 10.4807 15.432 9.81046 14.7702 9.33645C14.1083 8.86245 13.3141 8.6087 12.5 8.61116ZM22.3792 11.9931C20.4962 8.31914 16.7684 5.83337 12.5 5.83337C8.23159 5.83337 4.50276 8.32088 2.62081 11.9935C2.54138 12.1506 2.5 12.3242 2.5 12.5002C2.5 12.6763 2.54138 12.8499 2.62081 13.007C4.5038 16.681 8.23159 19.1667 12.5 19.1667C16.7684 19.1667 20.4972 16.6792 22.3792 13.0067C22.4586 12.8495 22.5 12.6759 22.5 12.4999C22.5 12.3238 22.4586 12.1502 22.3792 11.9931ZM12.5 17.5001C9.07465 17.5001 5.93436 15.5903 4.23853 12.5001C5.93436 9.40977 9.0743 7.50004 12.5 7.50004C15.9257 7.50004 19.0656 9.40977 20.7615 12.5001C19.066 15.5903 15.9257 17.5001 12.5 17.5001Z"
              fill="#1A1A1A"
            />
          </svg>
        </button>
      </div>
      <div className={classNameError}>
        {errors && (
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path
              d="M8.50016 1.83325C4.82016 1.83325 1.8335 4.81992 1.8335 8.49992C1.8335 12.1799 4.82016 15.1666 8.50016 15.1666C12.1802 15.1666 15.1668 12.1799 15.1668 8.49992C15.1668 4.81992 12.1802 1.83325 8.50016 1.83325ZM9.16683 11.8333H7.8335V7.83325H9.16683V11.8333ZM9.16683 6.49992H7.8335V5.16659H9.16683V6.49992Z"
              fill="#FF3B30"
            />
          </svg>
        )}
        {errorMessage}
      </div>
    </div>
  );
}

export default InputAuth;
