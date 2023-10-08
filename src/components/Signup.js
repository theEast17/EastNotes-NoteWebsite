import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:'',email: "", password: "",cpassword:''}) 
    let history = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
        const {name,email,password}=credentials
        const response = await fetch("http://localhost:5000/api/auth/createUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name,email,password})
        });
        const json = await response.json()
        // console.log(json)
        if (json.success){
            // Save the auth token and redirect
            localStorage.setItem('token', json.authToken); 
            history("/");
            props.showAlert("Succesfully Created your Account","success")
        }
        else{
            props.showAlert("Invalid Credentials","danger")
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }
  return (
    <div className='container'>
      <h2 style={{borderBottom:"1px solid black",padding:"10px",textAlign:'center'}}>Create an Account on EastNotes</h2>
     <form onSubmit={handleSubmit}>
     <div className="mb-3">
    <label htmlFor="name" className="form-label">Username</label>
    <input type="text" className="form-control" id="name" name='name' onChange={onChange} aria-describedby="emailHelp"/>
  </div>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp"/>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password" onChange={onChange} name='password' minLength={5}/>
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
    <input type="password" className="form-control" id="cpassword" onChange={onChange} name='cpassword' minLength={5}/>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default Signup
