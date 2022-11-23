// react and misc
import { useState } from "react";

// react router dom
import { Link, useNavigate } from "react-router-dom";

// toastify
import { toast } from "react-toastify";

// firebase and firestore
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// icons
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

const Signin = () => {
     const [showPassword, setShowPassword] = useState(false);
     const [formData, setFormData] = useState({ email: "", password: "" });
     const { email, password } = formData;

     const navigate = useNavigate();

     const handleOnChange = (e) => {
          setFormData((prev) => ({
               ...prev,
               [e.target.id]: e.target.value,
          }));
     };

     const handleOnSubmit = async (e) => {
          e.preventDefault();

          try {
               // get auth value from firebase
               const auth = getAuth();

               // register user
               const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
               );

               // if user is already on firebase, redirect to home page
               userCredential.user && navigate("/");
          } catch (err) {
               toast.error("Bad user credentials");
          }
     };

     return (
          <>
               <div className="pageContainer">
                    <header>
                         <p className="pageHeader">Welcome Back!</p>
                    </header>
                    <main>
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
                                        type={
                                             showPassword ? "text" : "password"
                                        }
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
                                             setShowPassword((prev) =>
                                                  setShowPassword(!prev)
                                             )
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
                         {/* Google OAuth */}
                         <Link to="/signup" className="registerLink">
                              Sign Up Instead
                         </Link>
                    </main>
               </div>
          </>
     );
};

export default Signin;
