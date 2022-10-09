import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/api/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";

export default observer(function InputForm() {
  const {userStore} = useStore();
  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" , error: null}}
        onSubmit={(values, {setErrors}) => userStore.login(values)
        .catch(error=> setErrors({error:'Invalid email or password'}))}
      >
        {/* autoComplete = not populate old values saved inside browser cache */}
        {({ handleSubmit, isSubmitting, errors}) => (
          <Form onSubmit={handleSubmit} className="ui form" autoComplete="off">
            <Header as='h1' color="teal" content="Login to Reactivities" textAlign="center"/>
            <MyTextInput name="email" placeholder="email" />
            <MyTextInput
              name="password"
              placeholder="password"
              type="password"
            />
            <ErrorMessage name="error" render={
              ()=> <Label basic color="red" style={{margin: 10}}
              content={errors.error}/>
            }/>
            <Button loading={isSubmitting} positive type="submit" fluid>Login</Button>
          </Form>
        )}
      </Formik>
    </>
  );
})
