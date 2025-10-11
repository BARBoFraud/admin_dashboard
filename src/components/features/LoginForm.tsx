"use client";
import { useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Card } from "../ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "../layout/ModeToggle";
import { FieldGroup, FieldLabel, Field } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Logo from "@/public/imgMaluma.jpeg";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Necesitas un nombre de usuario"),
  password: Yup.string().required("Necesitas una contraseña"),
});

export function LoginForm() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();

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
          setIsLoggingIn(true);
          setLoginError(null);
          try {
            await login(values.username, values.password);
          } catch (error: any) {
            setLoginError(error.message || "Error desconocido, intenta de nuevo");
            setIsLoggingIn(false);
          }
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
                  src={Logo.src}
                  alt="Logo"
                  className="w-30 h-30 rounded-full mx-auto mb-4"
                />
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">oFraud</h1>
              </div>
              {loginError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {loginError}
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
                <Button type="submit" disabled={isLoggingIn}>
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
