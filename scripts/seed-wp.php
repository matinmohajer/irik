<?php
/**
 * Seeds a WordPress + WooCommerce install with content matching
 * src/lib/mock-data.ts, so switching the Next.js app from mock data to the
 * real backend is a 1:1 visual match. Idempotent — safe to re-run.
 *
 * Run from the WordPress install directory (needs WP-CLI and an active
 * WooCommerce installation with the native Product Brands taxonomy):
 *   wp eval-file /path/to/irik/scripts/seed-wp.php
 */

// ============ Product categories (mirrors CATEGORIES in mock-data.ts) ============
$categories = [
    ['slug' => 'laptop', 'name' => 'لپ‌تاپ', 'parent' => null],
    ['slug' => 'desktop', 'name' => 'کامپیوتر', 'parent' => null],
    ['slug' => 'console', 'name' => 'کنسول بازی', 'parent' => null],
    ['slug' => 'monitor', 'name' => 'مانیتور', 'parent' => null],
    ['slug' => 'parts', 'name' => 'قطعات سخت‌افزار', 'parent' => null],
    ['slug' => 'storage', 'name' => 'ذخیره‌سازی', 'parent' => null],
    ['slug' => 'accessories', 'name' => 'لوازم جانبی گیمینگ', 'parent' => null],
    ['slug' => 'network', 'name' => 'شبکه و اینترنت', 'parent' => null],

    ['slug' => 'laptop-gaming', 'name' => 'لپ‌تاپ گیمینگ', 'parent' => 'laptop'],
    ['slug' => 'laptop-office', 'name' => 'لپ‌تاپ اداری و دانشجویی', 'parent' => 'laptop'],
    ['slug' => 'laptop-ultrabook', 'name' => 'لپ‌تاپ فوق‌سبک', 'parent' => 'laptop'],
    ['slug' => 'laptop-apple', 'name' => 'مک‌بوک اپل', 'parent' => 'laptop'],

    ['slug' => 'desktop-prebuilt', 'name' => 'کامپیوتر آماده', 'parent' => 'desktop'],
    ['slug' => 'desktop-custom', 'name' => 'اسمبل اختصاصی گیمینگ', 'parent' => 'desktop'],
    ['slug' => 'desktop-mini', 'name' => 'مینی پی‌سی', 'parent' => 'desktop'],

    ['slug' => 'console-playstation', 'name' => 'PlayStation', 'parent' => 'console'],
    ['slug' => 'console-xbox', 'name' => 'Xbox', 'parent' => 'console'],
    ['slug' => 'console-nintendo', 'name' => 'Nintendo Switch', 'parent' => 'console'],
    ['slug' => 'console-games', 'name' => 'بازی و لوازم جانبی کنسول', 'parent' => 'console'],

    ['slug' => 'monitor-gaming', 'name' => 'مانیتور گیمینگ', 'parent' => 'monitor'],
    ['slug' => 'monitor-office', 'name' => 'مانیتور اداری', 'parent' => 'monitor'],
    ['slug' => 'monitor-design', 'name' => 'مانیتور طراحی و گرافیک', 'parent' => 'monitor'],

    ['slug' => 'parts-cpu', 'name' => 'پردازنده (CPU)', 'parent' => 'parts'],
    ['slug' => 'parts-gpu', 'name' => 'کارت گرافیک (GPU)', 'parent' => 'parts'],
    ['slug' => 'parts-ram', 'name' => 'رم (RAM)', 'parent' => 'parts'],
    ['slug' => 'parts-motherboard', 'name' => 'مادربرد', 'parent' => 'parts'],
    ['slug' => 'parts-psu-case', 'name' => 'پاور و کیس', 'parent' => 'parts'],

    ['slug' => 'storage-ssd', 'name' => 'هارد SSD اینترنال', 'parent' => 'storage'],
    ['slug' => 'storage-hdd-external', 'name' => 'هارد اکسترنال', 'parent' => 'storage'],
    ['slug' => 'storage-flash', 'name' => 'فلش مموری', 'parent' => 'storage'],
    ['slug' => 'storage-memory-card', 'name' => 'کارت حافظه', 'parent' => 'storage'],

    ['slug' => 'accessories-headset', 'name' => 'هدست گیمینگ', 'parent' => 'accessories'],
    ['slug' => 'accessories-mouse-keyboard', 'name' => 'ماوس و کیبورد', 'parent' => 'accessories'],
    ['slug' => 'accessories-chair', 'name' => 'صندلی گیمینگ', 'parent' => 'accessories'],
    ['slug' => 'accessories-controller', 'name' => 'دسته بازی', 'parent' => 'accessories'],

    ['slug' => 'network-router', 'name' => 'روتر و مودم', 'parent' => 'network'],
    ['slug' => 'network-switch', 'name' => 'سوییچ شبکه', 'parent' => 'network'],
    ['slug' => 'network-wifi', 'name' => 'تجهیزات وای‌فای', 'parent' => 'network'],
];

