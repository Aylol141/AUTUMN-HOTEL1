'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { serviceCategoryLabels, type ServiceCategory, type Service } from '@/lib/types';
import { Plus, Pencil, Trash2, X, Sparkles, Clock, Tag, Save, LayoutGrid } from 'lucide-react';

const defaultService: Omit<Service, 'id'> = {
  name: '',
  description: '',
  price: 0,
  duration: 30,
  category: 'spa', // القيمة الافتراضية الآن تتبع السبا
  image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
};

export default function AdminServicesPage() {
  const services = useStore((state) => state.services);
  const addService = useStore((state) => state.addService);
  const updateService = useStore((state) => state.updateService);
  const deleteService = useStore((state) => state.deleteService);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Omit<Service, 'id'>>(defaultService);

  // تجميع الخدمات حسب الفئة لسهولة العرض
  const groupedServices = useMemo(() => {
    return services.reduce((acc, service) => {
      const cat = service.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(service);
      return acc;
    }, {} as Record<string, Service[]>);
  }, [services]);

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({ ...service });
    } else {
      setEditingService(null);
      setFormData(defaultService);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setFormData(defaultService);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateService(editingService.id, formData);
    } else {
      addService(formData);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-12 text-right pb-20" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-[#D7CCC8] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid className="h-6 w-6 text-[#D35400]" />
            <h1 className="text-3xl font-black text-[#2D1B14]">إدارة قوائم الخدمات</h1>
          </div>
          <p className="text-[#8D6E63] font-medium">نظم خدمات السبا، الرياضة، والضيافة لـ Autumn Hotel</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-[#D35400] hover:bg-[#3E2723] text-white rounded-2xl h-14 px-8 shadow-lg shadow-orange-900/20 transition-all flex items-center gap-3 text-lg font-bold"
        >
          <Plus className="h-6 w-6" />
          إضافة خدمة جديدة
        </Button>
      </div>

      {/* Categories Sections */}
      {Object.entries(serviceCategoryLabels).map(([key, label]) => (
        <section key={key} className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-[#3E2723] flex items-center gap-3">
              <span className="bg-[#FDF8F5] p-2 rounded-xl border border-[#D7CCC8] shadow-sm">{label.split(' ')[0]}</span>
              {label.split(' ').slice(1).join(' ')}
            </h2>
            <div className="flex-1 h-[2px] bg-gradient-to-l from-[#D7CCC8] to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedServices[key]?.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-[2rem] border border-[#D7CCC8] overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="h-40 relative">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-black text-[#2D1B14]">{service.name}</h3>
                    <div className="bg-[#FDF8F5] px-3 py-1 rounded-full border border-[#D35400]/20">
                      <span className="text-[#D35400] font-black">${service.price}</span>
                    </div>
                  </div>
                  
                  <p className="text-[#8D6E63] text-sm leading-relaxed mb-6 h-10 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F4ECE8]">
                    <div className="flex items-center gap-2 text-[#8D6E63] bg-[#FDF8F5] px-3 py-1 rounded-lg">
                      <Clock className="h-4 w-4 text-[#D35400]" />
                      <span className="text-xs font-bold">{service.duration} دقيقة</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-xl border-[#D7CCC8] text-[#3E2723] hover:bg-[#FDF8F5]"
                        onClick={() => handleOpenModal(service)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-xl border-[#D7CCC8] text-red-500 hover:bg-red-50"
                        onClick={() => { if(confirm('حذف الخدمة؟')) deleteService(service.id) }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!groupedServices[key]?.length && (
              <div className="col-span-full py-8 px-6 bg-[#FDF8F5] rounded-2xl border border-dashed border-[#D7CCC8] text-center">
                <p className="text-[#8D6E63] italic font-medium">لا توجد خدمات مضافة في هذا القسم بعد.</p>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Modal - إضافة وتعديل */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2D1B14]/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto border border-[#D7CCC8] shadow-2xl">
            <div className="sticky top-0 z-10 p-6 bg-white/80 backdrop-blur-md border-b border-[#D7CCC8] flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#2D1B14] flex items-center gap-2">
                <Sparkles className="text-[#D35400]" />
                {editingService ? 'تعديل الخدمة' : 'إضافة عرض جديد'}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="rounded-full hover:bg-red-50">
                <X className="h-6 w-6 text-red-400" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#3E2723] mb-2">اسم الخدمة</label>
                  <Input 
                    className="h-12 rounded-xl border-[#D7CCC8] bg-[#FDF8F5]" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#3E2723] mb-2">الوصف التفصيلي</label>
                  <textarea 
                    className="w-full min-h-[100px] rounded-xl border border-[#D7CCC8] bg-[#FDF8F5] p-4 text-sm focus:outline-[#D35400]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#3E2723] mb-2">السعر ($)</label>
                  <Input 
                    type="number" 
                    className="h-12 rounded-xl border-[#D7CCC8] bg-[#FDF8F5]"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#3E2723] mb-2">المدة (دقيقة/ساعة)</label>
                  <Input 
                    className="h-12 rounded-xl border-[#D7CCC8] bg-[#FDF8F5]"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="مثال: 60 أو يوم كامل"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#3E2723] mb-2">تصنيف القسم</label>
                  <select 
                    className="w-full h-12 rounded-xl border border-[#D7CCC8] bg-[#FDF8F5] px-4 font-bold"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
                  >
                    {Object.entries(serviceCategoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#3E2723] mb-2">رابط الصورة (Unsplash)</label>
                  <Input 
                    className="h-12 rounded-xl border-[#D7CCC8] bg-[#FDF8F5]"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1 bg-[#3E2723] hover:bg-[#D35400] text-white h-14 rounded-2xl font-black text-lg transition-all">
                  <Save className="ml-2 h-5 w-5" />
                  {editingService ? 'تحديث البيانات' : 'اعتماد الخدمة'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseModal} className="h-14 px-8 rounded-2xl border-[#D7CCC8] font-bold">
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}