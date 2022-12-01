// react and misc
import { useState } from "react";

// firebase
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";

// toastify
import { toast } from "react-toastify";

// react router dom
import { useNavigate, Link } from "react-router-dom";

// assets
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

const Profile = () => {
     // get auth value from firebase
     const auth = getAuth();

     // for url history
     const navigate = useNavigate();

     // hold and destruct state
     const [changeDetails, setChangeDetails] = useState(false);
     const [formData, setFormData] = useState({
          name: auth.currentUser.displayName,
          email: auth.currentUser.email,
     });
     const { name, email } = formData;

     // update state with input values
     const handleOnChange = (e) => {
          setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
     };

     // logout user
     const handleLogout = () => {
          auth.signOut();
          navigate("/");
     };

     // form submission
     const handleOnSubmit = async () => {
          setChangeDetails((prev) => !prev);
          try {
               // if the name has changed...
               if (auth.currentUser.displayName !== name) {
                    // ... then update display name in firebase...
                    await updateProfile(auth.currentUser, {
                         displayName: name,
                    });

                    // ... then update user obj in firestore
                    await updateDoc(doc(db, "users", auth.currentUser.uid), {
                         name,
                    });
               }
          } catch (err) {
               toast.error("Could not update profile details");
          }
     };

     return (
          <div className="profile">
               <header className="profileHeader">
                    <p className="pageHeader">My Profile</p>
                    <button
                         className="logOut"
                         type="button"
                         onClick={handleLogout}
                    >
                         Logout
                    </button>
               </header>
               <main>
                    <div className="profileDetailsHeader">
                         <p className="profileDetailsText">Personal Details</p>
                         <p
                              className="changePersonalDetails"
                              onClick={handleOnSubmit}
                         >
                              {changeDetails ? "done" : "change"}
                         </p>
                    </div>
                    <div className="profileCard">
                         <form>
                              <input
                                   type="text"
                                   id="name"
                                   className={
                                        changeDetails
                                             ? "profileNameActive"
                                             : "profileName"
                                   }
                                   disabled={!changeDetails}
                                   value={name}
                                   onChange={handleOnChange}
                              />
                              <input
                                   type="text"
                                   id="email"
                                   className={
                                        changeDetails
                                             ? "profileEmailActive"
                                             : "profileEmail"
                                   }
                                   disabled={!changeDetails}
                                   value={email}
                                   onChange={handleOnChange}
                              />
                         </form>
                    </div>
                    <Link to="/create-listing" className="createListing">
                         <img src={homeIcon} alt="home" />
                         <p>Sell or rent your home</p>
                         <img src={arrowRight} alt="arrow right" />
                    </Link>
               </main>
          </div>
     );
};

export default Profile;
