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
        //console.log(login);
        return axios.post("http://localhost:8181/users/login", login);
    }
    //User Service APIs
    registerUser(userDetails)
    {
        return axios.post("http://localhost:8181/users/createUser", userDetails);
    }
    getAllUsers()
    {
        return axios.get("http://localhost:8181/users/getAll", this.getConfig());
    }
    getUserById(id)
    {
        return axios.get("http://localhost:8181/users/getById/"+id, this.getConfig());
    }
    getUserByEmail(email)
    {
        return axios.get("http://localhost:8181/users/getByEmail/"+email, this.getConfig());
    }
    getUserByJWT(jwt)
    {
        return axios.get("http://localhost:8181/users/getByJWT", {
            headers:{
                Authorization: "Bearer "+localStorage.getItem("token"), // used for authentication
                'X-Target-Token': jwt //used to search user
            }
        });
    }
    getUserByUsername(userName)
    {
        return axios.get("http://localhost:8181/users/getByUserName/"+userName, this.getConfig());
    }
    updateUser(id,user){
        console.log(user);
        return axios.put("http://localhost:8181/users/updateUser/"+id, user, this.getConfig());
    }
    deleteUserById(id)
    {
        return axios.delete("http://localhost:8181/users/deleteUser/"+id, this.getConfig());
    }
    //Book service APIs
    createBook(bookDetails){
        return axios.post("http://localhost:8181/books/addBook", bookDetails, this.getConfig());
    }
    getAllBooks()
    {
        return axios.get("http://localhost:8181/books/getAll", this.getConfig());
    }
    getBookById(bookId)
    {
        return axios.get("http://localhost:8181/books/getById/"+bookId, this.getConfig());
    }
    getBookByName(bookName)
    {
        return axios.get("http://localhost:8181/books/getByName/"+bookName, this.getConfig());
    }
    deleteBook(bookId)
    {
        return axios.delete("http://localhost:8181/books/deleteBook/"+bookId, this.getConfig());
    }
    updateBook(newBook, bookId)
    {
        return axios.put("http://localhost:8181/books/updateBook/"+bookId, newBook, this.getConfig());
    }   

}
export default ApiService;