import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';

function RegisterUser(){

    const [user,setUser]=useState({});
     //here is where the entire user object will get stored
    const [btnVal, setBtnVal]=useState("Register");
    //const [existingUser, setExistingUser]=useState({});
    const navigate=useNavigate();
    const {id}=useParams(); //this is retrieved from the url of path and is given in the menu component in path

    useEffect( ()=> {
        //console.log(id);
        //console.log(Number(id)===10);
        async function fetchData(){
            if(Number(id)>0) //which means there is an id existing so updation of already existing user is required
            {
                const storedToken=localStorage.getItem("token");
                try {
                    const response = await fetch(`http://localhost:3001/getById?id=${encodeURIComponent(id)}`, {
                        method: "GET",
                        headers:{
                            'Authorization': `Bearer ${storedToken}`
                        }
                    });
        
                    const res= await response.json();
                    setUser(res.data.data);  
                    setBtnVal("Edit");
            }catch(error)
            {
                alert("Unable to fetch user");
            }  
            }
        }
        fetchData();
    },[])

    const firstnameHandler=(e)=>{
        user.firstName=e.target.value;
        setUser((prevState)=>{return {...prevState, user:e.target.value}});
    }
    const lastnameHandler=(e)=>{
        user.lastName=e.target.value;
        setUser((prevState)=>{return {...prevState, user:e.target.value}});
    }
    const usernameHandler=(e)=>{
        user.userName=e.target.value;
        setUser((prevState)=>{return {...prevState, user:e.target.value}});
    }
    const emailHandler=(e)=>{
        user.email=e.target.value;
        setUser((prevState)=>{return {...prevState, user:e.target.value}});
    }
    const passwordHandler=(e)=>{
        user.password=e.target.value;
        setUser((prevState)=>{return {...prevState, user:e.target.value}});
    }
    const phoneNumberHandler=(e)=>{
        user.phoneNumber=e.target.value;
        setUser((prevState)=>{return {...prevState, user:e.target.value}});
    }
    const submitHander=async (e)=>{
        e.preventDefault();
        if(id>0)
        {
            //console.log("Updated user: ",user);
            const storedToken=localStorage.getItem("token");
            const response = await fetch(`http://localhost:3001/updateUser?id=${encodeURIComponent(id)}`, {
                method:'PUT',
                headers: { 
                    'Authorization':`Bearer ${storedToken}`,
                    'Content-Type': 'application/json' 
                },
                body:JSON.stringify(user)
            });
            const res= await response.json();
            console.log(res);
            toast.success("User Details Updated!");
        }
        else{
            const response = await fetch('http://localhost:3001/createUser', {
                method:'POST',
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify(user)
            });
            const res= await response.json();

            console.log(res);
            toast.success("User Registered!");
        }
        //alert(res.data.message);
    }

    return(
        <div>
            <form className="dashboard-container" onSubmit={submitHander}>
                <div className="input-group">
                    <label className="register-label">Firstname:</label>
                    <input type="text" value={user.firstName} className="form-control" id="firstname" placeholder="Enter your firstname" onChange={firstnameHandler}/>
                </div>
                <div className="input-group">
                    <label className="register-label">Lastname:</label>
                    <input type="text" className="form-control" value={user.lastName} id="lastname" placeholder="Enter your lastname" onChange={lastnameHandler}/>
                    {/* <div>{movieNameError}</div> */}
                </div>
                <div className="input-group">
                    <label className="register-label">Username:</label>
                    <input type="text" className="form-control" value={user.userName} id="username" placeholder="Enter your username" onChange={usernameHandler}/>
                </div>
                <div className="input-group">
                    <label className="register-label">Phone Number:</label>
                    <input type="text" className="form-control" value={user.phoneNumber} id="phoneno" placeholder="Enter your phone number:" onChange={phoneNumberHandler}/>
                </div>
                <div className="input-group">
                    <label className="register-label">Email:</label>
                    <input type="text" className="form-control" value={user.email} id="email" placeholder="Enter your Email Id" onChange={emailHandler}/>
                    
                </div>
                {btnVal==="Register" && <div className="input-group">
                    <label>Password:</label>
                    <input type="text" className="form-control" value={user.password} id="password" placeholder="Enter your password" onChange={passwordHandler}/>
                </div>}
                <button type="submit" className="buttons">{btnVal}</button>
                <button id="buttons" onClick={()=>navigate("/dashboard")}>Back</button>
            </form>
        </div>

    )

}
export default RegisterUser;