$slugToId = [];
foreach ($categories as $cat) {
    $existing = get_term_by('slug', $cat['slug'], 'product_cat');
    if ($existing) {
        $slugToId[$cat['slug']] = (int) $existing->term_id;
        continue;
    }
    $parentId = $cat['parent'] ? ($slugToId[$cat['parent']] ?? 0) : 0;
    $result = wp_insert_term($cat['name'], 'product_cat', ['slug' => $cat['slug'], 'parent' => $parentId]);
    if (is_wp_error($result)) {
        fwrite(STDERR, "Category error {$cat['slug']}: " . $result->get_error_message() . "\n");
        continue;
    }
    $slugToId[$cat['slug']] = (int) $result['term_id'];
}
echo "Categories: " . count($slugToId) . "/" . count($categories) . "\n";

// ============ Brands (native WooCommerce product_brand taxonomy) ============
$brands = ['LENOVO', 'ASUS', 'ACER', 'APPLE', 'SONY', 'HYPERX', 'HP', 'LOGITECH'];
$brandToId = [];
foreach ($brands as $brand) {
    $existing = get_term_by('name', $brand, 'product_brand');
    if ($existing) {
        $brandToId[$brand] = (int) $existing->term_id;
        continue;
    }
    $result = wp_insert_term($brand, 'product_brand');
    if (is_wp_error($result)) {
        fwrite(STDERR, "Brand error {$brand}: " . $result->get_error_message() . "\n");
        continue;
    }
    $brandToId[$brand] = (int) $result['term_id'];
}
echo "Brands: " . count($brandToId) . "/" . count($brands) . "\n";

