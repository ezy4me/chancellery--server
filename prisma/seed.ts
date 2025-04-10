import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Создание категорий
  const category1 = await prisma.category.create({
    data: {
      name: 'Бизнес-печать',
      description: 'Печать для бизнеса, визитки, рекламные материалы.',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Офисная печать',
      description: 'Печать для офисных нужд, бланки, документация.',
    },
  });

  // Создание поставщиков
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Поставщик А',
      address: 'ул. Примерная, д. 1',
      phone: '+7 900 123 45 67',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Поставщик Б',
      address: 'ул. Примерная, д. 2',
      phone: '+7 900 234 56 78',
    },
  });

  // Создание продуктов
  await prisma.product.create({
    data: {
      name: 'Визитки',
      description: 'Визитки с логотипом и контактной информацией.',
      price: 500,
      quantity: 1000,
      categoryId: category1.id,
      supplierId: supplier1.id,
      imageId: null,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Рекламные буклеты',
      description: 'Буклеты с рекламной информацией для компании.',
      price: 1200,
      quantity: 500,
      categoryId: category1.id,
      supplierId: supplier2.id,
      imageId: null,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Бланки для документов',
      description: 'Стандартные бланки для офисной документации.',
      price: 300,
      quantity: 2000,
      categoryId: category2.id,
      supplierId: supplier1.id,
      imageId: null,
    },
  });

  console.log('Данные успешно добавлены в базу данных');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
