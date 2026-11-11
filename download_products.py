import urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

products = [
    ("iphone-16-pro", "https://shop.greengadgets.net.au/cdn/shop/files/IPH16PRO128WHTNIB_1024x.jpg?v=1770763120"),
    ("samsung-s25-ultra", "https://a.allegroimg.com/original/2981a8/e3e340394db7a3bda8d2fdcfd27f4/Smartfon-Samsung-Galaxy-S25-Ultra-12-GB-256-GB-5G-Szary-Titanium-Gray"),
    ("xiaomi-14t-pro", "https://i02.appmifile.com/946_item_my/27/09/2024/a2ecacda81ce75e618ef3d1c74a27ed2.jpg"),
    ("iphone-15", "https://d2e6ccujb3mkqf.cloudfront.net/ad427f77-c683-4c68-91b0-a109a627ee88-1_0e7610ba-929e-4242-acbb-116930da152a.jpg"),
    ("samsung-a56", "https://applemarketstore.ru/image/cache/catalog/samsung/a56/samsung-galaxy-a56-5g-grey-1-1000x1000.jpg"),
    ("redmi-note-14", "https://abfoto.pl/environment/cache/images/productGfx_90818_800_800/Xiaomi-Redmi-Note-14-Pro-4G-8256-GB-Fioletowy---Aurora-Purple.webp"),
    ("airpods-pro", "https://www.mrfix.ua/storage/632/6e3/e52/product-product-apple-airpods-pro-2nd-generation-mqd83-14270-2000x2000.webp"),
    ("galaxy-buds", "https://media.power-cdn.net/images/h-8195af965b7a8d1ee05673503a59a5b1/products/3390830/3390830_12_1200x1200_w_g.jpg"),
    ("jbl-tune", "https://www.jbl.com.ar/on/demandware.static/-/Sites-masterCatalog_Harman/default/dwb7fcdf2a/1.JBL_Tune_770NC_Product%20Image_Hero_Black.png"),
    ("galaxy-watch", "https://flexmobile.ca/cdn/shop/files/0861768_1200x1200.jpg?v=1740781339"),
    ("xiaomi-band", "https://img.advice.co.th/images_nas/pic_product4/A0162444/A0162444OK_BIG_1.jpg"),
    ("anker-powerbank", "https://cdn.shopify.com/s/files/1/0947/1387/2685/files/anker-zolo-power-bank-20000mah-22-5w-with-built-in-usb-c-cable-black-656.png"),
    ("baseus-charger", "https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc3/61fkgu3t_gL._AC_SL1500_.jpg"),
    ("baseus-cable", None),
    ("phone-case", None),
    ("samsung-charger", "https://www.dateks.lv/images/pic/2400/2400/560/1518.jpg"),
    ("honor-400-pro", None),
    ("motorola-edge-60-pro", None),
    ("oneplus-13", "https://www.oneplusmall.ru/images/49c2723d2b3eb8538384869bb3a4e309dd6c8628bd69ae7d629d151dae16b6c6.png"),
    ("pixel-9-pro", "https://onestop.ng/storage/products/images/2025/11/21/69202c44966f9-Google-Pixel-9-Pro-XL-Porcelain-179d9bbd6-a298-434a-99ff-91830855d927.png"),
    ("ipad-pro-m4", "https://macshack.co.za/cdn/shop/files/Untitleddesign_8e96c8d5-2647-4989-85f6-8f30bcb7fe04.png?v=1750928165&width=4096"),
    ("ipad-air-m3", "https://macstation.co.in/wp-content/uploads/2024/11/1-11-1.png"),
    ("samsung-tab-s10-ultra", "https://www.universal.com.fj/cdn/shop/files/MD-SM-X920NZAEXSA_500x500.jpg?v=1760788240"),
    ("samsung-tab-s10-plus", "https://microless.com/cdn/products/5a603bf510dd2533718d1fc040933ed7-hi.jpg"),
    ("xiaomi-pad-7-pro", "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/MTA-181159311/xiaomi_xiaomi_pad_7_pro_-_snapdragon_8s_gen_3_-_layar_11-2_3-2k_144hz_dolby_vision_atmos_-_ultra-thin_-_lightweight_-__xiaomi_hyperos_-_xiaomi_hyperai_-_xiao_full12_q00zcoeq.png"),
    ("lenovo-tab-p12", "https://img-itopya.mncdn.com/cdn/1000/1-c1fbfc.png"),
    ("redmi-pad-pro", "https://xiaomistoreph.com/cdn/shop/files/Redmi-Pad-Pro_Gray_1_1024x1024.jpg?v=1774431007"),
    ("oneplus-pad-2", "https://media-ik.croma.com/Croma%20Assets/Computers%20Peripherals/Tablets%20and%20iPads/Images/308674_fiywif.png"),
    ("honor-pad-9", None),
    ("huawei-matepad-11-5", "https://images.pcel.com/600/Computadoras-Tablets-Huawei-53014KCT-556220-Gg6tq9aokr3si6Y9.jpg"),
    ("macbook-air-m3", "https://www.sathya.store/img/product/JunC8uNKpvguyZnZ.png"),
    ("macbook-pro-m4", "https://cdn.mafrservices.com/pim-content/SAU/media/product/744003/1738576803/744003_main.jpg"),
    ("asus-zenbook-14", "https://id.store.asus.com/media/catalog/product/z/e/zenbook_14_oled_ux3405ma_product_photo_3s_foggy_silver_03_1.jpg"),
    ("asus-vivobook-15", "https://www.dateks.lv/images/pic/2400/2400/215/2203.jpg"),
    ("lenovo-ideapad-slim-5", "https://s13emagst.akamaized.net/products/66404/66403887/images/res_72c4b8630da8a157fe9d728c460a5c4a.png"),
    ("lenovo-legion-5", "https://resources.claroshop.com/medios-plazavip/s2/11978/4577037/640354b950dd4-mjhhyapvoivbxofu-1600x1600.jpg?qlty=75&scale=500"),
    ("hp-pavilion-15", "https://static.ee.ge/Elite/5e720132-cc37-4df1-9e64-41641f7a8b26_Thumb.jpeg"),
    ("dell-inspiron-16", "https://i.dell.com/sites/csimages/Product_Imagery/all/notebook-inspiron-16-7620-800x550-gray.png"),
    ("acer-swift-go-14", "https://static-ecpa.acer.com/media/catalog/product/a/c/acer-swift-go-14-sfg14-42-with-fingerprint-with-backlit-on-wallpaper-start-screen-pure-silver-01-1000x1000_nx.kleaa.001.png"),
    ("surface-laptop-7", "https://www.originstorage.com/Images/Product/Default/xlarge/54a5972693829e715515f24eb9e765f30dd38043.jpg"),
    ("sony-wh1000xm5", "https://www.mascomintl.com/themes/images/mascom/Sony%20WH-1000XM5%20Black%20Mascom.webp"),
    ("bose-qc-ultra", "https://static-data2.manualslib.com/product-images/43c/3268986/bose-quietcomfort-ultra-headphones-headphone.jpg"),
    ("soundcore-q45", "https://www.sanaliletisim.com/cdn/shop/files/A3040031_NoiseCancellingHeadphones_TD01_1200x1200.jpg?v=1683272079"),
    ("sony-wf1000xm5", None),
    ("nothing-ear", "https://swiftronicsinc.com/cdn/shop/files/NothingEarWht.jpg?v=1769456264&width=823"),
    ("redmi-buds-6-pro", None),
    ("beats-studio-pro", "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQTP3?.v=SUFReFd6NEVVOW50TTcxUzVyWlhHZ2tuVHYzMERCZURia3c5SzJFOTlPZ3oveDdpQVpwS0ltY2w2UW05aU90TzVtaW9peGdOaitwV1Nxb1VublZoTVE&fmt=jpeg&hei=1144&qlt=90&wid=1144"),
    ("apple-watch-series-10", "https://images.kabum.com.br/produtos/fotos/sync_mirakl/669442/xlarge/Apple-Watch-Series-10-42-Mm-M-L-Gps-Jet-Black-Aluminum-Black-Sport-Band_1755900582.png"),
    ("apple-watch-ultra-2", "https://img.globaldata.pt/products/MREJ3PO-A.jpg"),
    ("galaxy-watch-ultra", "https://images-na.ssl-images-amazon.com/images/I/817QHxxq34L.jpg"),
    ("huawei-watch-gt5", "https://dashandy.de/media/catalog/product/cache/47c8427ea7b2f9be33e88f56df3e17e6/6/9/6942103132025_1_2.jpg"),
    ("amazfit-balance", "https://static.ollo.it/img/catalog/2048x2048/amazfit-balance-3-81-cm-1-5-amoled-46-mm-digitale-480-x-480-pixel-touch-screen-grigio-wi-fi-gps-satellitare_1601757_950255.jpg"),
    ("garmin-vivoactive-5", "https://f.fcdn.app/imgs/afdc30/www.fitpoint.pe/fitppe/706a/original/catalogo/GA010-02862-10_1457_1/2000-2000/reloj-deportivo-garmin-vivoactive-5-negro-slate.jpg"),
    ("huawei-band-9", "https://media.e.leclerc/6942103117169_1?fit=fit&fmt=pjpeg&hei=450&op_sharpen=1&qlt=85&resmode=bilin&trim=0.5&wid=450"),
    ("amazfit-gtr-mini", "https://down-tw.img.susercontent.com/file/tw-11134207-7r98t-lzr4qv5a74l096"),
    ("magsafe-powerbank", "https://www.anker-il.co.il/images/site/products/d3126d5f-8a98-4784-8c91-52f88e654630.jpg"),
    ("ugreen-3in1-charger", "https://www.tejar.pk/media/catalog/product/cache/3/image/9df78eab33525d08d6e5fb8d27136e95/u/g/ugreen_magflow_3-in-1_magnetic_wireless_charger_qi2_25w_magsafe-compatible_-_tejar.jpg"),
    ("foldable-phone-stand", "https://cdn.sanwadirect.jp/images/goods/200-STN036_FT2DX.JPG"),
    ("privacy-screen-protector", None),
    ("beaded-phone-strap", None),
]

