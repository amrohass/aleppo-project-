-- ============================================================================
--  Aleppo Cafe — seed data (menu, locations, social)
--  Run AFTER schema.sql:  SQL Editor → New query → paste → Run.
--
--  This loads the current menu so the CMS starts populated. Text/headings are
--  NOT seeded here — the site already falls back to the built-in defaults for
--  any text, and the CMS "Text & Images" tab shows those same defaults ready
--  to edit (click "Save all changes" there to store them).
--
--  Safe to re-run: it clears the menu/location/social tables first.
-- ============================================================================

begin;

delete from public.menu_items;
delete from public.subcategories;
delete from public.categories;
delete from public.branches;
delete from public.locations;
delete from public.social_links;

-- ---- branches --------------------------------------------------------------
insert into public.branches (slug, name_en, name_ar, sort_order) values
  ('ramallah', 'Ramallah · رام الله', 'رام الله', 1),
  ('berzait',  'Berzait · بيرزيت',    'بيرزيت',   2);

-- ---- categories ------------------------------------------------------------
insert into public.categories (branch_id, slug, name_en, name_ar, sort_order)
select b.id, v.slug, v.en, v.ar, v.ord
from public.branches b
join (values
  ('ramallah','drinks',     'Drinks · مشروبات',        'مشروبات',           1),
  ('ramallah','sandwiches', 'Sandwiches · ساندويشات',  'ساندويشات',          2),
  ('ramallah','appetizers', 'Appetizers · المقبلات',   'المقبلات',           3),
  ('ramallah','mains',      'Main Course · الأطباق',   'الأطباق الرئيسية',   4),
  ('ramallah','salads',     'Salads · سلطات',          'سلطات',              5),
  ('ramallah','tost',       'Tost · توست',             'توست',               6),
  ('ramallah','dessert',    'Dessert · حلويات',        'حلويات',             7),
  ('berzait', 'sandwiches', 'Sandwiches · ساندويشات',  'ساندويشات',          1),
  ('berzait', 'appetizers', 'Appetizers · المقبلات',   'المقبلات',           2),
  ('berzait', 'mains',      'Main Course · الأطباق',   'الأطباق الرئيسية',   3),
  ('berzait', 'salads',     'Salads · سلطات',          'سلطات',              4),
  ('berzait', 'tost',       'Tost · توست',             'توست',               5),
  ('berzait', 'dessert',    'Dessert · حلويات',        'حلويات',             6)
) as v(branch, slug, en, ar, ord) on v.branch = b.slug;

-- ---- sub-groups (Ramallah drinks only) ------------------------------------
insert into public.subcategories (category_id, slug, name_en, name_ar, sort_order)
select c.id, v.slug, v.en, v.ar, v.ord
from public.categories c
join public.branches b on b.id = c.branch_id and b.slug = 'ramallah'
join (values
  ('hot',       'Hot · مشروبات ساخنة',       'مشروبات ساخنة', 1),
  ('cold',      'Cold · مشروبات باردة',      'مشروبات باردة', 2),
  ('juices',    'Fresh Juices · عصائر طبيعية','عصائر طبيعية', 3),
  ('cocktails', 'Cocktails · كوكتيلات',      'كوكتيلات',      4),
  ('iced',      'Iced Drinks · مشروبات مثلجة','مشروبات مثلجة', 5),
  ('shakes',    'Milk Shakes · ميلك',        'ميلك شيك',      6)
) as v(slug, en, ar, ord) on true
where c.slug = 'drinks';

-- ---- helper: shorthand to seed items of one branch+category ---------------
--  (repeated inline blocks below — Postgres has no procedure needed)

-- Ramallah · Drinks · Hot
insert into public.menu_items (category_id, subcategory_id, name_en, name_ar, price, sort_order)
select c.id, s.id, v.en, v.ar, v.price, v.ord
from public.categories c
join public.branches b on b.id = c.branch_id and b.slug = 'ramallah'
join public.subcategories s on s.category_id = c.id and s.slug = 'hot'
join (values
  ('Arabic Coffe','','7 ₪',1),('Espresso','','10 / 7 ₪',2),('Americano','','10 ₪',3),
  ('Tea','','6 ₪',4),('Cappuccino','','10 ₪',5),('Latte','','10 ₪',6),
  ('Spanish Latte','','15 ₪',7),('Hot Chocolate','','10 ₪',8),('Italian Chocolete','','15 ₪',9),
  ('Herbs','','10 ₪',10),('Frensh Vanilla','','15 ₪',11),('Matta','','7 ₪',12),
  ('Niscafe','','7 ₪',13),('Hazelnut','','15 ₪',14),('Toffee Caramel','','15 ₪',15),
  ('Masla chai','','10 ₪',16),('Honey Tea','','10 ₪',17),('Green Tea','','10 ₪',18),
  ('Chai Latte','','15 ₪',19),('Mocha','','15 ₪',20)
) as v(en, ar, price, ord) on true
where c.slug = 'drinks';

