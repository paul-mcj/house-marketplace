// react and misc
import { useEffect, useState } from "react";

// firebase
import {
     collection,
     getDocs,
     query,
     where,
     orderBy,
     limit,
     startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";

// react toastify
import { toast } from "react-toastify";

// components
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Offers = () => {
     // component level state
     const [listings, setListings] = useState(null);
     const [loading, setLoading] = useState(true);
     const [lastFetchedListing, setLastFetchedListing] = useState(null);

     // for pagination purposes
     const onFetchMoreListings = async () => {
          try {
               // get reference to collection
               const listingsRef = collection(db, "listings");

               // make a query, based on the dynamic react route pathname (as the route to this page in <App /> allows for dynamic routing)
               const q = query(
                    listingsRef,
                    where("offer", "==", true),
                    orderBy("timestamp", "desc"),
                    startAfter(lastFetchedListing),
                    limit(2)
               );

               // execute query and get the documents that match the query above
               const querySnap = await getDocs(q);

               // used for pagination purposes
               const lastVisible = querySnap.docs[querySnap.docs.length - 1];
               setLastFetchedListing(() => lastVisible);

               // loop through snapshot
               let listings = [];
               querySnap.forEach((doc) => {
                    return listings.push({
                         // the below syntax is weird to get these different values, but this is how firebase works!
                         id: doc.id,
                         data: doc.data(),
                    });
               });

               // change state
               setListings((prev) => [...prev, ...listings]);
               setLoading(() => false);
          } catch (err) {
               toast.error(`Could not fetch listings. ${err.message}`);
          }
     };

     useEffect(() => {
          const fetchListings = async () => {
               try {
                    // get reference to collection
                    const listingsRef = collection(db, "listings");

                    // make a query, based on the dynamic react route pathname (as the route to this page in <App /> allows for dynamic routing)
                    const q = query(
                         listingsRef,
                         where("offer", "==", true),
                         orderBy("timestamp", "desc"),
                         limit(2)
                    );

                    // execute query and get the documents that match the query above
                    const querySnap = await getDocs(q);

                    // used for pagination purposes
                    const lastVisible =
                         querySnap.docs[querySnap.docs.length - 1];
                    setLastFetchedListing(() => lastVisible);

                    // loop through snapshot
                    let listings = [];
                    querySnap.forEach((doc) => {
                         return listings.push({
                              // the below syntax is weird to get these different values, but this is how firebase works!
                              id: doc.id,
                              data: doc.data(),
                         });
                    });

                    // change state
                    setListings(() => listings);
                    setLoading(() => false);
               } catch (err) {
                    toast.error(`Could not fetch listings. ${err.message}`);
               }
          };

          // call async function
          fetchListings();
     }, []);

     // for JSX slimming
     let listingsContent = (
          <>
               <main>
                    <ul className="categoryListings">
                         {listings?.map((listing) => (
                              <ListingItem
                                   listing={listing.data}
                                   id={listing.id}
                                   key={listing.id}
                              />
                         ))}
                    </ul>
               </main>
               <br />
               <br />
               {lastFetchedListing && (
                    <p className="loadMore" onClick={onFetchMoreListings}>
                         Load More
                    </p>
               )}
          </>
     );

     return (
          <div className="category">
               <header>
                    <p className="pageHeader">Offers</p>
               </header>
               {loading ? (
                    <Spinner />
               ) : listings && listings.length > 0 ? (
                    listingsContent
               ) : (
                    <p>There are no current offers</p>
               )}
          </div>
     );
};

export default Offers;
