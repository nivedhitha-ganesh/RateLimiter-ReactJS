import { useEffect, useState } from "react";
import User from "./User";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function GetByUsername() {
    const [currentUser, setCurrentUser] = useState("");
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [valid, setValid] = useState(true);
    const [validSearch, setValidSearch] = useState(false);
    const [fetchedUser, setFetchedUser] = useState({});
    const [fetchError, setFetchError] = useState("");
    const [ttl, setTtl] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setCurrentUser(localStorage.getItem("username"));
    }, []);

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

    const validation = () => {
        if (username === "" || username === undefined) {
            //setValid(false);
            setUsernameError("Please enter username!!!");
            toast.error("Please enter username!");
        } else {
            setValid(true);
            setUsernameError("");
        }
    };

    const usernameHandler = (e) => {
        setUsernameError("");
        setUsername(e.target.value);
    };

    const getByUsername = async (e) => {
        e.preventDefault();
        validation();
        if (valid) {
            const storedToken = localStorage.getItem("token");
            try {
                const response = await fetch(`http://localhost:3001/getByUsername?username=${encodeURIComponent(username)}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${storedToken}`
                    }
                });

                if (response.status === 429) {
                    const errorData = await response.json();
                    setValidSearch(false);
                    setTtl(errorData.ttl);
                    setFetchError(errorData.response);
                    toast.error("TOO MANY REQUESTS!!");
                    return;
                }

                const res = await response.json();
                if (res.data.status === 'Success') {
                    setFetchedUser(res.data.data);
                    setValidSearch(true);
                    setFetchError("");
                    toast.success("User Fetched!");
                }
            } catch (error) {
                toast.error("Unable to fetch user");
                //alert("Unable to fetch user");
                //console.log(error);
            }
        }
    };

    return (
        <div>
            <div className="user-container">
                <h2>Hello, {currentUser}!</h2>
                <form id="login-form" onSubmit={getByUsername}>
                    <div className="username-fields">
                        <label>Enter name of user to be fetched: </label>
                        <input type="text" id="username" onChange={usernameHandler} />
                    </div>
                    {usernameError && <p style={{ color: 'black' }}>{usernameError}</p>}
                    <button type="submit" className="buttons">Search</button>
                    <button id="buttons" type="button" onClick={() => navigate("/dashboard")}>Back</button>
                </form>

                {fetchError && (
                    <p style={{ fontWeight: "700", color: "black" }}>
                        {fetchError} {ttl > 0 && `(Try again in ${ttl} seconds)`}
                    </p>
                )}
            </div>

            <div className="output">
                {validSearch && <User fetchedUser={fetchedUser} />}
            </div>
        </div>
    );
}

export default GetByUsername;
