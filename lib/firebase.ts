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
  signInWithCredential,
  EmailAuthProvider,
  AuthCredential,
  signInWithEmailAndPassword,
  reauthenticateWithCredential
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');
export const twitterProvider = new TwitterAuthProvider();

// 自動連携機能
export const autoLinkAccount = async (email: string, password: string, newCredential: AuthCredential) => {
  try {
    // 1. メール・パスワードでログイン
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // 2. 新しい認証資格情報を既存アカウントにリンク
    await linkWithCredential(userCredential.user, newCredential);
    
    console.log('アカウントの自動連携が完了しました');
    return userCredential.user;
  } catch (error: any) {
    console.error('自動連携エラー:', error);
    throw error;
  }
};

// 認証資格情報を取得する関数
const getCredentialFromResult = (result: any, provider: string): AuthCredential | null => {
  switch (provider) {
    case 'google':
      return GoogleAuthProvider.credentialFromResult(result);
    case 'microsoft':
      return OAuthProvider.credentialFromResult(result);
    case 'twitter':
      return TwitterAuthProvider.credentialFromResult(result);
    default:
      return null;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
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
          const methods = await fetchSignInMethodsForEmail(auth, email);
          
          // メール・パスワードで登録されている場合は自動連携を試行
          if (methods.includes('password')) {
            // エラーオブジェクトに追加情報を含める
            const enhancedError = new Error() as any;
            enhancedError.code = error.code;
            enhancedError.message = `このメールアドレス（${email}）は既にメール・パスワードで登録されています。\n\n多要素認証は未実装です。`;
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
            enhancedError.message = `このメールアドレスは既に${providerName}で登録されています。\n\n${providerName}でログインしてください。`;
            enhancedError.email = email;
            enhancedError.credential = credential;
            enhancedError.existingProvider = methods[0];
            enhancedError.canLink = false;
            throw enhancedError;
          }
        } catch (fetchError) {
          // fetchSignInMethodsForEmailが失敗した場合のフォールバック
          const enhancedError = new Error() as any;
          enhancedError.code = error.code;
          enhancedError.message = `このメールアドレスは既に別の認証方法で登録されています。\n\n元の認証方法でログインしてください。`;
          enhancedError.email = email;
          enhancedError.credential = credential;
          throw enhancedError;
        }
      } else {
        // emailやcredentialが取得できない場合のフォールバック
        const enhancedError = new Error() as any;
        enhancedError.code = error.code;
        enhancedError.message = `このメールアドレスは既に別の認証方法で登録されています。\n\n元の認証方法でログインしてください。`;
        throw enhancedError;
      }
    }
    
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signInWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
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
          const methods = await fetchSignInMethodsForEmail(auth, email);
          
          // メール・パスワードで登録されている場合は自動連携を試行
          if (methods.includes('password')) {
            // エラーオブジェクトに追加情報を含める
            const enhancedError = new Error() as any;
            enhancedError.code = error.code;
            enhancedError.message = `このメールアドレス（${email}）は既にメール・パスワードで登録されています。\n\n多要素認証は未実装です。`;
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
            enhancedError.message = `このメールアドレスは既に${providerName}で登録されています。\n\n${providerName}でログインしてください。`;
            enhancedError.email = email;
            enhancedError.credential = credential;
            enhancedError.existingProvider = methods[0];
            enhancedError.canLink = false;
            throw enhancedError;
          }
        } catch (fetchError) {
          // fetchSignInMethodsForEmailが失敗した場合のフォールバック
          const enhancedError = new Error() as any;
          enhancedError.code = error.code;
          enhancedError.message = `このメールアドレスは既に別の認証方法で登録されています。\n\n元の認証方法でログインしてください。`;
          enhancedError.email = email;
          enhancedError.credential = credential;
          throw enhancedError;
        }
      } else {
        // emailやcredentialが取得できない場合のフォールバック
        const enhancedError = new Error() as any;
        enhancedError.code = error.code;
        enhancedError.message = `このメールアドレスは既に別の認証方法で登録されています。\n\n元の認証方法でログインしてください。`;
        throw enhancedError;
      }
    }
    
    console.error('Error signing in with Microsoft:', error);
    throw error;
  }
};

