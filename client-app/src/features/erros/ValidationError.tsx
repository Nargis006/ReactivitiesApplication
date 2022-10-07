import { Message } from "semantic-ui-react";

interface Props{
    errors:String[] | null;
}
export default function ValidationError({errors}:Props){
    return(<>
    <Message error>
        {errors &&(
            <Message.List>
                {errors.map((error:any, i)=> (
                    <Message.Item key={i}>{error}</Message.Item>
                ))}
            </Message.List>
        )}
    </Message>
    </>)
}