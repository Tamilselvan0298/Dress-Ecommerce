const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning previous records ---');
  await prisma.auditLog.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.couponUsage.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.orderStatusHistory.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.shipment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.inventoryTransaction.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.productModel3D.deleteMany({});
  await prisma.productVideo.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.homepageSection.deleteMany({});
  await prisma.blogPost.deleteMany({});

  console.log('--- Seeding Users (Admin & Customers) ---');
  const superAdmin = await prisma.user.create({
    data: {
      name: 'Gayathri Sundaram',
      email: 'admin@avanya-couture.com',
      role: 'SUPER_ADMIN',
      phone: '+91 98401 23456',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: 'Radhika Mehra',
      email: 'radhika.mehra@example.com',
      role: 'CUSTOMER',
      phone: '+91 98112 87654',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    },
  });

  await prisma.address.create({
    data: {
      userId: customerUser.id,
      fullName: 'Radhika Mehra',
      addressLine1: 'Penthouse 14B, The Amaltas Residences',
      addressLine2: 'Prithviraj Road, Lutyens',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110011',
      country: 'India',
      phone: '+91 98112 87654',
      isDefaultShipping: true,
      isDefaultBilling: true,
    },
  });

  console.log('--- Seeding Categories ---');
  const categoriesData = [
    {
      name: 'Kanchipuram Silk',
      slug: 'kanchipuram-silk',
      description: 'Lustrous mulberry silks woven with interlocked Korvai borders and pure dipped zari from Tamil Nadu.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
      displayOrder: 1,
    },
    {
      name: 'Banarasi Brocade',
      slug: 'banarasi-brocade',
      description: 'Opulent Katan silks hand-embroidered with intricate Kadwa jaal and Mughal-inspired floral meenakari motifs.',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
      displayOrder: 2,
    },
    {
      name: 'Organza & Tissue',
      slug: 'organza-tissue',
      description: 'Gossamer-light glass tissue and translucent organzas woven with metallic threads for ethereal, modern draping.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
      displayOrder: 3,
    },
    {
      name: 'Chanderi & Handloom',
      slug: 'chanderi-handloom',
      description: 'Feather-weight silk-cotton weaves adorned with delicate peacock and coin butis, celebrating understated royalty.',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85',
      displayOrder: 4,
    },
    {
      name: 'Raw Silk & Tussar',
      slug: 'raw-silk-tussar',
      description: 'Textured wild forest silks embodying organic luxury, earthy tones, and temple border detailing.',
      image: 'https://images.unsplash.com/photo-1610030469854-46c59b646c24?auto=format&fit=crop&w=1200&q=85',
      displayOrder: 5,
    },
    {
      name: 'Royal Paithani',
      slug: 'royal-paithani',
      description: 'The queen of Maharashtrian silks featuring oblique square tapestries and kaleidoscopic peacocks in gold.',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=85',
      displayOrder: 6,
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created;
  }

  console.log('--- Seeding Collections ---');
  const collectionsData = [
    {
      name: 'The Royal Heirloom',
      slug: 'the-royal-heirloom',
      tagline: 'Centuries of Dynasty Weaves Reborn',
      description: 'Heavy architectural borders, pure 3-ply mulberry silk, and heirloom-grade gold zari crafted for milestone nuptials.',
      bannerImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=85',
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: 'Timeless Ivory & Muted Gold',
      slug: 'ivory-and-gold',
      tagline: 'Quiet Luxury in Monochromatic Splendor',
      description: 'Understated tones of vanilla bean, raw pearl, champagne tissue, and burnished bronze zari.',
      bannerImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85',
      isFeatured: true,
      displayOrder: 2,
    },
    {
      name: 'Midnight Noir & Jewel Tones',
      slug: 'midnight-noir',
      tagline: 'Dramatic Evening Drape for Contemporary Galas',
      description: 'Deep obsidian, royal lapis, rich emerald, and antique copper borders for after-dark allure.',
      bannerImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1800&q=85',
      isFeatured: true,
      displayOrder: 3,
    },
    {
      name: 'The Modern Minimalist',
      slug: 'the-modern-minimalist',
      tagline: 'Weightless Sophistication for Global Soirées',
      description: 'Clean geometry, fluid falls, unembellished borders, and innovative silk-linen blends designed to move effortlessly.',
      bannerImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1800&q=85',
      isFeatured: false,
      displayOrder: 4,
    },
  ];

  const collections = {};
  for (const col of collectionsData) {
    const created = await prisma.collection.create({ data: col });
    collections[col.slug] = created;
  }

  console.log('--- Seeding 32 Luxury Sarees with Editorial Data ---');

  const rawProducts = [
    {
      title: 'Aura Crimson Sovereign Kanchipuram',
      slug: 'aura-crimson-sovereign-kanchipuram',
      sku: 'AVN-KAN-001',
      categorySlug: 'kanchipuram-silk',
      collectionSlug: 'the-royal-heirloom',
      price: 84500,
      compareAtPrice: 98000,
      shortDescription: 'Regal crimson red pure silk with contrast Korvai emerald pallu and Mayil peacock motifs.',
      description: 'Woven over 48 artisan days in Kanchipuram, this masterpiece features the storied three-shuttle Korvai interlock. Heavy gold zari borders showcase twin mythical swans (Annam) and Mayil motifs, creating an eternal wedding statement.',
      fabric: 'Pure Mulberry Silk (Heavy 3-Ply)',
      weaveType: 'Handloom Korvai Double Warp',
      pattern: 'Traditional Mayil & Temple Rudraksha Jaal',
      borderType: 'Broad 12-inch Korvai Temple Border',
      zariType: 'Pure Silver Dipped 24K Gold Zari',
      occasion: 'Bridal / Wedding Muhurtham',
      originRegion: 'Kanchipuram, Tamil Nadu',
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1400&q=85',
      ],
      has3D: true,
    },
    {
      title: 'Ivory Pearl & Muted Gold Tissue Drape',
      slug: 'ivory-pearl-muted-gold-tissue-drape',
      sku: 'AVN-TIS-002',
      categorySlug: 'organza-tissue',
      collectionSlug: 'ivory-and-gold',
      price: 68900,
      compareAtPrice: 79000,
      shortDescription: 'Glass tissue saree in warm ivory, threaded with micro-warp spun gold metallic fibers.',
      description: 'A contemporary ode to bridal minimalism. The translucent warm ivory body catches ambient light with quiet radiance. Paired with a delicate scalloped champagne zari edge and self-toned unstitched blouse.',
      fabric: 'Pure Mulberry Silk Tissue',
      weaveType: 'Fine Warp Metal-Spun Weft',
      pattern: 'Continuous Shimmer Texture with Micro Polka Butis',
      borderType: 'Hand-Cut Scallop Champagne Zari',
      zariType: 'Tested Antique Champagne Zari',
      occasion: 'Reception, Cocktails, Sangeet',
      originRegion: 'Varanasi Atelier',
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1400&q=85',
      ],
      has3D: true,
    },
    {
      title: 'Varanasi Imperial Midnight Noir Kadwa',
      slug: 'varanasi-imperial-midnight-noir-kadwa',
      sku: 'AVN-BAN-003',
      categorySlug: 'banarasi-brocade',
      collectionSlug: 'midnight-noir',
      price: 92000,
      compareAtPrice: 105000,
      shortDescription: 'Deep obsidian Katan silk with raised antique gold Shikargah hunting jaal and meenakari accents.',
      description: 'The zenith of Banarasi craftsmanship. Every motif is hand-woven using the painstaking Kadwa technique without trailing threads on the reverse. Deep black silk acts as a dramatic canvas for antique gold vines and miniature sapphire birds.',
      fabric: 'Pure Katan Silk (Handspun)',
      weaveType: 'Authentic Kadwa Handloom',
      pattern: 'Shikargah Royal Forest Jaal',
      borderType: 'Traditional Koniya Corner Paisleys',
      zariType: 'Antique Matte Copper-Gold Zari',
      occasion: 'Royal Gala, Black Tie Reception',
      originRegion: 'Varanasi, Uttar Pradesh',
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1610030469854-46c59b646c24?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85',
      ],
      has3D: true,
    },
    {
      title: 'Champagne Whisper Chanderi Gossamer',
      slug: 'champagne-whisper-chanderi-gossamer',
      sku: 'AVN-CHA-004',
      categorySlug: 'chanderi-handloom',
      collectionSlug: 'the-modern-minimalist',
      price: 42500,
      compareAtPrice: 48000,
      shortDescription: 'Weightless handspun silk-cotton with hand-plucked ashrafi gold coin butis and translucent fall.',
      description: 'Crafted in the historic looms of Chanderi, this saree blends unbleached organic cotton with lustrous mulberry warp. The fall is liquid and crisp, ideal for warm destination ceremonies and intimate gatherings.',
      fabric: 'Silk By Cotton Chanderi',
      weaveType: 'Fine Open Warp Plain Weave',
      pattern: 'Micro Ashrafi Gold Coin Butis',
      borderType: 'Narrow Adda Gold Border',
      zariType: 'Muted Yellow Gold Zari',
      occasion: 'Day Wedding, Mehendi, Intimate Soirée',
      originRegion: 'Chanderi, Madhya Pradesh',
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      images: [
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85',
      ],
      has3D: false,
    },
    {
      title: 'Peshwai Gold Peacock Royal Paithani',
      slug: 'peshwai-gold-peacock-royal-paithani',
      sku: 'AVN-PAI-005',
      categorySlug: 'royal-paithani',
      collectionSlug: 'the-royal-heirloom',
      price: 115000,
      compareAtPrice: 135000,
      shortDescription: 'Magenta jewel-toned silk with solid gold zari pallu adorned with kaleidoscope Mor-Bangadi motifs.',
      description: 'Commissioned from Master Paithani weavers in Yeola. Features a solid pure gold zari pallu with hand-interlocked colored silk wefts depicting dancing peacocks in an eternal lotus pond.',
      fabric: '100% Fine Mulberry Silk',
      weaveType: 'Tapestry Technique (Dhaap Weave)',
      pattern: 'Mor-Bangadi (Peacock & Bangle Ring Motif)',
      borderType: 'Narali (Coconut) Zari Border',
      zariType: 'Pure Silver Thread Wrapped in 24K Gold',
      occasion: 'Royal Wedding, Vidhi Mandap',
      originRegion: 'Yeola, Maharashtra',
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      images: [
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85',
      ],
      has3D: true,
    },
    {
      title: 'Wild Forest Amber & Gicha Tussar Silk',
      slug: 'wild-forest-amber-gicha-tussar-silk',
      sku: 'AVN-TUS-006',
      categorySlug: 'raw-silk-tussar',
      collectionSlug: 'the-modern-minimalist',
      price: 36000,
      compareAtPrice: 42000,
      shortDescription: 'Organic slub-textured tussar silk in burnt amber with charcoal temple borders.',
      description: 'Harvested from wild tropical cocoons, this untamed silk possesses a distinctive natural sheen and rich tactile texture. Accented with contrast charcoal temple borders and a striped tribal pallu.',
      fabric: '100% Wild Forest Tussar Silk',
      weaveType: 'Handspun Gicha Slub Weave',
      pattern: 'Natural Textured Slub with Tribal Pallu',
      borderType: 'Contrast Charcoal Geometric Temple',
      zariType: 'Hand-Twisted Muted Brass Zari',
      occasion: 'Art Galas, Literary Evenings, Casual Luxury',
      originRegion: 'Bhagalpur, Bihar',
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
      images: [
        'https://images.unsplash.com/photo-1610030469854-46c59b646c24?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85',
      ],
      has3D: false,
    },
    {
      title: 'Emerald Sovereign Vintage Kanchipuram',
      slug: 'emerald-sovereign-vintage-kanchipuram',
      sku: 'AVN-KAN-007',
      categorySlug: 'kanchipuram-silk',
      collectionSlug: 'the-royal-heirloom',
      price: 88000,
      compareAtPrice: 99000,
      shortDescription: 'Deep bottle emerald body with antique copper-gold Korvai border and Yali mythological motifs.',
      description: 'An architectural heirloom steeped in Dravidian temple lore. The body is an intense deep bottle emerald, framed by an 11-inch contrast ruby border depicting protective Yali beasts and celestial chariots.',
      fabric: 'Pure Heavy Kanchipuram Silk',
      weaveType: 'Korvai Petni Technique',
      pattern: 'Yali & Rudraksha Coin Motifs',
      borderType: '11-Inch Multi-Tiered Temple Border',
      zariType: 'Tested Antique Red-Gold Zari',
      occasion: 'Muhurtham & Traditional Celebrations',
      originRegion: 'Kanchipuram, Tamil Nadu',
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85',
      ],
      has3D: true,
    },
    {
      title: 'Blush Rose Floral Glass Organza',
      slug: 'blush-rose-floral-glass-organza',
      sku: 'AVN-ORG-008',
      categorySlug: 'organza-tissue',
      collectionSlug: 'ivory-and-gold',
      price: 54000,
      compareAtPrice: 62000,
      shortDescription: 'Translucent powder pink silk organza with hand-painted gold leaf marigolds and pearl border.',
      description: 'Romantic and featherlight. Each floral petal is delicately rendered by master miniature artists using genuine gold dust sizing, bordered by seed pearls and fine silver wire.',
      fabric: '100% Crisp Silk Organza',
      weaveType: 'Fine High-Twist Glass Organza',
      pattern: 'Hand-Applied Gold Foil Florals',
      borderType: 'Seed Pearl & Cutdana Hand Embroidery',
      zariType: 'Soft Silver Resham Zari',
      occasion: 'Destination Weddings, Sundowner Brunches',
      originRegion: 'Kolkata Studio',
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85',
      ],
      has3D: false,
    },
    {
      title: 'Sapphire Lapis Rangkat Banarasi Silk',
      slug: 'sapphire-lapis-rangkat-banarasi-silk',
      sku: 'AVN-BAN-009',
      categorySlug: 'banarasi-brocade',
      collectionSlug: 'midnight-noir',
      price: 135000,
      compareAtPrice: 155000,
      shortDescription: 'Multi-colored warp Rangkat Banarasi in royal sapphire with interwoven diagonal meenakari lattice.',
      description: 'The pinnacle of complexity in Indian textile arts. Rangkat weaving requires multiple colored warp threads dyed in sections. Only 4 master weavers in Varanasi maintain mastery over this intricate cadence.',
      fabric: 'Pure Handloom Katan Silk',
      weaveType: 'Authentic Banarasi Rangkat Kadwa',
      pattern: 'Diagonal Chevron Meenakari Jaal',
      borderType: 'Grand Paithani Style Lotus Border',
      zariType: 'Pure Silver Thread Electroplated with 24K Gold',
      occasion: 'Heritage Nuptials, Royal Banquets',
      originRegion: 'Varanasi, Uttar Pradesh',
      isFeatured: false,
      isBestseller: false,
      isNewArrival: true,
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85',
      ],
      has3D: true,
    },
    {
      title: 'Vanilla Cream & Antique Muted Kanjivaram',
      slug: 'vanilla-cream-antique-muted-kanjivaram',
      sku: 'AVN-KAN-010',
      categorySlug: 'kanchipuram-silk',
      collectionSlug: 'ivory-and-gold',
      price: 76000,
      compareAtPrice: 86000,
      shortDescription: 'Monochromatic warm cream body with tone-on-tone self zari damask weave and antique gold edge.',
      description: 'Elegance distilled to its purest form. Created for brides who eschew ostentation in favor of sublime texture and timeless restraint. Drapes with liquid architectural weight.',
      fabric: 'Pure Mulberry Silk',
      weaveType: 'Heavy Self-Jacquard Handloom',
      pattern: 'Subtle Paisleys and Floral Creeper',
      borderType: 'Tone-on-Tone Self Zari Fluted Border',
      zariType: 'Antique Matte Champagne Gold Zari',
      occasion: 'Intimate Ceremonies, Receptions',
      originRegion: 'Kanchipuram, Tamil Nadu',
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1400&q=85',
      ],
      has3D: true,
    },
    // Adding 22 more products to exceed 30+ items for rich catalog experience
  ];

  // Generate additional variations to make 32 total luxury products
  const colorThemes = [
    { name: 'Ochre Sand & Burnished Gold', hex: '#C68B45', cat: 'chanderi-handloom', col: 'ivory-and-gold', price: 46000 },
    { name: 'Garnet Ruby Temple Weave', hex: '#7A1C29', cat: 'kanchipuram-silk', col: 'the-royal-heirloom', price: 82000 },
    { name: 'Plum Royale Brocade Saree', hex: '#4A154B', cat: 'banarasi-brocade', col: 'midnight-noir', price: 96000 },
    { name: 'Pistachio Mint Silk Tissue', hex: '#9BB898', cat: 'organza-tissue', col: 'the-modern-minimalist', price: 61000 },
    { name: 'Sunburst Marigold Handloom', hex: '#D97706', cat: 'royal-paithani', col: 'the-royal-heirloom', price: 108000 },
    { name: 'Charcoal Slate Textured Raw Silk', hex: '#334155', cat: 'raw-silk-tussar', col: 'midnight-noir', price: 38500 },
    { name: 'Opalescent White Zari Kanjivaram', hex: '#F8FAFC', cat: 'kanchipuram-silk', col: 'ivory-and-gold', price: 79500 },
    { name: 'Vintage Vermilion Wedding Saree', hex: '#B91C1C', cat: 'banarasi-brocade', col: 'the-royal-heirloom', price: 94000 },
    { name: 'Copper Rust Chanderi Classic', hex: '#9A3412', cat: 'chanderi-handloom', col: 'the-modern-minimalist', price: 44000 },
    { name: 'Twilight Indigo Hand-Woven Organza', hex: '#1E1B4B', cat: 'organza-tissue', col: 'midnight-noir', price: 58000 },
    { name: 'Peacock Teal Pure Kanchipuram', hex: '#0F766E', cat: 'kanchipuram-silk', col: 'the-royal-heirloom', price: 87500 },
    { name: 'Mocha Taupe Raw Forest Tussar', hex: '#78350F', cat: 'raw-silk-tussar', col: 'the-modern-minimalist', price: 39000 },
    { name: 'Gold Leaf Sheer Organza Tissue', hex: '#EAB308', cat: 'organza-tissue', col: 'ivory-and-gold', price: 69900 },
    { name: 'Maharani Emerald Paithani Tapestry', hex: '#064E3B', cat: 'royal-paithani', col: 'the-royal-heirloom', price: 122000 },
    { name: 'Aubergine Katan Silk Brocade', hex: '#3B0764', cat: 'banarasi-brocade', col: 'midnight-noir', price: 89000 },
    { name: 'Sandstone Beige Chanderi Saree', hex: '#D6D3D1', cat: 'chanderi-handloom', col: 'ivory-and-gold', price: 41000 },
    { name: 'Scarlet Lotus Korvai Kanjivaram', hex: '#DC2626', cat: 'kanchipuram-silk', col: 'the-royal-heirloom', price: 91000 },
    { name: 'Honey Gold Wild Tussar Handloom', hex: '#CA8A04', cat: 'raw-silk-tussar', col: 'the-modern-minimalist', price: 41500 },
    { name: 'Champagne Rose Glass Tissue', hex: '#FDA4AF', cat: 'organza-tissue', col: 'ivory-and-gold', price: 63000 },
    { name: 'Royal Neelambari Banarasi Saree', hex: '#1D4ED8', cat: 'banarasi-brocade', col: 'midnight-noir', price: 98000 },
    { name: 'Antique Bronze Paithani Special', hex: '#713F12', cat: 'royal-paithani', col: 'the-royal-heirloom', price: 118000 },
    { name: 'Celestial Pearl Minimalist Silk', hex: '#F1F5F9', cat: 'chanderi-handloom', col: 'the-modern-minimalist', price: 43500 },
  ];

  const allProductsList = [...rawProducts];
  let idCounter = 11;

  for (const item of colorThemes) {
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    allProductsList.push({
      title: item.name + ' Saree',
      slug: slug,
      sku: `AVN-GEN-${String(idCounter).padStart(3, '0')}`,
      categorySlug: item.cat,
      collectionSlug: item.col,
      price: item.price,
      compareAtPrice: Math.round(item.price * 1.15),
      shortDescription: `Artisanal ${item.name} handcrafted with pure mulberry silk warp and master-loom precision.`,
      description: `Woven with generational reverence, this atelier piece embodies balanced geometry, weightless drape, and regal finish. Suitable for connoisseurs of authentic luxury fashion.`,
      fabric: item.cat === 'kanchipuram-silk' ? 'Pure Heavy Kanchipuram Silk' : item.cat === 'banarasi-brocade' ? 'Pure Katan Silk' : item.cat === 'organza-tissue' ? 'Silk Glass Tissue' : 'Fine Handspun Silk',
      weaveType: 'Traditional Handloom Weave',
      pattern: 'Traditional Motif & Delicate Zari Borders',
      borderType: 'Contrast Handloom Border',
      zariType: 'High-Purity Metallic Zari',
      occasion: 'Festive Gala & Wedding Celebrations',
      originRegion: 'Indian Handloom Heritage Weaves',
      isFeatured: idCounter % 3 === 0,
      isBestseller: idCounter % 4 === 0,
      isNewArrival: idCounter % 2 === 0,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85',
      ],
      has3D: idCounter % 5 === 0,
    });
    idCounter++;
  }

  const createdProducts = [];
  for (const p of allProductsList) {
    const category = categories[p.categorySlug] || Object.values(categories)[0];
    const collection = collections[p.collectionSlug] || Object.values(collections)[0];

    const product = await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        sku: p.sku,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        costPrice: Math.round(p.price * 0.45),
        fabric: p.fabric,
        weaveType: p.weaveType,
        pattern: p.pattern,
        borderType: p.borderType,
        zariType: p.zariType,
        occasion: p.occasion,
        originRegion: p.originRegion,
        isFeatured: p.isFeatured,
        isBestseller: p.isBestseller,
        isNewArrival: p.isNewArrival,
        categoryId: category.id,
        collectionId: collection.id,
      },
    });

    createdProducts.push(product);

    // Create Images
    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: p.images[i],
          alt: `${product.title} - Luxury drape view ${i + 1}`,
          isPrimary: i === 0,
          displayOrder: i,
        },
      });
    }

    // Create Variants
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        title: 'Original Heritage Colorway',
        sku: `${product.sku}-V1`,
        color: 'Editorial Master',
        colorHex: '#C5A880',
        size: 'Standard Saree (6.3m with Blouse)',
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: 12,
        image: p.images[0],
      },
    });

    await prisma.productVariant.create({
      data: {
        productId: product.id,
        title: 'Pre-stitched Ready-to-Wear Drape',
        sku: `${product.sku}-RTW`,
        color: 'Editorial Master',
        colorHex: '#8B1E1E',
        size: 'Custom Tailored Ready Pleats',
        price: product.price + 4500,
        compareAtPrice: (product.compareAtPrice || product.price) + 5000,
        stock: 6,
        image: p.images[1] || p.images[0],
      },
    });

    // Create Inventory
    await prisma.inventory.create({
      data: {
        productId: product.id,
        sku: product.sku,
        stockQuantity: 18,
        reservedQuantity: 1,
        lowStockThreshold: 3,
        location: 'Atelier Vault, Chennai',
      },
    });

    // Create 3D Model record if enabled
    if (p.has3D) {
      await prisma.productModel3D.create({
        data: {
          productId: product.id,
          modelUrl: '/models/luxury_saree_drape.glb',
          posterUrl: p.images[0],
          initialScale: 1.0,
          cameraPosition: '[0, 1.2, 3]',
          lightingPreset: 'atelier_studio',
          fabricDrapeTexture: 'silk_woven_normal',
          isInteractive: true,
        },
      });
    }

    // Create Reviews
    await prisma.review.create({
      data: {
        productId: product.id,
        userId: customerUser.id,
        userName: 'Radhika M.',
        rating: 5,
        title: 'An absolute heirloom of breathtaking grandeur',
        comment: 'The weight of the pure silk and the subtle gleam of the zari is unmatched. The packaging arrived wrapped in soft muslin with a personalized certificate of weaving authenticity.',
        isVerifiedPurchase: true,
        isApproved: true,
      },
    });
  }

  console.log(`--- Created ${createdProducts.length} Products ---`);

  console.log('--- Seeding Coupons ---');
  await prisma.coupon.create({
    data: {
      code: 'ROYAL10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 25000,
      maxDiscount: 15000,
      maxUses: 500,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'FIRSTORDER',
      discountType: 'FIXED',
      discountValue: 2500,
      minOrderValue: 20000,
      maxDiscount: 2500,
      maxUses: 1000,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'FESTIVE25',
      discountType: 'PERCENTAGE',
      discountValue: 25,
      minOrderValue: 80000,
      maxDiscount: 30000,
      maxUses: 50,
      isActive: true,
    },
  });

  console.log('--- Seeding Sample Orders ---');
  const sampleOrder1 = await prisma.order.create({
    data: {
      orderNumber: 'AVN-2026-000101',
      userId: customerUser.id,
      customerEmail: 'radhika.mehra@example.com',
      customerPhone: '+91 98112 87654',
      customerName: 'Radhika Mehra',
      status: 'CONFIRMED',
      subtotal: 84500,
      discountTotal: 8450,
      taxTotal: 4225,
      shippingTotal: 0,
      grandTotal: 80275,
      currency: 'INR',
      shippingAddressJson: JSON.stringify({
        fullName: 'Radhika Mehra',
        addressLine1: 'Penthouse 14B, The Amaltas Residences',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110011',
        country: 'India',
        phone: '+91 98112 87654',
      }),
      trackingNumber: 'BD-COUTURE-849204',
      courierName: 'Blue Dart Couture Express',
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: sampleOrder1.id,
      productId: createdProducts[0].id,
      productTitle: createdProducts[0].title,
      sku: createdProducts[0].sku,
      purchasedPrice: 84500,
      originalPrice: 84500,
      quantity: 1,
      total: 84500,
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: sampleOrder1.id,
      status: 'CONFIRMED',
      note: 'Payment verified and luxury muslin packaging initiated at Atelier.',
      changedBy: 'SuperAdmin Gayathri',
    },
  });

  await prisma.payment.create({
    data: {
      orderId: sampleOrder1.id,
      provider: 'RAZORPAY',
      transactionId: 'pay_test_984719283712',
      paymentOrderId: 'order_test_847192',
      amount: 80275,
      currency: 'INR',
      status: 'SUCCESS',
    },
  });

  console.log('--- Seeding Homepage CMS Sections ---');
  const cmsSections = [
    {
      sectionKey: 'hero_cinematic',
      title: 'THE ART OF DRAPING',
      subtitle: 'Where Generational Looms Meet Contemporary Haute Couture',
      label: 'HÉLÈNE EDITION • VOL. 2026',
      mediaUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=90',
      ctaText: 'EXPLORE THE MAISON',
      ctaLink: '/shop',
      displayOrder: 1,
      isEnabled: true,
      contentJson: JSON.stringify({
        subheadline: 'Handwoven pure mulberry silk dipped in 24K real gold zari.',
        ticker: ['PURE KANCHIPURAM', 'AUTHENTIC KADWA BANARASI', 'GLASS TISSUE ORGANZA', 'ROYAL PAITHANI TAPESTRY'],
        videoPoster: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=85',
      }),
    },
    {
      sectionKey: 'curated_drapes',
      title: 'SIGNATURE ARCHIVES',
      subtitle: 'Sculpted by hand, measured by centuries.',
      label: 'CURATED SELECTION',
      mediaUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=85',
      ctaText: 'VIEW THE LOOKBOOK',
      ctaLink: '/collections/the-royal-heirloom',
      displayOrder: 2,
      isEnabled: true,
      contentJson: JSON.stringify({
        tagline: 'Each weave requires between 28 and 90 continuous handloom days.',
      }),
    },
    {
      sectionKey: 'craftsmanship_heritage',
      title: 'GENEALOGY OF A WEAVE',
      subtitle: 'Four centuries of uninterrupted loom poetry.',
      label: 'THE ATELIER PHILOSOPHY',
      mediaUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1800&q=85',
      ctaText: 'DISCOVER OUR CRAFT',
      ctaLink: '/about',
      displayOrder: 3,
      isEnabled: true,
      contentJson: JSON.stringify({
        pillars: [
          { title: 'The 3-Ply Silk', description: 'Grade-A mulberry silk twisted by hand for incomparable tensile strength and fluid weight.' },
          { title: 'Electroplated Gold Zari', description: 'Real silver filaments dipped in 24-karat gold baths to ensure eternal lustre.' },
          { title: 'The Korvai Interlock', description: 'Three shuttles operating synchronously to fuse solid body silk with unyielding borders.' },
        ],
      }),
    },
  ];

  for (const s of cmsSections) {
    await prisma.homepageSection.create({ data: s });
  }

  console.log('--- Seeding Blog Posts ---');
  await prisma.blogPost.create({
    data: {
      title: 'The Secret Geometry of Korvai: Why Three Shuttles Make an Heirloom',
      slug: 'secret-geometry-of-korvai',
      excerpt: 'Explore the ancient Tamil interlocking craft where body and border achieve unyielding mathematical harmony.',
      content: `The Korvai technique is not merely a method of weaving; it is a sacred bilateral dialogue between two master weavers seated at opposing ends of the pit loom. 
      
While ordinary powerloom sarees produce borders as printed or loosely jacquard-overlaid elements, genuine Korvai fuses the warp of the body with the contrasting warp of the border through tiny interlaced tooth-teeth joins known as Petni or Rekku.

When you drape an authentic Kanchipuram Korvai, you are wrapping yourself in sixty days of synchronized human breath and physical discipline.`,
      coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85',
      category: 'Heritage & Craft',
      tags: 'Kanchipuram, Korvai, Handloom, Heritage',
      seoTitle: 'The Secret Geometry of Korvai Weaving | Avanya Atelier',
      seoDescription: 'Discover why authentic Korvai sarees require two weavers, three shuttles, and weeks of synchronized craft.',
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'Caring for Pure Gold Zari: Preserving Your Heirlooms Across Generations',
      slug: 'caring-for-pure-gold-zari',
      excerpt: 'The definitive conservation protocol for real silver-gold threaded silks, from muslin storage to fold rotations.',
      content: `True zari is living metal. Unlike synthetic polyester lurex, metallic silver reacts to moisture, ambient sulfur, and friction. 

Always store your pure silks wrapped in unbleached white muslin (mulmul) cloth. Never introduce plastic covers, which trap moisture and cause the silver core to tarnish. Every six months, unfold your saree along the warp and reverse the crease line to prevent fiber fatigue.`,
      coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=85',
      category: 'Conservation & Care',
      tags: 'Zari Care, Silk Preservation, Textile Maintenance',
      seoTitle: 'How to Care for Pure Gold Zari Sarees | Avanya Atelier',
      seoDescription: 'Master the preservation techniques to ensure your heirloom sarees remain pristine for daughters and granddaughters.',
    },
  });

  console.log('--- Seed Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

