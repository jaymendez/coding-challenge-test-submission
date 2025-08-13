import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import cn from "classnames";
import $ from "./Button.module.css";
import Spinner from "../Spinner/Spinner";

interface ButtonProps {
  onClick?: () => void;
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
}) => {
  return (
    <button
      // DONE - Must have a condition to set the '.primary' className !!
      // DONE - Must have a condition to set the '.secondary' className !!
      // DONE - Display loading spinner per demo video. NOTE: add data-testid="loading-spinner" for spinner element (used for grading)
      className={cn($.button, {
        [$.primary]: variant === "primary",
        [$.secondary]: variant === "secondary",
        [$.loading]: loading,
      })}
      type={type}
      onClick={onClick}
    >
      {loading && (
        <span data-testid="loading-spinner">
          <Spinner />
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
