import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/registerForm";

export default function () {
  const { userStore, modalStore } = useStore();
  return (
    <>
      <Segment inverted textAlign="center" vertical className="masthead">
        <Container text>
          <Header as="h1" inverted>
            <Image
              size="massive"
              src="/assets/logo.png"
              alt="logo"
              style={{ marginBottom: 12 }}
            /> Reactivities
          </Header>
          {userStore.isLoggedIn ? (
            <>
              <Header as="h2" inverted content="Welcome to Reactivities" />
              <Button as={Link} to="/activities" size="huge" inverted>
                Go to activities!
              </Button>
            </>
          ) : (
            <>
            <Button onClick={()=>modalStore.openModel(<LoginForm/>)} size="huge" inverted>
              Login!
            </Button>
            <Button onClick={()=>modalStore.openModel(<RegisterForm/>)} size="huge" inverted>
              Register!
            </Button></>
          )}
        </Container>
      </Segment>
    </>
  );
}
