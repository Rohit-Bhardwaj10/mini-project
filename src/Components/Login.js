import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase/Firebase'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState,useContext } from 'react'
import '../Styles/Login.css'


function Login() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const navigate=useNavigate();

  //  const {loading,setLoading}=useContext(context)

  const user=JSON.parse(localStorage.getItem('user'))
  console.log(user);


   const handleLogin = async (e) => {
    e.preventDefault()
    try {
        // setLoading(true)
        const res = await signInWithEmailAndPassword(auth, email, password)
        localStorage.setItem('user', JSON.stringify(res))
        // Show success toast and wait for it before navigating
        await toast.success("Signed in successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
        // Add a small delay to ensure toast is visible
        setTimeout(() => {
            navigate('/')
        }, 1000)
    } catch (error) {
        let errorMessage = "Sign-in failed"
        switch (error.code) {
            case 'auth/wrong-password':
                errorMessage = "Invalid password. Please try again."
                break
            case 'auth/user-not-found':
                errorMessage = "No account found with this email."
                break
            case 'auth/invalid-email':
                errorMessage = "Invalid email address."
                break
            default:
                errorMessage = error.message
        }
        toast.error(errorMessage)
    }
   }
   
    return (
        <div className='login-container flex justify-center items-center'>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className='login-card'>
                <div>
                    <h1 className='login-title text-center'>Welcome Back</h1>
                    <p className='login-subtitle text-center'>Sign in to access your health dashboard</p>
                </div>
                <div>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        name='email'
                        className='login-input'
                        placeholder='Email'
                    />
                </div>
                <div>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className='login-input'
                        placeholder='Password'
                    />
                </div>
                <div className='flex justify-center mb-3'>
                    <button
                        onClick={handleLogin}
                        className='login-button'>
                        Login
                    </button>
                </div>
                <div className='login-divider'>
                    <h2>Don't have an account? <Link className='login-link' to={'/signup'}>Sign up</Link></h2>
                </div>
            </div>
        </div>
    )
}

export default Login
