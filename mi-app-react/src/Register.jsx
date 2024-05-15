import { useState, useRef } from 'react';
import { register } from './api';
import { useNavigate } from 'react-router-dom';

export default function Register() {

    const [name, setName] = useState('');
    const [tel, setTel] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [passRep, setPassRep] = useState('');
    const val = useRef('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            name: name,
            tel: tel,
            email: email,
            password: pass
        };
        register(formData, navigate);
    };

    const checkPass = () => {
        let correcto = false;  
      
        if (pass === passRep) correcto = true;
      
        if (correcto) {
            val.current = '';
        }
        else {
            val.current = '❌︎ The passwords do not match';
        };
      }

    return (<div className="container">
    <h2>Register</h2>
    
        <form className="form-control" onSubmit={handleSubmit}>
            <label htmlFor="name">Username:</label>
            <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} required />
            <label htmlFor="tel">Phone Number:</label>
            <input type="tel" placeholder="612345678, +34612345678, +34 612345678" name="tel" id="tel" value={tel} onChange={e => setTel(e.target.value)} required />
            <label htmlFor="email">Email:</label>
            <input type="email" placeholder="your_email@gmail.com" id="email" name="email" size="30" value={email} onChange={e => setEmail(e.target.value)} required />  
            <label htmlFor="pass">Password:</label>
            <input type="password" placeholder="Your password" id="pass" name="password" minLength="8" value={pass} onChange={e => setPass(e.target.value)} required/>
            <label htmlFor="pass">Repeat Password:</label>
            <input type="password" placeholder="Repeat password" id="passRep" onKeyUp={checkPass()}
                    name="password" minLength="8" value={passRep} onChange={e => setPassRep(e.target.value)} required/>

            {val.current ? <p id="alert" className='error'>{val.current}</p> : <p id="alert"></p>}
            <hr />
            <input type="submit" value="Registrarse" />
        </form> 
  </div>
  )
};