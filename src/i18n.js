import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      brandName: 'Food2Go',
      branches: 'Branches',
      menu: 'Menu',
      orderOnline: 'Order Online',
      contactUs: 'Contact Us',
      profile: 'Profile',
      login: 'Login',
      favorites: 'Favorites',
      welcomeBack: 'Welcome Back!',
      manageAccount: 'Manage your account',
      loginSignUp: 'Login / Sign Up',
      happyCustomers: '10K+ Happy Customers'
    }
  },
  ar: {
    translation: {
      brandName: 'فود تو جو',
      branches: 'الفروع',
      menu: 'القائمة',
      orderOnline: 'اطلب أونلاين',
      contactUs: 'تواصل معنا',
      profile: 'الملف الشخصي',
      login: 'تسجيل الدخول',
      favorites: 'المفضلة',
      welcomeBack: 'مرحباً بعودتك!',
      manageAccount: 'إدارة حسابك',
      loginSignUp: 'تسجيل الدخول / إنشاء حساب',
      happyCustomers: '10 آلاف+ عميل سعيد'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;