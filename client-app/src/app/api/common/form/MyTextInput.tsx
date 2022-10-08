import { useField } from "formik"
import { Form, Label } from "semantic-ui-react";

interface Props{
    placeholder: string,
    name: string,
    label?: string
}
export default function MyTextInput(props: Props){
    const [fields, meta] = useField(props.name);
    return (<Form.Field error={meta.touched && !!meta.error}>
        <label>{props.label}</label>
        <input {...fields} {...props}/>
        {meta.touched && meta.error ? (
            <Label basic color="red">{meta.error}</Label>
        ): null}
    </Form.Field>)
}