import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAdminLogin } from "@/hooks/auth.hooks"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card } from "./ui/card"

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required."),
  password: Yup.string().required("Password is required."),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { login, isLoading, error, isLoggedIn } = useAdminLogin();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  return (
    <Card>
    <Formik
      validationSchema={loginSchema}
      validateOnChange={true}
      initialValues={{
        username: "",
        password: "",
      }}
      onSubmit={async (values) => {
        await login(values);
      }}
    >
      {({errors, values, setFieldValue}) => (
        <Form className={cn("flex flex-col gap-6 p-6", className)} {...props}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-bold">Ingresa a tu cuenta</h1>
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
                onChange={(e) => setFieldValue("username", e.target.value)}
                className={errors.username ? "border-red-500" : ""}
                required 
              />
              {errors.username && (
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
                onChange={(e) => setFieldValue("password", e.target.value)}
                className={errors.password ? "border-red-500" : ""}
                required 
              />
              {errors.password && (
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
  )
}
