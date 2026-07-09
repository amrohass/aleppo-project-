/* ===========================================================================
 *  Aleppo Cafe — default / fallback content
 *
 *  This mirrors the current website content. It is used as-is until a Supabase
 *  project is configured (js/config.js). Once Supabase has data, that data
 *  overrides everything here at runtime. It is also the source that
 *  supabase/seed.sql loads into the database.
 *
 *  Structure matches what the render layer expects after it assembles the
 *  Supabase tables, so the exact same renderer draws either source.
 * ======================================================================== */

/* A branded placeholder used for the two showcase images in every menu
 * section, and anywhere an image has not been set yet. */
window.ALEPPO_PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%231A0B03%22%2F%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%22384%22%20height%3D%22284%22%20fill%3D%22none%22%20stroke%3D%22%23C5922A%22%20stroke-opacity%3D%220.35%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22150%22%20fill%3D%22%23C5922A%22%20font-family%3D%22serif%22%20font-size%3D%2234%22%20text-anchor%3D%22middle%22%3E%D8%AD%D9%84%D8%A8%3C%2Ftext%3E%3Ctext%20x%3D%22200%22%20y%3D%22188%22%20fill%3D%22%238C7550%22%20font-family%3D%22sans-serif%22%20font-size%3D%2212%22%20letter-spacing%3D%224%22%20text-anchor%3D%22middle%22%3EMENU%20IMAGE%3C%2Ftext%3E%3C%2Fsvg%3E";

