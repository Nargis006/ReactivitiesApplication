import { observer } from "mobx-react-lite";
import { Container, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

export default observer(function ServerError() {
    const { commonStore } = useStore();
    return (
      <>
        <Container>
          <Header as='h1' content='Server Error'/>
          <Header sub color='red' as='h5' content={commonStore.error?.message} />
          {commonStore.error?.details && <Segment>
              <Header sub color='teal' as='h4' content='Stack Trace'/>
              <code style={{marginTop: '10px'}}>{commonStore.error.details}</code>
          </Segment>}
        </Container>
      </>
    );
  })
