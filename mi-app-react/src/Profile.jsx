import { useState, useEffect } from 'react';
import { checkLoggedIn, changeProfileInformation, deleteAccount } from './api.js';
import { NavLink, useNavigate } from 'react-router-dom';

export default function profile() {

    const [name, setName] = useState('');
    const [tel, setTel] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        checkLoggedIn().then((data) => {
            if (!data.isLoggedIn) {
                navigate('/login');
            } else {
                setName(data.user.name);
                setTel(data.user.tel);
            }
        });
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            name: name,
            tel: tel,
        };
        changeProfileInformation(formData, 'profile');
        location.href = '/profile';
    };


    const handleDeletion = (event) => {
        event.preventDefault();
        deleteAccount();
    };


    return (<div className="container">
    <h2>Update profile</h2>
    
        <form className="form-control" onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} required />
            <label htmlFor="tel">Phone Number:</label>
            <input type="tel" name="tel" id="tel" value={tel} onChange={e => setTel(e.target.value)} required />
            <p id="alert"></p>
            <input type="submit" value="Update profile information" className='profile-button form-button'/>
        </form> 
        <hr />
        <div className='personal-rating-buttons profile-buttons'>
            <NavLink to="/password" className='profile-button navlink '>
                <button className='profile-button'>Change password</button>
            </NavLink>
            <button onClick={handleDeletion} className='profile-button'>Delete account</button>
        </div>
  </div>
  )
};
