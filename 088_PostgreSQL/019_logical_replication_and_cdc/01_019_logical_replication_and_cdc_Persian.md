<div dir="rtl">

[← فهرست و مسیر یادگیری](../README.md) | [English Version](01_019_logical_replication_and_cdc_English.md)

# 019 — رپلیکیشن منطقی و دریافت تغییرات داده (CDC)

## هدف یادگیری
تسلط بر رپلیکیشن منطقی (Logical Replication) در سطح جداول و مکانیزم دریافت تغییرات داده (Change Data Capture)؛ پیکربندی ناشر (Publisher) و مشترک (Subscriber)، درک مفهوم `REPLICA IDENTITY`، پیاده‌سازی الگوی Transactional Outbox با دبیزیوم (Debezium) و کافکا، و شناخت تفاوت‌های آن با رپلیکیشن فیزیکی.

---

## ۱. مقایسه رپلیکیشن منطقی با رپلیکیشن فیزیکی

| ویژگی | رپلیکیشن فیزیکی جریانی | رپلیکیشن منطقی |
| :--- | :--- | :--- |
| **دقت دسته‌بندی** | کل کلاستر (همه دیتابیس‌ها و کاتالوگ‌های سیستم). | **تک‌تک جداول** یا اسکیماهای دلخواه. |
| **نسخه‌های ناهمسان** | نسخه‌های اصلی و معماری سرورها باید ۱۰۰٪ یکسان باشند. | **پشتیبانی از نسخه‌های مختلف** (مثلاً انتقال از نسخه ۱۴ به ۱۶). |
| **قابلیت نوشتن روی مقصد** | سرور مقصد ۱۰۰٪ فقط‌خواندنی (Read-Only) است. | **سرور مقصد قابلیت خواندن و نوشتن دارد** (امکان ساخت ایندکس‌های اختصاصی). |
| **تغییرات اسکیما (DDL)** | دستورات ساختار جدول خودکار کپی می‌شوند. | **دستورات DDL کپی نمی‌شوند** و اسکیما باید از قبل روی مقصد ساخته شود. |
| **دنباله‌ها (Sequences)** | خودکار منتقل می‌شوند. | دنباله‌ها کپی نمی‌شوند. |

---

## ۲. راه‌اندازی مدل ناشر و مشترک (Pub/Sub)

```text
+------------------------------+                     +------------------------------+
|        سرور ناشر PUBLISHER   |                     |      سرور مشترک SUBSCRIBER   |
|                              |                     |                              |
| CREATE PUBLICATION pub_orders| ─── SQL Row Delta ─>| CREATE SUBSCRIPTION sub_ord  |
| FOR TABLE store.orders       |     (INSERT/UPDATE) | CONNECTION '...'             |
+------------------------------+                     +------------------------------+
```

### گام اول: تنظیمات سرور ناشر (Publisher)
```ini
# postgresql.conf
wal_level = logical
max_replication_slots = 10
```

ایجاد انتشار روی جداول منتخب:
```sql
CREATE PUBLICATION pub_store_orders 
FOR TABLE store.orders, store.order_items;

-- Or publish all tables in the entire database:
-- CREATE PUBLICATION pub_all FOR ALL TABLES;
```

### گام دوم: تنظیمات سرور مشترک (Subscriber)
```sql
-- Ensure matching schema already exists on subscriber!
CREATE SUBSCRIPTION sub_store_orders
CONNECTION 'host=publisher.example.internal port=5432 dbname=engineering_db user=replicator password=secret'
PUBLICATION pub_store_orders
WITH (copy_data = true);
```
*(گزینه `copy_data = true` ابتدا یک تصویر کلی از داده‌های فعلی می‌گیرد و سپس همگام‌سازی لحظه‌ای را آغاز می‌کند).*

---

## ۳. الزام تعیین هویت سطر با `REPLICA IDENTITY`

هنگامی که دستوری نظیر `UPDATE` یا `DELETE` روی ناشر اجرا می‌شود، دیتابیس مقصد باید بداند کدام سطر را ویرایش کند:

```sql
-- Default: Uses the Primary Key of the table
ALTER TABLE store.orders REPLICA IDENTITY DEFAULT;

-- Tables lacking a Primary Key require REPLICA IDENTITY FULL:
-- تمام فیلدهای قبلی سطر در لاگ نوشته می‌شود
-- هشدار: در جداول پرنوشتن باعث افزایش شدید حجم لاگ WAL می‌شود!
ALTER TABLE store.legacy_logs REPLICA IDENTITY FULL;
```

---

## ۴. دریافت تغییرات داده (CDC) و الگوی Transactional Outbox

با استفاده از پلاگین‌های دیکودینگ منطقی (`pgoutput`, `wal2json`) می‌توان جریان رویدادهای پایگاه‌داده را بدون نیاز به لاجیک‌های پیچیده مستقیماً به Apache Kafka هدایت کرد:

```text
برنامه ──[ تراکنش واحد ]──> ثبت داده‌های سفارش + ثبت در جدول Outbox
                                            │
                                            v
                                      فایل لاگ pg_wal
                                            │
                                            v
                               Debezium CDC (Logical Decoding)
                                            │
                                            v
                                  تاپیک آپاچی کافکا (Kafka)
```

این ساختار الگوی **Transactional Outbox** را تضمین می‌کند: رویداد به کافکا ارسال می‌شود اگر و فقط اگر تراکنش دیتابیس با موفقیت کامیت شده باشد؛ بنابراین باگ ناهماهنگی بین دیتابیس و بروکر پیام (Dual-write problem) کاملاً ریشه‌کن می‌شود!

---

## ۵. تمرین سناریومحور و پاسخ

**صورت تمرین:**  
روی سرور ناشر ستون جدیدی اضافه می‌کنید: `ALTER TABLE store.orders ADD COLUMN priority VARCHAR(20);`. چند لحظه بعد یک سطر جدید با این ستون درج می‌شود، اما همگام‌سازی بلافاصله متوقف شده و جدول `pg_stat_subscription` روی سرور مقصد خطا می‌دهد. چه اتفاقی افتاده و چگونه رفع می‌شود؟

**پاسخ:**  
رپلیکیشن منطقی دستورات تغییر ساختار (DDL) را منتقل نمی‌کند. وقتی دیتابیس تلاش کرد سطری حاوی ستون `priority` را به مقصد بفرستد، سرور مقصد به دلیل عدم وجود این ستون کار را متوقف کرد.  
*راه‌حل:* اعمال دستی همان تغییر ساختار روی سرور مقصد:  
`ALTER TABLE store.orders ADD COLUMN priority VARCHAR(20);`  
به محض اضافه شدن ستون به جدول مقصد، پروسس رپلیکیشن به صورت خودکار بدون از دست رفتن هیچ داده‌ای ادامه پیدا می‌کند.

---

## منابع رسمی
- [مستندات PostgreSQL: فصل ۳۱ - رپلیکیشن منطقی (Logical Replication)](https://www.postgresql.org/docs/current/logical-replication.html)
- [مستندات PostgreSQL: معماری و پلاگین‌های Logical Decoding](https://www.postgresql.org/docs/current/logicaldecoding.html)

</div>