-- Ramallah · Drinks · Cold
insert into public.menu_items (category_id, subcategory_id, name_en, name_ar, price, sort_order)
select c.id, s.id, v.en, v.ar, v.price, v.ord
from public.categories c
join public.branches b on b.id = c.branch_id and b.slug = 'ramallah'
join public.subcategories s on s.category_id = c.id and s.slug = 'cold'
join (values
  ('Bavari','بافاريا','30 ₪',1),('Soda water','','30 ₪',2),('XL','','30 ₪',3),
  ('Water L','','30 ₪',4),('Water S','','30 ₪',5),('Soft Drinks','','30 ₪',6)
) as v(en, ar, price, ord) on true
where c.slug = 'drinks';

-- Ramallah · Drinks · Juices
insert into public.menu_items (category_id, subcategory_id, name_en, name_ar, price, sort_order)
select c.id, s.id, v.en, v.ar, v.price, v.ord
from public.categories c
join public.branches b on b.id = c.branch_id and b.slug = 'ramallah'
join public.subcategories s on s.category_id = c.id and s.slug = 'juices'
join (values
  ('Orange Juice','عصير برتقال','15 ₪',1),('Lemon & Mint','ليمون ونعنع','15 ₪',2),
  ('Carrot Juice','عصير جزر','15 ₪',3)
) as v(en, ar, price, ord) on true
where c.slug = 'drinks';

-- Ramallah · Drinks · Cocktails
insert into public.menu_items (category_id, subcategory_id, name_en, name_ar, price, sort_order)
select c.id, s.id, v.en, v.ar, v.price, v.ord
from public.categories c
join public.branches b on b.id = c.branch_id and b.slug = 'ramallah'
join public.subcategories s on s.category_id = c.id and s.slug = 'cocktails'
join (values ('Fruit Cocktail','كوكتيل فواكه','20 ₪',1)) as v(en, ar, price, ord) on true
where c.slug = 'drinks';

-- Ramallah · Drinks · Iced
insert into public.menu_items (category_id, subcategory_id, name_en, name_ar, price, sort_order)
select c.id, s.id, v.en, v.ar, v.price, v.ord
from public.categories c
join public.branches b on b.id = c.branch_id and b.slug = 'ramallah'
join public.subcategories s on s.category_id = c.id and s.slug = 'iced'
join (values
  ('Iced Coffee','قهوة مثلجة','15 ₪',1),('Iced Latte','لاتيه مثلج','15 ₪',2)
) as v(en, ar, price, ord) on true
where c.slug = 'drinks';

-- Ramallah · Drinks · Shakes
insert into public.menu_items (category_id, subcategory_id, name_en, name_ar, price, sort_order)
select c.id, s.id, v.en, v.ar, v.price, v.ord
from public.categories c
join public.branches b on b.id = c.branch_id and b.slug = 'ramallah'
join public.subcategories s on s.category_id = c.id and s.slug = 'shakes'
join (values
  ('Vanilla Shake','ميلك شيك فانيلا','18 ₪',1),('Chocolate Shake','ميلك شيك شوكولا','18 ₪',2)
) as v(en, ar, price, ord) on true
where c.slug = 'drinks';

-- Sandwiches (both branches share the same list)
insert into public.menu_items (category_id, name_en, name_ar, price, sort_order)
select c.id, v.en, v.ar, v.price, v.ord
from public.categories c
join (values
  ('Chicken Sandwich','مسحب','25 ₪',1),('Mexican Chicken','مسحب مكسيكي','25 ₪',2),
  ('White Sauce Chicken','مسحب وايت صوص','25 ₪',3),('Italian Chicken Sandwich','مسحب إيطالي','25 ₪',4),
  ('Chicken Zinger','زنجر دجاج','25 ₪',5),('Classic Burger','برجر كلاسيك','35 ₪',6),
  ('Mushroom Burger','برجر مع مشروم','35 ₪',7),('Chicken Shawarma','شاورما دجاج','25 ₪',8)
) as v(en, ar, price, ord) on true
where c.slug = 'sandwiches';

