import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ListPage from './ListPage.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Profile from './Profile.jsx'
import Password from './Password.jsx'
import MovieDescription from './Movie.jsx'
import ErrorComponent from './ErrorComponent.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [{
        path: "",
        element: <ListPage />
    }, {
        path: "movie/:id",
        element: <MovieDescription />,
        errorElement: <ErrorComponent />,
        loader: async ({ params }) => {
            // return await fetch('https://filmaff.onrender.com/api/movies/' + params.id)
            return await fetch('http://localhost:8000/api/movies/' + params.id)
        }
    }, {
        path: "login",
        element: <Login />,
    }, {
        path: "register",
        element: <Register />,
    }, {
        path: "profile",
        element: <Profile />,
    }, {
        path: "password",
        element: <Password />,
    }, {
        path: "*",
        element: <ErrorComponent />,
    }
],
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
