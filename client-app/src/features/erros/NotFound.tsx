import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment, SegmentInline } from "semantic-ui-react";

export default function NotFound(){
    return(<>
    <Segment placeholder>
        <Header icon>
            <Icon name="search"/> Opps - we've looked everywere and couldnot find this.
        </Header>
        <SegmentInline>
            <Button primary as={Link} to='/activities'>Return to activities page</Button>
        </SegmentInline>
    </Segment>
    </>)
}