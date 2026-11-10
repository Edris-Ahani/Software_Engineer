<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_018_streaming_replication_English.md)

# 018 — رپلیکیشن فیزیکی جریانی (Streaming Replication)

## هدف یادگیری
آشنایی کامل با رپلیکیشن فیزیکی و جریانی در PostgreSQL؛ پیکربندی کلاستر Primary و Replicaهای Standby، درک تفاوت سناریوهای سنکرون و آسنکرون، پیشگیری از پر شدن دیسک توسط Replication Slots با `max_slot_wal_keep_size` و پایش تأخیر رپلیکیشن (Replication Lag).

---

## ۱. معماری رپلیکیشن فیزیکی جریانی

رپلیکیشن فیزیکی رکوردهای خام باینری WAL را از طریق سوکت TCP از سرور اصلی (Primary) به سرورهای فقط‌خواندنی (Standby) ارسال می‌کند:

```text
+-----------------------+                         +-----------------------+
|    سرور اصلی PRIMARY  |                         |    سرور STANDBY       |
| (خواندن و نوشتن)      |                         | (فقط خواندنی)         |
|                       |                         |                       |
|   اتصالات کلاینت      |                         |   کوئری‌های خواندن     |
|          │            |                         |          │            |
|          v            |                         |          v            |
|      pg_wal           |                         |   پردازش Startup      |
|          │            |                         |   (بازپخش بایت‌های WAL)|
|          v            |                         |          ^            |
|   پردازش walsender    | ─── TCP Stream (WAL) ──>|   پردازش walreceiver  |
+-----------------------+                         +-----------------------+
```

---

## ۲. مراحل راه‌اندازی رپلیکیشن

### گام اول: تنظیمات سرور Primary (`postgresql.conf` و `pg_hba.conf`)
```ini
# postgresql.conf
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10
hot_standby = on
```

مجوز دسترسی کاربر رپلیکیشن در `pg_hba.conf`:
```text
host    replication     replicator      10.0.1.0/24     scram-sha-256
```

ساخت اسلات رپلیکیشن پایدار:
```sql
SELECT pg_create_physical_replication_slot('standby_node_1');
```

### گام دوم: ساخت سرور Standby
اجرای دستور `pg_basebackup` روی سرور ثانویه:

```bash
pg_basebackup -h 10.0.1.10 -p 5432 -U replicator \
              -D /var/lib/postgresql/data -Fp -Xs -R \
              --slot=standby_node_1
```
*(فلگ `-R` به صورت خودکار فایل نشانگر `standby.signal` و تنظیمات اتصال را می‌سازد).*

---

## ۳. مقایسه رپلیکیشن آسنکرون در برابر سنکرون

```ini
# Asynchronous (Default):
# سرور اصلی بلافاصله پس از نوشتن لاگ محلی پاسخ موفقیت تراکنش را برمی‌گرداند.
# حداکثر کارایی؛ اما در صورت سوختن سرور اصلی، امکان جا ماندن چند میلی‌ثانیه داده وجود دارد.

# Synchronous Replication:
synchronous_standby_names = 'FIRST 1 (standby_node_1, standby_node_2)'
synchronous_commit = on
```

### سطوح مختلف `synchronous_commit` در حالت سنکرون:
- **`remote_write`**: سرور اصلی منتظر می‌ماند تا لاگ به بافر حافظه سیستم‌عامل Standby برسد.
- **`on` (استاندارد)**: سرور اصلی منتظر می‌ماند تا Standby لاگ را با `fsync` روی دیسک بنویسد.
- **`remote_apply`**: سرور اصلی منتظر می‌ماند تا پروسس Startup سرور Standby داده‌ها را دقیقاً در صفحات جدول اعمال کند (تضمین رویت آنی تغییرات روی سرورهای کپی).

---

## ۴. خطر بزرگ و مرگبار Replication Slots

اسلات رپلیکیشن تضمین می‌کند که سرور اصلی تا زمان اطمینان از دریافت سگمنت‌های لاگ توسط سرور Standby، **هیچ فایلی را از پوشه `pg_wal` پاک نکند**.

> **هشدار پروداکشن:**  
> اگر سرور Standby به مدت چند روز خاموش شود یا شبکه قطع گردد، سرور Primary تمام لاگ‌های تولیدشده را در دیسک انباشته می‌کند تا جایی که **دیسک ۱۰۰٪ پر شده و کل پایگاه‌داده متوقف می‌شود!**

### گاردریل محافظتی در `postgresql.conf`:
```ini
# سقف حداکثر حجم نگهداری لاگ برای اسلات‌های غیرفعال
max_slot_wal_keep_size = 64GB
```
اگر تأخیر سرور ثانویه از ۶۴ گیگابایت گذشت، اسلات باطل می‌شود تا دیسک پر نشود و سرویس اصلی سرپا بماند.

---

## ۵. مانیتورینگ دقیق لگ رپلیکیشن (Replication Lag)

```sql
-- Run on Primary:
SELECT 
    client_addr, 
    application_name, 
    state, 
    sync_state, 
    pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn) AS bytes_pending_send,
    pg_wal_lsn_diff(sent_lsn, write_lsn) AS bytes_pending_write,
    pg_wal_lsn_diff(write_lsn, flush_lsn) AS bytes_pending_flush,
    pg_wal_lsn_diff(flush_lsn, replay_lsn) AS bytes_pending_replay
FROM pg_stat_replication;
```

---

## ۶. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
در یک فروشگاه اینترنتی، کوئری‌های خواندن به سرور Replica هدایت می‌شوند. کاربر آدرس خود را تغییر می‌دهد اما پس از رفرش صفحه داشبورد، هنوز آدرس قدیمی خود را می‌بیند. دو ثانیه بعد آدرس اصلاح می‌شود. چه اتفاقی رخ داده و راه حل چیست؟

**پاسخ:**  
پدیده **Replication Lag (تأخیر رپلیکیشن)** در حالت آسنکرون. کوئری نوشتن روی سرور اصلی ذخیره شده اما هنوز لاگ آن به سرور ثانویه نرسیده یا بازپخش نشده است.  
*راهکارها:*
۱. تنظیم `synchronous_commit = remote_apply` در تراکنش تغییر آدرس.
۲. یا هدایت ترافیک خواندن کاربر به سرور اصلی به مدت چند ثانیه پس از هر عملیات ویرایش (Read-Your-Writes Pattern).

---

## منابع رسمی
- [مستندات PostgreSQL: فصل ۲۷ - دسترسی‌پذیری بالا و رپلیکیشن](https://www.postgresql.org/docs/current/high-availability.html)
- [مستندات PostgreSQL: پروتکل ارتباطی Streaming Replication](https://www.postgresql.org/docs/current/protocol-replication.html)

</div>

