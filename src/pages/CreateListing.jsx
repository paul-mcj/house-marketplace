// react and misc
import { useState, useEffect, useRef } from "react";

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

     if (loading) {
          return <Spinner />;
     }

     // form will be different deponing on if user enters geolocation data or not
     return <div>CreateListing</div>;
};

export default CreateListing;
