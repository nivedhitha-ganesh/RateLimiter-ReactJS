import { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from './ApiService';
import { FaKey } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";

function Login(){
    const [login, setLogin]=useState({userName:'', password:''});
    let [usernameError,setUsernameError]=useState("");
    let apiService=new ApiService(); //object for ApiService class
    let navigate= useNavigate(); //for routing

    const usernameHandler=(e)=>{
        setUsernameError("");
        setLogin(prev => ({ ...prev, userName: e.target.value }));
    }
    const passwordHandler=(e)=>{
        setLogin(prev => ({ ...prev, password: e.target.value }));
    }
   
    let validation=()=>{
        if(login.userName==="" || login.userName===undefined){
            console.log("validation failed !!!!")
            //setValid(false);
            setUsernameError("Please enter username!!!");
            toast.error("Please enter username!");
            return false;
        }
        //setUsernameError("");
        return true;
    }
    const handleSubmit= (e)=>{
        e.preventDefault();
        console.log(login.userName, " ", login.password);
            if(validation()){
                apiService.authenticate(login).then((res)=>{
                    // console.log(res.data);// console.log(res.data.status);
                    if(res.data.status === 'Success'){
                        if(login.userName==='adminRoot')
                        {   
                            localStorage.setItem('admin',login.userName); 
                        }else{
                            localStorage.setItem('admin',"");
                        }
                        
                        const token=res.data.data;
                        localStorage.setItem("token", token);
                        localStorage.setItem("username",login.userName); //to display Hello, Nivedhitha instead of Hello, User
                        toast.success("Login Successful!");
                        navigate("/options");
                        //navigate("/dashboard");
                    }else{
                        toast.error("User Login Failed");
                    }
                },
                    (err)=>{
                        //console.log("Error: ",err)
                        console.log(err.response.data.errorMessage);
                        toast.error("User Login Failed");
                        setUsernameError(err.response.data.errorMessage+"!!");
                    }
                )
            }      
    }  

    return(
        <div>
        <div className="login-container">
            <h2>Hello User!</h2>
        <form id="login-form">
            <div className="input-group">
                <label>Username</label>
                <div className="input-with-icon">
                    <CgProfile className="profile-icon"/><input type="text" id="username" value={login.userName} onChange={usernameHandler}/>
                </div>
            </div>
            
            <div className="input-group">
                <label >Password</label>
                <div className="input-with-icon">
                    <FaKey className="input-icon"/><input type="password" id="password" value={login.password} onChange={passwordHandler}/>
                </div>
            </div>
            {usernameError && <p style={{fontWeight:"700", color:"white"}}>{usernameError}</p>}
            <button onClick={handleSubmit} id="sub" className="login-btn">Login</button>
            <button onClick={()=>{navigate("/register/"+0)}} id="sign-up" className="login-btn">Sign Up</button>
        </form>
        </div>
        </div>
    )
}
export default Login;