// react and misc
import { useState, useEffect } from "react";

// react router dom
import { useParams, useSearchParams } from "react-router-dom";

// firebase
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";

// react toastify
import { toast } from "react-toastify";

// components
import Spinner from "../components/Spinner";

const Contact = () => {
     // init hooks
     const params = useParams();
     const { landlordId } = params;
     const [searchParams, setSearchParams] = useSearchParams(); //note: the searchParams hook is destructured just like useState hook

     // local state
     const [message, setMessage] = useState("");
     const [loading, setLoading] = useState(true);
     const [landlord, setLandlord] = useState(null);

     // fetch landlord data from firebase
     useEffect(() => {
          const getLandlord = async () => {
               const docRef = doc(db, "users", landlordId);
               const docSnap = await getDoc(docRef);

               // if listings are not properly connected to the landlord that created them, then there will always be an error
               if (docSnap.exists()) {
                    console.log(docSnap.data());
                    setLandlord(() => docSnap.data());
                    setLoading(() => false);
               } else {
                    toast.error("Could not retrieve landlord data");
               }
          };

          getLandlord();
     }, [landlordId]);

     //  if (loading) {
     //   return <Spinner />;
     //  }

     return <div>Contact</div>;
};

export default Contact;
