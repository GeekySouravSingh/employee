import React, { useCallback, useState } from 'react'
import Employee from './page';
import { getUsers } from 'employeer/src/api/user';
interface UserTableProps {
    users: Employee[];
    onSort: (field: string, order: 1 | -1) => void;
    handleEdit: (employee: Employee) => void;
    handleDelete: (employee: string) => void;
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
    selectedEmployee: Employee | null;
}

const UserTable: React.FC<UserTableProps> = ({ users, onSort,handleEdit,selectedEmployee,setEmployees ,handleDelete}) => {
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<1 | -1>(1);

  const handleSort = useCallback(async (field: string) => {
    const order = sortField === field && sortOrder === 1 ? -1 : 1;
    setSortField(field);
    setSortOrder(order);
      onSort(field, order);
      try {
          const resp = await getUsers(field,order);
          
          setEmployees(resp.users)
      } catch (error) {
        
      }
  },[sortField,sortOrder]);


  return (
    <div className="userTable">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Name {sortField === 'name' && (sortOrder === 1 ? '▲' : '▼')}
            </th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th onClick={() => handleSort('address')}>
              Address {sortField === 'address' && (sortOrder === 1 ? '▲' : '▼')}
                      </th>
                      <th>
                          Edit
                      </th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <tr key={index}>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.department.name}</td>
            <td>{user.address}</td>
                <td>
                    {
                    selectedEmployee?.id !== user.id && <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </div>
                    }
              </td>
            </tr>
          ))}
        </tbody>
          </table>
          
    </div>
  )
}

export default UserTable