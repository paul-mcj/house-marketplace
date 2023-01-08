// react and misc
import { useState, useEffect, useCallback } from "react";

// firebase
import { getAuth, updateProfile } from "firebase/auth";
import {
     doc,
     updateDoc,
     getDocs,
     collection,
     query,
     where,
     orderBy,
     deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";

// toastify
import { toast } from "react-toastify";

// react router dom
import { useNavigate, Link } from "react-router-dom";

// component
import ListingItem from "../components/ListingItem";

// assets
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

const Profile = () => {
     // get auth value from firebase
     const auth = getAuth();
     const userId = auth.currentUser.uid;

     // for url history
     const navigate = useNavigate();

     // hold and destruct state
     const [changeDetails, setChangeDetails] = useState(false);
     const [formData, setFormData] = useState({
          name: auth.currentUser.displayName,
          email: auth.currentUser.email,
     });
     const { name, email } = formData;
     const [listings, setListings] = useState(null);
     const [loading, setLoading] = useState(true);

     // get user listings from backend
     const fetchUserListings = useCallback(async () => {
          try {
               const listingsRef = collection(db, "listings");
               const q = query(
                    listingsRef,
                    where("userRef", "==", userId),
                    orderBy("timestamp", "desc")
               );
               const querySnap = await getDocs(q);
               let listings = [];
               querySnap.forEach((doc) => {
                    return listings.push({
                         id: doc.id,
                         data: doc.data(),
                    });
               });
               // change state
               setListings(() => listings);
               setLoading(() => false);
          } catch (err) {
               toast.error(`Could not fetch listings ${err.message}`);
          }
     }, [userId]);

     // fetch listings when component loads
     useEffect(() => {
          // call async function
          fetchUserListings();
     }, [fetchUserListings]);

     // update state with input values
     const handleOnChange = (e) => {
          setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
     };

     // logout user
     const handleLogout = () => {
          auth.signOut();
          navigate("/");
     };

     // delete listing from users listings
     const handleDelete = async (listingId) => {
          if (window.confirm("Are you sure you want to delete?")) {
               // delete listing
               await deleteDoc(doc(db, "listings", listingId));
               // update ui by fetching user listings again
               fetchUserListings();
               // success message
               toast.success("Listing was successfully deleted!");
          }
     };

     // edit a listing
     const handleEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

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

                    {/* Listings */}
                    {!loading && listings?.length > 0 && (
                         <>
                              <p className="listingText">Your Listings</p>
                              <ul className="listingsList">
                                   {listings.map((listing) => (
                                        <ListingItem
                                             key={listing.id}
                                             listing={listing.data}
                                             id={listing.id}
                                             onDelete={() =>
                                                  handleDelete(listing.id)
                                             }
                                             onEdit={() =>
                                                  handleEdit(listing.id)
                                             }
                                        />
                                   ))}
                              </ul>
                         </>
                    )}
               </main>
          </div>
     );
};

export default Profile;
