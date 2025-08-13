import classNames from "classnames";
import React from "react";
import $ from "./ErrorMessage.module.css";

type Props = React.HTMLProps<HTMLDivElement>;

const ErrorMessage = (props: Props) => {
  return (
    <div className={classNames($.errorMessage, props.className)}>
      {props.children}
    </div>
  );
};

export default ErrorMessage;
