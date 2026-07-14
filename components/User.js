function User(props){
    const id = props.fetchedUser.userId;
    const valid=props.validSearch;
    return(
        <div>
            <div class="card" style={{width:"22rem", backgroundColor:"#f7dcee"}}>
                <div class="card-body">
                <h3 class="card-title">ID - {props.fetchedUser.userId}: <b>{props.fetchedUser.firstName} {props.fetchedUser.lastName}</b></h3>
                <h6 class="card-subtitle mb-2 text-muted"><i>No. {props.fetchedUser.phoneNumber}</i></h6>
                <p class="card-text">You have been logged in as <b><i>{props.fetchedUser.role}</i></b> with email id <b><i>{props.fetchedUser.email}</i></b> and username as <b><i>{props.fetchedUser.userName}</i></b></p>
                { valid===false &&
                    <a href={"/register/"+id} class="card-link"><button className="btn btn-warning">Update Details</button></a>
                }
                { valid===false &&
                    <a href="#" class="card-link"><button className="btn btn-danger" onClick={()=>props.deleteUser(props.fetchedUser.userId)}>Remove User</button></a>
                }
                </div>
            </div>   
        </div>
    )

}
export default User;