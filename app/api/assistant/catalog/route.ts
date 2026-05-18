import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [rooms, services] = await Promise.all([
    prisma.room.findMany({
      orderBy: { price: 'asc' },
      select: {
        id: true,
        number: true,
        name: true,
        type: true,
        price: true,
        description: true,
      },
    }),
    prisma.service.findMany({
      orderBy: { price: 'asc' },
      select: {
        id: true,
        name: true,
        department: true,
        duration: true,
        price: true,
        description: true,
      },
    }),
  ]);

  return NextResponse.json({ rooms, services });
}
