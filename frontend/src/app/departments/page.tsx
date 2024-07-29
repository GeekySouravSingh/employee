import { getAll } from 'employeer/src/api/department'
import React from 'react'
import Item from './item';

const Departments = async () => {
  const { departments = [] } = await getAll();

  return (
    <div className="container">
      <h1>Departments</h1>
      <ul className="departmentList">
        {departments.map((department:any) => (
          <Item department={department}/>
        ))}
      </ul>
    </div>
  );
}

export default Departments