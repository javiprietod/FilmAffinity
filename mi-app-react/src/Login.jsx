import { useState } from 'react';


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = {
            email: email,
            password: password
        };
        const fetchData = async () => {
            fetch('http://localhost:8000/api/users/login/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            })
            .then((res) => {
                if (res.ok) {
                    location.href = '/';
                } else if (res.status === 401) {
                    document.getElementById('aviso').innerHTML = '✖︎ Email or password incorrect';
                    document.getElementById('aviso').className = 'error';
                }
            })
            .catch((error) => {
                console.log(error.message, 'error');
            });
        };
        fetchData();

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