export const signInWithTwitter = async () => {
  try {
    const result = await signInWithPopup(auth, twitterProvider);
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
          const methods = await fetchSignInMethodsForEmail(auth, email);
          
          // メール・パスワードで登録されている場合は自動連携を試行
          if (methods.includes('password')) {
            // エラーオブジェクトに追加情報を含める
            const enhancedError = new Error() as any;
            enhancedError.code = error.code;
            enhancedError.message = `このメールアドレス（${email}）は既にメール・パスワードで登録されています。\n\n多要素認証は未実装です。`;
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
            enhancedError.message = `このメールアドレスは既に${providerName}で登録されています。\n\n${providerName}でログインしてください。`;
            enhancedError.email = email;
            enhancedError.credential = credential;
            enhancedError.existingProvider = methods[0];
            enhancedError.canLink = false;
            throw enhancedError;
          }
        } catch (fetchError) {
          // fetchSignInMethodsForEmailが失敗した場合のフォールバック
          const enhancedError = new Error() as any;
          enhancedError.code = error.code;
          enhancedError.message = `このメールアドレスは既に別の認証方法で登録されています。\n\n元の認証方法でログインしてください。`;
          enhancedError.email = email;
          enhancedError.credential = credential;
          throw enhancedError;
        }
      } else {
        // emailやcredentialが取得できない場合のフォールバック
        const enhancedError = new Error() as any;
        enhancedError.code = error.code;
        enhancedError.message = `このメールアドレスは既に別の認証方法で登録されています。\n\n元の認証方法でログインしてください。`;
        throw enhancedError;
      }
    }
    
    console.error('Error signing in with Twitter:', error);
    throw error;
  }
};

// プロバイダー名を日本語で表示する関数
const getProviderDisplayName = (providerId: string): string => {
  switch (providerId) {
    case 'google.com':
      return 'Google';
    case 'microsoft.com':
      return 'Microsoft';
    case 'twitter.com':
      return 'X（Twitter）';
    case 'password':
      return 'メール・パスワード';
    default:
      return '別の認証方法';
  }
};

// アカウント連携機能（改善版）
export const linkAccountWithCredential = async (email: string, password: string, provider: 'google' | 'microsoft' | 'twitter') => {
  try {
    // まずメール・パスワードでログイン
    const emailCredential = EmailAuthProvider.credential(email, password);
    const userCredential = await signInWithCredential(auth, emailCredential);
    
    // 選択されたプロバイダーで認証情報を取得
    let oauthResult;
    switch (provider) {
      case 'google':
        oauthResult = await signInWithPopup(auth, googleProvider);
        break;
      case 'microsoft':
        oauthResult = await signInWithPopup(auth, microsoftProvider);
        break;
      case 'twitter':
        oauthResult = await signInWithPopup(auth, twitterProvider);
        break;
    }
    
    // アカウントを連携（認証情報が利用可能な場合のみ）
    if (oauthResult) {
      // 認証情報を直接取得する代わりに、新しい認証情報を作成
      let newCredential: AuthCredential | null = null;
      switch (provider) {
        case 'google':
          newCredential = GoogleAuthProvider.credentialFromResult(oauthResult);
          break;
        case 'microsoft':
          newCredential = OAuthProvider.credentialFromResult(oauthResult);
          break;
        case 'twitter':
          newCredential = TwitterAuthProvider.credentialFromResult(oauthResult);
          break;
      }
      
      if (newCredential) {
        await linkWithCredential(userCredential.user, newCredential);
        return userCredential.user;
      }
    }
  } catch (error: any) {
    console.error('Error linking account:', error);
    throw error;
  }
};

// 既存のアカウントとの連携を試行する関数
export const tryLinkExistingAccount = async (credential: AuthCredential, email: string) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    
    // メール・パスワードで登録されている場合のみ連携可能
    if (methods.includes('password')) {
      throw new Error('アカウント連携を行うには、まずメール・パスワードでログインしてから連携してください。');
    }
    
    // 他のSNSプロバイダーで登録されている場合は連携不可
    const providerName = getProviderDisplayName(methods[0]);
    throw new Error(`このメールアドレスは既に${providerName}で登録されています。${providerName}でログインしてください。`);
  } catch (error: any) {
    console.error('Error trying to link account:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}; 