// ============ Products (mirrors PRODUCTS in mock-data.ts) ============
$products = [
    [
        'slug' => 'lenovo-loq-15irx9', 'name' => 'لپ‌تاپ گیمینگ لنوو LOQ 15IRX9 نسل ۱۳ اینتل', 'brand' => 'LENOVO',
        'category' => 'laptop-gaming', 'price' => 89500000, 'regular_price' => 95000000, 'in_stock' => true,
        'sku' => 'LOQ-15IRX9-R7',
        'short_description' => 'لپ‌تاپ گیمینگ با پردازنده نسل سیزدهم اینتل و کارت گرافیک RTX 4060، برای بازی‌های روز و کارهای گرافیکی سنگین.',
        'description' => '<p>لپ‌تاپ گیمینگ لنوو LOQ 15IRX9 با پردازنده نسل سیزدهم اینتل و کارت گرافیک RTX 4060 برای بازی‌های روز و کارهای گرافیکی سنگین طراحی شده است. سیستم خنک‌کاری دوگانه، فشار حرارتی بالا را در جلسات طولانی گیمینگ کنترل می‌کند و صفحه‌نمایش ۱۴۴ هرتز، تجربه‌ای روان و بدون افت فریم ارائه می‌دهد.</p><p>بدنه آلومینیومی و کیبورد بک‌لایت RGB، ظاهری حرفه‌ای به این لپ‌تاپ داده و باتری ۶۰ وات‌ساعتی آن برای استفاده روزمره خارج از پریز نیز کفایت می‌کند.</p>',
        'specs' => ['پردازنده' => 'Intel Core i7-13650HX', 'کارت گرافیک' => 'NVIDIA RTX 4060 8GB', 'حافظه رم' => '16GB DDR5', 'حافظه ذخیره‌سازی' => '1TB NVMe SSD', 'صفحه‌نمایش' => '15.6" FHD IPS 144Hz'],
    ],
    [
        'slug' => 'playstation-5-slim', 'name' => 'کنسول بازی PlayStation 5 Slim', 'brand' => 'SONY',
        'category' => 'console-playstation', 'price' => 54900000, 'in_stock' => true, 'sku' => 'PS5-SLIM-1TB',
        'short_description' => 'کنسول نسل نهم سونی با حافظه ۱ ترابایتی و پشتیبانی از رزولوشن ۴K در ۱۲۰ فریم بر ثانیه.',
        'description' => '<p>کنسول نسل نهم سونی با حافظه ۱ ترابایتی و پشتیبانی از رزولوشن ۴K در ۱۲۰ فریم بر ثانیه.</p>',
        'specs' => ['حافظه' => '1TB SSD', 'رزولوشن' => '4K @ 120fps'],
    ],
    [
        'slug' => 'asus-vivobook-15', 'name' => 'لپ‌تاپ ایسوس Vivobook 15', 'brand' => 'ASUS',
        'category' => 'laptop-office', 'price' => 42300000, 'in_stock' => true, 'sku' => 'VIVOBOOK15-I5',
        'short_description' => 'لپ‌تاپ سبک و همه‌کاره، مناسب کارهای اداری و دانشجویی.',
        'description' => '<p>لپ‌تاپ سبک و همه‌کاره، مناسب کارهای اداری و دانشجویی.</p>',
        'specs' => ['پردازنده' => 'Intel Core i5-1335U', 'حافظه رم' => '8GB', 'حافظه ذخیره‌سازی' => '512GB SSD'],
    ],
    [
        'slug' => 'hyperx-cloud-ii', 'name' => 'هدست گیمینگ HyperX Cloud II', 'brand' => 'HYPERX',
        'category' => 'accessories-headset', 'price' => 3900000, 'in_stock' => true, 'sku' => 'HX-CLOUD2',
        'short_description' => 'هدست گیمینگ با صدای فراگیر ۷.۱ و میکروفون حذف نویز.',
        'description' => '<p>هدست گیمینگ با صدای فراگیر ۷.۱ و میکروفون حذف نویز.</p>',
        'specs' => ['صدا' => '7.1 Surround'],
    ],
    [
        'slug' => 'asus-tuf-f15', 'name' => 'لپ‌تاپ ایسوس TUF Gaming F15', 'brand' => 'ASUS',
        'category' => 'laptop-gaming', 'price' => 64200000, 'in_stock' => true, 'sku' => 'TUF-F15-I7',
        'short_description' => 'لپ‌تاپ گیمینگ مقاوم با بدنه استاندارد نظامی و خنک‌کاری قدرتمند.',
        'description' => '<p>لپ‌تاپ گیمینگ مقاوم با بدنه استاندارد نظامی و خنک‌کاری قدرتمند.</p>',
        'specs' => ['پردازنده' => 'Intel Core i7-12700H', 'کارت گرافیک' => 'RTX 3050', 'حافظه رم' => '16GB'],
    ],
    [
        'slug' => 'lenovo-ideapad-slim-3', 'name' => 'لپ‌تاپ لنوو IdeaPad Slim 3', 'brand' => 'LENOVO',
        'category' => 'laptop-office', 'price' => 38500000, 'in_stock' => true, 'sku' => 'IDEAPAD-SLIM3-R5',
        'short_description' => 'لپ‌تاپ اقتصادی و سبک، انتخابی مناسب برای دانشجویان.',
        'description' => '<p>لپ‌تاپ اقتصادی و سبک، انتخابی مناسب برای دانشجویان.</p>',
        'specs' => ['پردازنده' => 'AMD Ryzen 5', 'حافظه رم' => '8GB', 'حافظه ذخیره‌سازی' => '512GB SSD'],
    ],
    [
        'slug' => 'acer-nitro-v15', 'name' => 'لپ‌تاپ ایسر Nitro V15', 'brand' => 'ACER',
        'category' => 'laptop-gaming', 'price' => 71800000, 'in_stock' => true, 'sku' => 'NITRO-V15-I7',
        'short_description' => 'لپ‌تاپ گیمینگ میان‌رده با نسبت قیمت به عملکرد عالی.',
        'description' => '<p>لپ‌تاپ گیمینگ میان‌رده با نسبت قیمت به عملکرد عالی.</p>',
        'specs' => ['پردازنده' => 'Intel Core i7-13620H', 'کارت گرافیک' => 'RTX 4050', 'حافظه رم' => '16GB'],
    ],
    [
        'slug' => 'macbook-air-m2', 'name' => 'مک‌بوک اپل Air M2', 'brand' => 'APPLE',
        'category' => 'laptop-apple', 'price' => 83000000, 'in_stock' => false, 'sku' => 'MBA-M2-256',
        'short_description' => 'لپ‌تاپ فوق سبک اپل با تراشه M2 و باتری بلندمدت.',
        'description' => '<p>لپ‌تاپ فوق سبک اپل با تراشه M2 و باتری بلندمدت.</p>',
        'specs' => ['پردازنده' => 'Apple M2', 'حافظه رم' => '8GB', 'حافظه ذخیره‌سازی' => '256GB SSD'],
    ],
    [
        'slug' => 'hp-victus-15', 'name' => 'لپ‌تاپ اچ‌پی Victus 15', 'brand' => 'HP',
        'category' => 'laptop-gaming', 'price' => 53400000, 'regular_price' => 58000000, 'in_stock' => true, 'sku' => 'VICTUS15-I5',
        'short_description' => 'لپ‌تاپ گیمینگ ورودی با طراحی ساده و عملکرد قابل اتکا.',
        'description' => '<p>لپ‌تاپ گیمینگ ورودی با طراحی ساده و عملکرد قابل اتکا.</p>',
        'specs' => ['پردازنده' => 'Intel Core i5-13420H', 'کارت گرافیک' => 'RTX 3050', 'حافظه رم' => '16GB'],
    ],
    [
        'slug' => 'logitech-g502', 'name' => 'ماوس گیمینگ لاجیتک G502', 'brand' => 'LOGITECH',
        'category' => 'accessories-mouse-keyboard', 'price' => 4100000, 'in_stock' => true, 'sku' => 'LOGI-G502',
        'short_description' => 'ماوس گیمینگ با سنسور دقیق و ۱۱ دکمه قابل برنامه‌ریزی.',
        'description' => '<p>ماوس گیمینگ با سنسور دقیق و ۱۱ دکمه قابل برنامه‌ریزی.</p>',
        'specs' => ['دقت سنسور' => '25600 DPI'],
    ],
];

