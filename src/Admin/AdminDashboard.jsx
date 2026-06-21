import React from 'react'
import { getAuthUser } from '../constant/Constant';

const AdminDashboard = () => {
  const authUser = getAuthUser();
  console.log({
    authUser
  });
  
  return (
    <div>
      fldjflasjfasld
    </div>
  )
}

export default AdminDashboard
