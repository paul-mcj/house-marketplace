// react and misc
import { useEffect, useState, useRef } from "react";

// firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useAuthStatus = () => {
     // define instance of auth
     const auth = getAuth();

     // to avoid memory leaks with async calls, we want to check against useRef
     const isMounted = useRef(true);

     // state
     const [loggedIn, setLoggedIn] = useState(false);
     const [checkingStatus, setCheckingStatus] = useState(true);

     // check if current instance of auth changed upon render
     useEffect(() => {
          if (isMounted) {
               onAuthStateChanged(auth, (user) => {
                    if (user) {
                         setLoggedIn(() => true);
                    }
                    setCheckingStatus(() => false);
               });
          }

          // cleanup sets ref to false
          return () => {
               isMounted.current = false;
          };
     }, [auth, isMounted]);

     return { loggedIn, checkingStatus };
};

export default useAuthStatus;
