"use client";
import { useAdminsApi } from "@/api/Admins.api";
import { useState } from "react";
import * as Yup from "yup";
import { Card } from "../ui/card";
import { Form, Formik } from "formik";
import { FieldGroup, Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const adminSchema = Yup.object().shape({
  username: Yup.string()
    .required("Necesitas un nombre de usuario"),
    
  password: Yup.string()
    .required("Necesitas una contraseña")
    .min(10, "La contraseña debe tener al menos 10 caracteres")
});

export default function CreateAdminForm() {
    const { createAdmin } = useAdminsApi();
    const [isCreating, setIsCreating] = useState(false);
    const [creationError, setCreationError] = useState<string | null>(null);

    return (
        <Card>
            <Formik
                validationSchema={adminSchema}
                validateOnChange={false}
                validateOnBlur={true}
                initialValues={{
                    username: "",
                    password: "",
                }}
                onSubmit={async (values) => {
                    setIsCreating(true);
                    setCreationError(null);

                    try {
                        await createAdmin(values.username, values.password);
                    } catch (error) {
                        setCreationError("Error al crear el administrador");
                    } finally {
                        setIsCreating(false);
                        values.username = "";
                        values.password = "";
                    }
                }}
            >
                {({errors, values, touched, handleChange, handleBlur}) => (
                    <Form className="flex flex-col gap-6 p-6">
                        <FieldGroup>
                            {creationError && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                                    {creationError}
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
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating ? "Creando..." : "Crear Administrador"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </Form>
                )}
            </Formik>
        </Card>
    );
}