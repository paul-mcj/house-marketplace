// react router dom
import { Link } from "react-router-dom";

// react and misc
import PropTypes from "prop-types";

// assets
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";

const ListingItem = ({ listing, id, onDelete, onEdit }) => {
     return (
          <li className="categoryListing">
               <Link
                    to={`/category/${listing.type}/${id}`}
                    className="categoryListingLink"
               >
                    <img
                         src={listing.imgUrls[0]}
                         alt={listing.name}
                         className="categoryListingImg"
                    />
                    <div className="categoryListingDetails">
                         <p className="categoryListingLocation">
                              {listing.location}
                         </p>
                         <p className="categoryListingName">{listing.name}</p>
                         <p className="categoryListingPrice">
                              $
                              {listing.offer
                                   ? listing.discountedPrice
                                   : listing.regularPrice}
                              {listing.type === "rent" && "/ mth"}
                         </p>
                         <div className="categoryListingInfoDiv">
                              <img src={bedIcon} alt="bed" />
                              <p className="categoryListingInfoText">
                                   {listing.bedrooms > 1
                                        ? `${listing.bedrooms} Bedrooms`
                                        : "1 Bedroom"}
                              </p>
                              <img src={bathtubIcon} alt="bath" />
                              <p className="categoryListingInfoText">
                                   {listing.bathrooms > 1
                                        ? `${listing.bathrooms} Bathrooms`
                                        : "1 Bathroom"}
                              </p>
                         </div>
                    </div>
               </Link>
               {onDelete && (
                    <DeleteIcon
                         className="removeIcon"
                         fill="rgb(231, 76, 60)"
                         onClick={() => {
                              onDelete(listing.id, listing.name);
                         }}
                    />
               )}
               {onEdit && (
                    <EditIcon
                         className="editIcon"
                         onClick={() => onEdit(listing.id)}
                    />
               )}
          </li>
     );
};

ListingItem.propTypes = {
     listing: PropTypes.object.isRequired,
     id: PropTypes.string.isRequired,
     onDelete: PropTypes.func,
     onEdit: PropTypes.func,
};

export default ListingItem;
