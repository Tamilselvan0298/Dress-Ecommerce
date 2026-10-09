const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
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

  console.log('--- Seeding Avantika Clothing Admin & Customers ---');
  const superAdmin = await prisma.user.create({
    data: {
      name: 'Avantika Admin',
      email: 'care@avantikaclothing.com',
      role: 'SUPER_ADMIN',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  const sampleCustomer = await prisma.user.create({
    data: {
      name: 'Pooja Sharma',
      email: 'pooja.sharma@example.com',
      role: 'CUSTOMER',
      phone: '+91 98234 56789',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    },
  });

  await prisma.address.create({
    data: {
      userId: sampleCustomer.id,
      fullName: 'Pooja Sharma',
      addressLine1: 'B-402, Lotus Heights',
      addressLine2: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
      phone: '+91 98234 56789',
      isDefaultShipping: true,
      isDefaultBilling: true,
    },
  });

  console.log('--- Seeding Avantika Categories ---');
  const categoriesData = [
    {
      name: 'Batik Suits Unstitched',
      slug: 'batik-suits-unstitched',
      description: 'Authentic handcrafted 3-piece unstitched Batik suit sets in pure breathable cotton 60x60 with handcrafted dupattas.',
      image: 'https://cdn.shopify.com/s/files/1/0767/4468/7770/files/ruby-marigold-katha-batik-cotton-unstitched-suit-set-3481440.png?v=1787159890',
      displayOrder: 1,
    },
    {
      name: 'Batik Cloth & Fabric',
      slug: 'batik-cloth',
      description: 'Traditional wax batik fabric meterage crafted with heritage copper block stamps and organic vegetable dyes.',
      image: 'https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_14_2026_02_05_11_PM.png?v=1786696562&width=1500',
      displayOrder: 2,
    },
    {
      name: 'Batik Sarees',
      slug: 'cotton-coat-sets',
      description: 'Handcrafted Batik drapes and artisanal pure cotton sarees with running blouse pieces.',
      image: 'https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_14_2026_02_13_11_PM.webp?v=1787045362&width=1500',
      displayOrder: 3,
    },
    {
      name: 'Batik Suits Stitched',
      slug: 'batik-suits-stitched',
      description: 'Ready-to-wear tailored Batik kurta and pant sets with flowing matching dupattas.',
      image: 'https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_14_2026_02_10_40_PM.webp?v=1787045278&width=1500',
      displayOrder: 4,
    },
    {
      name: 'Cotton Batik Bedsheet',
      slug: 'cotton-batik-bedsheet',
      description: 'King and queen size hand-printed Batik bedsheets in 100% pure cotton with matching pillow covers.',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85',
      displayOrder: 5,
    },
  ];

  const categoryMap = {};
  for (const c of categoriesData) {
    categoryMap[c.slug] = await prisma.category.create({ data: c });
  }

  console.log('--- Seeding Avantika Collections ---');
  const collectionsData = [
    {
      name: 'New Arrivals',
      slug: 'new-arrivals',
      tagline: 'Handcrafted With Traditional Artistry & Timeless Elegance',
      description: 'Fresh off the dye tables — newly released wax batik and hand block printed suit sets.',
      bannerImage: 'https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_17_2026_02_03_00_AM.png?v=1786912868&width=3840',
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: 'Batik Cloth',
      slug: 'batik-cloth',
      tagline: 'Authentic Wax Batik & Copper Block Handprints',
      description: 'Centuries of wax-resist textile heritage reimagined into timeless ethnic apparel.',
      bannerImage: 'https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_17_2026_02_24_10_AM.png?v=1786913696&width=3840',
      isFeatured: true,
      displayOrder: 2,
    },
    {
      name: 'Batik Saree',
      slug: 'cotton-coat-sets',
      tagline: 'Elegance in Every Drape & Motif',
      description: 'Breathable handcrafted drapes made for celebratory gatherings, daily grace, and festive rituals.',
      bannerImage: 'https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_17_2026_02_39_28_AM.png?v=1786914608&width=3840',
      isFeatured: true,
      displayOrder: 3,
    },
    {
      name: 'Batik Suits Stitched',
      slug: 'batik-suits-stitched',
      tagline: 'Ready-to-Wear Effortless Sophistication',
      description: 'Impeccably tailored silhouettes combining artisan batik prints with contemporary cuts.',
      bannerImage: 'https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_17_2026_02_20_12_AM.png?v=1786913771&width=3840',
      isFeatured: true,
      displayOrder: 4,
    },
    {
      name: 'Batik Suits Unstitched',
      slug: 'batik-suits-unstitched',
      tagline: 'Tailor It Your Way — 3-Piece Complete Sets',
      description: 'Generous 2.5m top, 2.5m bottom, and 2.25m dupatta sets ready for your bespoke silhouette.',
      bannerImage: 'https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_17_2026_02_03_00_AM.png?v=1786912868&width=3840',
      isFeatured: true,
      displayOrder: 5,
    },
    {
      name: 'Cotton Batik Bedsheet',
      slug: 'cotton-batik-bedsheet',
      tagline: 'Artisanal Home Living in Pure Cotton',
      description: 'Transform your sanctuaries with hand-block wax batik bedspreads.',
      bannerImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1800&q=85',
      isFeatured: false,
      displayOrder: 6,
    },
  ];

  const collectionMap = {};
  for (const col of collectionsData) {
    collectionMap[col.slug] = await prisma.collection.create({ data: col });
  }

  console.log('--- Loading and Seeding Real Avantika Products ---');
  const rawShopifyData = JSON.parse(fs.readFileSync('C:/Users/TAMIL SELVAN/.gemini/antigravity/brain/fe017a29-d923-412a-811b-2728bb7d97fd/scratch/avantika_shopify_products.json', 'utf8'));
  const shopifyProducts = rawShopifyData.products || [];

  for (let i = 0; i < shopifyProducts.length; i++) {
    const sp = shopifyProducts[i];
    const price = parseFloat(sp.variants?.[0]?.price || '999');
    const compareAtPrice = sp.variants?.[0]?.compare_at_price ? parseFloat(sp.variants[0].compare_at_price) : price + 400;
    
    // Assign category
    let categoryId = categoryMap['batik-suits-unstitched'].id;
    let collectionId = collectionMap['new-arrivals'].id;

    if (sp.handle.includes('saree')) {
      categoryId = categoryMap['cotton-coat-sets'].id;
      collectionId = collectionMap['cotton-coat-sets'].id;
    } else if (sp.handle.includes('bedsheet')) {
      categoryId = categoryMap['cotton-batik-bedsheet'].id;
      collectionId = collectionMap['cotton-batik-bedsheet'].id;
    } else if (sp.handle.includes('batik-cloth')) {
      categoryId = categoryMap['batik-cloth'].id;
      collectionId = collectionMap['batik-cloth'].id;
    } else {
      // Rotate among collections
      if (i % 3 === 0) collectionId = collectionMap['new-arrivals'].id;
      else if (i % 3 === 1) collectionId = collectionMap['batik-suits-unstitched'].id;
      else collectionId = collectionMap['batik-cloth'].id;
    }

    const cleanDescription = (sp.body_html || 'Premium cotton 60x60 unstitched 3-piece suit set with authentic handcrafted wax batik / block print.')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const createdProduct = await prisma.product.create({
      data: {
        title: sp.title,
        slug: sp.handle,
        sku: `AVN-${String(i + 1).padStart(4, '0')}`,
        shortDescription: 'Authentic Handcrafted Batik 3-Piece Suit Set in Pure Cotton 60×60 with matching Dupatta.',
        description: cleanDescription,
        price: price,
        compareAtPrice: compareAtPrice,
        costPrice: Math.round(price * 0.45),
        fabric: 'Premium Pure Cotton 60×60',
        weaveType: 'Hand Block Wax Batik Print',
        pattern: 'Traditional Copper Block & Katha motifs',
        borderType: 'Handprinted border detail',
        zariType: 'Natural Organic Pigment / Wax Resist',
        sareeLength: 'Top: 2.50m | Bottom: 2.50m | Dupatta: 2.25m',
        blouseIncluded: true,
        blouseDetails: 'Matching 2.50m bottom fabric & 2.25m flowing cotton dupatta included',
        careInstructions: 'First wash dry clean recommended. Subsequently hand wash gently in cold water with mild liquid detergent. Dry in shade.',
        originRegion: 'Ujjain / Jaipur Craft Clusters, India',
        occasion: 'Casual & Daily Wear, Festive, Office Ethnic',
        weightGrams: 500,
        isFeatured: i < 8,
        isNewArrival: i < 6,
        isBestseller: i % 2 === 0,
        isPublished: true,
        categoryId: categoryId,
        collectionId: collectionId,
      },
    });

    // Create images
    if (sp.images && sp.images.length > 0) {
      for (let j = 0; j < sp.images.length; j++) {
        await prisma.productImage.create({
          data: {
            productId: createdProduct.id,
            url: sp.images[j].src,
            alt: `${sp.title} - View ${j + 1}`,
            displayOrder: j,
            isPrimary: j === 0,
          },
        });
      }
    } else {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: 'https://cdn.shopify.com/s/files/1/0767/4468/7770/files/ruby-marigold-katha-batik-cotton-unstitched-suit-set-3481440.png?v=1787159890',
          alt: sp.title,
          displayOrder: 0,
          isPrimary: true,
        },
      });
    }

    // Create standard variant
    const variant = await prisma.productVariant.create({
      data: {
        productId: createdProduct.id,
        sku: `${createdProduct.sku}-STD`,
        title: 'Unstitched 3-Piece Set',
        color: 'Artisan Multi',
        colorHex: '#C47B69',
        price: price,
        stock: 15 + (i * 3),
      },
    });

    // Create Inventory ledger
    await prisma.inventory.create({
      data: {
        productId: createdProduct.id,
        sku: createdProduct.sku,
        stockQuantity: 25,
        reservedQuantity: 2,
        lowStockThreshold: 5,
        location: 'Bhiwandi Central Hub, Rack A-12',
      },
    });

    // Seed 2-3 reviews per product
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: sampleCustomer.id,
        userName: sampleCustomer.name,
        rating: 5,
        title: 'Beautiful authentic batik fabric!',
        comment: 'The cotton 60x60 is remarkably soft and breathable. The wax crackle effect on the dupatta is exquisite. Will order again!',
        isVerifiedPurchase: true,
        isApproved: true,
      },
    });
  }

  console.log('--- Seeding Coupons ---');
  await prisma.coupon.create({
    data: {
      code: 'AVANTIKA10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 899,
      maxDiscount: 500,
      maxUses: 10000,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'BATIK15',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderValue: 1999,
      maxDiscount: 1000,
      maxUses: 5000,
      isActive: true,
    },
  });

  console.log('=== Avantika Clothing DB Seeding Complete! ===');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
