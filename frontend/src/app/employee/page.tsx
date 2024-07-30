'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import EmployeeForm from './form';
import { getUsers, removeUser } from 'employeer/src/api/user';
import { getAll } from 'employeer/src/api/department';
import UserTable from './table';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string,
  role: string;
  department: any;
}

interface Department {
  id: string;
  name: string;
}

const Employee = () => {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    (async () => {
      const [resp1, resp2]:any = await Promise.allSettled([
        getUsers(),
        getAll()
      ]);
      setEmployees(resp1.value.users);
      setDepartments(resp2.value.departments);
    })();
  }, [])
  
  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditing(false);
  };

  const handleUpdate = (employee: Employee) => {
    setEmployees((prev)=>prev.map((emp) => emp.id === employee.id ? employee : emp));
    setSelectedEmployee(null);
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await removeUser(id);
      setEmployees(employees.filter(employee => employee.id !== id));
    } catch (error) {
      
    }
  };

  return (
   <div style={{maxWidth: "1000px",margin: "auto"}}>
      <h1>Employees</h1>
      <button onClick={()=>router.push('/signup')} style={{width: "max-content"}}>Add New Employee</button>
       <div style={{display: "flex",gap: "20px",marginTop: "20px"}}>
          <UserTable users={employees}
            onSort={() => { }}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
            selectedEmployee={selectedEmployee}
          setEmployees={setEmployees}
        />
          {selectedEmployee?.id && (
            <EmployeeForm
              departments={departments}
              employee={selectedEmployee}
              setIsEditing={setIsEditing}
              setSelectedEmployee={setSelectedEmployee}
              handleUpdate={handleUpdate}
              employees={employees}
            />
          )}
        </div>
    </div>
  )
}

export default Employee