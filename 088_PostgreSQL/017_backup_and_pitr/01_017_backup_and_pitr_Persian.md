<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_017_backup_and_pitr_English.md)

# 017 — استراتژی‌های پشتیبان‌گیری، pg_dump و بازیابی نقطه‌ای (PITR)

## هدف یادگیری
طراحی معماری مقاومت در برابر فاجعه (Disaster Recovery)؛ درک تفاوت پشتیبان‌گیری منطقی (`pg_dump`) و فیزیکی (`pg_basebackup`)، راه‌اندازی آرشیو مداوم WAL و اجرای فرآیند شگفت‌انگیز Point-In-Time Recovery (PITR) جهت بازگرداندن سیستم به یک ثانیه قبل از بروز خطای انسانی.

---

## ۱. تفاوت بک‌آپ‌های منطقی در برابر فیزیکی

| معیار | بک‌آپ منطقی (`pg_dump`) | بک‌آپ فیزیکی (`pg_basebackup`) |
| :--- | :--- | :--- |
| **روش کار** | صدور دستورات متنی SQL جهت درج و ساخت ساختارها. | کپی بایت‌به‌بایت صفحات داده از دایرکتوری فیزیکی دیسک ($PGDATA). |
| **سرعت و مقیاس‌پذیری** | در حجم‌های بالای ۵۰۰ گیگابایت کند است؛ بازگردانی مستلزم ساخت مجدد تمام ایندکس‌هاست. | **بسیار پرسرعت.** بازگردانی صرفاً انتقال فایل است و نیاز به بازسازی ایندکس ندارد. |
| **پشتیبانی از PITR** | خیر. فقط وضعیت لحظه اجرای دستور را برمی‌گرداند. | **بله.** پایه اصلی اجرای بازیابی نقطه‌ای در هر ثانیه دلخواه است. |
| **انعطاف در انتخاب جدول** | امکان انتخاب تک‌جدول، اسکیما یا دیتابیس خاص. | کل کلاستر و تمام دیتابیس‌ها را به‌صورت یکجا برمی‌دارد. |

---

## ۲. پشتیبان‌گیری منطقی پرسرعت با `pg_dump`

همواره از فرمت دایرکتوری (`-Fd`) یا باینری کاستوم (`-Fc`) استفاده کنید تا امکان بازگردانی موازی (Multi-core Restore) فراهم باشد:

```bash
# Export using directory format with 4 parallel worker threads and compression
pg_dump -h localhost -p 5432 -U postgres -d engineering_db \
        -Fd -j 4 -Z 6 -f /backups/engineering_db_20260515.dump

# Parallel restore with 4 workers:
pg_restore -h localhost -p 5432 -U postgres -d engineering_db_restored \
           -j 4 -Fd /backups/engineering_db_20260515.dump
```

---

## ۳. بک‌آپ فیزیکی اولیه با `pg_basebackup`

```bash
# Stream physical base backup with checkpoint, progress bar, and compression
pg_basebackup -h 10.0.1.10 -p 5432 -U replicator \
              -D /backups/base_20260515 \
              -Ft -z -P -X stream
```

---

## ۴. معماری بازیابی تا نقطه زمانی دلخواه (PITR)

سیستم PITR از ترکیب یک بک‌آپ فیزیکی پایه با **آرشیو مداوم سگمنت‌های WAL** به دست می‌آید:

```text
خط زمانی پیوسته دیتابیس:
|----------------------- بک‌آپ فیزیکی پایه (یکشنبه ساعت ۰۰:۰۰)
    |==== ارسال پیوسته فایل‌های لاگ WAL به فضای ذخیره‌سازی ابری S3 =====|
                                                                         * (سه‌شنبه ۱۴:۱۵: دستور اشتباهی DROP TABLE!)
هدف بازیابی: بازگردانی بک‌آپ پایه -> بازپخش لاگ‌های WAL -> توقف در سه‌شنبه ساعت ۱۴:۱۴:۵۹!
```

### تنظیمات سرور جهت آرشیو مداوم (`postgresql.conf`):
```ini
wal_level = replica
archive_mode = on
archive_command = 'test ! -f /mnt/wal_archive/%f && cp %p /mnt/wal_archive/%f'
```

### مراحل اجرای بازیابی در نقطه زمانی دلخواه:
۱. توقف سرویس PostgreSQL و جایگزینی فایل‌های `$PGDATA` با محتوای بک‌آپ پایه.
۲. پاک کردن فایل‌های موقت `$PGDATA/pg_wal/`.
۳. ساخت فایل نشانگر ریکاوری:  
   `touch $PGDATA/recovery.signal`
۴. افزودن تنظیمات بازپخش در `postgresql.conf`:
   ```ini
   restore_command = 'cp /mnt/wal_archive/%f %p'
   recovery_target_time = '2026-05-15 14:14:59 UTC'
   recovery_target_action = 'promote'
   ```
۵. روشن کردن سرویس دیتابیس. موتور دیتابیس بک‌آپ پایه را بارگذاری کرده، لاگ‌ها را یکی‌یکی از آرشیو می‌خواند و دقیقاً در یک ثانیه قبل از حادثه متوقف شده و سیستم را به دیتابیس عملیاتی تبدیل می‌کند!

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
کاربری تصادفاً در ساعت `10:35:20` دستور `DROP TABLE store.users;` را اجرا کرده است. شما بک‌آپ دیشب و آرشیو کامل WAL را دارید. اگر هدف ریکاوری را روی `recovery_target_time = '10:35:00'` قرار دهید، آیا جدول برمی‌گردد و اگر پارامتر `recovery_target_action` تنظیم نشده باشد چه می‌شود؟

**پاسخ:**  
بله؛ جدول و تمامی اطلاعات آن کاملاً سالم بازیابی می‌شوند زیرا بازپخش لاگ‌ها در ساعت `10:35:00` (۲۰ ثانیه قبل از حذف جدول) متوقف می‌شود.  
اگر پارامتر `recovery_target_action` مشخص نشود، رفتار پیش‌فرض PostgreSQL در حالت `pause` قرار می‌گیرد. در این حالت دیتابیس در وضعیت Read-Only بالا می‌آید تا ادمین بتواند با `psql` درستی داده‌ها را تایید کند و سپس با دستور `SELECT pg_wal_replay_resume();` دیتابیس را به وضعیت Read-Write هدایت نماید.

---

## منابع رسمی
- [مستندات PostgreSQL: فصل ۲۶ - پشتیبان‌گیری و بازیابی](https://www.postgresql.org/docs/current/backup.html)
- [مستندات PostgreSQL: آرشیو مداوم و بازیابی در نقطه زمانی (PITR)](https://www.postgresql.org/docs/current/continuous-archiving.html)

</div>

