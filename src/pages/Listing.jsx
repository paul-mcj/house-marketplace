// react and misc.
import { useState, useEffect } from "react";

// react router dom
import { Link, useParams } from "react-router-dom";

// react leaflet
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// swiper
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

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
               {/* Image Slider */}
               <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    style={{ height: "300px" }}
               >
                    {listing.imgUrls.map((url, index) => (
                         <SwiperSlide key={index}>
                              <div
                                   style={{
                                        background: `url(${listing.imgUrls[index]}) center no-repeat`,
                                        backgroundSize: "cover",
                                   }}
                                   className="swiperSlideDiv"
                              ></div>
                         </SwiperSlide>
                    ))}
               </Swiper>

               {/* Information */}
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

                    {/* Interactive Leaflet Map */}
                    <p className="listingLocationTitle">Location</p>
                    <div className="leafletContainer">
                         <MapContainer
                              style={{ height: "100%", width: "100%" }}
                              center={[
                                   listing.geolocation.lat,
                                   listing.geolocation.lng,
                              ]}
                              zoom={13}
                              scrollWheelZoom={false}
                         >
                              <TileLayer
                                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                   url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              <Marker
                                   position={[
                                        listing.geolocation.lat,
                                        listing.geolocation.lng,
                                   ]}
                              >
                                   <Popup>{listing?.name}</Popup>
                              </Marker>
                         </MapContainer>
                    </div>

                    {/* Contact Button */}
                    {auth.currentUser?.uid !== listing.userRef && (
                         <Link
                              to={`/contact/${listing.userRef}?listingName=${listing.name}`}
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
