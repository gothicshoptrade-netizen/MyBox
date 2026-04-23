'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "dashboard": "Dashboard",
          "projects": "Projects",
          "servers": "Servers",
          "services": "Services",
          "credentials": "Credentials",
          "share_links": "Share Links",
          "logout": "Logout",
          "login": "Login with Google",
          "app_title": "IT-Vault",
          "active_projects": "Active Projects",
          "total_servers": "Total Servers",
          "total_services": "Total Services",
          "stored_credentials": "Stored Credentials",
          "recent_projects": "Recent Projects",
          "recent_servers": "Recent Servers",
          "system_overview": "System Overview",
          "secure_storage": "AES-256-GCM Encrypted Storage",
          "create_project": "Create Project",
          "create_server": "Add Server",
          "add_credential": "Add Credential",
          "share": "Share",
          "loading": "Loading...",
          "no_data": "No data available."
        }
      },
      ru: {
        translation: {
          "dashboard": "Дашборд",
          "projects": "Проекты",
          "servers": "Серверы",
          "services": "Сервисы",
          "credentials": "Доступы",
          "share_links": "Безопасный шеринг",
          "logout": "Выйти",
          "login": "Войти через Google",
          "app_title": "IT-Vault",
          "active_projects": "Активные проекты",
          "total_servers": "Всего серверов",
          "total_services": "Всего сервисов",
          "stored_credentials": "Доступы",
          "recent_projects": "Последние проекты",
          "recent_servers": "Последние серверы",
          "system_overview": "Обзор IT-инфраструктуры",
          "secure_storage": "Зашифрованное хранилище AES-256-GCM",
          "create_project": "Создать проект",
          "create_server": "Добавить сервер",
          "add_credential": "Добавить доступ",
          "share": "Поделиться",
          "loading": "Загрузка...",
          "no_data": "Нет данных."
        }
      }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isPaywall: boolean;
  trialEndsAt: Date | null;
  subscriptionEndsAt: Date | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isPaywall: false,
  trialEndsAt: null,
  subscriptionEndsAt: null,
  login: async () => {},
  logout: async () => {}
});

export function useAuth() {
  return useContext(AuthContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaywall, setIsPaywall] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null);
  const [subscriptionEndsAt, setSubscriptionEndsAt] = useState<Date | null>(null);

  useEffect(() => {
    let unsubscribeDoc = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setLoading(false);
        setIsPaywall(false);
        setTrialEndsAt(null);
        setSubscriptionEndsAt(null);
        return;
      }

      // Check user document for subscription logic
      const userRef = doc(db, 'users', u.uid);
      
      const checkDoc = async () => {
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          // New User: 14 days free trial
          const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
          await setDoc(userRef, {
            email: u.email,
            trialEndsAt: trialEnd,
            subscriptionEndsAt: null,
            createdAt: serverTimestamp()
          });
        }
      };
      
      await checkDoc();

      unsubscribeDoc = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const tEnd = data.trialEndsAt ? new Date(data.trialEndsAt) : null;
          const sEnd = data.subscriptionEndsAt ? new Date(data.subscriptionEndsAt) : null;
          
          setTrialEndsAt(tEnd);
          setSubscriptionEndsAt(sEnd);

          const now = new Date();
          const trialExpired = tEnd ? now > tEnd : false;
          const subExpired = sEnd ? now > sEnd : true;

          // If trial is over and no active subscription (or it's expired) -> Paywall
          setIsPaywall(trialExpired && subExpired);
        }
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDoc();
    };
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <AuthContext.Provider value={{ user, loading, isPaywall, trialEndsAt, subscriptionEndsAt, login, logout }}>
        {children}
      </AuthContext.Provider>
    </I18nextProvider>
  );
}
