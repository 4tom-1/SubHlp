import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  OAuthProvider, 
  TwitterAuthProvider, 
  signInWithPopup, 
  signOut,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  type AuthCredential
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// アプリの初期化を一度だけ行う
let app: any;
let db: any;
let auth: any;
let googleProvider: any;
let microsoftProvider: any;
let twitterProvider: any;

// 遅延初期化関数
const initializeFirebase = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    microsoftProvider = new OAuthProvider('microsoft.com');
    twitterProvider = new TwitterAuthProvider();
  }
  return { app, db, auth, googleProvider, microsoftProvider, twitterProvider };
};

// 初期化を実行
const { app: firebaseApp, db: firestoreDb, auth: firebaseAuth, googleProvider: googleAuthProvider, microsoftProvider: msAuthProvider, twitterProvider: twitterAuthProvider } = initializeFirebase();

export { firestoreDb as db, firebaseAuth as auth, googleAuthProvider as googleProvider, msAuthProvider as microsoftProvider, twitterAuthProvider as twitterProvider };

// 自動連携機能
export const autoLinkAccount = async (email: string, password: string, newCredential: AuthCredential) => {
  try {
    // 1. メール・パスワードでログイン
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    
    // 2. 新しい認証資格情報を既存アカウントにリンク
    await linkWithCredential(userCredential.user, newCredential);
    
    console.log('アカウントの自動連携が完了しました');
    return userCredential.user;
  } catch (error: any) {
    console.error('自動連携エラー:', error);
    throw error;
  }
};

// プロバイダー名の取得を簡素化
const getProviderDisplayName = (providerId: string): string => {
  const providerNames: { [key: string]: string } = {
    'google.com': 'Google',
    'microsoft.com': 'Microsoft',
    'twitter.com': 'Twitter',
    'password': 'メール・パスワード'
  };
  return providerNames[providerId] || providerId;
};

// Googleログイン関数を最適化
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
    return result.user;
  } catch (error: any) {
    // ポップアップがキャンセルされた場合は無視
    if (error.code === 'auth/cancelled-popup-request' || 
        error.code === 'auth/popup-closed-by-user') {
      return null;
    }
    
    // アカウントが別の認証方法で存在する場合の処理
    if (error.code === 'auth/account-exists-with-different-credential') {
      const email = error.customData?.email;
      const credential = error.customData?.credential;
      
      if (email && credential) {
        try {
          const methods = await fetchSignInMethodsForEmail(firebaseAuth, email);
          
          // メール・パスワードで登録されている場合は自動連携を試行
          if (methods.includes('password')) {
            const enhancedError = new Error() as any;
            enhancedError.code = error.code;
            enhancedError.message = `このメールアドレス（${email}）は既にメール・パスワードで登録されています。`;
            enhancedError.email = email;
            enhancedError.credential = credential;
            enhancedError.existingProvider = 'password';
            enhancedError.canLink = true;
            throw enhancedError;
          } else {
            // 他のSNSプロバイダーで登録されている場合
            const providerName = getProviderDisplayName(methods[0]);
            const enhancedError = new Error() as any;
            enhancedError.code = error.code;
            enhancedError.message = `このメールアドレスは既に${providerName}で登録されています。`;
            enhancedError.email = email;
            enhancedError.credential = credential;
            enhancedError.existingProvider = methods[0];
            enhancedError.canLink = false;
            throw enhancedError;
          }
        } catch (fetchError) {
          const enhancedError = new Error() as any;
          enhancedError.code = error.code;
          enhancedError.message = `このメールアドレスは既に別の認証方法で登録されています。`;
          enhancedError.email = email;
          enhancedError.credential = credential;
          throw enhancedError;
        }
      } else {
        const enhancedError = new Error() as any;
        enhancedError.code = error.code;
        enhancedError.message = `このメールアドレスは既に別の認証方法で登録されています。`;
        throw enhancedError;
      }
    }
    
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Microsoftログイン関数を最適化
export const signInWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, msAuthProvider);
    return result.user;
  } catch (error: any) {
    // ポップアップがキャンセルされた場合は無視
    if (error.code === 'auth/cancelled-popup-request' || 
        error.code === 'auth/popup-closed-by-user') {
      return null;
    }
    
    // アカウントが別の認証方法で存在する場合の処理
    if (error.code === 'auth/account-exists-with-different-credential') {
      const email = error.customData?.email;
      const credential = error.customData?.credential;
      
      if (email && credential) {
        try {
          const methods = await fetchSignInMethodsForEmail(firebaseAuth, email);
          
          // メール・パスワードで登録されている場合は自動連携を試行
          if (methods.includes('password')) {
            const enhancedError = new Error() as any;
            enhancedError.code = error.code;
            enhancedError.message = `このメールアドレス（${email}）は既にメール・パスワードで登録されています。`;
            enhancedError.email = email;
            enhancedError.credential = credential;
            enhancedError.existingProvider = 'password';
            enhancedError.canLink = true;
            throw enhancedError;
          } else {
            // 他のSNSプロバイダーで登録されている場合
            const providerName = getProviderDisplayName(methods[0]);
            const enhancedError = new Error() as any;
            enhancedError.code = error.code;
            enhancedError.message = `このメールアドレスは既に${providerName}で登録されています。`;
            enhancedError.email = email;
            enhancedError.credential = credential;
            enhancedError.existingProvider = methods[0];
            enhancedError.canLink = false;
            throw enhancedError;
          }
        } catch (fetchError) {
          const enhancedError = new Error() as any;
          enhancedError.code = error.code;
          enhancedError.message = `このメールアドレスは既に別の認証方法で登録されています。`;
          enhancedError.email = email;
          enhancedError.credential = credential;
          throw enhancedError;
        }
      } else {
        const enhancedError = new Error() as any;
        enhancedError.code = error.code;
        enhancedError.message = `このメールアドレスは既に別の認証方法で登録されています。`;
        throw enhancedError;
      }
    }
    
    console.error('Error signing in with Microsoft:', error);
    throw error;
  }
};

