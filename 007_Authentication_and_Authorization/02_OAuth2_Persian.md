<div dir="rtl">

# پروتکل OAuth 2.0

## چیست؟
پروتکل OAuth 2.0 (Open Authorization) یک چارچوب استاندارد صنعتی برای مجوز دسترسی (Authorization) است. این استاندارد به یک برنامه شخص ثالث (Third-party) اجازه می‌دهد تا به یک سرویس HTTP دسترسی محدود پیدا کند؛ این کار می‌تواند از طرف مالک منبع (مثلاً یک کاربر) انجام شود یا به خود برنامه شخص ثالث اجازه دسترسی مستقل بدهد. لازم به ذکر است که OAuth ذاتاً یک پروتکل احراز هویت (Authentication) نیست (هرچند OpenID Connect برای این هدف بر روی آن ساخته شده است)، بلکه یک پروتکل مجوز دسترسی است.

## نقش‌های کلیدی در OAuth 2.0
۱. **مالک منبع (Resource Owner)**: کاربری که به یک برنامه اجازه می‌دهد تا به حساب او دسترسی پیدا کند.
۲. **کلاینت (Client)**: برنامه‌ای که می‌خواهد به حساب کاربر دسترسی پیدا کند.
۳. **سرور منابع (Resource Server)**: سروری که میزبان داده‌های محافظت شده کاربر است (مثلاً Google APIs).
۴. **سرور مجوز (Authorization Server)**: سروری که کاربر را احراز هویت کرده و توکن‌های دسترسی (Access Tokens) را برای کلاینت صادر می‌کند.

## چه مشکلاتی را حل می‌کند؟
- **الگوی ضدرمز عبور (Password Anti-Pattern)**: قبل از OAuth، کاربران مجبور بودند رمزهای عبور خود را به برنامه‌های شخص ثالث بدهند تا به داده‌هایشان دسترسی داشته باشند (مثلاً دادن رمز جیمیل به یک سایت برای پیدا کردن دوستان). OAuth این مشکل را برطرف می‌کند.
- **کنترل دسترسی دانه‌دار (Granular Access Control)**: به شما امکان می‌دهد محدوده‌های خاصی از دسترسی (Scopes) را به برنامه‌ها اعطا کنید (مثلاً "فقط خواندن ایمیل" اما نه "حذف ایمیل").
- **لغو دسترسی (Revocation)**: کاربران می‌توانند به راحتی دسترسی یک برنامه را بدون نیاز به تغییر رمز عبور خود لغو کنند.

## چه زمانی و کجا از آن استفاده کنیم؟
زمانی از OAuth 2.0 استفاده کنید که می‌خواهید به کاربران اجازه دهید با استفاده از ارائه‌دهندگان خارجی وارد سیستم شوند (مانند "ورود با گوگل/گیت‌هاب/فیس‌بوک")، یا زمانی که برنامه شما نیاز دارد به طور امن به داده‌های کاربر که در سرویس دیگری میزبانی می‌شود دسترسی پیدا کند.

## مثال‌ها

### جریان OAuth 2.0 (Authorization Code Grant)
۱. **کلاینت** کاربر را به **سرور مجوز** هدایت (Redirect) می‌کند.
۲. **کاربر** وارد سیستم شده و دسترسی‌های درخواستی را تایید می‌کند.
۳. **سرور مجوز** کاربر را همراه با یک `کد مجوز` (Authorization Code) به **کلاینت** بازمی‌گرداند.
۴. **کلاینت** کد مجوز و `کلید مخفی` (Client Secret) خود را در پس‌زمینه به **سرور مجوز** ارسال می‌کند.
۵. **سرور مجوز** یک `توکن دسترسی` (Access Token) برمی‌گرداند.
۶. **کلاینت** از این توکن برای درخواست داده‌ها از **سرور منابع** استفاده می‌کند.

### مثال Node.js (استفاده از passport.js برای ورود با گوگل)
```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // This callback is fired when Google returns the data
    // Use the profile data to find or create a user in your database
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// Express Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```
</div>
