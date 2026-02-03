import { Link, useNavigate } from "react-router-dom"
import Logo from "../assets/footer-logo.svg"
import { useForm, type SubmitHandler } from "react-hook-form";
import { login as loginform } from "../core/services/login.service";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  username: z.string().min(4, 'Логин должен содержать минимум 4 символа'),
  password: z.string().min(4, 'Пароль должен содержать минимум 4 символа')
});

type LoginForm = z.infer<typeof schema>;

const Login = () => {
  const [isWrongCredentials, setIsWrongCredentials] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: loginform,
    onSuccess: (response) => {
      if (response.status.code === -3) {
        setIsWrongCredentials(true);
      } else if (response.status.code === 0) {
        localStorage.setItem('token', response.data.token);
        setIsWrongCredentials(false);
        navigate('/u/m-c');
      }
    }
  });

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col min-h-screen w-full pt-15.5 gap-28.25 bg-[linear-gradient(116.82deg,#1482FF_0%,#CD1CFF_100%)]">

      <Link to='/' className="flex justify-center items-center cursor-pointer" >
        <img src={Logo} alt="logo" />
      </Link>

      <div className="flex justify-center items-center">
        <form className="w-full max-w-105" onSubmit={handleSubmit(onSubmit)}>

          <h2 className="text-white text-center text-[28px] my-0">
            Вход
          </h2>

          <div className="flex flex-col mt-6.5">
            <label className="text-white text-[20px] font-semibold">
              Логин
            </label>

            <div className="relative mt-2">
              <input {...register('username')} id="login" type="text" placeholder="Введите логин"
                className="w-full max-w-105 h-13.75
                     pl-14.5 pr-4 py-3.5
                     rounded-2xl outline-none
                     bg-white/40 text-white text-[16px]
                     placeholder-white/70 placeholder:font-semibold" />
              <i className="pi pi-user text-2xl absolute left-4 top-1/2 -translate-y-[50%] text-white/70"></i>
            </div>
            {errors.username && (
              <span className="text-orange-400">{errors.username.message}</span>
            )}
          </div>

          <div className="flex flex-col mt-6.5">
            <label className="text-white text-[20px] font-semibold">
              Пароль
            </label>

            <div className="relative mt-2">
              <input {...register('password')} id="password" type="password" placeholder="Введите пароль"
                className="w-full max-w-105 h-13.75 pl-14.5 pr-4 py-3.5 rounded-2xl outline-none bg-white/40 text-white text-[16px] placeholder-white/70 placeholder:font-semibold" />
              <i className="pi pi-lock text-2xl absolute left-4 top-1/2 -translate-y-[50%] text-white/70"></i>
            </div>
            {errors.password && (
              <span className="text-orange-400">{errors.password.message}</span>
            )}

            {isWrongCredentials && (
              <span className="flex items-center gap-2.5 mt-2.75 text-orange-400 text-sm">
                <i className="pi pi-exclamation-circle"></i>
                Неверное имя пользователя или пароль
              </span>
            )}
          </div>

          <div className="relative mt-6.5">
            <button type="submit" disabled={false} className="cursor-pointer w-full max-w-105 h-13.75 rounded-2xl bg-white text-[#6600FF] text-[23px] font-medium transition disabled:cursor-not-allowed disabled:bg-white/80">
              Войти
            </button>
          </div>
        </form>
      </div >
    </div >
  )
}

export default Login;