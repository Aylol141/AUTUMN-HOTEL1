'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const identifier = String(formData.get('email') || formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');

  if (!identifier || !password) {
    return { error: 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني وكلمة المرور' };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });

    if (!user || user.password !== password) {
      return { error: 'بيانات الدخول غير صحيحة' };
    }

    const cookieStore = await cookies();

    cookieStore.set('user_role', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    cookieStore.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    const targetPath =
      user.role === 'admin'
        ? '/admin'
        : user.role === 'secretary'
          ? '/dashboard/secretary'
          : '/dashboard/guest';

    return { success: true, redirect: targetPath };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('user_role');
  cookieStore.delete('user_id');
  redirect('/admin/login');
}
