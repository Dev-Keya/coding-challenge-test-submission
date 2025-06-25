import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent, ButtonHTMLAttributes } from "react";
import $ from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  className = "",
  ...rest
}) => {
  // TODO: Add conditional classNames : DONE
  // - Must have a condition to set the '.primary' className : DONE
  // - Must have a condition to set the '.secondary' className : DONE
  // - Display loading spinner per demo video. NOTE: add data-testid="loading-spinner" for spinner element (used for grading) : DONE
  const variantClass =
    variant === "secondary" ? $.secondary : $.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${$.button} ${variantClass} ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? (
        <span data-testid="loading-spinner" className={$.spinner} />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
