// react and misc.
import { useState, useEffect } from "react";

// react router dom
import { Link, useParams } from "react-router-dom";

// firebase
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";

// components
import Spinner from "../components/Spinner";

// assets
import ShareIcon from "../assets/svg/shareIcon.svg";

const Listing = () => {
     // set state pieces for component
     const [listing, setListing] = useState(null);
     const [loading, setLoading] = useState(true);
     const [shareLinkCopied, setShareLinkCopied] = useState(false);

     // initialize params with react router dom
     const params = useParams();
     const { listingId } = params;

     // initialize firebase authentication
     const auth = getAuth();

     // function that prepares a copy of image url for sharing
     const shareLink = () => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(() => true);
          setTimeout(() => {
               setShareLinkCopied(() => false);
          }, 2000);
     };

     // immediately fetch listing when page is loaded
     useEffect(() => {
          const fetchListing = async () => {
               const docRef = doc(db, "listings", listingId);
               const docSnap = await getDoc(docRef);

               if (docSnap.exists()) {
                    console.log(docSnap.data());
                    setListing(() => docSnap.data());
                    setLoading(() => false);
               }
          };

          fetchListing();
     }, [listingId]);

     if (loading) {
          return <Spinner />;
     }

     return (
          <main>
               {/* slider */}
               <div className="shareIconDiv" onClick={shareLink}>
                    <img src={ShareIcon} alt="" />
               </div>
               {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}
               <div className="listingDetails">
                    <p className="listingName">
                         {listing.name} - $
                         {listing.offer
                              ? listing.discountedPrice
                              : listing.regularPrice}
                    </p>
                    <p className="listingLocation">{listing.location}</p>
                    <p className="listingType">
                         For {listing.type === "rent" ? "Rent" : "Sale"}
                    </p>
                    {listing.offer && (
                         <p className="discountPrice">
                              ${listing.regularPrice - listing.discountedPrice}{" "}
                              discount
                         </p>
                    )}
                    <ul className="listingDetailsList">
                         <li>
                              {listing.bedrooms > 1
                                   ? `${listing.bedrooms} bedrooms`
                                   : "1 bedroom"}
                         </li>
                         <li>
                              {listing.bathrooms > 1
                                   ? `${listing.bathrooms} bathrooms`
                                   : "1 bathroom"}
                         </li>
                         <li>{listing.parking && "Parking Spot"}</li>
                         <li>{listing.furnished && "Furnished"}</li>
                    </ul>
                    {/* Geolocation Map */}
                    <p className="listingLocationTitle">Location</p>

                    {auth.currentUser?.uid !== listing.userRef && (
                         <Link
                              to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
                              className="primaryButton"
                         >
                              Contact Landlord
                         </Link>
                    )}
               </div>
          </main>
     );
};

export default Listing;
