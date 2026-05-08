import { Award, Heart, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'فخامة ملكية',
    description: 'نقدم تجربة إقامة استثنائية تجمع بين الرقي والراحة المطلقة',
  },
  {
    icon: Users,
    title: 'خدمة احترافية',
    description: 'فريق عمل مخصص لخدمتكم وتلبية تطلعاتكم على مدار الساعة',
  },
  {
    icon: Shield,
    title: 'خصوصية تامة',
    description: 'نضمن لكم بيئة آمنة وهادئة للاستمتاع بلحظاتكم الخاصة',
  },
  {
    icon: Heart,
    title: 'رعاية فائقة',
    description: 'نهتم بأدق التفاصيل لضمان إقامة لا تُنسى في كل زيارة',
  },
];

export function AboutSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-black">
      {/* تأثير الضوء خلف العناصر */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#dda15e]/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[#dda15e] font-serif tracking-[0.3em] uppercase text-sm block">من نحن</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white text-balance">
            لماذا تختار <span className="text-[#dda15e]">أجنحتنا؟</span>
          </h2>
          <div className="w-24 h-[1px] bg-[#dda15e]/30 mx-auto mt-4" />
          <p className="text-white/50 max-w-2xl mx-auto leading-relaxed text-lg font-light">
            وجهتكم المثالية للراحة والجمال، حيث تلتقي الفخامة بالهدوء لنقدم لكم تجربة تفوق التوقعات.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-md hover:bg-white/[0.07] hover:border-[#dda15e]/30 transition-all duration-500 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#dda15e]/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-[#dda15e]/5">
                <feature.icon className="h-8 w-8 text-[#dda15e]" />
              </div>
              <h3 className="text-xl font-serif text-white mb-3 group-hover:text-[#dda15e] transition-colors">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed font-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}