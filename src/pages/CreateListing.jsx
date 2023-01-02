// react and misc
import { useState, useEffect, useRef } from "react";

// react toastify
import { toast } from "react-toastify";

// uuid
import { v4 as uuidv4 } from "uuid";

// firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
     getStorage,
     ref,
     uploadBytesResumable,
     getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

// react router dom
import { useNavigate } from "react-router-dom";

// components
import Spinner from "../components/Spinner";

const CreateListing = () => {
     // initialize auth
     const auth = getAuth();

     // initialize firebase storage capabilities
     const storage = getStorage();

     // initialize navigation
     const navigate = useNavigate();

     // use to check if component is mounted (to avoid memory leeks)
     const isMounted = useRef(true);

     // loading state
     const [loading, setLoading] = useState(false);

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

     // function that stores an image in firebase when a user adds one
     const storeImage = async (image) => {
          // need to create a new Promise for each image added when this function is invoked
          return new Promise((resolve, reject) => {
               // create a new filename composed of user credentials, the image name and a unique suffix
               const fileName = `${auth.currentUser.uid}-${
                    image.name
               }-${uuidv4()}`;

               // create a reference for the image for storage purposes (its location is under an "images" folder)
               const storageRef = ref(storage, `images/${fileName}`);

               // this firebase function follows Google documentation for file uploads to the database
               const uploadTask = uploadBytesResumable(storageRef, image);

               // Register three observers:
               // 1. 'state_changed' observer, called any time the state changes
               // 2. Error observer, called on failure
               // 3. Completion observer, called on successful completion
               uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                         // Observe state change events such as progress, pause, and resume
                         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                         const progress =
                              (snapshot.bytesTransferred /
                                   snapshot.totalBytes) *
                              100;
                         console.log("Upload is " + progress + "% done");
                    },
                    (error) => {
                         // Handle unsuccessful uploads from the failed Promise
                         reject(error);
                    },
                    () => {
                         // Handle successful uploads on complete
                         getDownloadURL(uploadTask.snapshot.ref).then(
                              (downloadURL) => {
                                   resolve(downloadURL);
                              }
                         );
                    }
               );
          });
     };

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

          // get geocoding data
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
          }

          // loop thorough all uploaded images to resolve Promises -- can use a catch clause should an error occur on any Promise being looped thorough
          const imgUrls = await Promise.all(
               [...images].map((image) => storeImage(image))
          ).catch(() => {
               setLoading(() => false);
               toast.error("Images not uploaded");
               return;
          });

          // create an object to submit to database
          const formDataCopy = {
               ...formData,
               imgUrls,
               geolocation,
               timestamp: serverTimestamp(),
          };

          // we don't want the actual images to be uploaded (as we have the url to each), as well as the address given (as it has been gathered with geolocation), so to circumvent larger uploads of data and resolve possible errors, just delete the following from the formCopyData before final submission:
          delete formDataCopy.images;
          delete formDataCopy.address;

          // also make sure to set the location to the address the user typed in (as using geolocation formatted data from Google maps for this isn't reliable)
          formDataCopy.location = address;

          // if there is no offer, then delete the discounted price
          !formDataCopy.offer && delete formDataCopy.discountedPrice;

          // now, save the cleaned up object to the database collection on firebase
          const docRef = await addDoc(collection(db, "listings"), formDataCopy);
          toast.success("Listing saved!");
          navigate(`/category/${formDataCopy.type}/${docRef.id}`);

          // reset loading state
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
