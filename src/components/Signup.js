import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate , Link } from 'react-router-dom';

function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/auth/signup', {
        fullName,
        email,
        password,
      });
      console.log("dvf"+ response.data.error);
      if (response.error) {
        setError(response.error);
        setSuccess(null);
      } else {
        setSuccess(response.data.message);
        setError(null);
        setFullName('');
        setEmail('');
        setPassword('');
        // Redirect to login page after successful sign up
       // navigate('/login');
      }
    } catch (err) {
        console.log(err.response.data.error);
      setError(err.response.data.error);
      setSuccess(null);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow bg-warning">
            <div className="card-body">
              <h2 className="mb-2 text-center ">To Do App</h2>
              <h6 className=' mb-4 text-center'>SignUp Now !</h6>
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
              {success && (
                <div className="alert alert-success">
                  {success}
                  <button
                    type="button"
                    className="btn-close float-end"
                    aria-label="Close"
                    onClick={() => setSuccess(null)}
                  ></button>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                 
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    placeholder='Enter Full Name'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                 
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder='Enter Email'
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
                  Sign Up
                </button>
                </div>
              </form>
              <p className="mt-3 text-center ">
                Already have an account? <Link to="/login" className='text-danger'>Login Now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;