"use client"
import { signOut } from 'employeer/src/api/user';
import { useProfile } from 'employeer/src/contexts/useProfile';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Header = () => {
  const router = useRouter()
  const { userProfile,setUserProfile }: any = useProfile();
  const [profile, setProfile] = useState("");

  useEffect(() => {
    if (userProfile?.firstName) setProfile(userProfile?.firstName + " " + userProfile?.lastName);
    else setProfile("")
  }, [userProfile]);


  const handleSignOut = async() => {
    await signOut();
    setUserProfile(null);

  }

  const handleClick = ()=> {
    profile ? handleSignOut() : router.push('/login');
  }

  return (
   <header className="header">
      <Link href="/" className="logo">
        LOGO
      </Link>
      <div>
        <button onClick={handleClick}>{profile ?"Sign out": "Sign In"}</button>
      </div>
    </header>
  )
}

export default Header