import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.supplier.deleteMany();

  const categories = await prisma.category.createMany({
    data: [
      {
        name: 'Бизнес-печать',
        description:
          'Печать визиток, бланков, листовок и другой деловой полиграфии',
      },
      {
        name: 'Рекламная продукция',
        description:
          'Печать буклетов, флаеров, листовок и другой рекламной продукции',
      },
      {
        name: 'Упаковка',
        description:
          'Производство коробок, пакетов, этикеток и другой упаковочной продукции',
      },
      {
        name: 'Сувенирная продукция',
        description: 'Печать на ручках, кружках, футболках и других сувенирах',
      },
      {
        name: 'Широкоформатная печать',
        description:
          'Печать баннеров, плакатов, стендов и другой крупноформатной продукции',
      },
      {
        name: 'Типография',
        description:
          'Полный цикл типографских услуг, включая брошюровку и переплет',
      },
      {
        name: 'Офисная печать',
        description:
          'Печать бланков, конвертов, папок и другой офисной продукции',
      },
      {
        name: 'Печать на текстиле',
        description:
          'Нанесение изображений на футболки, толстовки, сумки и другой текстиль',
      },
      {
        name: 'Цифровая печать',
        description: 'Быстрая печать малыми тиражами с высоким качеством',
      },
      {
        name: 'Наружная реклама',
        description: 'Изготовление вывесок, табличек, световых коробов',
      },
      {
        name: 'Полиграфия для мероприятий',
        description: 'Печать приглашений, программ, бейджей для мероприятий',
      },
      {
        name: 'Календари',
        description: 'Печать квартальных, карманных, настенных календарей',
      },
    ],
    skipDuplicates: true,
  });

  const suppliers = await prisma.supplier.createMany({
    data: [
      {
        name: 'Поставщик А',
        address: 'ул. Примерная, д. 1',
        phone: '+7 900 123 45 67',
      },
      {
        name: 'Поставщик Б',
        address: 'ул. Примерная, д. 2',
        phone: '+7 900 234 56 78',
      },
      {
        name: 'Поставщик В',
        address: 'ул. Примерная, д. 3',
        phone: '+7 900 345 67 89',
      },
    ],
    skipDuplicates: true,
  });

  const allCategories = await prisma.category.findMany();
  const allSuppliers = await prisma.supplier.findMany();

  await prisma.product.createMany({
    data: [
      {
        name: 'Визитки',
        description: 'Визитки с логотипом и контактной информацией',
        price: 500,
        quantity: 1000,
        categoryId:
          allCategories.find((c) => c.name === 'Бизнес-печать')?.id || 1,
        supplierId: allSuppliers[0].id,
      },
      {
        name: 'Рекламные буклеты',
        description: 'Буклеты с рекламной информацией для компании',
        price: 1200,
        quantity: 500,
        categoryId:
          allCategories.find((c) => c.name === 'Рекламная продукция')?.id || 2,
        supplierId: allSuppliers[1].id,
      },
      {
        name: 'Картонные коробки',
        description: 'Упаковочные коробки разных размеров',
        price: 300,
        quantity: 2000,
        categoryId: allCategories.find((c) => c.name === 'Упаковка')?.id || 3,
        supplierId: allSuppliers[2].id,
      },
      {
        name: 'Футболки с принтом',
        description: 'Хлопковые футболки с нанесением логотипа',
        price: 1500,
        quantity: 300,
        categoryId:
          allCategories.find((c) => c.name === 'Печать на текстиле')?.id || 8,
        supplierId: allSuppliers[0].id,
      },
      {
        name: 'Баннер 3x6 м',
        description: 'Широкоформатный баннер для наружной рекламы',
        price: 4500,
        quantity: 50,
        categoryId:
          allCategories.find((c) => c.name === 'Широкоформатная печать')?.id ||
          5,
        supplierId: allSuppliers[1].id,
      },
      {
        name: 'Офисные бланки',
        description: 'Бланки для документов с фирменным дизайном',
        price: 250,
        quantity: 1500,
        categoryId:
          allCategories.find((c) => c.name === 'Офисная печать')?.id || 7,
        supplierId: allSuppliers[2].id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Данные успешно добавлены в базу данных');
  console.log(`Создано категорий: ${categories.count}`);
  console.log(`Создано поставщиков: ${suppliers.count}`);
}

main();
