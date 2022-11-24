// firebase
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";

// icons
import googleIcon from "../assets/svg/googleIcon.svg";

// toastify
import { toast } from "react-toastify";

// react router dom
import { useNavigate, useLocation } from "react-router-dom";

const OAuth = () => {
     // url navigation and location
     const location = useLocation();
     const navigate = useNavigate();

     // authenticate user
     const auth = getAuth();

     // initialize Google provider
     const provider = new GoogleAuthProvider();
     // popup will allow you to select from account, instead of automatic loggin
     provider.setCustomParameters({
          prompt: "select_account",
     });

     // for Google authentication
     const handleGoogleAuth = async () => {
          try {
               // get Google access token to use Google API
               const result = await signInWithPopup(auth, provider);

               // get user info from above
               const user = result.user;

               // check for user in database...
               const docRef = doc(db, "users", user.uid);
               const docSnap = await getDoc(docRef);

               // ... if doesn't exists, create a new user
               if (!docSnap.exists()) {
                    await setDoc(doc(db, "users", user.uid), {
                         name: user.displayName,
                         email: user.email,
                         timestamp: serverTimestamp(),
                    });
               }

               // go to home page
               navigate("/");
               toast.success(
                    `Welcome ${
                         docSnap.exists() ? "back" : "to House Marketplace"
                    }, ${auth.currentUser.displayName}`
               );
          } catch (err) {
               console.log(err);
               toast.error(
                    `Could not authorize with Google. Please try again. ${err.message}`
               );
          }
     };

     return (
          <div className="socialLogin">
               <p>Sign {location.pathname === "/signup" ? "Up" : "In"} with </p>
               <button className="socialIconDiv" onClick={handleGoogleAuth}>
                    <img
                         className="socialIconImg"
                         src={googleIcon}
                         alt="Google"
                    />
               </button>
          </div>
     );
};

export default OAuth;
