import { NavLink, useNavigate } from "react-router-dom";
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
        if (confirm("Are you sure you want to log out?")) {
            logout(setIsLoggedIn, setUserName);
        }
    } 
    useEffect(() => {
        checkLoggedIn().then((data) => {
            if (data.isLoggedIn) {

                setIsLoggedIn(true);
                setUserName(data.user.name);
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

    const handleAdvancedSearchSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const queryParams = new URLSearchParams(new FormData(form)).toString();
        console.log(queryParams);
        navigate(`/?${queryParams}`); // Navigate to the main page with query parameters
    };

    useEffect(() => {
        
    }, [window.location])

    return (
        <header>
            <nav>
                <div id="logo-container">
                    <NavLink to="/">
                        <img id="logo" src={logo} height="44"/>
                    </NavLink>
                </div>
                <div id="search-bar-container">
                    <form id="search-bar" onSubmit={handleAdvancedSearchSubmit}>
                        <input type="text" name="title" id="title" placeholder="Search..." />
                    </form>
                    <div id="advanced" onClick={() => setAdvancedSearch(!advancedSearch)}>
                        Advanced Search &gt;&gt;&gt;
                    </div>
                </div>
                {advancedSearch ?
                    <div id='advanced-search' className="modal" onClick={() => setAdvancedSearch(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <form id="advanced-search-form" onSubmit={handleAdvancedSearchSubmit}>
                                <label htmlFor="title" style={{'color': 'black'}}>Title:</label>
                                <input type="text" name="title" id="title" placeholder="Title" />
                                <label htmlFor="director" style={{'color': 'black'}}>Director:</label>
                                <input type="text" name="director" id="director" placeholder="Director" />
                                <label htmlFor="genre" style={{'color': 'black'}}>Genre:</label>
                                <input type="text" name="genre" id="genre" placeholder="Genre" />
                                <label htmlFor="year" style={{'color': 'black'}}>Year:</label>
                                <input type="text" name="year" id="year" placeholder="Year" />
                                <label htmlFor="rating" style={{'color': 'black'}}>Rating:</label>
                                <input type="hidden" name="rating" id="rating" placeholder="rating" value={ratingFilter} />
                                <div className='movie-rating-stars'>
                                    <RatingStars reviewScore={ratingFilter} setReviewScore={setRatingFilter}>  </RatingStars>
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
                                <span id='profile-actions' onClick={() => setIsOpen(!isOpen)} style={{'zIndex': '1'}}>
                                    Welcome, <strong id='name-bold' style={{'textDecoration': 'underline'}}>{userName}</strong>
                                </span>
                                {isOpen ?  (
                                    <div className="modal" onClick={() => setIsOpen(false)}>
                                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                                            <p>
                                                <NavLink to="/profile">
                                                    Profile
                                                </NavLink>
                                            </p>
                                            <hr />
                                            <p onClick={handleLogout}>Logout</p>
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