-- Appetizers
insert into public.menu_items (category_id, name_en, name_ar, price, sort_order)
select c.id, v.en, v.ar, v.price, v.ord
from public.categories c
join (values
  ('Garlic Bread','خبز بالثوم','15 ₪',1),('Meat Rolls (8 pcs)','أصابع لحمة · 8 قطع','25 ₪',2),
  ('Chicken Fingers (6 pcs)','أصابع دجاج · 6 قطع','25 ₪',3),('Potato Rolls (8 pcs)','أصابع بطاطا · 8 قطع','25 ₪',4),
  ('French Fries','بطاطا مقلية','12 ₪',5),('Nachos','ناتشوز','25 ₪',6)
) as v(en, ar, price, ord) on true
where c.slug = 'appetizers';

-- Main Course
insert into public.menu_items (category_id, name_en, name_ar, price, sort_order)
select c.id, v.en, v.ar, v.price, v.ord
from public.categories c
join (values
  ('Fajita','فاهيتا','35 ₪',1),('Chicken Steak with Sautéed Vegetables','ستيك دجاج مع خضار','35 ₪',2),
  ('Fettuccine','فيتوتشيني / دجاج','30–35 ₪',3),('Stroganoff','ستروجانوف','35 ₪',4)
) as v(en, ar, price, ord) on true
where c.slug = 'mains';

-- Salads
insert into public.menu_items (category_id, name_en, name_ar, price, sort_order)
select c.id, v.en, v.ar, v.price, v.ord
from public.categories c
join (values
  ('Caesar Salad','سيزر','25 ₪',1),('Fattoush','فتوش','17 ₪',2),('Tabbouleh','تبولة','17 ₪',3),
  ('Chicken Salad','سلطة دجاج','25 ₪',4),('Greek Salad','سلطة يونانية','20 ₪',5),('Tuna Salad','سلطة تونا','20 ₪',6)
) as v(en, ar, price, ord) on true
where c.slug = 'salads';

-- Tost
insert into public.menu_items (category_id, name_en, name_ar, price, sort_order)
select c.id, v.en, v.ar, v.price, v.ord
from public.categories c
join (values
  ('Mix tost','توست مشكل','25 ₪',1),('Cheese tost','توست جبنة صفراء','25 ₪',2),
  ('Sausage tost','توست نقانق','25 ₪',3),('White Cheese tost','توست جبنة بيضاء','25 ₪',4),
  ('Tuna tost','توست تونا','25 ₪',5),('Roast beef tost','توست روست بيف','35 ₪',6),
  ('Smoked turkey tost','توست حبش','35 ₪',7)
) as v(en, ar, price, ord) on true
where c.slug = 'tost';

-- Dessert
insert into public.menu_items (category_id, name_en, name_ar, price, sort_order)
select c.id, v.en, v.ar, v.price, v.ord
from public.categories c
join (values
  ('NewYork cheesecake','نيويورك تشيز كيك','30 ₪',1),('German cake','جيرمن كيك','30 ₪',2),
  ('Tiramisu','تيراميسو','25 ₪',3),('Souffle','سوفليه','25 ₪',4),
  ('Kindly ask the waiter for more.','لطفاً اسأل النادل للمزيد','',5)
) as v(en, ar, price, ord) on true
where c.slug = 'dessert';

-- ---- locations -------------------------------------------------------------
insert into public.locations (num, name_en, name_ar, description_en, address_en, social_handle, map_url, sort_order) values
  ('01', 'Rukab Street · Ramallah', 'شارع ركب',
   'Our original home — the one where every tile has a memory, and every corner has heard a thousand stories.',
   'Rukab Street, Ramallah, Palestine', '@aleppo.cafe.palestine',
   'https://www.instagram.com/aleppo.cafe.palestine?igsh=MTJjbTNzbm5sa2I1Yw==', 1),
  ('02', 'Birzait · Ramallah', 'بيرزيت',
   'The second chapter — bringing the same warmth and heritage to the heart of Birzait, welcoming a new family of regulars.',
   'Birzait University''s eastern gate, Ramallah, Palestine', '@aleppo.cafe.palestine',
   'https://www.instagram.com/aleppo.cafe.palestine?igsh=MTJjbTNzbm5sa2I1Yw==', 2);

-- ---- social / contacts -----------------------------------------------------
insert into public.social_links (platform, label, url, icon, sort_order) values
  ('facebook',  'Facebook',               'https://www.facebook.com/aleppocafepal', 'f',  1),
  ('instagram', '@aleppo.cafe.palestine', 'https://www.instagram.com/aleppo.cafe.palestine?igsh=MTJjbTNzbm5sa2I1Yw==', 'ig', 2);

commit;

-- Done. Reload the website (and the CMS) to see the data.
