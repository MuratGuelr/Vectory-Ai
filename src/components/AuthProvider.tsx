'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithCustomToken, signInWithCredential, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  userData: any;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Auth State Listener
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data (credits, etc.)
        const userRef = doc(db, 'users', currentUser.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                // Initialize new user
                setDoc(userRef, {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    credits: 5, // Free credits
                    role: 'user'
                });
            }
        });
        // We can't easily unsubscribe from snapshot here inside auth listener without refs, 
        // but for this simple app it's ok.
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    // Electron OAuth Listener
    let unsubscribeOAuth: (() => void) | undefined;
    if (typeof window !== 'undefined' && (window as any).electron) {
        // Deep link listener (legacy)
        (window as any).electron.onDeepLink((url: string) => {
            console.log("Received deep link:", url);
            const urlObj = new URL(url);
            if (urlObj.hostname === 'login') {
                const token = urlObj.searchParams.get('token');
                if (token) {
                    signInWithCustomToken(auth, token).catch(console.error);
                }
            }
        });

        // New OAuth token listener (HTTP Server flow)
        if ((window as any).electron.onOAuthSuccess) {
            unsubscribeOAuth = (window as any).electron.onOAuthSuccess((token: string) => {
                console.log("Received OAuth token from Electron");
                const credential = GoogleAuthProvider.credential(token);
                signInWithCredential(auth, credential)
                    .then((result) => {
                        console.log("Successfully signed in with credential", result.user.email);
                        router.push('/');
                    })
                    .catch((error) => {
                        console.error("Credential sign-in error:", error);
                    });
            });
        }
    }

    return () => {
        unsubscribe();
        if (unsubscribeOAuth) unsubscribeOAuth();
    };
  }, [router]);

  const signIn = () => {
    router.push('/login');
  };

  const signOut = () => {
    firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
