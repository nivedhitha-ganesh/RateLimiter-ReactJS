import { useNavigate } from "react-router-dom";

function DashboardUser(){
    let navigate=useNavigate();
    const username=localStorage.getItem("username");
    return(
    <div>
        <div className="dashboard-container">
            
            <h1>Welcome, {username}!</h1><h1>Choose your option</h1>
            <button id="getUsers" onClick={()=>{navigate("/users")}}>Get All Users</button>
            <button id="getByUsername" onClick={()=>{navigate("/username")}}>Get User by Username</button>
            <button id="getByEmail" onClick={()=>{navigate("/email")}}>Get User by Email</button>
            <button id="getById" onClick={()=>{navigate("/userid")}}>Get User by UserID</button>
            <button id="getByJwt" onClick={()=>{navigate("/jwt")}}>Get User by JWT token</button>
            <button id="buttons" onClick={()=>{ navigate("/"); }}>Back</button>
        </div>
    </div>
    )

}
export default DashboardUser;