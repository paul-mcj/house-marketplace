// react and misc
import { useState } from "react";

// react router dom
import { Link, useNavigate } from "react-router-dom";

// icons
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

// toastify
import { toast } from "react-toastify";

// firebase and firestore
import {
     getAuth,
     createUserWithEmailAndPassword,
     updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const Signup = () => {
     const [showPassword, setShowPassword] = useState(false);
     const [formData, setFormData] = useState({
          name: "",
          email: "",
          password: "",
     });
     const { name, email, password } = formData;

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
               const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
               );

               // get user info from the above user
               const user = userCredential.user;

               // update display name
               updateProfile(auth.currentUser, { displayName: name });

               // make a copy of formData state...
               const formDataCopy = { ...formData };

               // ... and delete the password field from it (since we don't want that uploaded to the database)
               delete formDataCopy.password;

               // add timestamp to the object
               formDataCopy.timestamp = serverTimestamp();

               // now we can update the database and add the new user to the users collection of the database
               await setDoc(doc(db, "users", user.uid), formDataCopy);

               // redirect to home page
               navigate("/");
          } catch (error) {
               toast.error("Oops! Something went wrong with registration.");
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
                                   type="text"
                                   className="nameInput"
                                   placeholder="Name"
                                   id="name"
                                   value={name}
                                   onChange={handleOnChange}
                              />
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
                              <div className="signUpBar">
                                   <p className="signUpText">Sign Up</p>
                                   <button className="signUpButton">
                                        <ArrowRightIcon
                                             fill="#fff"
                                             width="34px"
                                             height="34px"
                                        />
                                   </button>
                              </div>
                         </form>
                         {/* Google OAuth */}
                         <Link to="/signin" className="registerLink">
                              Sign In Instead
                         </Link>
                    </main>
               </div>
          </>
     );
};

export default Signup;
