import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      email: 'admin@autumn-hotel.com',
      name: 'Autumn Admin',
      phone: '09000000',
      password: '123',
      role: 'admin',
    },
    create: {
      username: 'admin',
      email: 'admin@autumn-hotel.com',
      name: 'Autumn Admin',
      phone: '09000000',
      password: '123',
      role: 'admin',
    },
  });

  await prisma.user.upsert({
    where: { username: 'sec' },
    update: {
      email: 'secretary@autumn-hotel.com',
      name: 'Autumn Secretary',
      phone: '09111111',
      password: '123',
      role: 'secretary',
    },
    create: {
      username: 'sec',
      email: 'secretary@autumn-hotel.com',
      name: 'Autumn Secretary',
      phone: '09111111',
      password: '123',
      role: 'secretary',
    },
  });

  const roomsData = [
    {
      number: 'room-deluxe-king',
      name: 'غرفة ديلوكس ملكية',
      type: 'room',
      price: 620,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85',
      description: 'غرفة هادئة بسرير كينغ، إضاءة دافئة، مكتب عمل، وإطلالة على حدائق المنتجع.',
    },
    {
      number: 'room-garden',
      name: 'غرفة الحديقة',
      type: 'room',
      price: 740,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
      description: 'إقامة مريحة مع شرفة صغيرة تطل على المساحات الخضراء وخدمة قهوة صباحية.',
    },
    {
      number: 'room-family',
      name: 'غرفة عائلية',
      type: 'room',
      price: 980,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85',
      description: 'مساحة واسعة للعائلات، سريران كبيران، منطقة جلوس، وتجهيزات مناسبة للأطفال.',
    },
    {
      number: 'suite-royal',
      name: 'الجناح الملكي',
      type: 'suite',
      price: 1550,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85',
      description: 'جناح فاخر بإطلالة بانورامية، جاكوزي خاص، صالة استقبال، وخدمة ضيافة مميزة.',
    },
    {
      number: 'suite-honeymoon',
      name: 'جناح شهر العسل',
      type: 'suite',
      price: 1380,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85',
      description: 'تصميم رومانسي، حمام رخامي، ورود موسمية، وفطور خاص داخل الجناح.',
    },
    {
      number: 'suite-presidential',
      name: 'الجناح الرئاسي',
      type: 'suite',
      price: 2200,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85',
      description: 'أعلى مستويات الخصوصية مع صالة اجتماعات، تراس واسع، وخدمة كونسيرج خاصة.',
    },
  ];

  for (const room of roomsData) {
    await prisma.room.upsert({
      where: { number: room.number },
      update: room,
      create: room,
    });
  }

  const servicesData = [
    {
      name: 'بوفيه فطور فاخر',
      price: 85,
      duration: 60,
      department: 'hotel',
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=85',
      description: 'تشكيلة صباحية من المخبوزات الطازجة، القهوة المختصة، وأطباق محلية وعالمية.',
    },
    {
      name: 'جلسة سبا استرخائية',
      price: 320,
      duration: 90,
      department: 'spa',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
      description: 'مساج كامل للجسم مع زيوت عطرية ودخول للساونا وغرفة البخار.',
    },
    {
      name: 'جلسة تدريب خاصة',
      price: 180,
      duration: 45,
      department: 'fitness',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85',
      description: 'حصة رياضية فردية مع مدرب مختص وبرنامج مناسب لمستوى الضيف.',
    },
    {
      name: 'استقبال من المطار',
      price: 140,
      duration: 35,
      department: 'extra',
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=85',
      description: 'سيارة خاصة مع سائق لاستقبال الضيوف من المطار حتى الفندق.',
    },
    {
      name: 'عشاء رومانسي',
      price: 420,
      duration: 120,
      department: 'hotel',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85',
      description: 'طاولة خاصة على ضوء الشموع مع قائمة مختارة لشخصين.',
    },
    {
      name: 'جولة سياحية خاصة',
      price: 260,
      duration: 180,
      department: 'extra',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
      description: 'رحلة قصيرة مع مرشد للتعرف على أجمل المعالم القريبة من المنتجع.',
    },
  ];

  for (const service of servicesData) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: service,
      create: service,
    });
  }

  console.log('Seed data created/updated successfully!');
}

main()
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
