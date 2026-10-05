-- Re-seed Zaré catalog (12 products) for New Arrivals + Most Popular
-- Run AFTER admin-product-images-collections.sql if columns are missing

delete from public.products;

insert into public.products
  (name, slug, description, short_description, price, compare_at_price, category, volume, scent_notes, stock, image_url, featured, new_arrival, sort_order, created_at)
values
(
  'Noir Absolu', 'noir-absolu',
  'A commanding composition of smoked woods, black pepper and rich amber.',
  'Smoked woods, pepper & amber',
  2499, 3200, 'him', '50ml', array['Black Pepper','Cedar','Amber','Vetiver'],
  40, '/images/product-noir.jpg', true, false, 1, now() - interval '40 days'
),
(
  'Velvet Rose', 'velvet-rose',
  'Silk-soft petals meet warm vanilla and a whisper of musk.',
  'Rose, vanilla & soft musk',
  2799, 3400, 'her', '50ml', array['Damask Rose','Vanilla','White Musk','Peony'],
  35, '/images/product-velvet.jpg', true, false, 2, now() - interval '38 days'
),
(
  'Aura', 'aura',
  'A modern unisex signature of clean iris, soft woods and pale musk.',
  'Iris, soft woods & musk',
  2599, 3100, 'unisex', '50ml', array['Iris','Sandalwood','White Musk','Bergamot'],
  45, '/images/product-aura.jpg', true, false, 3, now() - interval '35 days'
),
(
  'Oud Al Layl', 'oud-al-layl',
  'Dark oud resin wrapped in saffron and sweet tobacco.',
  'Oud, saffron & tobacco',
  3499, 4200, 'unisex', '50ml', array['Agarwood','Saffron','Tobacco','Incense'],
  25, '/images/product-oud.jpg', true, false, 4, now() - interval '32 days'
),
(
  'Citrus Atelier', 'citrus-atelier',
  'Sunlit bergamot and bitter orange lifted by neroli.',
  'Bergamot, neroli & green notes',
  2199, 2800, 'him', '50ml', array['Bergamot','Neroli','Petitgrain','Cedar'],
  50, '/images/product-citrus.jpg', true, false, 5, now() - interval '28 days'
),
(
  'Rose de Soie', 'rose-de-soie',
  'A luminous Turkish rose absolute over creamy sandalwood.',
  'Turkish rose & sandalwood',
  2899, 3500, 'her', '50ml', array['Turkish Rose','Sandalwood','Amber','Lychee'],
  30, '/images/product-rose.jpg', true, false, 6, now() - interval '25 days'
),
(
  'Amber Nocturne', 'amber-nocturne',
  'Warm amber resin melted with tonka and soft spices.',
  'Amber, tonka & spice',
  2699, 3300, 'unisex', '50ml', array['Amber','Tonka','Cinnamon','Vanilla'],
  38, '/images/product-oud.jpg', false, true, 7, now() - interval '6 days'
),
(
  'Jade Vetiver', 'jade-vetiver',
  'Fresh cut vetiver with green citrus and cool moss.',
  'Vetiver, citrus & moss',
  2399, 2900, 'him', '50ml', array['Vetiver','Grapefruit','Oakmoss','Mint'],
  42, '/images/product-citrus.jpg', false, true, 8, now() - interval '5 days'
),
(
  'Blush Orchid', 'blush-orchid',
  'Exotic orchid petals over creamy coconut and soft woods.',
  'Orchid, coconut & woods',
  2999, 3600, 'her', '50ml', array['Orchid','Coconut','Ylang','Sandalwood'],
  28, '/images/product-velvet.jpg', false, true, 9, now() - interval '4 days'
),
(
  'Silver Musk', 'silver-musk',
  'Clean white musk with a metallic iris edge.',
  'White musk & iris',
  2299, 2700, 'unisex', '50ml', array['White Musk','Iris','Cashmere Wood','Aldehyde'],
  48, '/images/product-aura.jpg', false, true, 10, now() - interval '3 days'
),
(
  'Ember Leather', 'ember-leather',
  'Smoked leather wrapped in birch tar and sweet balsam.',
  'Leather, birch & balsam',
  3199, 3800, 'him', '50ml', array['Leather','Birch','Balsam','Smoke'],
  22, '/images/product-noir.jpg', false, true, 11, now() - interval '2 days'
),
(
  'Discovery Set', 'discovery-set',
  'Five 5ml samples of your choice from the Zaré collection.',
  '5 × 5ml samples of your choice',
  1499, 1999, 'testers', '5×5ml', array['Curated','Travel','Sampler'],
  60, '/images/product-rose.jpg', false, true, 12, now() - interval '1 day'
);
