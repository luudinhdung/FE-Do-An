import { ButtonHTMLAttributes } from "react";

interface PropTypes extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  message?: string;
}

function Button({ onClick, message, children, ...props }: PropTypes) {
  return (
    <button onClick={onClick} className={props.className}>
      {message}
      {children}
    </button>
  );
}

export default Button;
