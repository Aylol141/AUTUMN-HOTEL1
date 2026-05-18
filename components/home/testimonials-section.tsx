import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'سارة أحمد',
    role: 'ضيف منتظم',
    content: 'تجربة استثنائية! الأجنحة قمة في الرقي، والمكان يوفر هدوءاً وخصوصية لا مثيل لها. أنصح الجميع بزيارته للحصول على قسط من الراحة.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    name: 'خالد محمد',
    role: 'ضيف جديد',
    content: 'من أفضل الأماكن التي زرتها، الاهتمام بأدق التفاصيل والخدمة الاحترافية تجعلك تشعر بالفخامة منذ لحظة وصولك. شكراً لفريق العمل.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  },
  {
    name: 'ريم عبدالله',
    role: 'ضيف VIP',
    content: 'المكان أنيق جداً والخصوصية تامة، الخدمة كانت سريعة والموظفون في غاية الود والاحترافية. وجهتي الدائمة للاسترخاء.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#0b0d09]"> {/* خلفية داكنة جداً لتبرز الألوان الخريفية */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#dda15e] font-medium tracking-widest uppercase text-sm">تجارب ضيوفنا</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-2 mb-4 text-balance">
            ماذا يقول زوارنا؟
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto leading-relaxed text-lg">
            نفخر بثقة ضيوفنا ونسعى دائماً لتقديم تجربة إقامة تفوق التوقعات
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-[#dda15e]/40 transition-all duration-500"
            >
              {/* أيقونة الاقتباس بلون ذهبي خريفي خفيف */}
              <Quote className="absolute top-8 left-8 h-10 w-10 text-[#dda15e]/10" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-[#dda15e] fill-[#dda15e]" />
                ))}
              </div>
              
              {/* النص مستقيم وبدون ميلان كما طلبتِ */}
              <p className="text-white/80 mb-8 leading-relaxed font-normal">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#dda15e]/20"
                />
                <div>
                  <div className="font-bold text-white text-lg">{testimonial.name}</div>
                  <div className="text-sm text-[#dda15e] font-medium tracking-wide">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}