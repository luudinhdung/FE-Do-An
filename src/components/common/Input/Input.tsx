import React, { InputHTMLAttributes } from "react";

interface PropTypes extends InputHTMLAttributes<HTMLInputElement> {
  message?: string;
  register?: any;
  name?: string;
}

function Input({ name, message, register, children, ...props }: PropTypes) {
  return <input {...props} {...(register ? register(name) : {})} />;
}

export default Input;
