import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password,
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('fullName',response.data.fullName);
        // Navigate to the dashboard
        navigate('/');
      }
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow bg-warning">
            <div className="card-body">
              <h2 className="mb-2 text-center">To Do App</h2>
              <h6 className='text-center mb-4'>Login Now !</h6>
              {error && (
                <div className="alert alert-danger">
                  {error}
                  <button
                    type="button"
                    className="btn-close float-end"
                    aria-label="Close"
                    onClick={() => setError(null)}
                  ></button>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  
                  <input
                    type="email"
                    className="form-control"
                    placeholder='Enter Email'
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                 
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className='d-grid gap-2 col-6 mx-auto'>
                <button type="submit" className="btn btn-danger rounded-5 btn-block">
                  Login
                </button>
                </div>
              </form>
              <p className="mt-3 text-center">
                Do not have account ? <Link to="/signup" className='text-danger'>SignUp Now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
