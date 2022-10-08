import { useField } from "formik";
import { Form, Label, Select } from "semantic-ui-react";

interface Props {
  placeholder: string;
  name: string;
  options: any;
  label?: string;
}
export default function MySelectInput(props: Props) {
  const [fields, meta, helpers] = useField(props.name);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <Select
        options={props.options}
        value={fields.value || null}
        onChange={(e, d) => {
          helpers.setValue(d.value);
        }}
        onBlur={() => {
          helpers.setTouched(true);
        }}
        placeholder={props.placeholder}
      />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}
