'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { CheckCircle, CreditCard, User, Phone, MapPin, FileText, Download, Printer } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const receiptRef = useRef<HTMLDivElement>(null);
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const addOrder = useStore((state) => state.addOrder);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    orderNumber: string;
    totalPrice: number;
  } | null>(null);

  const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0 && !isSubmitted) {
      router.push('/cart');
    }
  }, [cart.length, isSubmitted, router]);

  if (cart.length === 0 && !isSubmitted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const order = addOrder({
      customerName,
      customerPhone,
      customerAddress,
      items: cart,
      totalPrice,
      paymentMethod: 'manual',
    });

    setOrderDetails({
      orderNumber: order.orderNumber,
      totalPrice,
    });
    setIsSubmitted(true);
    clearCart();
  };

  const handlePrint = () => {
    window.print();
  };

  if (isSubmitted && orderDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
              {/* Success Message */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">تم تأكيد طلبك بنجاح!</h1>
                <p className="text-muted-foreground">
                  شكراً لكِ {customerName}، سيتم التواصل معكِ قريباً
                </p>
              </div>

              {/* Receipt */}
              <div
                ref={receiptRef}
                className="bg-card rounded-2xl border border-border p-6 mb-6 print:shadow-none"
                id="receipt"
              >
                <div className="text-center border-b border-border pb-4 mb-4">
                  <h2 className="text-xl font-bold text-primary">سمايل هاوس</h2>
                  <p className="text-sm text-muted-foreground">مركز التجميل والعناية</p>
                </div>

                <div className="text-center mb-4">
                  <h3 className="font-bold text-foreground">إيصال الدفع</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">رقم الطلب:</span>
                    <span className="font-bold text-primary">{orderDetails.orderNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">اسم العميلة:</span>
                    <span>{customerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">رقم الجوال:</span>
                    <span dir="ltr">{customerPhone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">العنوان:</span>
                    <span>{customerAddress}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-border pt-4 mb-4">
                  <h4 className="font-bold mb-3">المنتجات المطلوبة:</h4>
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>
                          {item.product.name} x {item.quantity}
                        </span>
                        <span>{item.product.price * item.quantity} ريال</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المجموع الفرعي:</span>
                    <span>{orderDetails.totalPrice} ريال</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الشحن:</span>
                    <span className="text-green-600">مجاني</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                    <span>الإجمالي:</span>
                    <span className="text-primary">{orderDetails.totalPrice} ريال</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm">طريقة الدفع: الدفع اليدوي</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    يمكنكِ الدفع عند استلام الطلب أو التحويل البنكي على الحساب التالي:
                    <br />
                    البنك: الراجحي | رقم الحساب: SA1234567890123456789012
                  </p>
                </div>

                <div className="text-center mt-6 pt-4 border-t border-dashed border-border">
                  <p className="text-sm text-muted-foreground">شكراً لتسوقكِ معنا</p>
                  <p className="text-xs text-muted-foreground">للاستفسار: +966 50 123 4567</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-center print:hidden">
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="ml-2 h-4 w-4" />
                  طباعة الإيصال
                </Button>
                <Button onClick={() => router.push('/')}>
                  العودة للرئيسية
                </Button>
              </div>

              {/* SMS Simulation Notice */}
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl text-center print:hidden">
                <p className="text-sm text-green-800">
                  تم إرسال رسالة SMS تأكيد إلى رقم {customerPhone} تحتوي على تفاصيل الطلب
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">إتمام الشراء</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    بيانات العميلة
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                      <Input
                        type="text"
                        placeholder="أدخلي اسمك الكامل"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">رقم الجوال</label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="tel"
                          placeholder="05xxxxxxxx"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="pr-10"
                          dir="ltr"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">عنوان التوصيل</label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                        <textarea
                          placeholder="أدخلي عنوان التوصيل الكامل"
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    طريقة الدفع
                  </h2>
                  
                  <div className="border-2 border-primary rounded-xl p-4 bg-primary/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      </div>
                      <span className="font-bold">الدفع اليدوي</span>
                    </div>
                    <div className="bg-card rounded-lg p-4 text-sm text-muted-foreground space-y-2">
                      <p className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        يمكنكِ الدفع عند استلام الطلب
                      </p>
                      <p>أو التحويل البنكي على:</p>
                      <div className="bg-muted p-3 rounded-lg">
                        <p>البنك: الراجحي</p>
                        <p>رقم الحساب: SA1234567890123456789012</p>
                        <p>اسم المستفيد: مركز سمايل هاوس</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  تأكيد الطلب
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-4">ملخص الطلب</h2>
                
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                        <p className="text-sm font-bold text-primary">
                          {item.product.price * item.quantity} ريال
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span>{totalPrice} ريال</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الشحن</span>
                    <span className="text-green-600">مجاني</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                    <span>الإجمالي</span>
                    <span className="text-primary">{totalPrice} ريال</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
