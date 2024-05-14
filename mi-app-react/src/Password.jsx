import { useState, useRef } from 'react';
import { changeProfileInformation } from './api.js';


export default function Register() {

    const [pass, setPass] = useState('');
    const [passRep, setPassRep] = useState('');
    const val = useRef('');

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = {
            password: pass,
        };
        changeProfileInformation(formData);
    };

    const compruebaPass = () => {
        let correcto = false;  
      
        if (pass === passRep) correcto = true;
      
        val.current = correcto ? '' : '✖︎ The passwords do not match';
      }

    return (<div className="container">
    <h2>Update password</h2>
    
        <form className="form-control" onSubmit={handleSubmit}>
            <label htmlFor="pass">Password:</label>
            <input type="password" id="pass" name="password" pattern="^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$" minLength="8" value={pass} onChange={e => setPass(e.target.value)} />
            <label htmlFor="pass">Repeat Password:</label>
            <input type="password" id="passRep" onKeyUp={compruebaPass()} value={passRep} onChange={e => setPassRep(e.target.value)}
                    name="password" pattern="^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$" minLength="8" />
            {val.current ? <p id="aviso" className="error">{val.current}</p> : <p id="aviso"></p>}
            <hr />
            <input type="submit" value="Update password" />
        </form> 
    </div>
  )
};
