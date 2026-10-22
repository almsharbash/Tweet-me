// إعدادات Tweet me — عدّل هذا الملف فقط بعد فتح مشروع Firebase.
// ما دام apiKey يبدأ بـ PUT_ يعمل التطبيق في "الوضع التجريبي المحلي" على هاتفك فقط.

export const CONFIG = {
  firebase: {
    apiKey: "PUT_API_KEY_HERE",
    authDomain: "PUT_PROJECT_ID.firebaseapp.com",
    projectId: "PUT_PROJECT_ID",
    storageBucket: "PUT_PROJECT_ID.appspot.com",
    messagingSenderId: "PUT_SENDER_ID",
    appId: "PUT_APP_ID"
  },
  // اختياري: Cloudinary المجاني لرفع الصور والصوت.
  // إن تركته فارغاً تُحفظ الصور المضغوطة والرسائل الصوتية القصيرة داخل Firestore مباشرة.
  cloudinary: {
    cloudName: "PUT_CLOUD_NAME",
    uploadPreset: "PUT_UNSIGNED_PRESET"
  }
};
