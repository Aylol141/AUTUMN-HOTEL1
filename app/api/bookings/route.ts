import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function toAppointment(booking: any) {
  return {
    id: booking.id,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    patientName: booking.customerName,
    patientPhone: booking.customerPhone,
    serviceId: booking.roomId,
    serviceName: booking.serviceName,
    date: booking.date,
    time: booking.time,
    status: booking.status,
    paymentMethod: booking.paymentMethod,
    paymentStatus: booking.paymentStatus,
    paymentReference: booking.paymentReference,
    paymentNote: booking.paymentNote,
    createdAt: booking.createdAt.toISOString(),
  };
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId')?.trim();

  const bookings = await prisma.booking.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(bookings.map(toAppointment));
}

export async function POST(request: Request) {
  const body = await request.json();
  const roomId = String(body.serviceId || body.roomId || '').trim();
  const customerName = String(body.customerName || '').trim();
  const customerPhone = String(body.customerPhone || '').trim();
  const serviceName = String(body.serviceName || 'Room booking').trim();
  const date = String(body.date || '').trim();
  const time = String(body.time || '').trim();
  const price = Number(body.price || 0);
  const userId = String(body.userId || '').trim();
  const username = String(body.username || '').trim();
  const userRole = String(body.userRole || 'guest').trim();
  const accountUsername = username || `guest-${userId}`;
  const paymentMethod = String(body.paymentMethod || '').trim();
  const paymentReference = String(body.paymentReference || '').trim();
  const paymentNote = String(body.paymentNote || '').trim();

  if (!userId) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول قبل إنشاء الحجز' }, { status: 401 });
  }

  if (!roomId || !customerName || !customerPhone || !date || !time) {
    return NextResponse.json({ error: 'Missing booking fields' }, { status: 400 });
  }

  if (!['bank', 'sham_cash'].includes(paymentMethod)) {
    return NextResponse.json({ error: 'يرجى اختيار طريقة الدفع: تحويل بنكي أو شام كاش' }, { status: 400 });
  }

  if (!paymentReference) {
    return NextResponse.json({ error: 'يرجى إدخال رقم عملية الدفع أو رقم الإشعار' }, { status: 400 });
  }

  if (date < getTodayDate()) {
    return NextResponse.json({ error: 'لا يمكن إنشاء حجز بتاريخ قديم' }, { status: 400 });
  }

  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {
      username: accountUsername,
      name: customerName,
      phone: customerPhone,
      role: userRole || 'guest',
    },
    create: {
      id: userId,
      username: accountUsername,
      name: customerName,
      phone: customerPhone,
      password: '',
      role: userRole || 'guest',
    },
  });

  let room = await prisma.room.findFirst({
    where: {
      OR: [{ id: roomId }, { number: roomId }],
    },
  });

  if (room) {
    room = await prisma.room.update({
      where: { id: room.id },
      data: { name: serviceName, price },
    });
  } else {
    room = await prisma.room.create({
      data: {
        id: roomId,
        number: roomId,
        name: serviceName,
        type: String(body.bookingType || 'room'),
        price,
        status: 'available',
      },
    });
  }

  const checkIn = new Date(`${date}T${time}:00`);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 1);

  const booking = await prisma.booking.create({
    data: {
      customerName,
      customerPhone,
      serviceName,
      date,
      time,
      checkIn,
      checkOut,
      totalPrice: price,
      paymentMethod,
      paymentStatus: 'pending_review',
      paymentReference,
      paymentNote,
      userId: user.id,
      roomId: room.id,
      status: 'pending',
    },
  });

  return NextResponse.json(toAppointment(booking), { status: 201 });
}
