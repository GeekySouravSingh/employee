'use client'
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { getAll } from 'employeer/src/api/department';
import { registerUser } from 'employeer/src/api/user';
import { useRouter } from 'next/navigation';

export const roles = ["Employee","Manager"];

export interface SignupFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  department: string;
  address: string,
}

const schema = Joi.object({
  firstName: Joi.string().required().label('First Name'),
  lastName: Joi.string().required().label('Last Name'),
  address: Joi.string().required().label('Address'),
  email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
  password: Joi.string().min(6).required().label('Password'),
  role: Joi.string().required().label('Role'),
  department: Joi.string().required().label('Department')
});

const Signup: React.FC = () => {
    const router = useRouter()

  const { register, handleSubmit, formState: { errors } ,watch} = useForm<SignupFormInputs>({
    resolver: joiResolver(schema)
  });

  const [departments, setDepartments] = useState([]);
  const [isLoading,setIsLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const res = await getAll();
        setDepartments(res.departments)
      } catch (error) {
        console.log(error);
      }
      setIsLoading(true)
    })();
  },[])

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    console.log(data);
    try {
      setIsLoading(true)
      await registerUser(data);
      router.back()
    } catch (error) {
      console.log("error",error);
    }
    setIsLoading(false)
  };

  return (
    <div className="container">
      <h1>Create User</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="formGroup">
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" {...register('firstName')} />
          {errors.firstName && <p className="error">{errors.firstName.message}</p>}
        </div>

        <div className="formGroup">
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" {...register('lastName')} />
          {errors.lastName && <p className="error">{errors.lastName.message}</p>}
        </div>

        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
      
        <div className="formGroup">
          <label htmlFor="address">Address</label>
          <input id="address" type="address" {...register('address')} />
          {errors.address && <p className="error">{errors.address.message}</p>}
        </div>

        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register('password')} />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        <div className="formGroup">
          <label htmlFor="role">Role</label>
          <select id="role" {...register('role')}>
            <option selected disabled value="">Select Role</option>
            {roles.map((role: string) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {errors.role && <p className="error">{errors.role.message}</p>}
        </div>

        <div className="formGroup">
          <label htmlFor="department">Department</label>
          <select id="department" {...register('department')}>
            <option selected disabled value="">Select Department</option>
            {departments.map((department: any) => 
              <option key={department.id} value={department.id}>{department.name}</option>
            )}
          </select>
          {errors.department && <p className="error">{errors.department.message}</p>}
        </div>
        <button type="submit" >Sign Up</button>
      </form>
      <div style={{marginTop: "10px"}}>
      </div>
    </div>
  );
};

export default Signup;
