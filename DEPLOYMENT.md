# دليل نشر المشروع على Vercel

## المتطلبات
- حساب على [Vercel](https://vercel.com)
- حساب على [MongoDB Atlas](https://www.mongodb.com/atlas) (للقاعدة البيانات)
- Git repository (GitHub, GitLab, أو Bitbucket)

## خطوات النشر

### 1. إعداد قاعدة البيانات
1. أنشئ حساب على MongoDB Atlas
2. أنشئ cluster جديد
3. احصل على connection string
4. استبدل `<username>`, `<password>`, و `<database_name>` بالقيم الصحيحة

### 2. إعداد متغيرات البيئة في Vercel
1. اذهب إلى مشروعك في Vercel Dashboard
2. اذهب إلى Settings > Environment Variables
3. أضف المتغيرات التالية:

```
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=your_strong_jwt_secret_key
JWT_EXPIRES_IN=90d
NODE_ENV=production
```

### 3. رفع المشروع على Git
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 4. ربط المشروع مع Vercel
1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اضغط على "New Project"
3. اختر Git repository الخاص بك
4. Vercel سيكتشف تلقائياً أنه Node.js project
5. تأكد من أن Build Command فارغ أو `npm run build`
6. تأكد من أن Output Directory فارغ
7. اضغط "Deploy"

### 5. اختبار النشر
بعد النشر، ستجد URL للمشروع. جرب:
- `https://your-project.vercel.app/` - للصفحة الرئيسية
- `https://your-project.vercel.app/health` - لفحص الاتصال بقاعدة البيانات

## ملاحظات مهمة
- تأكد من أن جميع المتغيرات المطلوبة موجودة في Environment Variables
- Vercel يدعم ES modules (type: "module") بشكل طبيعي
- المشروع يستخدم serverless-http للتوافق مع Vercel
- جميع routes ستكون متاحة تحت `/api/` تلقائياً

## استكشاف الأخطاء
- تحقق من logs في Vercel Dashboard
- تأكد من صحة connection string لقاعدة البيانات
- تأكد من أن جميع dependencies موجودة في package.json
