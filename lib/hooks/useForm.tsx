import { useEffect, useRef, useState } from 'react';

import type { TypeOf, ZodSchema } from 'zod';

type Errors<S> = {
  [K in keyof S]?: string;
};

type SubmitFunction = () => void;

export default function useForm<Schema extends ZodSchema, State = TypeOf<Schema>>(
  initialState: State,
  schema: Schema,
  submit: (data: State) => Promise<void> | void
): [
  State,
  Errors<State>,
  (field: keyof State, value: State[keyof State]) => void,
  SubmitFunction,
  boolean,
  (loading: boolean) => void,
  (data: State) => void,
] {
  const [data, setData] = useState<State>(initialState);
  const [errors, setErrors] = useState<Errors<State>>({});
  const [loading, setLoading] = useState(false);
  const ref = useRef(false);

  useEffect(() => {
    ref.current = true;

    return () => {
      ref.current = false;
    };
  }, []);

  // Validate a single field by validating the entire form and extracting the relevant error
  const validateField = (newData: State, field: keyof State) => {
    const test = schema.safeParse(newData);

    if (!test.success) {
      // Find any errors related to this field
      const fieldError = test.error.errors.find(
        (error) => error.path.length > 0 && error.path[0] === field
      );

      if (fieldError) {
        return fieldError.message;
      }
    }

    return undefined;
  };

  const handleChange = (field: keyof State, value: State[keyof State]) => {
    // Create the new data object
    const newData = {
      ...data,
      [field]: value,
    };

    // Update the data state
    setData(newData);

    // Validate the field in real-time
    const fieldError = validateField(newData, field);

    // Update errors for just this field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: fieldError,
    }));
  };

  const handleSubmit = () => {
    const test = schema.safeParse(data);

    if (test.success) {
      submit(data);
      return;
    }

    // Create a formatted errors object from all validation errors
    const formattedErrors: Errors<State> = {};

    test.error.errors.forEach((error) => {
      if (error.path.length > 0) {
        const field = error.path[0] as keyof State;
        formattedErrors[field] = error.message;
      }
    });

    setErrors(formattedErrors);
  };

  const setFormData = (newData: State) => {
    setData(newData);

    setErrors({});
  };

  return [data, errors, handleChange, handleSubmit, loading, setLoading, setFormData];
}
