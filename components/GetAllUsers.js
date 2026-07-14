import { useState, useEffect } from "react";
import User from "./User";
import { useNavigate } from "react-router-dom";


function GetAllUsers(){
    let [usersList, setUsersList]=useState([]);
    let [btnVal, setBtnVal]=useState("Register");

    let navigate=useNavigate();
   
   useEffect(()=>{
    async function fetchData(){
        const storedToken=localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:3001/getUsers`, {
            method: "GET",
            headers:{
                'Authorization': `Bearer ${storedToken}`
            }
        });
        
    // if (response.status === 429) {
    //      const errorData = await response.json();
    //      setValidSearch(false);
    //      setFetchError(`${errorData.response} (Try again in ${errorData.ttl} seconds)`);
    //      return;
    //  }

        const res= await response.json();
        
        if(res.data.status==='Success')
        {
            //console.log(res.data.message);
            setUsersList(res.data.data);
        }
    }catch(error)
    {
        alert("Unable to fetch list of users");
        //console.log(error);
    }

    }
    fetchData();
    
   },[])

   const deleteUser= async (id)=>{
        const userId=id;
        const storedToken=localStorage.getItem("token");
        const response = await fetch(`http://localhost:3001/deleteById?id=${encodeURIComponent(userId)}`, {
            method:'DELETE',
            headers:{
                'Authorization': `Bearer ${storedToken}`
            }
        });
        const res= await response.json();
        //alert(res.data.message);
    
        let newArr=usersList.filter((user)=>user.id!==id);
        setUsersList(newArr);
        //console.log(newArr);
    }


    return(
    <div className="all">
        {/*to display the cards side by side */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {
                usersList.map((user)=>{
                    return <User key={user.userId} fetchedUser={user} deleteUser={deleteUser} validSearch={false}/>
                })
            }
            <button id="buttons" style={ {margin:"auto"} } onClick={()=>navigate("/dashboard")}>Back</button>
        </div>
    </div>
    )

}
export default GetAllUsers;