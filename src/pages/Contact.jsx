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

     // textarea state change
     const onChange = (e) => setMessage(() => e.target.value);

     // fetch landlord data from firebase
     useEffect(() => {
          const getLandlord = async () => {
               const docRef = doc(db, "users", landlordId);
               const docSnap = await getDoc(docRef);

               if (docSnap.exists()) {
                    console.log(docSnap.data());
                    setLandlord(() => docSnap.data());
                    // setLoading(() => false);
               } else {
                    // this error will show if the user of the listing is non-existent
                    toast.error("Could not retrieve landlord data");
               }
          };

          getLandlord();
     }, [landlordId]);

     //  if (loading) {
     //   return <Spinner />;
     //  }

     return (
          <div className="pageContainer">
               <header>
                    <p className="pageHeader">Contact Landlord</p>
               </header>
               {landlord !== null && (
                    <main>
                         <div className="contactLandlord">
                              <p className="landlordName">
                                   Contact {landlord?.name}
                              </p>
                         </div>
                         <form className="messageForm">
                              <div className="messageDiv">
                                   <label
                                        htmlFor="message"
                                        className="messageLabel"
                                   >
                                        Message
                                   </label>
                                   <textarea
                                        name="message"
                                        id="message"
                                        className="textarea"
                                        value={message}
                                        onChange={onChange}
                                   ></textarea>
                              </div>
                              <a
                                   href={`mailto:${
                                        landlord?.email
                                   }?Subject=${searchParams.get(
                                        "listingName"
                                   )}&body=${message}`}
                              >
                                   <button
                                        className="primaryButton"
                                        type="button"
                                   >
                                        Send Message
                                   </button>
                              </a>
                         </form>
                    </main>
               )}
          </div>
     );
};

export default Contact;
