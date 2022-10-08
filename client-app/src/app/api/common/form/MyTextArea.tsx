import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props{
    placeholder: string,
    name: string,
    rows: number
    label?: string
}
export default function MyTextArea(props: Props){
    const [fields, meta] = useField(props.name);
    return (<Form.Field error={meta.touched && !!meta.error}>
        <label>{props.label}</label>
        <textarea {...fields} {...props}/>
        {meta.touched && meta.error ? (
            <Label basic color="red">{meta.error}</Label>
        ): null}
    </Form.Field>)
}