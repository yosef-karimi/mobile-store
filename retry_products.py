import urllib.request
import urllib.error
import time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

OUTPUT = Path("public/products")
OUTPUT.mkdir(parents=True, exist_ok=True)

products = [
    (10, "galaxy-watch", "https://flexmobile.ca/cdn/shop/files/0861768_1200x1200.jpg?v=1740781339"),
    (11, "xiaomi-band", "https://img.advice.co.th/images_nas/pic_product4/A0162444/A0162444OK_BIG_1.jpg"),
    (12, "anker-powerbank", "https://cdn.shopify.com/s/files/1/0947/1387/2685/files/anker-zolo-power-bank-20000mah-22-5w-with-built-in-usb-c-cable-black-656.png"),
    (16, "samsung-charger", "https://www.dateks.lv/images/pic/2400/2400/560/1518.jpg"),
    (20, "pixel-9-pro", "https://onestop.ng/storage/products/images/2025/11/21/69202c44966f9-Google-Pixel-9-Pro-XL-Porcelain-179d9bbd6-a298-434a-99ff-91830855d927.png"),
    (21, "ipad-pro-m4", "https://macshack.co.za/cdn/shop/files/Untitleddesign_8e96c8d5-2647-4989-85f6-8f30bcb7fe04.png?v=1750928165&width=4096"),
    (24, "samsung-tab-s10-plus", "https://microless.com/cdn/products/5a603bf510dd2533718d1fc040933ed7-hi.jpg"),
    (26, "lenovo-tab-p12", "https://img-itopya.mncdn.com/cdn/1000/1-c1fbfc.png"),
    (45, "nothing-ear", "https://cdn.shopify.com/s/files/1/0585/1172/0640/files/0000s_0023_Ear-white.png?v=1753686149"),
    (46, "redmi-buds-6-pro", "https://i02.appmifile.com/mi-com-product/fly-birds/redmi-buds-6-pro/pc/7396af1adad02487accf9fb900d1ab77.png"),
    (17, "honor-400-pro", "https://www-file.honor.com/content/dam/honor/global/events/2025/honor-400-pro/p.png"),
    (29, "honor-pad-9", "https://www-file.honor.com/content/dam/honor/global/products/tablets/honor-pad-9/imgs/section1/kv.jpg"),
]

# اگر فایل قبلاً با هر پسوندی وجود داشته باشد، دانلود نمی‌شود.
def existing_file(slug):
    matches = list(OUTPUT.glob(slug + ".*"))
    return matches[0] if matches else None

def detect_image(data):
    if data.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png"
    if data.startswith(b"RIFF") and data[8:12] == b"WEBP":
        return ".webp"
    if data.startswith((b"GIF87a", b"GIF89a")):
        return ".gif"
    return None

def download(item):
    index, slug, url = item

    old = existing_file(slug)
    if old:
        return index, slug, "SKIP", old.name

    last_error = "خطای نامشخص"

    for attempt in range(1, 5):
        try:
            request = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
                    "Referer": url.split("/")[0] + "//" + url.split("/")[2] + "/"
                }
            )

            with urllib.request.urlopen(request, timeout=50) as response:
                data = response.read()

            ext = detect_image(data)

            if not ext or len(data) < 3000:
                raise ValueError("فایل تصویر معتبر نیست")

            path = OUTPUT / f"{slug}{ext}"
            temp = OUTPUT / f"{slug}.part"

            temp.write_bytes(data)
            temp.replace(path)

            return index, slug, "OK", path.name

        except Exception as error:
            last_error = str(error)
            if attempt < 4:
                time.sleep(attempt * 3)

    return index, slug, "FAIL", last_error

results = []

print("شروع تلاش مجدد برای تصاویر...\n", flush=True)

with ThreadPoolExecutor(max_workers=2) as executor:
    futures = [executor.submit(download, item) for item in products]

    for future in as_completed(futures):
        result = future.result()
        results.append(result)

for index, slug, status, detail in sorted(results):
    if status == "OK":
        print(f"{index}/60 دانلود شد: {detail}", flush=True)
    elif status == "SKIP":
        print(f"{index}/60 قبلاً دانلود شده: {detail}", flush=True)
    else:
        print(f"{index}/60 ناموفق: {slug} | {detail}", flush=True)

success = sum(1 for r in results if r[2] == "OK")
skipped = sum(1 for r in results if r[2] == "SKIP")
failed = sum(1 for r in results if r[2] == "FAIL")

print("\n------------------------------")
print(f"دانلود جدید موفق: {success}")
print(f"قبلاً دانلود شده: {skipped}")
print(f"ناموفق: {failed}")
print("------------------------------")

print("\nمحصولاتی که هنوز لینک مستقیم ندارند:")
print("15 - قاب گوشی")
print("18 - Motorola Edge 60 Pro")
print("59 - Privacy Screen Protector")
print("60 - Beaded Phone Strap")
