export function login (formData) {
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
}

export function checkLoggedIn () {
    return fetch('http://localhost:8000/api/users/me/', {
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
    .catch((error) => {
        console.log(error.message, 'error');
    });
}

export function changeProfileInformation (formData) {
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
}

export function deleteAccount () {
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
}

export function logout (setIsLoggedIn, setUserName, navigate) {
    fetch('http://localhost:8000/api/users/logout', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    .then((res) => {
        if (res.ok) {
            setIsLoggedIn(false);
            setUserName('');
            navigate('/')
        }
    })
    .catch((error) => {
            console.log(error.message, 'error');
    });
}

export function register (formData) {
    fetch('http://localhost:8000/api/users/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    }).then((res) => {
        if (res.ok) {
            location.href = '/login';
        }
        else if (res.status === 409) {
            document.getElementById('aviso').innerHTML = '✖︎ This email is already registered';
            document.getElementById('aviso').className = 'error';
        }
    }).catch((error) => {
    console.log(error.message, 'error');
    });
}