// react and misc
import { useState } from "react";

// react router dom
import { Link, useNavigate } from "react-router-dom";

// react toastify
import { toast } from "react-toastify";

// components
import OAuth from "../components/OAuth";

// firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// assets
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

const Signin = () => {
     // get auth value from firebase
     const auth = getAuth();

     // state
     const [showPassword, setShowPassword] = useState(false);
     const [formData, setFormData] = useState({ email: "", password: "" });
     const { email, password } = formData;

     // for navigation url
     const navigate = useNavigate();

     // input field value changes
     const handleOnChange = (e) => {
          setFormData((prev) => ({
               ...prev,
               [e.target.id]: e.target.value,
          }));
     };

     // form submission
     const handleOnSubmit = async (e) => {
          e.preventDefault();

          try {
               // register user
               const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
               );

               // if user is already on firebase, redirect to home page
               userCredential.user && navigate("/");

               toast.success(`Welcome back, ${auth.currentUser.displayName}`);
          } catch (err) {
               toast.error(`Bad user credentials. ${err.message}`);
          }
     };

     return (
          <>
               <div className="pageContainer">
                    <header>
                         <p className="pageHeader">Welcome Back!</p>
                    </header>
                    <form onSubmit={handleOnSubmit}>
                         <input
                              type="email"
                              className="emailInput"
                              placeholder="Email"
                              id="email"
                              value={email}
                              onChange={handleOnChange}
                         />
                         <div className="passwordInputDiv">
                              <input
                                   type={showPassword ? "text" : "password"}
                                   className="passwordInput"
                                   placeholder="password"
                                   id="password"
                                   value={password}
                                   onChange={handleOnChange}
                              />
                              <img
                                   src={visibilityIcon}
                                   alt="show password"
                                   onClick={() =>
                                        setShowPassword((prev) => !prev)
                                   }
                                   className="showPassword"
                              />
                         </div>
                         <Link
                              to="/forgot-password"
                              className="forgotPasswordLink"
                         >
                              Forgot Password
                         </Link>
                         <div className="signInBar">
                              <p className="signInText">Sign In</p>
                              <button className="signInButton">
                                   <ArrowRightIcon
                                        fill="#fff"
                                        width="34px"
                                        height="34px"
                                   />
                              </button>
                         </div>
                    </form>
                    <OAuth />
                    <Link to="/signup" className="registerLink">
                         Sign Up Instead
                    </Link>
               </div>
          </>
     );
};

export default Signin;
