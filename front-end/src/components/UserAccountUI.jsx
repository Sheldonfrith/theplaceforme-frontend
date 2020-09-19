import React, { useState, useEffect, useContext, useCallback } from "react";
import { postRequest, getRequest } from "../lib/HTTP";

export default function UserAccountUI({ user, logout, isAdmin, setShowDataEntry }) {
  const [adminToken, setAdminToken] = useState(null);

  const submitAdminToken =(e) => {
    postRequest("/admins", [ adminToken, user.uid]);
  }
  const [datasetToDelete, setDatasetToDelete] = useState(null);
    const updateDatabase =(e)=>{
        getRequest('/update-database');
    }
    const removeFromDatabase = (e)=>{
        getRequest('/delete-from-database/q?datasetID='+datasetToDelete);
        setTimeout(()=>{getRequest('/update-database');},2000);
    }
  //non-admin view
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

  //admin view
  else {
    return (
        <div className="container-fluid bg-dark text-light p-2">
            You are an admin. 
          <button className="btn btn-primary" onClick={logout}>Log Out</button>
          <button className="btn btn-warning" onClick={()=>{setShowDataEntry(prev => !prev)}}>Switch View</button>
          <button className="btn btn-warning" onClick={updateDatabase}>Update Database Meta-Info</button>
          <button className="btn btn-danger" onClick={removeFromDatabase}>Remove dataset from database: </button>
          <span>
            <input className="form-control" type="text" placeholder="paste dataset id here" onChange={(e)=>setDatasetToDelete(e.target.value)}/>
            </span>
        </div>
      );

  }
}
