import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";


export default function Register() {

    const [pass, setPass] = useState('');
    const [passRep, setPassRep] = useState('');
    const val = useRef('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        console.log("Form submission started");
        const formData = {
            password: pass,
        };
        const fetchData = async () => {
            fetch('http://localhost:8000/api/users/me/', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                    credentials: 'include',
                }).then((res) => {
                    if (res.ok) {
                        navigate("/profile")
                    }
                    else if (res.status === 409) {
                        document.getElementById('aviso').className = 'error';
                    }
                }).catch((error) => {
                console.log(error.message, 'error');
            });
        };
        fetchData();

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
