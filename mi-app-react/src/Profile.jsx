import { useState, useEffect } from 'react';
import { checkLoggedIn, changeProfileInformation } from './api.js';

export default function profile() {

    const [nombre, setNombre] = useState('');
    const [tel, setTel] = useState('');

    useEffect(() => {
        checkLoggedIn().then((data) => {
            setNombre(data.nombre);
            setTel(data.tel);
        });
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = {
            nombre: nombre,
            tel: tel,
        };
        changeProfileInformation(formData);
    };


    const handleDeletion = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        deleteAccount();
    };


    return (<div className="container">
    <h2>Update profile</h2>
    
        <form className="form-control" onSubmit={handleSubmit}>
            <label for="nombre">Name:</label>
            <input type="text" name="nombre" id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
            <label for="tel">Phone Number:</label>
            <input type="tel" name="tel" id="tel" value={tel} onChange={e => setTel(e.target.value)} required />
            <hr />
            <input type="submit" value="Update profile information" />
        </form> 
        <button onClick={() => location.href = '/password'}>Change Password</button>
        <hr />
        <button onClick={handleDeletion}>Delete account</button>
  </div>
  )
};
