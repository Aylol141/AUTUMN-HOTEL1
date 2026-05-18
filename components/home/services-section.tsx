import { Coffee, Utensils, Sparkles, Car, Bell, Moon } from 'lucide-react';

const resortServices = [
  {
    icon: Utensils,
    title: 'إفطار فاخر',
    description: 'تشكيلة مختارة من الأطباق العالمية والمحلية تُقدم يومياً',
  },
  {
    icon: Sparkles,
    title: 'نادي صحي وسبا',
    description: 'جلسات استرخاء وعناية متكاملة تحت أيدي متخصصين',
  },
  {
    icon: Bell,
    title: 'خدمة الغرف',
    description: 'فريق عمل مخصص لتلبية احتياجاتكم على مدار الساعة',
  },
  {
    icon: Car,
    title: 'نقل خاص',
    description: 'خدمة استقبال وتوديع من وإلى المطار بسيارات فاخرة',
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-[#0b0d09]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">خدماتنا الحصرية</h2>
          <p className="text-white/40 max-w-xl mx-auto">نعتني بكافة التفاصيل لنجعل من إقامتك تجربة استثنائية لا تُنسى</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resortServices.map((service, index) => (
            <div 
              key={index} 
              className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-[#dda15e]/40 transition-all group"
            >
              <div className="w-12 h-12 bg-[#dda15e]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#dda15e] transition-colors">
                <service.icon className="h-6 w-6 text-[#dda15e] group-hover:text-black" />
              </div>
              <h3 className="text-white font-bold mb-2">{service.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}