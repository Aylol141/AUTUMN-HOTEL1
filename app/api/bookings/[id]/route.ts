import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const allowedStatuses = new Set(['pending', 'confirmed', 'completed', 'cancelled']);
const allowedPaymentStatuses = new Set(['pending_review', 'paid', 'unpaid', 'rejected']);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const status = String(body.status || '');
  const paymentStatus = String(body.paymentStatus || '');
  const requesterUserId = request.headers.get('x-user-id')?.trim();

  if (status && !allowedStatuses.has(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  if (paymentStatus && !allowedPaymentStatuses.has(paymentStatus)) {
    return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
  }

  if (!status && !paymentStatus) {
    return NextResponse.json({ error: 'No status change provided' }, { status: 400 });
  }

  if (requesterUserId) {
    if (status !== 'cancelled') {
      return NextResponse.json({ error: 'Guests can only cancel their own bookings' }, { status: 403 });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });

    if (!existingBooking || existingBooking.userId !== requesterUserId) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (existingBooking.status === 'completed') {
      return NextResponse.json({ error: 'Completed bookings cannot be cancelled' }, { status: 400 });
    }
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
    },
  });

  return NextResponse.json({
    id: booking.id,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await prisma.booking.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
