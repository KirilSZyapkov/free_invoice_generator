"use client";

import {useEffect} from "react";
import {useUser} from "@clerk/nextjs";

const SyncUser = ()=>{
  const {user} = useUser();

  useEffect(() => {

  }, []);
  return(
    <div>Sync User</div>
  )
}

export default SyncUser;