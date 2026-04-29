require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  await prisma.sessionComment.deleteMany();
  await prisma.coachComment.deleteMany();
  await prisma.sessionReview.deleteMany();
  await prisma.coachReview.deleteMany();
  await prisma.favoriteSession.deleteMany();
  await prisma.favoriteCoach.deleteMany();
  await prisma.favoriteProduct.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.sessionBooking.deleteMany();
  await prisma.coachSession.deleteMany();
  await prisma.coachProfile.deleteMany();
  await prisma.shopProduct.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('soreadmin123', 10);
  const coachPassword = await bcrypt.hash('coach-temp', 10);

  const admin = await prisma.user.create({
    data: {
      firstName: 'Sorea',
      lastName: 'Admin',
      email: 'admin@sorea.local',
      password: adminPassword,
      role: 'admin',
      avatarUrl: '/images/logo_sorea.webp',
      isActive: true,
    },
  });

  const coaches = await Promise.all([
    prisma.user.create({
      data: {
        firstName: 'Lina',
        lastName: 'Moreau',
        email: 'lina.moreau@sorea.local',
        password: coachPassword,
        role: 'coach',
        avatarUrl: '/images/illustration_community.webp',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Nora',
        lastName: 'Benali',
        email: 'nora.benali@sorea.local',
        password: coachPassword,
        role: 'coach',
        avatarUrl: '/images/hero_cover.webp',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Camille',
        lastName: 'Rossi',
        email: 'camille.rossi@sorea.local',
        password: coachPassword,
        role: 'coach',
        avatarUrl: '/images/illustration_features.webp',
        isActive: true,
      },
    }),
  ]);

  const coachProfiles = await Promise.all(
    coaches.map((coach, index) =>
      prisma.coachProfile.create({
        data: {
          userId: coach.id,
          bio:
            index === 0
              ? 'Coach bien-être spécialisée dans les routines anti-stress et les micro-rituels du quotidien. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
              : index === 1
                ? 'Accompagnement respiration et recentrage. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'
                : 'Coach douceur & équilibre avec une approche sensorielle. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          specialty:
            index === 0 ? 'Gestion du stress' : index === 1 ? 'Respiration & énergie' : 'Équilibre émotionnel',
          experienceYears: 4 + index,
          hourlyRate: index === 0 ? 55 : index === 1 ? 65 : 50,
          averageRating: index === 0 ? 4.9 : index === 1 ? 4.8 : 4.7,
          verified: true,
        },
      })
    )
  );

  const products = await Promise.all([
    prisma.shopProduct.create({
      data: {
        name: 'Kit Pause Mentale',
        description: 'Un coffret pour ralentir, respirer et retrouver votre calme. Lorem ipsum dolor sit amet.',
        price: 29,
        stockQuantity: 18,
        imageUrl: '/images/product_1.webp',
        isActive: true,
      },
    }),
    prisma.shopProduct.create({
      data: {
        name: 'Lumière douce',
        description: 'Un rituel lumineux pour vos soirées. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        price: 42,
        stockQuantity: 12,
        imageUrl: '/images/product_2.webp',
        isActive: true,
      },
    }),
    prisma.shopProduct.create({
      data: {
        name: 'Carnet d’ancrage',
        description: 'Notes, intentions et gratitude au quotidien. Lorem ipsum dolor sit amet.',
        price: 18,
        stockQuantity: 25,
        imageUrl: '/images/product_3.webp',
        isActive: true,
      },
    }),
    prisma.shopProduct.create({
      data: {
        name: 'Brume sérénité',
        description: 'Une brume légère pour installer une ambiance apaisante. Lorem ipsum dolor sit amet.',
        price: 24,
        stockQuantity: 20,
        imageUrl: '/images/product_4.webp',
        isActive: true,
      },
    }),
    prisma.shopProduct.create({
      data: {
        name: 'Trousse zen',
        description: 'Le nécessaire pour une pause bien-être en déplacement. Lorem ipsum dolor sit amet.',
        price: 36,
        stockQuantity: 14,
        imageUrl: '/images/product_5.webp',
        isActive: true,
      },
    }),
    prisma.shopProduct.create({
      data: {
        name: 'Routine du soir',
        description: 'Le kit idéal pour apaiser le rythme avant de dormir. Lorem ipsum dolor sit amet.',
        price: 31,
        stockQuantity: 16,
        imageUrl: '/images/product_6.webp',
        isActive: true,
      },
    }),
  ]);

  const sessions = await Promise.all([
    prisma.coachSession.create({
      data: {
        coachId: coachProfiles[0].id,
        title: 'Pilates douceur',
        description: 'Une séance enveloppante pour relâcher les tensions et réveiller le corps. Lorem ipsum dolor sit amet.',
        sessionType: 'Pilates',
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
        durationMinutes: 45,
        capacity: 8,
        price: 45,
        averageRating: 4.9,
        isPublished: true,
      },
    }),
    prisma.coachSession.create({
      data: {
        coachId: coachProfiles[1].id,
        title: 'Respiration et recentrage',
        description: 'Un temps calme pour retrouver de la clarté et du souffle. Lorem ipsum dolor sit amet.',
        sessionType: 'Breathwork',
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        durationMinutes: 60,
        capacity: 10,
        price: 52,
        averageRating: 4.8,
        isPublished: true,
      },
    }),
    prisma.coachSession.create({
      data: {
        coachId: coachProfiles[2].id,
        title: 'Journal de sérénité',
        description: 'Écriture guidée pour poser ses pensées et avancer plus sereinement. Lorem ipsum dolor sit amet.',
        sessionType: 'Writing ritual',
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        durationMinutes: 50,
        capacity: 12,
        price: 40,
        averageRating: 4.7,
        isPublished: true,
      },
    }),
  ]);

  await prisma.coachReview.createMany({
    data: [
      {
        coachId: coachProfiles[0].id,
        userId: admin.id,
        rating: 5,
        reviewText: 'Très bonne énergie, séance ultra apaisante. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        coachId: coachProfiles[1].id,
        userId: admin.id,
        rating: 4.8,
        reviewText: 'Un accompagnement clair et doux. Lorem ipsum dolor sit amet.',
      },
    ],
  });

  await prisma.sessionReview.createMany({
    data: [
      {
        sessionId: sessions[0].id,
        userId: admin.id,
        rating: 5,
        reviewText: 'Parfait pour décompresser après une journée chargée. Lorem ipsum dolor sit amet.',
      },
      {
        sessionId: sessions[1].id,
        userId: admin.id,
        rating: 4.7,
        reviewText: 'Je ressors vraiment recentré. Lorem ipsum dolor sit amet.',
      },
    ],
  });

  await prisma.coachComment.createMany({
    data: [
      {
        coachId: coachProfiles[0].id,
        userId: admin.id,
        commentText: 'À tester absolument pour le soir. Lorem ipsum dolor sit amet.',
      },
      {
        coachId: coachProfiles[2].id,
        userId: admin.id,
        commentText: 'Super concept, très doux et inspirant. Lorem ipsum dolor sit amet.',
      },
    ],
  });

  await prisma.sessionComment.createMany({
    data: [
      {
        sessionId: sessions[0].id,
        userId: admin.id,
        commentText: 'Le format est parfait pour progresser sans pression. Lorem ipsum dolor sit amet.',
      },
      {
        sessionId: sessions[2].id,
        userId: admin.id,
        commentText: 'J’adore le côté écrit + guidé. Lorem ipsum dolor sit amet.',
      },
    ],
  });

  const adminCart = await prisma.cart.create({
    data: {
      userId: admin.id,
    },
  });

  await prisma.cartItem.createMany({
    data: [
      {
        cartId: adminCart.id,
        productId: products[0].id,
        quantity: 1,
        unitPrice: products[0].price,
      },
      {
        cartId: adminCart.id,
        productId: products[2].id,
        quantity: 2,
        unitPrice: products[2].price,
      },
    ],
  });

  await prisma.favoriteProduct.create({
    data: {
      userId: admin.id,
      productId: products[1].id,
    },
  });

  await prisma.favoriteCoach.create({
    data: {
      userId: admin.id,
      coachId: coachProfiles[0].id,
    },
  });

  await prisma.favoriteSession.create({
    data: {
      userId: admin.id,
      sessionId: sessions[0].id,
    },
  });

  console.log('Seed completed successfully.');
  console.log(`Admin login: admin@sorea.local / soreadmin123`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });