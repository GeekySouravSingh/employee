"use client"

import { useEffect, useState } from "react";
import { useProfile } from "../contexts/useProfile";
import Link from "next/link";

export default function Home() {
  const { userProfile }: any = useProfile();

  console.log("Home userProfile",userProfile);
  

  const [profile, setProfile] = useState("User");

  useEffect(() => {
    if(userProfile?.firstName)
      setProfile(userProfile?.firstName + " " + userProfile?.lastName);
    else setProfile("")
  },[userProfile])

  return (
    <div style={{margin: "20px auto"}}>
      <h2> Welcome {profile}</h2>
      <h3 style={{ margin: "20px auto" }}>{userProfile?.role === "Manager" ? <Link href="/departments">Department</Link> : ""}</h3>
      <h3 style={{margin: "20px auto"}}>{userProfile?.role === "Manager" ? <Link href="/employee">Employee</Link>: ""}</h3>
    </div>
  );
}
