// react and misc
import { useState, useEffect, useRef } from "react";

// react toastify
import { toast } from "react-toastify";

// firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";

// react router dom
import { useNavigate } from "react-router-dom";

// components
import Spinner from "../components/Spinner";

const CreateListing = () => {
     // initialize auth
     const auth = getAuth();

     // loading state
     const [loading, setLoading] = useState(false);

     // initialize navigation
     const navigate = useNavigate();

     // use to check if component is mounted (to avoid memory leeks)
     const isMounted = useRef(true);

     // geolocation state
     const [geolocationEnabled, setGeolocationEnabled] = useState(true);

     // set state defaults below
     const [formData, setFormData] = useState({
          type: "rent",
          name: "",
          bedrooms: 1,
          bathrooms: 1,
          parking: false,
          furnished: false,
          address: "",
          offer: false,
          regularPrice: 0,
          discountedPrice: 0,
          images: {},
          latitude: 0,
          longitude: 0,
     });

     // destructure state defaults
     const {
          type,
          name,
          bedrooms,
          bathrooms,
          parking,
          furnished,
          address,
          offer,
          regularPrice,
          discountedPrice,
          images,
          latitude,
          longitude,
     } = formData;

     useEffect(() => {
          isMounted &&
               onAuthStateChanged(auth, (user) => {
                    user
                         ? setFormData(() => ({
                                ...formData,
                                userRef: user.uid,
                           }))
                         : navigate("/signin");
               });

          return () => {
               isMounted.current = false;
          };

          //note: adding formData as a dependency will result in a loop, so it should not be added as a dependency
     }, [isMounted, auth, navigate]);

     // form submission function (needs to be async to fetch geolocation resources)
     const handleOnSubmit = async (e) => {
          e.preventDefault();

          setLoading(() => true);

          // if this occurs, send out a toast error message
          if (discountedPrice >= regularPrice) {
               setLoading(() => false);
               toast.error(
                    "Discounted Price needs to be less than regular price!"
               );
               return;
          }

          // users cannot upload more than 6 images
          if (images.length > 6) {
               setLoading(() => false);
               toast.error("Max 6 images");
               return;
          }

          // geocoding
          let geolocation = {};
          let location;

          if (geolocationEnabled) {
               // get API key from Google cloud API services for this project
               const res = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
               );

               const data = await res.json();
               geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
               geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
               location =
                    data.status === "ZERO_RESULTS"
                         ? undefined
                         : data.results[0]?.formatted_address;
               if (location === undefined || location.includes("undefined")) {
                    setLoading(() => false);
                    toast.error("Please enter a correct address");
                    return;
               }
          } else {
               geolocation.lat = latitude;
               geolocation.lng = longitude;
               location = address;
          }
          setLoading(() => false);
     };

     // function that changes depending on input
     const onMutate = (e) => {
          // for boolean button values
          let boolean = null;
          if (e.target.value === "true") {
               boolean = true;
          }
          if (e.target.value === "false") {
               boolean = false;
          }

          // for files selection
          if (e.target.files) {
               setFormData((prev) => ({
                    ...prev,
                    images: e.target.files,
               }));
          }

          // text and numbers
          if (!e.target.files) {
               setFormData((prev) => ({
                    ...prev,
                    [e.target.id]: boolean ?? e.target.value,
               }));
          }
     };

     if (loading) {
          return <Spinner />;
     }

     // form will be different depending on if user enters geolocation data or not
     return (
          <div className="profile">
               <header>
                    <p className="pageHeader">Create a Listing</p>
               </header>

               <main>
                    <form onSubmit={handleOnSubmit}>
                         <label className="formLabel">Sell / Rent</label>
                         <div className="formButtons">
                              <button
                                   type="button"
                                   className={
                                        type === "sale"
                                             ? "formButtonActive"
                                             : "formButton"
                                   }
                                   id="type"
                                   value="sale"
                                   onClick={onMutate}
                              >
                                   Sell
                              </button>
                              <button
                                   type="button"
                                   className={
                                        type === "rent"
                                             ? "formButtonActive"
                                             : "formButton"
                                   }
                                   id="type"
                                   value="rent"
                                   onClick={onMutate}
                              >
                                   Rent
                              </button>
                         </div>

                         <label className="formLabel">Name</label>
                         <input
                              className="formInputName"
                              type="text"
                              id="name"
                              value={name}
                              onChange={onMutate}
                              maxLength="32"
                              minLength="10"
                              required
                         />

                         <div className="formRooms flex">
                              <div>
                                   <label className="formLabel">Bedrooms</label>
                                   <input
                                        className="formInputSmall"
                                        type="number"
                                        id="bedrooms"
                                        value={bedrooms}
                                        onChange={onMutate}
                                        min="1"
                                        max="50"
                                        required
                                   />
                              </div>
                              <div>
                                   <label className="formLabel">
                                        Bathrooms
                                   </label>
                                   <input
                                        className="formInputSmall"
                                        type="number"
                                        id="bathrooms"
                                        value={bathrooms}
                                        onChange={onMutate}
                                        min="1"
                                        max="50"
                                        required
                                   />
                              </div>
                         </div>

                         <label className="formLabel">Parking spot</label>
                         <div className="formButtons">
                              <button
                                   className={
                                        parking
                                             ? "formButtonActive"
                                             : "formButton"
                                   }
                                   type="button"
                                   id="parking"
                                   value={true}
                                   onClick={onMutate}
                                   min="1"
                                   max="50"
                              >
                                   Yes
                              </button>
                              <button
                                   className={
                                        !parking && parking !== null
                                             ? "formButtonActive"
                                             : "formButton"
                                   }
                                   type="button"
                                   id="parking"
                                   value={false}
                                   onClick={onMutate}
                              >
                                   No
                              </button>
                         </div>

                         <label className="formLabel">Furnished</label>
                         <div className="formButtons">
                              <button
                                   className={
                                        furnished
                                             ? "formButtonActive"
                                             : "formButton"
                                   }
                                   type="button"
                                   id="furnished"
                                   value={true}
                                   onClick={onMutate}
                              >
                                   Yes
                              </button>
                              <button
                                   className={
                                        !furnished && furnished !== null
                                             ? "formButtonActive"
                                             : "formButton"
                                   }
                                   type="button"
                                   id="furnished"
                                   value={false}
                                   onClick={onMutate}
                              >
                                   No
                              </button>
                         </div>

                         <label className="formLabel">Address</label>
                         <textarea
                              className="formInputAddress"
                              type="text"
                              id="address"
                              value={address}
                              onChange={onMutate}
                              required
                         />

                         {!geolocationEnabled && (
                              <div className="formLatLng flex">
                                   <div>
                                        <label className="formLabel">
                                             Latitude
                                        </label>
                                        <input
                                             className="formInputSmall"
                                             type="number"
                                             id="latitude"
                                             value={latitude}
                                             onChange={onMutate}
                                             required
                                        />
                                   </div>
                                   <div>
                                        <label className="formLabel">
                                             Longitude
                                        </label>
                                        <input
                                             className="formInputSmall"
                                             type="number"
                                             id="longitude"
                                             value={longitude}
                                             onChange={onMutate}
                                             required
                                        />
                                   </div>
                              </div>
                         )}

                         <label className="formLabel">Offer</label>
                         <div className="formButtons">
                              <button
                                   className={
                                        offer
                                             ? "formButtonActive"
                                             : "formButton"
                                   }
                                   type="button"
                                   id="offer"
                                   value={true}
                                   onClick={onMutate}
                              >
                                   Yes
                              </button>
                              <button
                                   className={
                                        !offer && offer !== null
                                             ? "formButtonActive"
                                             : "formButton"
                                   }
                                   type="button"
                                   id="offer"
                                   value={false}
                                   onClick={onMutate}
                              >
                                   No
                              </button>
                         </div>

                         <label className="formLabel">Regular Price</label>
                         <div className="formPriceDiv">
                              <input
                                   className="formInputSmall"
                                   type="number"
                                   id="regularPrice"
                                   value={regularPrice}
                                   onChange={onMutate}
                                   min="50"
                                   max="750000000"
                                   required
                              />
                              {type === "rent" && (
                                   <p className="formPriceText">$ / Month</p>
                              )}
                         </div>

                         {offer && (
                              <>
                                   <label className="formLabel">
                                        Discounted Price
                                   </label>
                                   <input
                                        className="formInputSmall"
                                        type="number"
                                        id="discountedPrice"
                                        value={discountedPrice}
                                        onChange={onMutate}
                                        min="50"
                                        max="750000000"
                                        required={offer}
                                   />
                              </>
                         )}

                         <label className="formLabel">Images</label>
                         <p className="imagesInfo">
                              The first image will be the cover (max 6).
                         </p>
                         <input
                              className="formInputFile"
                              type="file"
                              id="images"
                              onChange={onMutate}
                              max="6"
                              accept=".jpg,.png,.jpeg"
                              multiple
                              required
                         />
                         <button
                              type="submit"
                              className="primaryButton createListingButton"
                         >
                              Create Listing
                         </button>
                    </form>
               </main>
          </div>
     );
};

export default CreateListing;