output = Path("public/products")
output.mkdir(parents=True, exist_ok=True)

def download(item):
    index, (slug, url) = item

    if not url:
        return index, slug, False, "لینک هنوز پیدا نشده"

    try:
        request = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0"}
        )

        with urllib.request.urlopen(request, timeout=35) as response:
            content_type = response.headers.get("Content-Type", "").lower()
            data = response.read()

        if not content_type.startswith("image/"):
            raise ValueError(f"پاسخ تصویر نیست: {content_type}")

        if data.startswith(b"\xff\xd8\xff"):
            ext = ".jpg"
        elif data.startswith(b"\x89PNG\r\n\x1a\n"):
            ext = ".png"
        elif data.startswith(b"RIFF") and data[8:12] == b"WEBP":
            ext = ".webp"
        elif data.startswith(b"GIF8"):
            ext = ".gif"
        else:
            raise ValueError("فرمت تصویر قابل تشخیص نیست")

        path = output / f"{slug}{ext}"
        path.write_bytes(data)

        return index, slug, True, path.name

    except Exception as error:
        return index, slug, False, str(error)

success = 0
failed = 0

print(f"شروع دانلود {len(products)} محصول از 60 محصول\n", flush=True)

with ThreadPoolExecutor(max_workers=5) as executor:
    futures = [
        executor.submit(download, (i, product))
        for i, product in enumerate(products, start=1)
    ]

    results = [future.result() for future in as_completed(futures)]

for index, slug, ok, result in sorted(results):
    if ok:
        success += 1
        print(f"{index}/60 دانلود شد: {result}", flush=True)
    else:
        failed += 1
        print(f"{index}/60 ناموفق: {slug} | {result}", flush=True)

missing = [i for i, (slug, url) in enumerate(products, start=1) if not url]

print("\n------------------------------")
print(f"موفق: {success}")
print(f"ناموفق: {failed}")
print(f"لینک پیدا نشده: {len(missing)}")
print(f"شماره محصولات بدون لینک: {missing}")
print("------------------------------")
