import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAdminLogin } from "@/hooks/auth.hooks";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card } from "./ui/card";
import logo from "@/components/assets/imgMaluma.jpeg";
import { ModeToggle } from "@/components/mode-toggle";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Necesita un nombre de usuario."),
  password: Yup.string().required("Necesita una contraseña."),
});

export function LoginForm() {
  const { login, isLoading, error, isLoggedIn } = useAdminLogin();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, router]);

  return (
    <Card>
      <Formik
        validationSchema={loginSchema}
        validateOnChange={false}
        validateOnBlur={true}
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values) => {
          await login(values);
        }}
      >
        {({ errors, values, touched, handleChange, handleBlur }) => (
          <Form className={"flex flex-col gap-6 p-6"}>
            <div className="flex justify-end">
              <ModeToggle />
            </div>
            <FieldGroup>
              <div>
                <img
                  src={logo.src}
                  alt="Logo"
                  className="w-30 h-30 rounded-full mx-auto mb-4"
                />
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">oFraud</h1>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.username && touched.username ? "border-red-500" : ""
                  }
                  required
                />
                {errors.username && touched.username && (
                  <p className="text-red-700 text-sm mt-1">{errors.username}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password ? "border-red-500" : ""
                  }
                  required
                />
                {errors.password && touched.password && (
                  <p className="text-red-700 text-sm mt-1">{errors.password}</p>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
