// react and misc
import { useEffect, useState } from "react";

// firebase and firestore
import { getAuth } from "firebase/auth";

const Profile = () => {
     const [user, setUser] = useState(null);

     const auth = getAuth();
     const { currentUser } = auth;

     useEffect(() => {
          setUser(() => currentUser);
     }, [currentUser]);

     return user ? <h1>{user.displayName}</h1> : "Not logged in";
};

export default Profile;
