import { NavLink } from "react-router-dom";
import logo from './images/logo.png';
import RatingStars from './RatingStars';
import { useState, useEffect } from 'react';
import { checkLoggedIn, logout } from "./api";

export default function Header() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [advancedSearch, setAdvancedSearch] = useState(false);
    const [ratingFilter, setRatingFilter] = useState(0);
    const navigate = useNavigate();

    const handleLogout = () => {
        // ask if the user is sure they want to log out
        // if they click "yes", log them out
        // if they click "no", do nothing
        if (confirm("Are you sure you want to log out?")) {
            logout(setIsLoggedIn, setUserName);
        }
    } 
    // If the user is logged in, show the user's name and a logout button
    // first, we need to get the user's name from the server
    useEffect(() => {
        // Check if the user is logged in
        checkLoggedIn().then((data) => {
            if (data.isLoggedIn) {

                setIsLoggedIn(true);
                setUserName(data.user.nombre);
            } else {
                setIsLoggedIn(false);
                setUserName('');
            }
        });

    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.id !== 'advanced') {
                if (event.target.id !== 'advanced-search' && advancedSearch) {
                    setAdvancedSearch(false);
                }
            }
            if (event.target.id !== 'profile-actions' && event.target.id !== 'name-bold') {
                if (event.target.id !== 'modal' && isOpen) {
                    setIsOpen(false);
                }
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [advancedSearch, isOpen]);

    return (
        <header>
            {/* Navigation Bar */}
            <nav>
                <div id="logo-container">
                    <NavLink to="/">
                        <img id="logo" src={logo} height="44" />
                    </NavLink>
                </div>
                <div id="search-bar-container">
                    <form id="search-bar">
                        <input type="text" name="title" id="title" placeholder="Search..." />
                    </form>
                    <div id="advanced" onClick={() => setAdvancedSearch(!advancedSearch)}>
                        Advanced Search &gt;&gt;&gt;
                    </div>
                </div>
                {advancedSearch ?
                    <div id='advanced-search' className="modal" onClick={() => setAdvancedSearch(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <form id="advanced-search-form">
                                <label for="title" style={{'color': 'black'}}>Title:</label>
                                <input type="text" name="title" id="title" placeholder="Title" />
                                <label for="director" style={{'color': 'black'}}>Director:</label>
                                <input type="text" name="director" id="director" placeholder="Director" />
                                <label for="genre" style={{'color': 'black'}}>Genre:</label>
                                <input type="text" name="genre" id="genre" placeholder="Genre" />
                                <label for="year" style={{'color': 'black'}}>Year:</label>
                                <input type="text" name="year" id="year" placeholder="Year" />
                                <label for="rating" style={{'color': 'black'}}>Rating:</label>
                                <input type="hidden" name="rating" id="rating" placeholder="rating" value={ratingFilter} />
                                <div className='movie-rating-stars'>
                                    <RatingStars reviewScore={ratingFilter} changeReviewScore={setRatingFilter}>  </RatingStars>
                                </div>
                                <hr />
                                <input type="submit" id='search-button' value="Search" />
                            </form>
                        </div>
                    </div> : null
                }
                <div id="user-login-container">
                    <div id="login-register">
                        {isLoggedIn ? ( 
                            <div>
                                <span id='profile-actions' onClick={() => setIsOpen(!isOpen)} style={{'z-index': '1'}}>
                                    Welcome, <strong id='name-bold' style={{'textDecoration': 'underline'}}>{userName}</strong>
                                </span>
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