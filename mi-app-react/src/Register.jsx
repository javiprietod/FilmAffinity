import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

export default function Register() {

    const [nombre, setNombre] = useState('');
    const [tel, setTel] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const val = useRef('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = {
            nombre: nombre,
            tel: tel,
            email: email,
            password: password
        };
        const fetchData = async () => {
            fetch('http://localhost:8000/api/users/', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }).then((res) => {
                    if (res.ok) {
                        navigate("/login")
                        console.log("Register successful");
                    }
                    else if (res.status === 409) {
                        document.getElementById('aviso').innerHTML = '✖︎ This email is already registered';
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
      
        if (correcto) {
            val.current = '';
        }
        else {
            val.current = '✖︎ The passwords do not match';
        };
        return correcto;
      }

    return (<div className="container">
    <h2>Register</h2>
    
        <form className="form-control" onSubmit={handleSubmit}>
            <label for="nombre">Name:</label>
            <input type="text" name="nombre" id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
            <label for="tel">Phone Number:</label>
            <input type="tel" name="tel" id="tel" value={tel} onChange={e => setTel(e.target.value)} required />
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" size="30" value={email} onChange={e => setEmail(e.target.value)} required />  
            <label for="pass">Password:</label>
            <input type="password" id="pass" name="password" pattern="^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$" minLength="8" value={password} onChange={e => setPassword(e.target.value)} required/>
            <label for="pass">Repeat Password:</label>
            <input type="password" id="passRep" onKeyUp={compruebaPass()}
                    name="password" pattern="^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$" minLength="8" required/>

            {val.current ? <p id="aviso" className="error">{val.current}</p> : <p id="aviso"></p>}
            <hr />
            <input type="submit" value="Registrarse" />
        </form> 
  </div>
  )
};