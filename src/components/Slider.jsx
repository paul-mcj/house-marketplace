// react and misc.
import { useState, useEffect } from "react";

// react router dom
import { useNavigate } from "react-router-dom";

// firebase
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";

// swiper
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";
import "swiper/css/autoplay";

// components
import Spinner from "../components/Spinner";

const Slider = () => {
     // local state
     const [loading, setLoading] = useState(true);
     const [listings, setListings] = useState(null);

     // navigation
     const navigate = useNavigate();

     useEffect(() => {
          const fetchListings = async () => {
               const listingsRef = collection(db, "listings");
               const q = query(
                    listingsRef,
                    orderBy("timestamp", "desc"),
                    limit(5)
               );
               const querySnap = await getDocs(q);

               let listings = [];
               querySnap.forEach((doc) => {
                    return listings.push({ id: doc.id, data: doc.data() });
               });
               setListings(() => listings);
               setLoading(() => false);
               // console.log(listings);
          };

          fetchListings();
     }, []);

     if (loading) {
          return <Spinner />;
     }

     return (
          listings && (
               <>
                    <p className="exploreHeading">Recommended</p>
                    <Swiper
                         style={{ height: "300px" }}
                         modules={[Navigation, Pagination, Scrollbar, A11y]}
                         slidesPerView={1}
                         pagination={{ clickable: true }}
                    >
                         {listings.map(({ data, id }) => (
                              <SwiperSlide
                                   key={id}
                                   onClick={() =>
                                        navigate(`/category/${data.type}/${id}`)
                                   }
                              >
                                   <div
                                        className="swiperSlideDiv"
                                        style={{
                                             background: `url(${data.imgUrls[0]}) center no-repeat`,
                                             backgroundSize: "cover",
                                             padding: "150px",
                                        }}
                                   >
                                        <p className="swiperSlideText">
                                             {data.name}
                                        </p>
                                        <p className="swiperSlidePrice">
                                             $
                                             {data.discountedPrice ??
                                                  data.regularPrice}{" "}
                                             {data.type === "rent" && "/month"}
                                        </p>
                                   </div>
                              </SwiperSlide>
                         ))}
                    </Swiper>
               </>
          )
     );
};

export default Slider;