$productCount = 0;
foreach ($products as $p) {
    if (wc_get_product_id_by_sku($p['sku'])) {
        $productCount++;
        continue;
    }

    $product = new WC_Product_Simple();
    $product->set_name($p['name']);
    $product->set_slug($p['slug']);
    $product->set_sku($p['sku']);
    $product->set_regular_price((string) ($p['regular_price'] ?? $p['price']));
    if (isset($p['regular_price'])) {
        $product->set_sale_price((string) $p['price']);
    }
    $product->set_status('publish');
    $product->set_catalog_visibility('visible');
    $product->set_stock_status($p['in_stock'] ? 'instock' : 'outofstock');
    $product->set_manage_stock(false);
    $product->set_short_description($p['short_description']);
    $product->set_description($p['description']);
    if (isset($slugToId[$p['category']])) {
        $product->set_category_ids([$slugToId[$p['category']]]);
    }

    if (!empty($p['specs'])) {
        $attributes = [];
        foreach ($p['specs'] as $label => $value) {
            $attr = new WC_Product_Attribute();
            $attr->set_name($label);
            $attr->set_options([$value]);
            $attr->set_visible(true);
            $attributes[] = $attr;
        }
        $product->set_attributes($attributes);
    }

    $productId = $product->save();
    if ($productId && isset($brandToId[$p['brand']])) {
        wp_set_object_terms($productId, [$brandToId[$p['brand']]], 'product_brand');
    }
    if ($productId) {
        $productCount++;
    } else {
        fwrite(STDERR, "Product error: {$p['slug']}\n");
    }
}
echo "Products: {$productCount}/" . count($products) . "\n";

// ============ Blog post categories + posts (mirrors POSTS in mock-data.ts) ============
$postCategories = [
    'buying-guide' => 'راهنمای خرید',
    'comparison' => 'مقایسه',
    'tutorial' => 'آموزش',
    'news' => 'اخبار',
];
$postCatIds = [];
foreach ($postCategories as $slug => $name) {
    $existing = get_term_by('slug', $slug, 'category');
    if ($existing) {
        $postCatIds[$slug] = (int) $existing->term_id;
        continue;
    }
    $result = wp_insert_term($name, 'category', ['slug' => $slug]);
    $postCatIds[$slug] = is_wp_error($result) ? 0 : (int) $result['term_id'];
}

