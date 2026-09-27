<div dir="rtl">

# اصول طراحی RESTful API

## چیست؟
REST (Representational State Transfer) یک سبک معماری برای طراحی برنامه‌های شبکه‌ای است. این معماری بر یک پروتکل ارتباطی کلاینت-سرور و بدون حالت (stateless) متکی است، که تقریباً همیشه HTTP است. APIهای RESTful از متدهای HTTP (مانند GET, POST, PUT, DELETE, PATCH) برای انجام عملیات CRUD روی منابعی که با آدرس‌ها (URL) شناسایی می‌شوند، استفاده می‌کنند.

## تاریخچه و منشأ
معماری REST توسط روی فیلدینگ (Roy Fielding) در رساله دکترای او در سال ۲۰۰۰ معرفی شد. او یکی از نویسندگان اصلی مشخصات HTTP بود و REST برای استفاده از ویژگی‌های موجود وب طراحی شد.

## چه مشکلاتی را حل می‌کند؟
- **استانداردسازی**: یک رابط یکپارچه و رفتار قابل پیش‌بینی در سراسر وب‌سرویس‌های مختلف ارائه می‌دهد.
- **مقیاس‌پذیری**: بدون حالت بودن (Statelessness) به این معنی است که سرورها نیازی به نگهداری اطلاعات نشست (session) ندارند، که به آن‌ها اجازه می‌دهد به راحتی مقیاس‌پذیر باشند.
- **جداسازی دغدغه‌ها**: کلاینت (فرانت‌اند) را از سرور (بک‌اند) جدا می‌کند و به آن‌ها اجازه می‌دهد به طور مستقل توسعه یابند.

## چه زمانی و کجا از آن استفاده کنیم؟
از REST برای ساخت وب APIهایی استفاده کنید که باید توسط کلاینت‌های مختلف (برنامه‌های وب، برنامه‌های موبایل، سرویس‌های شخص ثالث) مصرف شوند. این معماری استاندارد اصلی برای APIهای عمومی مبتنی بر HTTP است.

## مثال‌ها

### طراحی خوب در مقابل بد برای URL
```text
// BAD
GET /getUser?id=123
POST /createUser
POST /updateUser/123

// GOOD (RESTful)
GET /users/123
POST /users
PUT /users/123
DELETE /users/123
```

### مثال با Express.js
```javascript
const express = require('express');
const app = express();
app.use(express.json());

const users = [];

// Get all users
app.get('/users', (req, res) => {
    res.json(users);
});

// Create a new user
app.post('/users', (req, res) => {
    const newUser = { id: Date.now(), ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Get user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});
```
</div>
