import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import User from "./User";

function GetById(){
    const [currentUser, setCurrentUser]=useState(""); //the current username that shd be displayed : Hello Nivedhitha!
    const [userId, setUserId]=useState(""); //the value of username entered by user
    const [userIdError,setUserIdError]=useState(""); //error message displayed when username is not entered or invalid
    let [valid,setValid]=useState(true);
    let [validSearch,setValidSearch]=useState(false); //this is for rendering the user data onto screen only when the search button is pressed and is user data exists
    //if validSearch is true then only User component will get rendered
    let [fetchedUser, setFetchedUser]=useState({}); //this is the user data/info that is fetched frm backend
    //its passed as props to User component
    let [fetchError,setFetchError]=useState(""); //to display rate limiter error message

    //to keep track of ttl timer and store it when it starts
    const [ttl, setTtl] = useState(null);

    let navigate=useNavigate();

    useEffect(()=>{
        setCurrentUser(localStorage.getItem("username"));
    },[])
    useEffect(() => { //for the ttl timer to run continuously (decreases with every second)
        let timer;
        if (ttl > 0) {
            timer = setInterval(() => {
                setTtl(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setFetchError(""); // Clear error when TTL ends
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [ttl]);
    
    let validation=()=>{
        if(userId==="" || userId===undefined){
            console.log("validation failed !!!!")
            setValid(false);
            setUserIdError("Please enter ID!!!");
        }
    }

    const useridHandler=(e)=>{
        setUserId(e.target.value); //the value retrieved by user which is the username value is assigned to the set method
    }
    const getByEmail= async (e)=>{
        e.preventDefault();
        validation();
        if(valid===true)
        {
            const storedToken=localStorage.getItem("token");
            try {
                const response = await fetch(`http://localhost:3001/getById?id=${encodeURIComponent(userId)}`, {
                    method: "GET",
                    headers:{
                        'Authorization': `Bearer ${storedToken}`
                    }
                });
                
            if (response.status === 429) {
                 const errorData = await response.json();
                 setValidSearch(false);
                 setTtl(errorData.ttl);
                 setFetchError(errorData.response);
                 return;
             }
    
                const res= await response.json();
                setFetchedUser(res.data.data);   
                //console.log(res);
                //console.log(response);
                if(res.data.status==='Success')
                {
                    setValidSearch(true);
                    setFetchError(false);
                }
            }catch(error)
            {
                alert("Unable to fetch user");
                console.log(error);
            }
        
        }
    }
    return(
        <div>
        <div className="user-container">
        <h2>Hello, {currentUser}!</h2>
        <form id="login-form" onSubmit={getByEmail}>
            <div className="username-fields">
                <label>Enter UserID of user to be fetched: </label>
                <input type="text" id="userid" onChange={useridHandler}/>
            </div>
            {userIdError && <p style={{color:'black'}}>{userIdError}</p>}
            <button type="submit" className="buttons">Search</button>
            <button id="buttons" onClick={()=>{ navigate("/dashboard"); }}>Back</button>
            {/* <p>{fetchedUser.firstName}</p> */}
        </form>
        
        {fetchError && (
                    <p style={{ fontWeight: "700", color: "black" }}>
                        {fetchError} {ttl > 0 && `(Try again in ${ttl} seconds)`}
                    </p>
                )}
        </div>
        <div className="output">
            {validSearch && <User fetchedUser={fetchedUser}/>}
        </div>
        </div>
    )

}
export default GetById;