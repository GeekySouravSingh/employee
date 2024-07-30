'use client'
import React, { useEffect, useState } from 'react'
import { getAll } from 'employeer/src/api/department'
import Item from './item';

const Departments =  () => {
  const [departments, setDepartments] = useState([]);
  
  useEffect(() => {
    (async () => {
        try {
          const resp = await getAll();
          setDepartments(resp?.departments)
        } catch (error: any) {
          throw new Error(error.message)
        }
    })();
  }, [])

  return (
    <div className="container">
      <h1>Departments</h1>
      <ul className="departmentList">
        {departments?.map((department:any) => (
          <Item department={department}/>
        ))}
      </ul>
    </div>
  );
}

export default Departments