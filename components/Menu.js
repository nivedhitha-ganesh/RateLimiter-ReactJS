import DashboardUser from "./DashboardUser";
import GetAllUsers from "./GetAllUsers";
import GetByEmail from "./GetByEmail";
import GetById from "./GetById";
import GetByJWT from "./GetByJWT";
import GetByUsername from "./GetByUsername";
import RegisterUser from "./RegisterUser";
import Login from "./login";
import {Route, Routes } from "react-router-dom";



function Menu(){
    return(
    <div>
        <Routes>{/*whatever path is given it should navigate and route */}
            <Route path="/register/:id" element={<RegisterUser/>}></Route>
            <Route path="/" element ={<Login/>}></Route>
            <Route path="/dashboard" element={<DashboardUser/>}></Route>
            <Route path="/users" element={<GetAllUsers/>}></Route>
            <Route path="/username" element={<GetByUsername/>}></Route>
            <Route path="/email" element={<GetByEmail/>}></Route>
            <Route path="/userid" element={<GetById/>}/>
            <Route path="/jwt" element={<GetByJWT/>}></Route>
        </Routes>
        
    </div>)

}
export default Menu;