
const express = require('express');
const axios=require('axios');
//const redis=require("./redis-client");
const path = require('path');
const rateLimiter=require("./RateLimiter");
const cors = require('cors');
// const { LocalStorage } = require('node-localstorage');
// const localStorage = new LocalStorage('./scratch');


    const app = express();

    app.use(cors({
        origin: 'http://localhost:3000', // allow requests from your React app
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        credentials: true // if you're using cookies or authentication headers
    }));


    app.use(express.static('public'));

    app.use(express.static(path.join(__dirname, 'public')));//his tells the browser to request http://localhost:3001/index.css. But unless you explicitly tell Express to serve that file, it won’t know how to respond to that request
    //if someone requests /index.css, /script.js, or any other file that exists inside the public folder, just serve it directly
    //or else CSS, JS, images, etc. won’t load.
    app.use(express.json());

    //no rate limiting in login part
    app.post("/login", async (req,res)=>{
        try{ 
            //destructuring
            const {userName, password}=req.body; //this is the body that we passed in the request that we sent
            //console.log("Received from frontend:", {userName, password}); 
            const response=await axios.post('http://localhost:8282/users/login',{
                userName,
                password
            }
            );
            //So response.data.data REFERS TO TOKEN response.data.token 
            //one adv is that the current token is retieved and set in the localstorage during the login process itself instead of placing the token every single time
            //const token=response.data.data;
            //console.log(token);
            res.status(200).json({status:"success", message:"User logged in", data:response.data});
        }catch(error){
            //console.error(error);
            res.status(500).json({status:"failed", message:"User Login failed", error:error});
        }
})

//API Endpoints
app.post('/api1', rateLimiter({secondsWindow:60, allowedHits:5}), async(req,res)=>{
    //expensive fn calculation goes in RateLimiter.js
    return res.json({
        response:'ok',
        callsInAMinute:req.requests,
        ttl:req.ttl
    })
})
//token is not needed for registering user for first time
app.post('/createUser', async(req,res)=>{
    try{
        const resp=await axios.post('http://localhost:8282/users/createUser', req.body);
        res.status(200).json({status:"success", message:"User Registered", data:resp.data});
    }catch(error){
        //console.error(error);
        res.status(500).json({status:"error", message:"User Registration failed"});
    }
    
})
app.get('/getUsers', async (req,res)=>{
    const tokenFromHeader=req.headers['authorization'];
    const resp=await axios.get('http://localhost:8282/users/getAll', {
        headers: {
             'Authorization': tokenFromHeader
        }
    })
    //console.log(resp);
    res.status(200).json({status:"success",data:resp.data});
})

app.get("/getByUsername", rateLimiter({secondsWindow:20, allowedHits:2}), async (req,res)=>{
    const tokenFromHeader=req.headers['authorization'];
    const username=req.query.username; //username is the exact name which is mentioned in the url of fetch fn in GetByUsername component 
    //In this url `http://localhost:3001/getByUsername?username=${encodeURIComponent(username)}` username is the name used after ? symbol
    //console.log("Username from input:",username);
    const result= await axios.get(`http://localhost:8282/users/getByUserName/${username}`, {
        headers:{
            'Authorization':tokenFromHeader
        }
    });
    res.status(200).json({status:"sucess",data:result.data});
})

app.get("/getByEmail", rateLimiter({secondsWindow:60, allowedHits:5}), async (req,res)=>{
    const tokenFromHeader=req.headers['authorization'];
    const email=req.query.email;
    //console.log("Email from input: ", email);
    const result = await axios.get(`http://localhost:8282/users/getByEmail/${email}`, {
        headers:{
            'Authorization': tokenFromHeader
        }
    });
    res.status(200).json({status:"success", data:result.data});
})
app.get("/getById", rateLimiter({secondsWindow:60, allowedHits:3}), async (req, res)=>{
    const tokenFromHeader=req.headers['authorization'];
    const userId=req.query.id;
    const result= await axios.get(`http://localhost:8282/users/getById/${userId}`, {
        headers:{
            'Authorization': tokenFromHeader
        }
    })
    res.status(200).json({status:"success", data:result.data});
})

app.delete("/deleteById", async (req,res)=>{
    const tokenFromHeader=req.headers['authorization'];
    const userId=req.query.id;
    const result= await axios.delete(`http://localhost:8282/users/deleteUser/${userId}`,{
        headers:{
            'Authorization': tokenFromHeader
        }
    });
    res.status(200).json({status:"success", data:result.data});
})

//gateway endpoint for login
app.post("/getToken",async (req,res)=>{
    const result= await axios.post('http://localhost:8181/users/login', req.body);
    res.status(200).json({status:"success", data:result.data});
})

app.get("/getJwt", rateLimiter({secondsWindow:60, allowedHits:2}), async (req,res)=>{

    const jwtToken=req.headers['authorization']; //this is the token of user that has logged in currently 
    const tokenToBeSearched=req.query.jwt; //this is the token of user to be fetched
    //in the below code instead of `http://localhost:8282/users/getByJWT/${tokenToBeSearched}`doing this the token for which the user shd be fetched is retrieved frm header
    //so we must not append it after  /getByJWT and pass it in header section in authorization
    const result = await axios.get('http://localhost:8282/users/getByJWT', {
            headers:{
                'Authorization': jwtToken, // used for authentication
                'X-Target-Token': tokenToBeSearched 
            }
     });
     // abv we use custom header 'X-Target-Token' for retrieving the user with this token and in controller of backend we include this as one of the other headers and parameter


     //console.log(result.data);
     //console.log(tokenToBeSearched,jwtToken);
    res.status(200).json({status:"success", data:result.data});
});
app.put('/updateUser', async(req,res)=>{
    try{
        const id=req.query.id;
        const tokenFromHeader=req.headers['authorization'];
        //console.log(req.body);
        const resp=await axios.put(`http://localhost:8282/users/updateUser/${id}`, req.body,{
            headers:{
                'Authorization': tokenFromHeader
            }
        });
        res.status(200).json({status:"success", message:"User Updated", data:resp.data});
    }catch(error){
        //console.error(error);
        res.status(500).json({status:"error", message:"User Updation failed"});
    }
    
})

app.listen(3001, ()=> console.log("Listening on port 3001..."));