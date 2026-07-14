import { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login(){
    const [login, setLogin]=useState({username:'', password:''});
    let [valid,setValid]=useState(true);
    let [usernameError,setUsernameError]=useState("");

    //for routing
    let navigate= useNavigate();

    const usernameHandler=(e)=>{
        setUsernameError("");
        setLogin(prev => ({ ...prev, username: e.target.value }));
    }
    const passwordHandler=(e)=>{
        setLogin(prev => ({ ...prev, password: e.target.value }));
    }
   
    let validation=()=>{
        if(login.username==="" || login.username===undefined){
            console.log("validation failed !!!!")
            //setValid(false);
            setUsernameError("Please enter username!!!");
            toast.error("Please enter username!");
            //return false;
        }
        //setUsernameError("");
        //return true;
    }
    const handleSubmit= async (e)=>{
        e.preventDefault();
        //console.log(username, " ", password);
        //console.log(login.username, " ", login.password);
        validation();
        if(valid===true){
            let userName=login.username;
            let password=login.password;
            try {
                const response = await fetch('http://localhost:3001/login', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userName, password })
                });
        
                const res= await response.json();
                console.log(res); //res.data refers to the token that we need to get into the localStorage
                // if(res.data.status==='Success')
                // {
                //     console.log("working", res.data.data);
                // }
                if(res.data.status === 'Success'){
                    const token=res.data.data;
                    localStorage.setItem("token", token);
                    localStorage.setItem("username",login.username); //to display Hello, Nivedhitha instead of Hello, User
                    // alert("Login successful!!!");
                    toast.success("Login Successful!");
                    navigate("/dashboard");
                }
                else{
                    alert(res.data.message);
                }
            }
            catch (error) {
                //console.error("Login error:", error);
                // alert("User Login Failed");
                toast.error("User Login Failed");
            }

        }  
}
    const gatewayHandler=async ()=>{
            let userName=login.username;
            let password=login.password;
            //console.log(userName," ", password);
            try {
                const response = await fetch('http://localhost:3001/getToken', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userName, password })
                });
        
                const res= await response.json();
                console.log(res);
            }catch (error) {
                //console.error("Login error:", error);
                alert("User Login Failed");

            }
    }

    return(
        <div>
        <div className="login-container">
            <h2>Hello User!</h2>
        <form id="login-form">
            <div className="input-group">
                <label>Username</label>
                <input type="text" id="username" onChange={usernameHandler}/>
            </div>
            {usernameError && <p style={{fontWeight:"700", color:"white"}}>{usernameError}</p>}
            <div className="input-group">
                <label >Password</label>
                <input type="password" id="password" onChange={passwordHandler}/>
            </div>
            <button onClick={handleSubmit} id="sub">Login</button>
            <button onClick={()=>{navigate("/register/"+0)}} id="sign-up">Sign Up</button>
        </form>
        </div>
        {/* <div><button onClick={gatewayHandler}>Test</button></div> */}
        </div>
    )
}
export default Login;