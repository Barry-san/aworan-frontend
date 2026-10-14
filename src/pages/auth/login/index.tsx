import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { Button } from "#components/ui/button"
import { Input } from "#components/ui/input"
import { ERROR_MESSAGES } from "#lib/contants"
import AuthLayout from "../../../layouts/authLayout"
import FormError from "../components/form-error"
import { useLogin } from "../hooks/useLogin"

export default function LoginPage() {
  return (
    <AuthLayout cta={<LoginCTA />} description={"Sign in"}>
      <LoginForm />
    </AuthLayout>
  );
}


function LoginForm() {
  const { register, handleSubmit, formState } = useForm<{ email: string, password: string }>()
  const { errors } = formState
  const { mutate: handleLogin } = useLogin()
  const [isVisible, setVisibility] = useState(false)

  return <form className="grid gap-8" onSubmit={handleSubmit((data) => handleLogin(data))}>
    <div className="grid gap-2" >
      <label htmlFor="email" className="text-neutral-200 text-sm">email</label>
      <div className="relative">
        <Mail
          aria-hidden
          pointerEvents={"none"}
          className="size-4 text-neutral-400 top-1/4 left-3 absolute"
        />
        <Input
          type="email"
          placeholder="example@email.com"
          className="pl-9"
          {...register("email", { required: ERROR_MESSAGES.required_field })} />
      </div>
      <FormError error={errors.email?.message} />
    </div>

    <div className="grid gap-2">
      <label htmlFor="password" className="text-neutral-200 text-sm">password</label>
      <div className="relative">
        <Lock className="size-4 text-neutral-400 absolute bottom-1/4 left-3" />
        <Input
          type={isVisible ? "text" : "password"}
          placeholder="enter your password"
          className="pl-9"
          {...register("password", { required: ERROR_MESSAGES.required_field, minLength: { value: 6, message: "Minimum of 6 characters" } })} />

        <button
          className="absolute right-3 top-1/4"
          type="button"
          onClick={() => setVisibility(!isVisible)}>
          {isVisible ? <Eye className="size-4 text-neutral-400" /> : <EyeOff className="size-4 text-neutral-400" />}
        </button>
      </div>
      <FormError error={errors.password?.message}></FormError>
    </div>

    <Button type="submit" className="py-5 text-sm capitalize font-mono">
      Sign in <ArrowRight aria-hidden />
    </Button>
  </form>
}

function LoginCTA() {
  return <p>Don't have an account? <Link to={"/signup"} className="underline text-primary">Sign up</Link></p>
}
