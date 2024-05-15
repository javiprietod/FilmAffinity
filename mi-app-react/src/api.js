export function login (formData) {
    // fetch('https://filmaff.onrender.com/api/users/login/', {
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
            document.getElementById('aviso').innerHTML = '❌︎ Email or password incorrect';
            document.getElementById('aviso').className = 'error';
        }
    })
    .catch((error) => {
        console.error(error.message, 'error');
    });
}

export async function checkLoggedIn() {
    // const response = await fetch('https://filmaff.onrender.com/api/users/me/', {
    const response = await fetch('http://localhost:8000/api/users/me/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        credentials: 'include',
    });

    if (response.ok) {
        const data = await response.json();
        return { isLoggedIn: true, user: data };
    } 
    return { isLoggedIn: false, user: null }; 
}

export function changeProfileInformation (formData, page) {
    // fetch('https://filmaff.onrender.com/api/users/me/', {
    fetch('http://localhost:8000/api/users/me/', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
    }).then((res) => {
        if (res.ok) {
            document.getElementById('aviso').innerHTML = '✅ The information has been updated successfully';
            document.getElementById('aviso').className = 'correct';
        }
        else if (res.status === 400) {
            document.getElementById('aviso').innerHTML = (
                (page === 'profile') ?
                '❌︎ The phone number introduced is not valid' : 
                '❌︎ The password must have at least a lowercase letter, a capital letter and a number'
            );
            document.getElementById('aviso').className = 'error';
        }
    }).catch((error) => {
        console.error(error.message, 'error');
    });
}

export function deleteAccount () {
    // fetch('https://filmaff.onrender.com/api/users/me/', {
    if (confirm('Are you sure you want to delete your account?')) {
        fetch('http://localhost:8000/api/users/me/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).then((res) => {
            if (res.ok) {
                location.href = '/';
            }
        }).catch((error) => {
            console.error(error.message, 'error');
        });
    }
}

export function logout (setIsLoggedIn, setUserName) {
    // fetch('https://filmaff.onrender.com/api/users/logout', {
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
            location.href = '/';
        }
    })
    .catch((error) => {
        console.error(error.message, 'error');
    });
}

export function register (formData) {
    // fetch('https://filmaff.onrender.com/api/users/', {
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
            document.getElementById('aviso').innerHTML = '❌︎ This email is already registered';
            document.getElementById('aviso').className = 'error';
        }
        else if (res.status === 406) {
            document.getElementById('aviso').innerHTML = '❌︎ The password must have at least a lowercase letter, a capital letter and a number';
            document.getElementById('aviso').className = 'error';
        }
        else if (res.status === 400) {
            document.getElementById('aviso').innerHTML = '❌︎ The phone number introduced is not valid';
            document.getElementById('aviso').className = 'error';
        }
    }).catch((error) => {
        console.error(error.message, 'error');
    });
}

export async function postReview(movieId, userId, reviewScore, reviewBody) {
    const res = await fetch('http://localhost:8000/api/reviews/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating: reviewScore,
        body: reviewBody,
        movie: movieId,
        user: userId,
      }),
      credentials: 'include',
    })
    if (res.ok) {
            return res.json();
    } 
    throw new Error('Failed to post review');
    
}

export async function patchReview(reviewId, movieId, reviewScore, reviewBody) {
    let body;
    if (reviewBody !== '') {
        body = JSON.stringify({
            movie: movieId,
            rating: reviewScore,
            body: reviewBody,
        });
    } else {
        body = JSON.stringify({
            movie: movieId,
            rating: reviewScore,
        });
    }
  
    const res = await fetch(`http://localhost:8000/api/reviews/${reviewId}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
    })
    if (res.ok) {
        return res.json();
    }
    throw new Error('Failed to patch review');
  }

export async function deleteReview(reviewId) {
    const res = await fetch(`http://localhost:8000/api/reviews/${reviewId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if (res.ok) {
        return true;
    }
    throw new Error('Failed to delete review');
}

export async function getReviewFromMovieUser(movieId, user) {
    const res = await fetch(`http://localhost:8000/api/reviews/?movieid=${movieId}&username=${user}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (res.ok) {
        const data = await res.json();
        return data;
    } else {
        throw new Error('Failed to get review');
    }
}
