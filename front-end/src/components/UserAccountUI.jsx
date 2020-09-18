import React, { useState, useEffect, useContext, useCallback } from "react";
import { postRequest } from "../lib/HTTP";

export default function UserAccountUI({ user, logout, isAdmin }) {
  const [adminToken, setAdminToken] = useState(null);

  const submitAdminToken =(e) => {
    postRequest("/admins", [ adminToken, user.uid]);
  }

  //admin view
  if (!isAdmin) {
    return (
        <div>
          <h4>Become admin:</h4>
          <input
            type="text"
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="Paste admin token here"
          />
          <button onClick={submitAdminToken}>Submit Admin Token</button>
          <button onClick={logout}>Log Out</button>
        </div>
      );
  }

  //non-admin view
  else {
    return (
        <div>
            You are an admin. 
          <button onClick={logout}>Log Out</button>
        </div>
      );

  }
}
