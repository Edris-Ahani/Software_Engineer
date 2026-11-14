<div dir="rtl">

[English version](009_collections_unicode_English.md)

# ۰۰۹ ـ Collection، String و Unicode

[فهرست](../README_Persian.md) · [قبلی](008_models_patterns_Persian.md) · [بعدی](010_errors_Persian.md)

ساختار داده را از روی الگوی دسترسی انتخاب کن، نه عادت. مثال شمارش کلمات از `entry` استفاده می‌کند تا «پیداکردن یا ساختن مقدار اولیه» یک مسیر روشن داشته باشد.

| نوع | کاربرد | هزینهٔ معمول |
| --- | --- | --- |
| `Vec<T>` | دنبالهٔ پیوسته، پیمایش و index | index برابر O(1)، push سرشکن O(1)، حذف وسط O(n) |
| `VecDeque<T>` | صف دوطرفه | افزودن/برداشتن دو سر معمولاً O(1) سرشکن |
| `HashMap<K,V>` | lookup بدون ترتیب پایدار | میانگین مورد انتظار O(1)، وابسته به hash و داده |
| `BTreeMap<K,V>` | نگاشت مرتب و range query | lookup و درج O(log n) |
| `HashSet<T>` | یکتایی و عضویت | میانگین مورد انتظار O(1) |
| `BinaryHeap<T>` | صف اولویت max-heap | peek برابر O(1)، pop برابر O(log n) |

```rust
use std::collections::HashMap;
let mut counts = HashMap::new();
for word in "rust rust api".split_whitespace() {
    *counts.entry(word).or_insert(0_u32) += 1;
}
assert_eq!(counts.get("rust"), Some(&2));
```

در [مثال ۰۰۷](../examples/src/bin/007_collections.rs)، خروجی HashMap به BTreeMap تبدیل می‌شود تا نمایش مرتب باشد. ترتیب iteration روی HashMap قرارداد قابل اتکا برای snapshot یا API نیست. referenceهای map ممکن است با تغییر map محدود شوند؛ borrow را پیش از mutation تمام کن.

## متن: byte، scalar value و grapheme

`String` مالک متن UTF-8 است؛ `&str` یک view معتبر UTF-8. `len()` تعداد byteها را می‌دهد. `chars().count()` تعداد Unicode scalar valueها را می‌دهد؛ تعداد کاراکتر دیداری یا grapheme الزاماً همین نیست. یک حرف همراه علامت ترکیبی می‌تواند دو scalar value باشد.

```rust
let text = "caf\u{e9}";
assert_eq!(text.len(), 5);
assert_eq!(text.chars().count(), 4);
assert_eq!(text.get(3..4), None);
assert_eq!(text.get(3..), Some("\u{e9}"));
```

index مستقیم `text[0]` وجود ندارد؛ معلوم نیست منظور byte است یا حرف. slice با مرز نامعتبر UTF-8 panic می‌دهد؛ `get(range)` گزینهٔ امن‌تری است. برای grapheme segmentation و normalization کامل باید از ابزار تخصصی مثل [unicode-segmentation](https://docs.rs/unicode-segmentation/) و [unicode-normalization](https://docs.rs/unicode-normalization/) با بررسی نسخه و نیاز واقعی استفاده کرد.

در متن فارسی، شکل‌های متفاوت حروف، نیم‌فاصله و اعراب مسئلهٔ جست‌وجو و برابری را پیچیده می‌کنند. `to_ascii_lowercase` فقط حروف ASCII را تغییر می‌دهد؛ case folding یا normalization عمومی Unicode نیست. پروژهٔ جست‌وجوی این دوره این محدودیت را در نام flag اعلام می‌کند.

```bat
cmd /c cargo run -p rust-lessons --bin 007_collections
cmd /c cargo run -p rust-lessons --bin 008_strings
```

خروجی مثال دوم با `Bytes: 5, scalar values: 4` شروع می‌شود. برای مسیر فایل سیستم از `Path`/`PathBuf` و برای رشتهٔ سیستم‌عامل از `OsStr`/`OsString` استفاده کن؛ همهٔ مسیرها الزاماً UTF-8 نیستند.

**تمرین:** word count را با خروجی مرتب بساز. برای یک رشته شامل علامت ترکیبی، تعداد byte و scalar value را پیش‌بینی کن. تعریف «تعداد حرف» را در نیاز محصول خودت روشن کن.

منبع: [Collections](https://doc.rust-lang.org/std/collections/)، [String](https://doc.rust-lang.org/std/string/struct.String.html).

</div>
