import { useNavigate, NavLink } from "react-router-dom";
import logo from './images/logo.png';
import { useState, useEffect } from 'react';

export default function Header() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // ask if the user is sure they want to log out
        // if they click "yes", log them out
        // if they click "no", do nothing
        if (confirm("Are you sure you want to log out?")) {
            fetch('http://localhost:8000/api/users/logout', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            .then((res) => {
                if (res.ok) {
                    setIsLoggedIn(false);
                    setUserName('');
                    navigate('/')
                }
            })
            .catch((error) => {
                    console.log(error.message, 'error');
            });
        }
    } 
    // If the user is logged in, show the user's name and a logout button
    // first, we need to get the user's name from the server
    useEffect(() => {
        // console.log("useEffect");
        const fetchData = async () => {
            fetch('http://localhost:8000/api/users/me/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((data) => {
                setUserName(data.nombre);
                setIsLoggedIn(true);
            }
            )
            .catch((error) => {
                console.log(error.message, 'error');
            });
        };
        fetchData();
    }, []);

    return (
        <header>
            {/* Navigation Bar */}
            <nav>
                <div id="logo-container">
                    <NavLink to="/">
                        <img id="logo" src={logo} height="44" />
                    </NavLink>
                </div>
                <div>
                    <form id="search-bar">
                        <input type="text" name="search" id="search" placeholder="Search..." />
                        {/* <input type="submit" value="Search"> */}
                    </form>
                </div>
                <div id="user-login-container">
                    <div id="login-register">
                        {isLoggedIn ? ( 
                            <div>
                                <span onClick={() => setIsOpen(!isOpen)}>Welcome, <strong style={{'textDecoration': 'underline'}}>{userName}</strong></span>
                                {console.log("isOpen:", isOpen)}
                                {isOpen ?  (
                                    <div className="modal" onClick={() => setIsOpen(false)}>
                                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                                            
                                        <p><a href="/profile">Profile</a></p>
                                        <hr />
                                        <p onClick={handleLogout}><a>Logout</a></p>
                                            
                                    </div>
                                    </div>
                                ) : null
                                }
                            </div>
                        ) : (
                            <div>
                                <NavLink className="sign-in" to="/login">
                                    <strong>Login</strong>
                                </NavLink>
                                {" "}/{" "}
                                <NavLink className="register" to="/register">
                                    Register
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};