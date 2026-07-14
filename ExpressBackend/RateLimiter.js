const redis=require("./redis-client"); 
const jwt = require('jsonwebtoken');
function rateLimiter({secondsWindow, allowedHits}){
    return async function(req, res, next){
    //const ip = req.headers['x-forwarded-for']?.split(',')[0]  || req.socket.remoteAddress;
    //console.log(ip); //op-::1 is the IP address means you're getting the IPv6 loopback address, which is equivalent to 127.0.0.1 in IPv4
    //It means the request is coming from localhost on our local machine port
    //const requests = await redis.incr(ip);

    
const authHeader = req.headers['authorization'];
 if (!authHeader || !authHeader.startsWith('Bearer ')) {
 return res.status(401).json({ response: 'Unauthorized: No token provided' });
 }
 const token = authHeader.split(' ')[1];
 let userName;
 try {
 const decoded = jwt.decode(token); // Use jwt.verify(token, secret) if you want to validate it
 //console.log("Decoded token:", decoded);
 userName = decoded.sub || decoded.userName || decoded.username;
 } catch (err) {
    return res.status(400).json({ response: 'Invalid token' });
 }  
 if (!userName) {
    return res.status(400).json({ response: 'Username not found in token' });
 }
 //console.log(userName);
 const key = `rate-limit:${userName}`;
 const requests = await redis.incr(key);

    let ttl //time to live
    //After 60 seconds, Redis deletes the key, and the user can start fresh.After the TTL expires, Redis automatically deletes the key, resetting the request count.
    if(requests==1){ //1st req
        await redis.expire(key,secondsWindow); //60 seconds cooldown
        ttl=secondsWindow
    }
    else{
         ttl=await redis.ttl(key); //how much time is left for the app to work in that time window
    }
    if(requests>allowedHits) //only 5 requests by min allowed
    {
      return res.status(429).json({
         response:'Too Many Requests. Please try again later',
         callsInAMinute:requests,
         ttl
      })
    }else{
        req.requests=requests
        req.ttl=ttl
        next(); //calls the next middleware in the chain
    }
  }
}
module.exports=rateLimiter;

//next is fn if you call, the next middleware in the chain will be called