// react router dom
import { Link } from "react-router-dom";

// assets
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";

const Explore = () => {
     return (
          <div className="explore">
               <h1>Explore</h1>
               <header>
                    <p className="pageHeader"></p>
               </header>
               <main>
                    {/* Slider */}
                    <p className="exploreCategoryHeading">Categories</p>
                    <div className="exploreCategories">
                         <Link to="/category/rent">
                              <img
                                   src={rentCategoryImage}
                                   alt="Rent"
                                   className="exploreCategoryImg"
                              />
                              <p className="exploreCategoryName">
                                   Places For Rent
                              </p>
                         </Link>
                         <Link to="/category/sale">
                              <img
                                   src={sellCategoryImage}
                                   alt="Sell"
                                   className="exploreCategoryImg"
                              />
                              <p className="exploreCategoryName">
                                   Places For Sale
                              </p>
                         </Link>
                    </div>
               </main>
          </div>
     );
};

export default Explore;
