import axios from "axios";
class ApiService{
    getConfig(){
        let config={
            headers:{
                Authorization:"Bearer "+localStorage.getItem("token")
            }
        }
        return config;
    }
    authenticate(login){
        return axios.post("http://localhost:8282/users/login", login);
    }

}
export default ApiService;