// Twitterログイン関数を最適化
export const signInWithTwitter = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, twitterAuthProvider);
    return result.user;
  } catch (error: any) {
    // ポップアップがキャンセルされた場合は無視
    if (error.code === 'auth/cancelled-popup-request' || 
        error.code === 'auth/popup-closed-by-user') {
      return null;
    }
    
    // アカウントが別の認証方法で存在する場合の処理
    if (error.code === 'auth/account-exists-with-different-credential') {
      const email = error.customData?.email;
      const credential = error.customData?.credential;
      
      if (email && credential) {
        try {
          const methods = await fetchSignInMethodsForEmail(firebaseAuth, email);
          
          // メール・パスワードで登録されている場合は自動連携を試行
          if (methods.includes('password')) {
            const enhancedError = new Error() as any;
            enhancedError.code = error.code;
            enhancedError.message = `このメールアドレス（${email}）は既にメール・パスワードで登録されています。`;
            enhancedError.email = email;
            enhancedError.credential = credential;
            enhancedError.existingProvider = 'password';
            enhancedError.canLink = true;
            throw enhancedError;
          } else {
            // 他のSNSプロバイダーで登録されている場合
            const providerName = getProviderDisplayName(methods[0]);
            const enhancedError = new Error() as any;
            enhancedError.code = error.code;
            enhancedError.message = `このメールアドレスは既に${providerName}で登録されています。`;
            enhancedError.email = email;
            enhancedError.credential = credential;
            enhancedError.existingProvider = methods[0];
            enhancedError.canLink = false;
            throw enhancedError;
          }
        } catch (fetchError) {
          const enhancedError = new Error() as any;
          enhancedError.code = error.code;
          enhancedError.message = `このメールアドレスは既に別の認証方法で登録されています。`;
          enhancedError.email = email;
          enhancedError.credential = credential;
          throw enhancedError;
        }
      } else {
        const enhancedError = new Error() as any;
        enhancedError.code = error.code;
        enhancedError.message = `このメールアドレスは既に別の認証方法で登録されています。`;
        throw enhancedError;
      }
    }
    
    console.error('Error signing in with Twitter:', error);
    throw error;
  }
};

// ログアウト関数を簡素化
export const signOutUser = async () => {
  await signOut(firebaseAuth);
}; 