// react router dom
import { Routes, Route } from "react-router-dom";

// components
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import Listing from "./pages/Listing";

// react toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// pages
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";

function App() {
     return (
          <>
               <Routes>
                    <Route path="/" element={<Explore />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route
                         path="/category/:categoryName"
                         element={<Category />}
                    />
                    <Route path="/profile" element={<PrivateRoute />}>
                         <Route path="/profile" element={<Profile />} />
                    </Route>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route
                         path="/forgot-password"
                         element={<ForgotPassword />}
                    />
                    <Route path="/create-listing" element={<CreateListing />} />
                    <Route
                         path="/edit-listing/:listingId"
                         element={<EditListing />}
                    />
                    <Route
                         path="/category/:categoryName/:listingId"
                         element={<Listing />}
                    />
                    <Route path="/contact/:landlordId" element={<Contact />} />
               </Routes>
               <NavBar />
               <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable
                    theme="dark"
               />
          </>
     );
}

export default App;
