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

export async function checkLoggedIn() {
    try {
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
        } else {
            return { isLoggedIn: false, user: null };
        }
    } catch (error) {
        return { isLoggedIn: false, user: null };
    }
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
            if (res.ok) {
                location.href = '/';
            }
        }
    }).catch((error) => {
        console.log(error.message, 'error');
    });
}

export function logout (setIsLoggedIn, setUserName) {
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

export function postReview(movieId, userId, ratingScore,body) {
    fetch('http://localhost:8000/api/reviews/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating: ratingScore,
        body: body,
        movie: movieId,
        user: userId,
      }),
      credentials: 'include',
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('Failed to post review');
      }
    })
    .then((data) => {
      console.log('Review posted successfully:', data);
    })
    .catch((error) => {
      console.error('Error posting review:', error);
    });
  }
  
  export function patchReview(reviewId, ratingScore, movieId, bodyText) {
    let body;
    if (bodyText !== null) {
      body = JSON.stringify({
        movie: movieId,
        rating: ratingScore,
        body: bodyText,
      });
    } else {
      body = JSON.stringify({
        movie: movieId,
        rating: ratingScore,
      });
    }
  
    fetch(`http://localhost:8000/api/reviews/${reviewId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then((res) => {
        if (res.ok) {
          // Review updated successfully
        } else {
          throw new Error('Failed to update review');
        }
      })
      .catch((error) => {
        console.error('Error updating review:', error);
      });
  }
