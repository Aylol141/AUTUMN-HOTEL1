'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Sparkles, Lock, User } from 'lucide-react'; // حذفنا Eye و EyeOff من هنا

export function LoginForm() {
  const router = useRouter();
  const { login } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));
    const user = login(username, password);
    
    if (user) {
      const routes: Record<string, string> = {
        admin: '/dashboard/admin',
        doctor: '/dashboard/doctor',
        secretary: '/dashboard/secretary',
        patient: '/dashboard/patient',
        guest: '/dashboard/guest', // أضفنا مسار الزبون لضمان التوجيه الصحيح
      };
      router.push(routes[user.role] || '/dashboard/guest');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 relative">
      {/* اللوجو */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-8 w-8 text-[#dda15e]" />
          <span className="text-3xl font-serif font-bold tracking-tighter text-[#2c1810]">
            AUTUMN
          </span>
        </div>
        <div className="h-[1px] w-12 bg-[#bc6c25] mx-auto mb-4" />
        <p className="text-xs uppercase tracking-[0.3em] text-[#2c1810]/60 font-medium">تسجيل الدخول</p>
      </div>

      <Card className="border border-white/20 bg-white/40 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden">
        <CardContent className="p-8 md:p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* حقل اسم المستخدم */}
            <div className="space-y-2 text-right">
              <label className="text-[10px] uppercase tracking-widest text-[#2c1810]/80 mr-1 font-bold">اسم المستخدم</label>
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-14 text-right bg-white/30 border-white/20 focus:border-[#dda15e] focus:bg-white/50 rounded-2xl transition-all pl-12"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2c1810]/40 group-focus-within:text-[#bc6c25] transition-colors" />
              </div>
            </div>

            {/* حقل كلمة المرور - تم حذف العين نهائياً */}
            <div className="space-y-2 text-right">
              <div className="flex justify-between items-center px-1">
                 <Link href="#" className="text-[10px] text-[#bc6c25] hover:text-[#2c1810] transition-colors">نسيت كلمة المرور؟</Link>
                 <label className="text-[10px] uppercase tracking-widest text-[#2c1810]/80 font-bold">كلمة المرور</label>
              </div>
              <div className="relative group">
                <Input
                  type="password" // جعلناه ثابت password دائماً
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 text-right bg-white/30 border-white/20 focus:border-[#dda15e] focus:bg-white/50 rounded-2xl transition-all pl-12"
                  required
                />
                {/* وضعنا أيقونة القفل بدلاً من العين ليعطي شكل جمالي هادئ */}
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2c1810]/40 transition-colors" />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-[11px] text-center font-medium animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-sm uppercase tracking-widest font-bold bg-[#2c1810] hover:bg-[#1a0f0a] text-white rounded-2xl shadow-lg transition-all active:scale-[0.98] mt-4"
            >
              {isLoading ? 'جاري التحقق...' : 'دخول النظام'}
            </Button>
          </form>

          <div className="text-center mt-10 pt-6 border-t border-[#2c1810]/5">
            <p className="text-[11px] text-[#2c1810]/50 mb-4 tracking-tight">ليس لديك حساب في ريزورت أيلول؟</p>
            <Link href="/register">
              <Button 
                variant="ghost" 
                className="w-full h-12 rounded-2xl text-[#2c1810] hover:bg-white/40 hover:text-[#bc6c25] font-bold text-xs uppercase tracking-widest transition-all"
              >
                إنشاء حساب جديد
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#dda15e]/20 blur-[100px] rounded-full" />
    </div>
  );
}