import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/api/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from "yup";
import ValidationError from "../erros/ValidationError";

export default observer(function RegisterUser() {
  const { userStore } = useStore();
  return (
    <>
      <Formik
        initialValues={{
          displayname: "",
          username: "",
          email: "",
          password: "",
          error: null,
        }}
        onSubmit={(values, { setErrors }) =>
          userStore
            .register(values)
            .catch((error) => {
              setErrors({ error});
            })
        }
        validationSchema={Yup.object({
          displayname: Yup.string().required(),
          username: Yup.string().required(),
          email: Yup.string().required().email(),
          password: Yup.string().required(),
        })}
      >
        {/* autoComplete = not populate old values saved inside browser cache */}
        {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
          <Form onSubmit={handleSubmit} className="ui form error" autoComplete="off">
            <Header
              as="h1"
              color="teal"
              content="Sign up for Reactivities"
              textAlign="center"
            />

            <MyTextInput name="displayname" placeholder="Display Name" />
            <MyTextInput name="username" placeholder="Username" />
            <MyTextInput name="email" placeholder="email" />
            <MyTextInput
              name="password"
              placeholder="password"
              type="password"
            />
            <ErrorMessage
              name="error"
              render={() => (
                <ValidationError errors={errors.error}/>
              )}
            />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={isSubmitting}
              positive
              type="submit"
              fluid
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
});
