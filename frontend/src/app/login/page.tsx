'use client'
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useRouter } from 'next/navigation';
import { login } from 'employeer/src/api/user';
import Link from 'next/link';
import { useProfile } from 'employeer/src/contexts/useProfile';

export interface LoginupFormInputs {
  email: string;
  password: string;
}

const schema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
  password: Joi.string().min(6).required().label('Password'),
});

const Login: React.FC = () => {
  const router = useRouter();
  const { userProfile,setUserProfile }: any = useProfile();

  const { register, handleSubmit, formState: { errors } ,watch} = useForm<LoginupFormInputs>({
    resolver: joiResolver(schema)
  });

  const [isLoading,setIsLoading] = useState(false)

  const onSubmit: SubmitHandler<LoginupFormInputs> = async (data) => {
    console.log(data);
    try {
      setIsLoading(true)
      const resp = await login(data);

      setUserProfile(resp.user)
      router.push("/")
    } catch (error) {
      console.log("error",error);
    }
    setIsLoading(false)
  };

  return (
    <div className="container">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register('password')} />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isLoading}>Sign Up</button>
      </form>
      <div style={{ marginTop: "10px" }}>
      </div>
    </div>
  );
};

export default Login;
