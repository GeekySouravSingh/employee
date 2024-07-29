'use client'
import { joiResolver } from '@hookform/resolvers/joi';
import { IDepartment, getOne, updateOne } from 'employeer/src/api/department';
import Joi from 'joi';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

const schema = Joi.object({
  name: Joi.string().required().label('name'),
});

const Department = ({ params: { id } }: any) => {
  const [department, setDepartment] = useState();
  
  const { register, handleSubmit, formState: { errors },setValue } = useForm<IDepartment>({
    resolver: joiResolver(schema),
    defaultValues: {name: department}
  });

  useEffect(() => {
    (async () => {
      const { department } = await getOne(id);
      setDepartment(department.name)
      setValue("name",department.name);
    })();
  },[])
  
  if (!department) {
    return <div>Department not found.</div>;
  }
  
  const onSubmit = async (data: IDepartment) => {
    try {
      await updateOne(id,data);
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className='container'>
      <h1>Department Details</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="formGroup">
          <label htmlFor="firstName">Name</label>
          <input id="firstName" {...register('name')} />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  )
}

export default Department