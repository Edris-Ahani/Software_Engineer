<div dir="rtl">

# توکن وب جیسون (JWT)

## چیست؟
توکن وب جیسون (JWT) یک استاندارد باز (RFC 7519) است که روشی فشرده و مستقل را برای انتقال امن اطلاعات بین طرفین به عنوان یک شیء JSON تعریف می‌کند. این اطلاعات به دلیل اینکه به صورت دیجیتالی امضا (Sign) می‌شوند، قابل تایید و اعتماد هستند. JWTها می‌توانند با استفاده از یک کلید مخفی (با الگوریتم HMAC) یا یک جفت کلید عمومی/خصوصی (مثل RSA یا ECDSA) امضا شوند.

## ساختار یک JWT
یک JWT از سه بخش تشکیل شده است که با نقطه (`.`) از هم جدا می‌شوند:
۱. **هدر (Header)**: شامل دو بخش است: نوع توکن (JWT) و الگوریتم امضای استفاده شده (مانند HMAC SHA256 یا RSA).
۲. **پی‌لود (Payload)**: شامل ادعاها (Claims) است. ادعاها اظهاراتی درباره یک موجودیت (معمولاً کاربر) و داده‌های اضافی هستند.
۳. **امضا (Signature)**: برای ایجاد بخش امضا، باید هدر رمزگذاری شده، پی‌لود رمزگذاری شده، یک کلید مخفی، و الگوریتم مشخص شده در هدر را در نظر گرفت و آن‌ها را امضا کرد.

فرمت نمونه: `xxxxx.yyyyy.zzzzz`

## چه مشکلاتی را حل می‌کند؟
- **احراز هویت بدون حالت (Stateless Authentication)**: برخلاف احراز هویت مبتنی بر نشست (Session) که سرور شناسه‌های نشست را در حافظه یا پایگاه داده ذخیره می‌کند، JWT به سرور اجازه می‌دهد کاربر را بدون مراجعه به پایگاه داده تایید کند، زیرا خود توکن شامل تمام اطلاعات لازم است.
- **سازگاری با Cross-Domain/CORS**: از آنجا که توکن در هدر HTTP ارسال می‌شود (معمولاً در هدر `Authorization: Bearer <token>`)، به خوبی در دامنه‌های مختلف کار می‌کند.
- **مناسب برای موبایل**: برای برنامه‌های موبایلی که مدیریت کوکی‌ها و نشست‌های سنتی در آن‌ها دشوار است، گزینه‌ای عالی است.

## چه زمانی و کجا از آن استفاده کنیم؟
- **مجوز دسترسی (Authorization)**: این رایج‌ترین سناریو برای استفاده از JWT است. پس از ورود کاربر به سیستم، هر درخواست بعدی شامل JWT خواهد بود و به کاربر اجازه می‌دهد به مسیرها، خدمات و منابعی که با آن توکن مجاز هستند دسترسی پیدا کند.
- **تبادل اطلاعات (Information Exchange)**: JWTها راه خوبی برای انتقال امن اطلاعات بین طرفین هستند.

## مثال‌ها

### مثال Node.js (با استفاده از پکیج `jsonwebtoken`)
```javascript
const jwt = require('jsonwebtoken');

const secretKey = 'my_super_secret_key';

// 1. Generate a JWT (Login)
function generateToken(user) {
    const payload = {
        id: user.id,
        role: user.role
    };
    // Token expires in 1 hour
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

// 2. Verify a JWT (Middleware for protected routes)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, decodedUser) => {
        if (err) return res.sendStatus(403);
        
        req.user = decodedUser;
        next();
    });
}
```
</div>
