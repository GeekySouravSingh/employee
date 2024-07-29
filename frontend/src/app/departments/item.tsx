'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

const Item = ({ department }: any) => {
    const router = useRouter()

  const handleEdit = (departmentId: string) => {
    // Implement edit functionality (e.g., redirect to an edit form)
    console.log('Edit department with ID:', departmentId);
  };

  const handleDelete = async (departmentId: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        const response = await fetch(`/api/auth/departments/${departmentId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Optionally refresh the page or refetch data
          console.log('Department deleted successfully');
        } else {
          console.error('Failed to delete department:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  return (
    <li key={department._id} className="departmentItem">
        <span>{department.name}</span>
        <button onClick={() => router.push(`department/${department.id}`)}>Edit</button>
        <button onClick={() => handleDelete(department._id)}>Delete</button>
    </li>
  )
}

export default Item