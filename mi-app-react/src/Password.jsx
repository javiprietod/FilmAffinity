import { useState, useRef } from 'react';
import { changeProfileInformation } from './api.js';


export default function Register() {

    const [pass, setPass] = useState('');
    const [passRep, setPassRep] = useState('');
    const val = useRef('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            password: pass,
        };
        changeProfileInformation(formData, 'password');
    };

    const checkPass = () => {
        let correcto = false;  
      
        if (pass === passRep) correcto = true;
      
        val.current = correcto ? '' : '❌︎ The passwords do not match';
      }

    return (<div className="container">
    <h2>Update password</h2>
    
        <form className="form-control" onSubmit={handleSubmit}>
            <label htmlFor="pass">Password:</label>
            <input type="password" id="pass" name="password" minLength="8" value={pass} onChange={e => setPass(e.target.value)} />
            <label htmlFor="pass">Repeat Password:</label>
            <input type="password" id="passRep" onKeyUp={checkPass()} value={passRep} onChange={e => setPassRep(e.target.value)}
                    name="password" minLength="8" />
            {val.current ? <p id="alert" className="error">{val.current}</p> : <p id="alert"></p>}
            <hr />
            <input type="submit" value="Update password" />
        </form> 
    </div>
  )
};
