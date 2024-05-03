import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function profile() {

    const [nombre, setNombre] = useState('');
    const [tel, setTel] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
        fetch('http://localhost:8000/api/users/me/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((data) => {
            setNombre(data.nombre);
            setTel(data.tel);
        }
        )
        .catch((error) => {
            console.log(error.message, 'error');
        });
    };
    fetchData();
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = {
            nombre: nombre,
            tel: tel,
        };
        console.log(formData);
        const fetchData = async () => {
            fetch('http://localhost:8000/api/users/me/', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                    credentials: 'include',
                }).then((res) => {
                    console.log(res.status);
                    if (res.ok) {
                        location.href = '/profile';
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


    const handleDeletion = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = {
            nombre: nombre,
            tel: tel,
        };
        console.log(formData);
        const fetchData = async () => {
            fetch('http://localhost:8000/api/users/me/', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }).then((res) => {
                    if (confirm('Are you sure you want to delete your account?')) {
                        console.log(res.status);
                        if (res.ok) {
                            location.href = '/';
                        }
                    }
                }).catch((error) => {
                console.log(error.message, 'error');
            });
        };
        fetchData();
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
