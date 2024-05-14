import { useState } from 'react';
import { login } from './api.js';


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = {
            email: email,
            password: password
        };
        login(formData)

    };
    // {entrar(form2json(event))}

    return (<div className="container">
    <h2>Login</h2>
    
        <form className="form-control" onSubmit={handleSubmit}> 
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" size="30" value={email} onChange={e => setEmail(e.target.value)} required /> 
            
            <label for="pass">Password:</label>
            <input type="password" id="pass" name="password" pattern="^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$" value={password} onChange={e => setPassword(e.target.value)} minlength="8" required/>
    
            
            <p id="aviso"></p>
            <hr />
            <input type="submit" value="Enter" />

        </form>
    </div>
    )
};

