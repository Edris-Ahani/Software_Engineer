<div dir="rtl">

# امنیت: تزریق اس‌کیوال (SQL Injection / SQLi)

## چیست؟
تزریق اس‌کیوال (SQL Injection) یک تکنیک تزریق کد است که در آن مهاجم دستورات مخرب SQL را اجرا می‌کند تا کنترل سرور دیتابیسِ برنامه وب را به دست بگیرد. این حمله زمانی رخ می‌دهد که ورودی کاربر بدون اعتبارسنجی (Sanitization) به صورت مستقیم با یک رشته متنی خام (Raw String) برای ساخت کوئری دیتابیس ترکیب شود.

## نحوه کار (مثال واقعی)
فرض کنید یک کوئری ورود به سیستم (Login) به این شکل نوشته شده است:
<div dir="ltr">

```javascript
// BAD CODE
const username = req.body.username;
const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = 'xxx'";
```

</div>
اگر یک هکر عبارت `admin' --` را به عنوان نام کاربری خود وارد کند، کوئری نهایی که به دیتابیس می‌رود به این شکل درمی‌آید:
<div dir="ltr">

```sql
SELECT * FROM users WHERE username = 'admin' --' AND password = 'xxx'
```

</div>
در زبان SQL، علامت `--` به معنای کامنت (توضیحات) است. در نتیجه دیتابیس تمام بررسی‌های مربوط به رمز عبور را کاملاً نادیده می‌گیرد و هکر بدون اینکه رمز عبور را بداند، با موفقیت به عنوان مدیر (admin) وارد سیستم می‌شود!

## نحوه جلوگیری
هیچ‌گاه از ترکیب رشته‌های متنی خام برای ساخت کوئری SQL استفاده نکنید.
۱. **کوئری‌های پارامتری (Prepared Statements)**: این اصلی‌ترین خط دفاعی است. موتور دیتابیس ورودی کاربر را دقیقاً و صرفاً به عنوان یک *مقدار داده‌ای (Literal Value)* در نظر می‌گیرد و هرگز اجازه نمی‌دهد به عنوان کد اجرایی تفسیر شود.
<div dir="ltr">

```javascript
// GOOD CODE (Node.js with pg)
const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
const values = [req.body.username, req.body.password];
client.query(query, values);
```

</div>
۲. **استفاده از ORM**: اکثر ابزارهای مدرن ORM (مانند Prisma، TypeORM یا Entity Framework) به صورت پیش‌فرض و در پشت‌صحنه از کوئری‌های پارامتری استفاده می‌کنند و به طور خودکار از شما در برابر این حمله محافظت می‌کنند.

</div>
