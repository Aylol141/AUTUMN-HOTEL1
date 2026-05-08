'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Sparkles, Eye, EyeOff, CheckCircle, User, Phone, Lock, UserPlus, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  // استخدام registerUser بدلاً من registerPatient لتوافق الستور المطور
  const { registerUser, login } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // التحقق من تطابق كلمات المرور
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setIsLoading(false);
      return;
    }

    // محاكاة بسيطة للتحميل
    await new Promise((resolve) => setTimeout(resolve, 800));

    // عملية التسجيل مع تحديد الرتبة كـ guest تلقائياً
    const newUser = registerUser({
      name: formData.name,
      phone: formData.phone,
      username: formData.username,
      password: formData.password,
      role: 'guest', // هنا السر: نحدد أنه زبون لريزورت أيلول
    });

    if (newUser) {
      setSuccess(true);
      
      // تسجيل الدخول التلقائي
      login(formData.username, formData.password);
      
      // التوجيه فوراً لمجلد الـ guest حيث يوجد المساعد الذكي
      setTimeout(() => {
        router.push('/dashboard/guest'); 
      }, 2000);
    } else {
      setError('اسم المستخدم موجود مسبقاً، يرجى اختيار اسم آخر');
    }
    setIsLoading(false);
  };

  // واجهة النجاح الفخمة
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb] p-4 relative overflow-hidden text-right" dir="rtl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#dda15e33,transparent)]" />
        <Card className="w-full max-w-md text-center p-10 border border-white/20 bg-white/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] relative z-10 animate-in zoom-in-95 duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 mb-6 border border-amber-500/20">
            <CheckCircle className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#2c1810] mb-2">مرحباً بك في عالم أيلول!</h2>
          <p className="text-[#2c1810]/60 font-light italic">تم تفعيل عضويتك.. جاري تحويلك لمساعدك الشخصي ✨</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb] p-4 relative overflow-hidden text-right" dir="rtl">
      {/* عناصر جمالية */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-[#dda15e]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#2c1810]/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2 group">
            <Sparkles className="h-8 w-8 text-[#dda15e] group-hover:rotate-12 transition-transform duration-500" />
            <span className="text-4xl font-serif font-bold tracking-tighter text-[#2c1810]">AUTUMN</span>
          </div>
          <div className="h-[1px] w-12 bg-[#bc6c25] mx-auto mb-4 opacity-40" />
          <p className="text-xs uppercase tracking-[0.4em] text-[#2c1810]/60 font-medium">عضوية ريزورت أيلول</p>
        </div>

        <Card className="border border-white/30 bg-white/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden transition-all duration-700">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-xl font-serif font-bold text-[#2c1810] text-center mb-8">تسجيل عضوية جديدة</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#2c1810]/70 mr-1 font-bold block">الاسم بالكامل</label>
                  <div className="relative group">
                    <Input
                      placeholder="أدخل اسمك الكامل"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12 text-right bg-white/40 border-white/20 focus:border-[#dda15e] rounded-2xl transition-all pr-10"
                      required
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2c1810]/30 group-focus-within:text-[#bc6c25]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#2c1810]/70 mr-1 font-bold block">رقم الجوال</label>
                  <div className="relative group">
                    <Input
                      placeholder="09XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 text-right bg-white/40 border-white/20 focus:border-[#dda15e] rounded-2xl transition-all pr-10 font-mono"
                      required
                    />
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2c1810]/30 group-focus-within:text-[#bc6c25]" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#2c1810]/70 mr-1 font-bold block">اسم المستخدم</label>
                <div className="relative group">
                  <Input
                    placeholder="سيُستخدم لتسجيل الدخول"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="h-12 text-right bg-white/40 border-white/20 focus:border-[#dda15e] rounded-2xl transition-all pr-10 font-mono"
                    required
                  />
                  <UserPlus className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2c1810]/30 group-focus-within:text-[#bc6c25]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#2c1810]/70 mr-1 font-bold block">كلمة المرور</label>
                  <div className="relative group">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-12 text-right bg-white/40 border-white/20 focus:border-[#dda15e] rounded-2xl transition-all pr-10 font-mono"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2c1810]/30 hover:text-[#bc6c25] z-20">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#2c1810]/70 mr-1 font-bold block">تأكيد الكلمة</label>
                  <div className="relative group">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="h-12 text-right bg-white/40 border-white/20 focus:border-[#dda15e] rounded-2xl transition-all pr-10 font-mono"
                      required
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2c1810]/30" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-[11px] text-center font-medium animate-bounce">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-xs uppercase tracking-[0.3em] font-bold bg-[#2c1810] hover:bg-[#1a0f0a] text-white rounded-2xl shadow-xl transition-all active:scale-[0.98] mt-4"
              >
                {isLoading ? 'جاري الانضمام...' : 'تفعيل العضوية الفاخرة'}
              </Button>
            </form>

            <div className="text-center mt-10 pt-6 border-t border-[#2c1810]/5 flex flex-col gap-4">
              <Link href="/login">
                <Button variant="ghost" className="w-full h-12 rounded-2xl text-[#2c1810] hover:bg-white/40 font-bold text-xs uppercase tracking-widest">
                  لديك حساب بالفعل؟ سجل دخولك
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}