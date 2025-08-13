import React, { ChangeEvent, useState } from "react";

type Field = {
  [key: string]: any;
};

const useFormState = <T extends Field>(initialValues: T) => {
  const [fields, setFields] = useState<T>(initialValues);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFields = () => setFields(initialValues);

  return { fields, onChange, resetFields };
};

export default useFormState;