window.ALEPPO_DEFAULT = {

  /* ----- bilingual text / image blocks, keyed by name --------------------
   * value_en = English/LTR value, value_ar = Arabic/RTL value.
   * Image blocks store the file path (relative or full URL) in value_en.   */
  content: {
    'brand.favicon':     { section: 'Branding', label: 'Browser tab icon (favicon)', type: 'image', en: 'logo.jpg', ar: '' },

    'hero.eyebrow':      { section: 'Hero', label: 'Eyebrow line',        type: 'text',  en: 'Est. 2016 · Ramallah, Palestine', ar: '' },
    'hero.arabic':       { section: 'Hero', label: 'Arabic wordmark',     type: 'text',  en: 'حلب', ar: 'حلب' },
    'hero.english':      { section: 'Hero', label: 'English wordmark',    type: 'text',  en: 'Aleppo Cafe', ar: '' },
    'hero.tagline':      { section: 'Hero', label: 'Tagline',             type: 'text',  en: 'إنت فبيتك — You are home', ar: '' },
    'hero.cta_menu':     { section: 'Hero', label: 'Primary button',      type: 'text',  en: 'Explore Menu', ar: 'القائمة' },
    'hero.cta_story':    { section: 'Hero', label: 'Secondary button',    type: 'text',  en: 'Our Story', ar: 'قصتنا' },
    'hero.bg':           { section: 'Hero', label: 'Background (desktop)', type: 'image', en: 'hero-cover.png', ar: '' },
    'hero.bg_mobile':    { section: 'Hero', label: 'Background (mobile)',  type: 'image', en: 'phone_back.png', ar: '' },
    'hero.scroll':       { section: 'Hero', label: 'Scroll hint',          type: 'text',  en: 'Scroll', ar: '' },

    'nav.logo_ar':        { section: 'Navigation', label: 'Logo — Arabic',        type: 'text', en: 'حلب', ar: 'حلب' },
    'nav.logo_en':        { section: 'Navigation', label: 'Logo — English',       type: 'text', en: 'Aleppo Cafe', ar: '' },
    'nav.link_story':      { section: 'Navigation', label: 'Nav link · Story',      type: 'text', en: 'Our Story', ar: 'قصتنا' },
    'nav.link_menu':       { section: 'Navigation', label: 'Nav link · Menu',       type: 'text', en: 'Menu', ar: 'القائمة' },
    'nav.link_atmosphere': { section: 'Navigation', label: 'Nav link · Atmosphere', type: 'text', en: 'Atmosphere', ar: 'الأجواء' },
    'nav.link_locations':  { section: 'Navigation', label: 'Nav link · Locations',  type: 'text', en: 'Locations', ar: 'المواقع' },
    'nav.reserve':       { section: 'Navigation', label: 'Find-us button', type: 'text', en: 'Find Us', ar: 'جدنا' },

    'story.label':       { section: 'Story', label: 'Section label',   type: 'text', en: 'Our Story · قصتنا', ar: '' },
    'story.title':       { section: 'Story', label: 'Title (HTML)',    type: 'html', en: 'More than a cafe.<br><em>A second home.</em>', ar: '' },
    'story.quote_ar':    { section: 'Story', label: 'Arabic quote',    type: 'text', en: 'إنت فبيتك', ar: 'إنت فبيتك' },
    'story.quote_en':    { section: 'Story', label: 'Quote (English)', type: 'text', en: '"You are in your home"', ar: '' },
    'story.body1':       { section: 'Story', label: 'Paragraph 1',     type: 'text', en: 'Nestled inside a century-old building in Ramallah, Aleppo Cafe was born from a simple belief: that a cafe should feel like a warm gathering of family. Since 2016, our guests have not been customers — they are beloved friends who return again and again to our embrace.', ar: '' },
    'story.body2':       { section: 'Story', label: 'Paragraph 2',     type: 'text', en: 'The stone walls remember. The amber light has witnessed laughter, conversations, board games stretching into the night, and mornings that started with Palestinian breakfast and two cups of tea. Our employees are not staff — they are the soul of this home.', ar: '' },
    'story.img':         { section: 'Story', label: 'Photo',           type: 'image', en: 'converted_image.jpg', ar: '' },
    'story.badge_num':   { section: 'Story', label: 'Badge number',    type: 'text', en: '10', ar: '' },
    'story.badge_label': { section: 'Story', label: 'Badge caption',   type: 'text', en: 'Years of warmth', ar: '' },
    'story.stat1_num':   { section: 'Story', label: 'Stat 1 number',   type: 'text', en: '100+', ar: '' },
    'story.stat1_label': { section: 'Story', label: 'Stat 1 label',    type: 'text', en: 'Year old building', ar: '' },
    'story.stat2_num':   { section: 'Story', label: 'Stat 2 number',   type: 'text', en: '10', ar: '' },
    'story.stat2_label': { section: 'Story', label: 'Stat 2 label',    type: 'text', en: 'Years of love', ar: '' },
    'story.stat3_num':   { section: 'Story', label: 'Stat 3 number',   type: 'text', en: '2', ar: '' },
    'story.stat3_label': { section: 'Story', label: 'Stat 3 label',    type: 'text', en: 'Ramallah locations', ar: '' },

    'atm.label':  { section: 'Atmosphere', label: 'Section label', type: 'text', en: 'The Space · المكان', ar: '' },
    'atm.title':  { section: 'Atmosphere', label: 'Title',         type: 'text', en: 'Every corner tells a story', ar: '' },
    'atm.body':   { section: 'Atmosphere', label: 'Intro text',    type: 'text', en: 'Vintage lamps, mosaic tables, hand-woven cushions, and the faint hum of Arabic music — welcome to Aleppo.', ar: '' },
    'atm.caption':{ section: 'Atmosphere', label: 'Feature caption (Arabic)', type: 'text', en: 'وبين عيلتك', ar: 'وبين عيلتك' },
    'atm.img1':   { section: 'Atmosphere', label: 'Image 1 (large)', type: 'image', en: 'converted_image_2.jpg', ar: '' },
    'atm.img2':   { section: 'Atmosphere', label: 'Image 2', type: 'image', en: 'IMG_0707.jpg', ar: '' },
    'atm.img3':   { section: 'Atmosphere', label: 'Image 3', type: 'image', en: 'IMG_0705.jpg', ar: '' },
    'atm.img4':   { section: 'Atmosphere', label: 'Image 4', type: 'image', en: 'IMG_0704.jpg', ar: '' },
    'atm.img5':   { section: 'Atmosphere', label: 'Image 5', type: 'image', en: 'IMG_0708.jpg', ar: '' },

    'menu.label': { section: 'Menu', label: 'Section label', type: 'text', en: 'The Menu · قائمة الطعام', ar: '' },
    'menu.title': { section: 'Menu', label: 'Title',         type: 'text', en: 'From our kitchen, with love', ar: '' },
    'menu.body':  { section: 'Menu', label: 'Intro text',    type: 'text', en: 'Prices in NIS. All sandwiches served with fries or salad. Main dishes served with rice.', ar: '' },

    'hookah.label': { section: 'Hookah', label: 'Section label', type: 'text', en: 'The Chimney Hookah · مدخنة أراجيل', ar: '' },
    'hookah.title': { section: 'Hookah', label: 'Title (HTML)',  type: 'html', en: 'Settle in. <em>Stay a while.</em>', ar: '' },
    'hookah.body':  { section: 'Hookah', label: 'Intro text',    type: 'text', en: 'Our handcrafted hookah flavors are as warm as the conversations they accompany.', ar: '' },
    // Flavors: one per line, "Name | Price".
    'hookah.flavors': { section: 'Hookah', label: 'Flavors (one per line: Name | Price)', type: 'list', en:
      'Two Apples | 15 ₪\nLemon & Mint | 15 ₪\nWatermelon & Mint | 15 ₪\nMelon Mint | 15 ₪\nGum & Cinnamon | 15 ₪\nBlueberry | 15 ₪\nAdalya Love 66 | 15 ₪\nNakhla Tobacco | 20 ₪', ar: '' },

    'games.title': { section: 'Games', label: 'Arabic headline', type: 'text', en: 'يلا نلعب؟', ar: 'يلا نلعب؟' },
    'games.sub':   { section: 'Games', label: 'Sub-headline',    type: 'text', en: "Let's Play · Board Games Available", ar: '' },
    'games.list':  { section: 'Games', label: 'Games (one per line)', type: 'list', en: 'Monopoly\nScrabble\nRisk\nChess\nUno\n& More', ar: '' },

    'exp.label':  { section: 'Why Aleppo', label: 'Section label', type: 'text', en: 'Why Aleppo · لماذا حلب', ar: '' },
    'exp.title':  { section: 'Why Aleppo', label: 'Title (HTML)',  type: 'html', en: 'Three things that make us <em>different</em>', ar: '' },
    'exp.card1_title': { section: 'Why Aleppo', label: 'Card 1 title', type: 'text', en: 'A Century of Walls', ar: '' },
    'exp.card1_text':  { section: 'Why Aleppo', label: 'Card 1 text',  type: 'text', en: 'Our building has stood for over 100 years. The stone absorbs stories. You feel it the moment you walk in — a warmth that no new construction can replicate.', ar: '' },
    'exp.card2_title': { section: 'Why Aleppo', label: 'Card 2 title', type: 'text', en: 'Games, Always', ar: '' },
    'exp.card2_text':  { section: 'Why Aleppo', label: 'Card 2 text',  type: 'text', en: 'Monopoly, chess, UNO, Scrabble — because the best conversations start around a board game. Time slows down here. That is the point.', ar: '' },
    'exp.card3_title': { section: 'Why Aleppo', label: 'Card 3 title', type: 'text', en: 'Family, Not Staff', ar: '' },
    'exp.card3_text':  { section: 'Why Aleppo', label: 'Card 3 text',  type: 'text', en: 'Our team are not employees — they are the beating heart of Aleppo. They know your name. They remember your order. They are why guests keep coming back.', ar: '' },

    'loc.label': { section: 'Locations', label: 'Section label', type: 'text', en: 'Find Us · جدنا', ar: '' },
    'loc.title': { section: 'Locations', label: 'Title',         type: 'text', en: 'Two homes in Ramallah', ar: '' },
    'loc.body':  { section: 'Locations', label: 'Intro text',    type: 'text', en: 'Both locations carry the same soul — warm light, familiar faces, and a cup of something good.', ar: '' },

    'footer.tagline_ar': { section: 'Footer', label: 'Tagline (Arabic)',  type: 'text', en: 'إنت فبيتك وبين عيلتك', ar: 'إنت فبيتك وبين عيلتك' },
    'footer.tagline_en': { section: 'Footer', label: 'Tagline (English)', type: 'text', en: 'You are home, among family.', ar: '' },
    'footer.copyright':  { section: 'Footer', label: 'Copyright line',    type: 'text', en: '© 2016 Aleppo Cafe · حلب كافيه · Ramallah, Palestine', ar: '' },
    'footer.seal':       { section: 'Footer', label: 'Arabic seal',       type: 'text', en: 'إنت فبيتك', ar: 'إنت فبيتك' },
    'footer.logo_ar':          { section: 'Footer', label: 'Logo — Arabic',          type: 'text', en: 'حلب', ar: 'حلب' },
    'footer.logo_en':          { section: 'Footer', label: 'Logo — English',         type: 'text', en: 'Aleppo Cafe · حلب كافيه', ar: '' },
    'footer.explore_heading':  { section: 'Footer', label: 'Column heading · Explore', type: 'text', en: 'Explore', ar: 'استكشف' },
    'footer.explore_story':      { section: 'Footer', label: 'Explore link · Story',      type: 'text', en: 'Our Story', ar: 'قصتنا' },
    'footer.explore_atmosphere': { section: 'Footer', label: 'Explore link · Atmosphere', type: 'text', en: 'Atmosphere', ar: 'الأجواء' },
    'footer.explore_menu':       { section: 'Footer', label: 'Explore link · Menu',       type: 'text', en: 'Menu', ar: 'القائمة' },
    'footer.explore_locations':  { section: 'Footer', label: 'Explore link · Locations',  type: 'text', en: 'Locations', ar: 'المواقع' },
    'footer.visit_heading':    { section: 'Footer', label: 'Column heading · Visit',   type: 'text', en: 'Visit', ar: 'زورونا' },
    'footer.credit':           { section: 'Footer', label: 'Developer credit (HTML allowed)', type: 'html', en: 'Developed by <a href="https://hktechnologie.com/">HK Technologies</a>', ar: '' }
  },

  /* ----- menu: branches → categories → (subcategories) → items ----------- */
  branches: [
    {
      slug: 'ramallah', name_en: 'Ramallah · رام الله', name_ar: 'رام الله',
      categories: [
        {
          slug: 'drinks', name_en: 'Drinks · مشروبات', name_ar: 'مشروبات',
          subcategories: [
            { slug: 'hot',       name_en: 'Hot · مشروبات ساخنة',    name_ar: 'مشروبات ساخنة' },
            { slug: 'cold',      name_en: 'Cold · مشروبات باردة',   name_ar: 'مشروبات باردة' },
            { slug: 'juices',    name_en: 'Fresh Juices · عصائر طبيعية', name_ar: 'عصائر طبيعية' },
            { slug: 'cocktails', name_en: 'Cocktails · كوكتيلات',   name_ar: 'كوكتيلات' },
            { slug: 'iced',      name_en: 'Iced Drinks · مشروبات مثلجة', name_ar: 'مشروبات مثلجة' },
            { slug: 'shakes',    name_en: 'Milk Shakes · ميلك',     name_ar: 'ميلك شيك' }
          ],
          items: [
            { sub: 'hot', en: 'Arabic Coffe',     ar: '', price: '7 ₪' },
            { sub: 'hot', en: 'Espresso',         ar: '', price: '10 / 7 ₪' },
            { sub: 'hot', en: 'Americano',        ar: '', price: '10 ₪' },
            { sub: 'hot', en: 'Tea',              ar: '', price: '6 ₪' },
            { sub: 'hot', en: 'Cappuccino',       ar: '', price: '10 ₪' },
            { sub: 'hot', en: 'Latte',            ar: '', price: '10 ₪' },
            { sub: 'hot', en: 'Spanish Latte',    ar: '', price: '15 ₪' },
            { sub: 'hot', en: 'Hot Chocolate',    ar: '', price: '10 ₪' },
            { sub: 'hot', en: 'Italian Chocolete',ar: '', price: '15 ₪' },
            { sub: 'hot', en: 'Herbs',            ar: '', price: '10 ₪' },
            { sub: 'hot', en: 'Frensh Vanilla',   ar: '', price: '15 ₪' },
            { sub: 'hot', en: 'Matta',            ar: '', price: '7 ₪' },
            { sub: 'hot', en: 'Niscafe',          ar: '', price: '7 ₪' },
            { sub: 'hot', en: 'Hazelnut',         ar: '', price: '15 ₪' },
            { sub: 'hot', en: 'Toffee Caramel',   ar: '', price: '15 ₪' },
            { sub: 'hot', en: 'Masla chai',       ar: '', price: '10 ₪' },
            { sub: 'hot', en: 'Honey Tea',        ar: '', price: '10 ₪' },
            { sub: 'hot', en: 'Green Tea',        ar: '', price: '10 ₪' },
            { sub: 'hot', en: 'Chai Latte',       ar: '', price: '15 ₪' },
            { sub: 'hot', en: 'Mocha',            ar: '', price: '15 ₪' },
            { sub: 'cold', en: 'Bavari',      ar: 'بافاريا', price: '30 ₪' },
            { sub: 'cold', en: 'Soda water',  ar: '', price: '30 ₪' },
            { sub: 'cold', en: 'XL',          ar: '', price: '30 ₪' },
            { sub: 'cold', en: 'Water L',     ar: '', price: '30 ₪' },
            { sub: 'cold', en: 'Water S',     ar: '', price: '30 ₪' },
            { sub: 'cold', en: 'Soft Drinks', ar: '', price: '30 ₪' },
            { sub: 'juices', en: 'Orange Juice',    ar: 'عصير برتقال',  price: '15 ₪' },
            { sub: 'juices', en: 'Lemon & Mint',    ar: 'ليمون ونعنع', price: '15 ₪' },
            { sub: 'juices', en: 'Carrot Juice',    ar: 'عصير جزر',     price: '15 ₪' },
            { sub: 'cocktails', en: 'Fruit Cocktail', ar: 'كوكتيل فواكه', price: '20 ₪' },
            { sub: 'iced',   en: 'Iced Coffee',     ar: 'قهوة مثلجة',   price: '15 ₪' },
            { sub: 'iced',   en: 'Iced Latte',      ar: 'لاتيه مثلج',   price: '15 ₪' },
            { sub: 'shakes', en: 'Vanilla Shake',   ar: 'ميلك شيك فانيلا', price: '18 ₪' },
            { sub: 'shakes', en: 'Chocolate Shake', ar: 'ميلك شيك شوكولا', price: '18 ₪' }
          ]
        },
        {
          slug: 'sandwiches', name_en: 'Sandwiches · ساندويشات', name_ar: 'ساندويشات',
          items: [
            { en: 'Chicken Sandwich',        ar: 'مسحب',           price: '25 ₪' },
            { en: 'Mexican Chicken',         ar: 'مسحب مكسيكي',    price: '25 ₪' },
            { en: 'White Sauce Chicken',     ar: 'مسحب وايت صوص',  price: '25 ₪' },
            { en: 'Italian Chicken Sandwich',ar: 'مسحب إيطالي',    price: '25 ₪' },
            { en: 'Chicken Zinger',          ar: 'زنجر دجاج',      price: '25 ₪' },
            { en: 'Classic Burger',          ar: 'برجر كلاسيك',    price: '35 ₪' },
            { en: 'Mushroom Burger',         ar: 'برجر مع مشروم',  price: '35 ₪' },
            { en: 'Chicken Shawarma',        ar: 'شاورما دجاج',    price: '25 ₪' }
          ]
        },
        {
          slug: 'appetizers', name_en: 'Appetizers · المقبلات', name_ar: 'المقبلات',
          items: [
            { en: 'Garlic Bread',            ar: 'خبز بالثوم',           price: '15 ₪' },
            { en: 'Meat Rolls (8 pcs)',      ar: 'أصابع لحمة · 8 قطع',   price: '25 ₪' },
            { en: 'Chicken Fingers (6 pcs)', ar: 'أصابع دجاج · 6 قطع',   price: '25 ₪' },
            { en: 'Potato Rolls (8 pcs)',    ar: 'أصابع بطاطا · 8 قطع',  price: '25 ₪' },
            { en: 'French Fries',            ar: 'بطاطا مقلية',          price: '12 ₪' },
            { en: 'Nachos',                  ar: 'ناتشوز',               price: '25 ₪' }
          ]
        },
        {
          slug: 'mains', name_en: 'Main Course · الأطباق', name_ar: 'الأطباق الرئيسية',
          items: [
            { en: 'Fajita',                                  ar: 'فاهيتا',             price: '35 ₪' },
            { en: 'Chicken Steak with Sautéed Vegetables',   ar: 'ستيك دجاج مع خضار',  price: '35 ₪' },
            { en: 'Fettuccine',                              ar: 'فيتوتشيني / دجاج',   price: '30–35 ₪' },
            { en: 'Stroganoff',                              ar: 'ستروجانوف',          price: '35 ₪' }
          ]
        },
        {
          slug: 'salads', name_en: 'Salads · سلطات', name_ar: 'سلطات',
          items: [
            { en: 'Caesar Salad',  ar: 'سيزر',          price: '25 ₪' },
            { en: 'Fattoush',      ar: 'فتوش',          price: '17 ₪' },
            { en: 'Tabbouleh',     ar: 'تبولة',         price: '17 ₪' },
            { en: 'Chicken Salad', ar: 'سلطة دجاج',     price: '25 ₪' },
            { en: 'Greek Salad',   ar: 'سلطة يونانية',  price: '20 ₪' },
            { en: 'Tuna Salad',    ar: 'سلطة تونا',     price: '20 ₪' }
          ]
        },
        {
          slug: 'tost', name_en: 'Tost · توست', name_ar: 'توست',
          items: [
            { en: 'Mix tost',          ar: 'توست مشكل',        price: '25 ₪' },
            { en: 'Cheese tost',       ar: 'توست جبنة صفراء',  price: '25 ₪' },
            { en: 'Sausage tost',      ar: 'توست نقانق',       price: '25 ₪' },
            { en: 'White Cheese tost', ar: 'توست جبنة بيضاء',  price: '25 ₪' },
            { en: 'Tuna tost',         ar: 'توست تونا',        price: '25 ₪' },
            { en: 'Roast beef tost',   ar: 'توست روست بيف',    price: '35 ₪' },
            { en: 'Smoked turkey tost',ar: 'توست حبش',         price: '35 ₪' }
          ]
        },
        {
          slug: 'dessert', name_en: 'Dessert · حلويات', name_ar: 'حلويات',
          items: [
            { en: 'NewYork cheesecake', ar: 'نيويورك تشيز كيك', price: '30 ₪' },
            { en: 'German cake',        ar: 'جيرمن كيك',        price: '30 ₪' },
            { en: 'Tiramisu',           ar: 'تيراميسو',         price: '25 ₪' },
            { en: 'Souffle',            ar: 'سوفليه',           price: '25 ₪' },
            { en: 'Kindly ask the waiter for more.', ar: 'لطفاً اسأل النادل للمزيد', price: '' }
          ]
        }
      ]
    },
    {
      slug: 'berzait', name_en: 'Berzait · بيرزيت', name_ar: 'بيرزيت',
      categories: [
        {
          slug: 'sandwiches', name_en: 'Sandwiches · ساندويشات', name_ar: 'ساندويشات',
          items: [
            { en: 'Chicken Sandwich',        ar: 'مسحب',           price: '25 ₪' },
            { en: 'Mexican Chicken',         ar: 'مسحب مكسيكي',    price: '25 ₪' },
            { en: 'White Sauce Chicken',     ar: 'مسحب وايت صوص',  price: '25 ₪' },
            { en: 'Italian Chicken Sandwich',ar: 'مسحب إيطالي',    price: '25 ₪' },
            { en: 'Chicken Zinger',          ar: 'زنجر دجاج',      price: '25 ₪' },
            { en: 'Classic Burger',          ar: 'برجر كلاسيك',    price: '35 ₪' },
            { en: 'Mushroom Burger',         ar: 'برجر مع مشروم',  price: '35 ₪' },
            { en: 'Chicken Shawarma',        ar: 'شاورما دجاج',    price: '25 ₪' }
          ]
        },
        {
          slug: 'appetizers', name_en: 'Appetizers · المقبلات', name_ar: 'المقبلات',
          items: [
            { en: 'Garlic Bread',            ar: 'خبز بالثوم',           price: '15 ₪' },
            { en: 'Meat Rolls (8 pcs)',      ar: 'أصابع لحمة · 8 قطع',   price: '25 ₪' },
            { en: 'Chicken Fingers (6 pcs)', ar: 'أصابع دجاج · 6 قطع',   price: '25 ₪' },
            { en: 'Potato Rolls (8 pcs)',    ar: 'أصابع بطاطا · 8 قطع',  price: '25 ₪' },
            { en: 'French Fries',            ar: 'بطاطا مقلية',          price: '12 ₪' },
            { en: 'Nachos',                  ar: 'ناتشوز',               price: '25 ₪' }
          ]
        },
        {
          slug: 'mains', name_en: 'Main Course · الأطباق', name_ar: 'الأطباق الرئيسية',
          items: [
            { en: 'Fajita',                                  ar: 'فاهيتا',             price: '35 ₪' },
            { en: 'Chicken Steak with Sautéed Vegetables',   ar: 'ستيك دجاج مع خضار',  price: '35 ₪' },
            { en: 'Fettuccine',                              ar: 'فيتوتشيني / دجاج',   price: '30–35 ₪' },
            { en: 'Stroganoff',                              ar: 'ستروجانوف',          price: '35 ₪' }
          ]
        },
        {
          slug: 'salads', name_en: 'Salads · سلطات', name_ar: 'سلطات',
          items: [
            { en: 'Caesar Salad',  ar: 'سيزر',          price: '25 ₪' },
            { en: 'Fattoush',      ar: 'فتوش',          price: '17 ₪' },
            { en: 'Tabbouleh',     ar: 'تبولة',         price: '17 ₪' },
            { en: 'Chicken Salad', ar: 'سلطة دجاج',     price: '25 ₪' },
            { en: 'Greek Salad',   ar: 'سلطة يونانية',  price: '20 ₪' },
            { en: 'Tuna Salad',    ar: 'سلطة تونا',     price: '20 ₪' }
          ]
        },
        {
          slug: 'tost', name_en: 'Tost · توست', name_ar: 'توست',
          items: [
            { en: 'Mix tost',          ar: 'توست مشكل',        price: '25 ₪' },
            { en: 'Cheese tost',       ar: 'توست جبنة صفراء',  price: '25 ₪' },
            { en: 'Sausage tost',      ar: 'توست نقانق',       price: '25 ₪' },
            { en: 'White Cheese tost', ar: 'توست جبنة بيضاء',  price: '25 ₪' },
            { en: 'Tuna tost',         ar: 'توست تونا',        price: '25 ₪' },
            { en: 'Roast beef tost',   ar: 'توست روست بيف',    price: '35 ₪' },
            { en: 'Smoked turkey tost',ar: 'توست حبش',         price: '35 ₪' }
          ]
        },
        {
          slug: 'dessert', name_en: 'Dessert · حلويات', name_ar: 'حلويات',
          items: [
            { en: 'NewYork cheesecake', ar: 'نيويورك تشيز كيك', price: '30 ₪' },
            { en: 'German cake',        ar: 'جيرمن كيك',        price: '30 ₪' },
            { en: 'Tiramisu',           ar: 'تيراميسو',         price: '25 ₪' },
            { en: 'Souffle',            ar: 'سوفليه',           price: '25 ₪' },
            { en: 'Kindly ask the waiter for more.', ar: 'لطفاً اسأل النادل للمزيد', price: '' }
          ]
        }
      ]
    }
  ],

  /* ----- locations ------------------------------------------------------- */
  locations: [
    {
      num: '01', name_ar: 'شارع ركب', name_en: 'Rukab Street · Ramallah',
      description_en: 'Our original home — the one where every tile has a memory, and every corner has heard a thousand stories.', description_ar: '',
      address_en: 'Rukab Street, Ramallah, Palestine', address_ar: '',
      social_handle: '@aleppo.cafe.palestine',
      map_url: 'https://www.instagram.com/aleppo.cafe.palestine?igsh=MTJjbTNzbm5sa2I1Yw=='
    },
    {
      num: '02', name_ar: 'بيرزيت', name_en: 'Birzait · Ramallah',
      description_en: 'The second chapter — bringing the same warmth and heritage to the heart of Birzait, welcoming a new family of regulars.', description_ar: '',
      address_en: "Birzait University's eastern gate, Ramallah, Palestine", address_ar: '',
      social_handle: '@aleppo.cafe.palestine',
      map_url: 'https://www.instagram.com/aleppo.cafe.palestine?igsh=MTJjbTNzbm5sa2I1Yw=='
    }
  ],

  /* ----- social + contact links ------------------------------------------ */
  social: [
    { platform: 'facebook',  label: 'Facebook',              url: 'https://www.facebook.com/aleppocafepal', icon: 'f',  sort_order: 1 },
    { platform: 'instagram', label: '@aleppo.cafe.palestine', url: 'https://www.instagram.com/aleppo.cafe.palestine?igsh=MTJjbTNzbm5sa2I1Yw==', icon: 'ig', sort_order: 2 }
  ]
};
