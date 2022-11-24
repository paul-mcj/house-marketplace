// react and misc
import { useState } from "react";

// react router dom
import { Link } from "react-router-dom";

// firebase
import {
     confirmPasswordReset,
     getAuth,
     sendPasswordResetEmail,
} from "firebase/auth";

// toastify
import { toast } from "react-toastify";

// icons
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";

const ForgotPassword = () => {
     // get authenticate user
     const auth = getAuth();

     // state
     const [email, setEmail] = useState("");

     // input changes respective state piece
     const handleOnChange = (e) => {
          setEmail(() => e.target.value);
     };

     // form submission
     const handleOnSubmit = async (e) => {
          e.preventDefault();

          try {
               await sendPasswordResetEmail(auth, email);
               toast.success(
                    `Email was sent to ${email}. Please check your inbox to reset your password.`
               );
          } catch (err) {
               console.log(err);
               toast.error(`Could not send reset email. ${err.message}`);
          }
     };

     return (
          <div className="pageContainer">
               <header>
                    <p className="pageHeader">Forgot Password</p>
               </header>
               <main>
                    <form onSubmit={handleOnSubmit}>
                         <input
                              type="email"
                              placeholder="Email"
                              className="emailInput"
                              id="email"
                              value={email}
                              onChange={handleOnChange}
                         />
                         <Link className="forgotPasswordLink" to="/signin">
                              Sign In
                         </Link>
                         <div className="signInBar">
                              <div className="signInText">Send Reset Link</div>
                              <button className="signInButton">
                                   <ArrowRightIcon
                                        fill="#fff"
                                        width="34px"
                                        height="34px"
                                   />
                              </button>
                         </div>
                    </form>
               </main>
          </div>
     );
};

export default ForgotPassword;
