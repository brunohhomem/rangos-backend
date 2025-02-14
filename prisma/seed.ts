/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { FoodSource, PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as xlsx from 'xlsx';

const prisma = new PrismaClient();

type ExcelFoodData = {
  food: string;
  calories: number;
  protein: number;
  lipids: number;
  cholesterol: number;
  carbohydrate: number;
  fiber: number;
};

async function seed() {
  const hasUser = await prisma.user.findUnique({
    where: { email: 'bruno@email.com' },
  });

  if (!hasUser) {
    await prisma.user.create({
      data: {
        email: 'bruno@email.com',
        name: 'brunohhomem',
        password: '',
      },
    });
  }

  const filePath = path.resolve(__dirname, 'taco4ed.xlsx');
  const excel = xlsx.readFile(filePath);
  const tabName = excel.SheetNames[0];
  const tab = excel.Sheets[tabName];

  // Pular as duas primeiras linhas (onde não estão os cabeçalhos)
  const data = xlsx.utils.sheet_to_json(tab, {
    header: 2,
  }) as unknown as ExcelFoodData;

  importFoodData(data)
    .then(() => {
      console.log('Dados importados com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao importar dados:', error);
    });
}

async function importFoodData(data) {
  for (const item of data) {
    const foodData = {
      food: item.food,
      foodSource: FoodSource.TACO,
      calories: isNaN(Number(item.calories)) ? 0 : Number(item.calories),
      protein: isNaN(Number(item.protein)) ? 0 : Number(item.protein),
      lipids: isNaN(Number(item.lipids)) ? 0 : Number(item.lipids),
      cholesterol: isNaN(Number(item.cholesterol))
        ? 0
        : Number(item.cholesterol),
      carbohydrate: isNaN(Number(item.carbohydrate))
        ? 0
        : Number(item.carbohydrate),
      fiber: isNaN(Number(item.fiber)) ? 0 : Number(item.fiber),
    };

    await prisma.food.create({
      data: foodData,
    });
  }
}

seed();
