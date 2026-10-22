# Tweet me — دليل الرفع والتشغيل

## 1) الرفع إلى GitHub (يعمل فوراً بالوضع التجريبي)
ارفع هذه الملفات إلى جذر مستودع Tweet-me (بنفس أسمائها تماماً):
index.html · styles.css · app.js · config.js · sw.js · manifest.json · icon-192.png · icon-512.png · icon-maskable-512.png

ثم افتح: https://almsharbash.github.io/Tweet-me/
ستجد التطبيق بالوضع التجريبي المحلي (محادثة مع «Tweet بوت») لتجربة الواجهة والثيمات والصور والصوت.
احذف الملف العشوائي الذي رفعته للتفعيل.

## 2) ربط Firebase (عند فتح السحابة)
1. مشروع جديد باسم tweet-me على خطة Spark المجانية.
2. Authentication ← Sign-in method ← فعّل «Email/Password».
3. Firestore Database ← Create database ← Production mode.
4. Firestore ← Rules ← الصق محتوى firestore.rules ← Publish.
5. إعدادات المشروع ← Your apps ← أضف تطبيق ويب ← انسخ الـ config.
6. افتح config.js على GitHub وضع القيم مكان PUT_… ثم احفظ.
7. Authentication ← Settings ← Authorized domains ← أضف: almsharbash.github.io

## 3) الوسائط (اختياري)
بدون Cloudinary تُحفظ الصور المضغوطة والرسائل الصوتية القصيرة داخل Firestore.
لحجم أكبر: حساب Cloudinary مجاني ← Settings ← Upload ← Upload presets ← أنشئ preset بنمط Unsigned ← ضع cloudName وuploadPreset في config.js.

## ما تم في الإصدار 1
دخول وحساب جديد · محادثات فردية · نص وصور ورسائل صوتية · علامات القراءة · عدّاد غير المقروء · الوضع بلا إنترنت · ثيم داكن/فاتح/تلقائي · ألوان زرقاء متعددة ولون مخصص · خلفية المحادثة (ألوان/تدرجات/صورة من هاتفك) · لون الفقاعات · حجم الخط.

## المراحل القادمة
الإشعارات عند إغلاق التطبيق · المكالمات صوت وفيديو · الحالات · المجموعات · تحويل APK عبر PWABuilder.
