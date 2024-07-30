import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SignupFormInputs, roles } from '../signup/page';
import { update } from 'employeer/src/api/user';
import { useRouter } from 'next/navigation';

interface Department {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
   address?: string,
  email: string;
  role: string;
  department: Department;
}

export interface FormInputs {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  address?: string,
  department: string;
}

interface EmployeeFormProps {
  employee: Employee | null;
  handleUpdate: (employee: Employee) => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
  employees: Employee[] | null;
  departments: Department[]
}

const schema = Joi.object({
  firstName: Joi.string().required().label('First Name'),
  lastName: Joi.string().required().label('Last Name'),
  address: Joi.string().required().label('Address'),
  email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
  role: Joi.string().required().label('Role'),
  department: Joi.string().required().label('Department')
});

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, setIsEditing, setSelectedEmployee, handleUpdate, departments }) => {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>({
    resolver: joiResolver(schema),
    defaultValues: {
      firstName: employee?.firstName || '',
      lastName: employee?.lastName || '',
      email: employee?.email || '',
      role: employee?.role || '',
      address: employee?.address || '',
      department: employee?.department?.id || '' 
    }
  });

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        role: employee.role,
        address: employee?.address || '',
        department: employee.department?.id || ''
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        role: '',
        department: ''
      });
    }
  }, [employee, reset]);

    const onSubmit = async(data: FormInputs | SignupFormInputs) => {
      try {
        if (employee) {          
          const resp = await update(employee!.id, data);
          handleUpdate(resp.user);
        } else {
          router.push('/signup')
        }
      } catch (error) {}
    };

  return (
    <div className="employeeForm">
      <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
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
          <label htmlFor="role">Roles</label>
          <select id="role" {...register('role')}>
            <option value="" disabled>Select Role</option>
            {roles.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.role && <p className="error">{errors.role.message}</p>}
        </div>

        <div className="formGroup">
          <label htmlFor="department">Department</label>
          <select id="department" {...register('department')}>
            <option value="" disabled>Select Department</option>
            {departments.map(it => (
              <option key={it.id} value={it.id}>
                {it.name}
              </option>
            ))}
          </select>
          {errors.department && <p className="error">{errors.department.message}</p>}
        </div>

        <div style={{ display: "flex" }}>
          <button type="submit">{employee ? 'Update' : 'Add'}</button>
          <button type="button" onClick={() => setSelectedEmployee(null)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
