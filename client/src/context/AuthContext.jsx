import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo
} from 'firebase/auth';
import API from '../services/api';

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(name, email, password, college) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    const response = await API.post('/api/auth/register', { 
      uid: user.uid, 
      name, 
      email, 
      college 
    });
    setDbUser(response.data);
    return userCredential;
  }
  
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function googleSignIn() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const { user } = result;
    const details = getAdditionalUserInfo(result);

    if (details.isNewUser) {
      const response = await API.post('/api/auth/register', {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        college: "Not Specified"
      });
      setDbUser(response.data);
    }
    return result;
  }

  function logout() {
    setDbUser(null);
    return signOut(auth);
  }

  // --- THIS useEffect IS NOW CORRECTED ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // This API call now correctly uses the interceptor
          const res = await API.get('/api/auth/me');
          setDbUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user data from DB", error);
          setDbUser(null); 
        } finally {
          // setLoading(false) only happens after the try/catch is complete
          setLoading(false);
        }
      } else {
        // If there is no user, we are also done loading
        setDbUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    dbUser,
    setDbUser,
    signup,
    login,
    googleSignIn,
    logout,
    loading, // Also export loading state for optional use in UI
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Show children only when the initial auth check is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
}