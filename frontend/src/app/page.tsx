"use client"

import { useEffect, useState } from "react";
import { useProfile } from "../contexts/useProfile";
import Link from "next/link";

export default function Home() {
  const { userProfile }: any = useProfile();

  const [profile, setProfile] = useState("User");

  useEffect(() => {
    if(userProfile?.firstName)
      setProfile(userProfile?.firstName + " " + userProfile?.lastName);
    else setProfile("")
  },[userProfile])

  return (
    <div style={{margin: "20px auto"}}>
      <div className="userInfo">
        <div className="userInfo-card">
          <h2>User Information</h2>
          {profile ? <div className="userInfo-details">
            <div className="userInfo-detail">
              <label>First Name:</label>
              <span>{userProfile?.firstName}</span>
            </div>
            <div className="userInfo-detail">
              <label>Last Name:</label>
              <span>{userProfile?.lastName}</span>
            </div>
            <div className="userInfo-detail">
              <label>Email:</label>
              <span>{userProfile?.email}</span>
            </div>
            <div className="userInfo-detail">
              <label>Address:</label>
              <span>{userProfile?.address}</span>
            </div>
            <div className="userInfo-detail">
              <label>Role:</label>
              <span>{userProfile?.role}</span>
            </div>
            <div className="userInfo-detail">
              <label>Department:</label>
              <span>{userProfile?.department.name}</span>
            </div>
          </div>: <h3>Please login to see info</h3>}
        </div>
      </div>
      {userProfile?.role === "Manager" && <div style={{ display: "flex",gap: "20px",justifyContent: 'center',marginTop: "20px" }}>
        <Link href="/departments">Department</Link>
        <p>/</p>
        <Link href="/employee">Employee</Link>
    </div>}
    
    </div>
  );
}
