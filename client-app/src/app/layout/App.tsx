import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, Switch, useLocation } from "react-router-dom";
import home from "../../features/home/home";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/erros/TestErrors";
import { ToastContainer } from "react-toastify";
import NotFound from "../../features/erros/NotFound";
import ServerError from "../../features/erros/ServerError";

function App() {
  const location = useLocation();
  return (
    <>
    <ToastContainer position="bottom-right" hideProgressBar/>
    <Route path="/" component={home} exact/>
    <Route
     path={'/(.+)'}
     render={()=><>
     <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <Switch>
          <Route path="/activities" component={ActivityDashboard} exact/>
          <Route path="/activities/:id" component={ActivityDetails} />
          <Route key={location.key} path={['/createActivity','/manage/:id']} component={ActivityForm} />
          <Route path='/errors' component={TestErrors} />
          <Route path='/server-error' component={ServerError} exact/>
          <Route component={NotFound}/>
        </Switch>
      </Container>
     </>}/>
    </>
  );
}

export default observer(App);
