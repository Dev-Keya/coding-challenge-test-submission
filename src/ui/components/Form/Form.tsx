import React, { FunctionComponent } from 'react';

import Button from '../Button/Button';
import InputText from '../InputText/InputText';
import $ from './Form.module.css';

interface FormEntry {
  name: string;
  placeholder: string;
  // TODO: Defined a suitable type for extra props
  // This type should cover all different of attribute types : DONE
  extraProps: any;
}

interface FormProps {
  label: string;
  loading?: boolean;
  formEntries: FormEntry[];
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  submitText: string;
}

const Form: FunctionComponent<FormProps> = ({
  label,
  loading,
  formEntries,
  onFormSubmit,
  submitText,
}) => {
  return (
    <form onSubmit={onFormSubmit}>
      <fieldset>
        <legend>{label}</legend>
        {formEntries.map(({ name, placeholder, extraProps }, index) => {
          const normalizedExtraProps = {
            ...extraProps,
            value:
              extraProps.value !== undefined && extraProps.value !== null
                ? String(extraProps.value)
                : '',
          };

          return (
            <div key={`${name}-${index}`} className={$.formRow}>
              <InputText
                key={`${name}-${index}`}
                name={name}
                placeholder={placeholder}
                {...normalizedExtraProps}
              />
            </div>
          );
        })}

        <Button loading={loading} type="submit">
          {submitText}
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;