$posts = [
    [
        'slug' => 'gaming-laptop-buying-guide-2026',
        'title' => 'راهنمای خرید لپ‌تاپ گیمینگ در سال ۲۰۲۶؛ روی چه مشخصاتی تمرکز کنیم؟',
        'excerpt' => 'پیش از خرید لپ‌تاپ گیمینگ باید نسبت کارت گرافیک به پردازنده، کیفیت سیستم خنک‌کاری و نرخ‌تازه‌سازی صفحه‌نمایش را کنار هم بسنجید.',
        'category' => 'buying-guide', 'date' => '2026-07-06 09:00:00',
        'content' => '<p>پیش از خرید لپ‌تاپ گیمینگ باید نسبت کارت گرافیک به پردازنده، کیفیت سیستم خنک‌کاری و نرخ‌تازه‌سازی صفحه‌نمایش را کنار هم بسنجید.</p><h2>کارت گرافیک مهم‌تر از پردازنده است</h2><p>برای اکثر بازی‌های روز، کارت گرافیک نقش تعیین‌کننده‌تری نسبت به پردازنده دارد.</p><h2>خنک‌کاری را دست کم نگیرید</h2><p>لپ‌تاپ‌های گیمینگ زیر بار سنگین به سرعت داغ می‌شوند.</p>',
    ],
    [
        'slug' => 'ps5-vs-xbox-series-x',
        'title' => 'PS5 یا Xbox Series X؛ کدام کنسول برای شما مناسب‌تر است؟',
        'excerpt' => 'مقایسه‌ای واقعی بر اساس کتابخانه بازی‌ها، قیمت و تجربه کاربری دو کنسول محبوب بازار.',
        'category' => 'comparison', 'date' => '2026-06-30 09:00:00',
        'content' => '<p>مقایسه‌ای واقعی بر اساس کتابخانه بازی‌ها، قیمت و تجربه کاربری دو کنسول محبوب بازار.</p>',
    ],
    [
        'slug' => 'internal-vs-external-ssd',
        'title' => 'SSD اینترنال بخریم یا اکسترنال؟ راهنمای انتخاب حافظه ذخیره‌سازی',
        'excerpt' => 'تفاوت سرعت، قیمت و کاربرد SSDهای اینترنال و اکسترنال را با مثال‌های واقعی بررسی می‌کنیم.',
        'category' => 'tutorial', 'date' => '2026-06-23 09:00:00',
        'content' => '<p>تفاوت سرعت، قیمت و کاربرد SSDهای اینترنال و اکسترنال را با مثال‌های واقعی بررسی می‌کنیم.</p>',
    ],
    [
        'slug' => 'cpu-cooler-air-vs-liquid',
        'title' => 'کول‌تر خنک‌کننده پردازنده؛ هوایی بخریم یا مایع؟',
        'excerpt' => 'برای سیستم‌های گیمینگ و رندر سنگین، انتخاب درست خنک‌کننده تفاوت زیادی در دمای پردازنده ایجاد می‌کند.',
        'category' => 'buying-guide', 'date' => '2026-06-18 09:00:00',
        'content' => '<p>برای سیستم‌های گیمینگ و رندر سنگین، انتخاب درست خنک‌کننده تفاوت زیادی در دمای پردازنده ایجاد می‌کند.</p>',
    ],
    [
        'slug' => 'intel-core-ultra-arrives-in-iran',
        'title' => 'نسل جدید پردازنده‌های اینتل Core Ultra به بازار ایران رسید',
        'excerpt' => 'بررسی مشخصات و قیمت اولین لپ‌تاپ‌های مجهز به پردازنده‌های نسل جدید اینتل در فروشگاه آیریک.',
        'category' => 'news', 'date' => '2026-06-10 09:00:00',
        'content' => '<p>بررسی مشخصات و قیمت اولین لپ‌تاپ‌های مجهز به پردازنده‌های نسل جدید اینتل در فروشگاه آیریک.</p>',
    ],
    [
        'slug' => 'gaming-monitor-buying-guide',
        'title' => 'مانیتور گیمینگ مناسب چه ویژگی‌هایی باید داشته باشد؟',
        'excerpt' => 'نرخ‌تازه‌سازی، زمان پاسخ و نوع پنل را قبل از خرید مانیتور گیمینگ جدی بگیرید.',
        'category' => 'buying-guide', 'date' => '2026-06-02 09:00:00',
        'content' => '<p>نرخ‌تازه‌سازی، زمان پاسخ و نوع پنل را قبل از خرید مانیتور گیمینگ جدی بگیرید.</p>',
    ],
];

$postCount = 0;
foreach ($posts as $post) {
    $existing = get_page_by_path($post['slug'], OBJECT, 'post');
    if ($existing) {
        $postCount++;
        continue;
    }
    $postId = wp_insert_post([
        'post_title' => $post['title'],
        'post_name' => $post['slug'],
        'post_content' => $post['content'],
        'post_excerpt' => $post['excerpt'],
        'post_status' => 'publish',
        'post_type' => 'post',
        'post_date' => $post['date'],
    ]);
    if ($postId && !is_wp_error($postId)) {
        wp_set_post_categories($postId, [$postCatIds[$post['category']]]);
        $postCount++;
    } else {
        fwrite(STDERR, "Post error: {$post['slug']}\n");
    }
}
echo "Posts: {$postCount}/" . count($posts) . "\n";

echo "Seeding complete.\n";
