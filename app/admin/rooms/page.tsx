'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, Search, Edit2, Trash2, BedDouble, 
  X, Save, Crown, LayoutGrid
} from 'lucide-react';

// تعريف التصنيفات المعتمدة للفصل بين الوحدات
const roomCategoryLabels: Record<string, string> = {
  suite: 'الأجنحة',
  room: 'الغرف ',
};

export default function AdminRoomsPage() {
  const products = useStore((state) => state.products);
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  const deleteProduct = useStore((state) => state.deleteProduct);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'room', // القيمة الافتراضية
    description: '',
    image: ''
  });

  // تجميع الغرف حسب الفئة برمجياً (Suite vs Room)
  const groupedRooms = useMemo(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered.reduce((acc, product) => {
      const cat = product.category === 'suite' ? 'suite' : 'room';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    }, {} as Record<string, any[]>);
  }, [products, searchTerm]);

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product, price: product.price.toString() });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', category: 'room', description: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      inStock: true,
      id: editingProduct ? editingProduct.id : Date.now().toString()
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 text-right pb-20" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2D1B14]">إدارة وحدات الإقامة</h1>
          <p className="text-[#8D6E63] text-sm mt-1">تخصيص الأجنحة الفاخرة والغرف الفندقية</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-[#D35400] hover:bg-[#3E2723] text-white rounded-2xl h-12 px-6 shadow-lg shadow-orange-900/20"
        >
          <Plus className="ml-2 h-5 w-5" /> إضافة وحدة جديدة
        </Button>
      </div>

      {/* Search Container */}
      <div className="bg-white p-5 rounded-[2rem] border border-[#D7CCC8] shadow-sm">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D6E63]" />
          <Input
            placeholder="بحث عن غرف أو أجنحة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-12 h-12 bg-[#FDF8F5] border-[#D7CCC8] rounded-2xl focus:ring-[#D35400]"
          />
        </div>
      </div>

      {/* Categories Rendering */}
      {Object.entries(roomCategoryLabels).map(([key, label]) => (
        <div key={key} className="space-y-6">
          {/* Section Divider */}
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl border border-[#D7CCC8] shadow-sm">
              {key === 'suite' ? <Crown className="text-[#D35400] h-6 w-6" /> : <BedDouble className="text-[#8D6E63] h-6 w-6" />}
            </div>
            <h2 className="text-2xl font-black text-[#3E2723]">{label}</h2>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-[#D7CCC8] to-transparent"></div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedRooms[key]?.map((product) => (
              <div key={product.id} className="bg-white rounded-[2.5rem] border border-[#D7CCC8] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-48 relative overflow-hidden group">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                      key === 'suite' ? 'bg-[#3E2723] text-white' : 'bg-white/90 text-[#3E2723]'
                    }`}>
                      {key === 'suite' ? 'Premium Suite' : 'Standard Room'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-black text-[#2D1B14]">{product.name}</h3>
                    <div className="text-left">
                       <span className="text-[#D35400] font-black text-xl">${product.price}</span>
                       <p className="text-[10px] text-[#8D6E63] font-bold">/ ليلة واحدة</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleOpenModal(product)}
                      className="flex-1 rounded-xl border-[#D7CCC8] text-[#3E2723] hover:bg-[#FDF8F5] h-11"
                    >
                      <Edit2 className="h-4 w-4 ml-2" /> تعديل
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => deleteProduct(product.id)}
                      className="rounded-xl border-[#D7CCC8] text-red-500 hover:bg-red-50 h-11 w-11 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(!groupedRooms[key] || groupedRooms[key].length === 0) && (
            <div className="py-12 text-center bg-white/50 rounded-[2rem] border border-dashed border-[#D7CCC8]">
              <p className="text-[#8D6E63] font-medium">لا توجد وحدات مضافة في هذا القسم حالياً</p>
            </div>
          )}
        </div>
      ))}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2D1B14]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden border border-[#D7CCC8] shadow-2xl">
            <div className="p-6 bg-[#FDF8F5] border-b border-[#D7CCC8] flex justify-between items-center">
              <h2 className="text-xl font-black text-[#2D1B14] flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-[#D35400]" />
                {editingProduct ? 'تعديل بيانات الوحدة' : 'إضافة وحدة جديدة'}
              </h2>
              <Button variant="ghost" className="rounded-full h-10 w-10 p-0" onClick={() => setIsModalOpen(false)}><X className="h-5 w-5" /></Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5 text-right">
              <div>
                <label className="text-xs font-black text-[#8D6E63] uppercase tracking-widest block mb-2">اسم الجناح / الغرفة</label>
                <Input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-[#FDF8F5] border-[#D7CCC8] rounded-xl h-12 focus:ring-[#D35400]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-[#8D6E63] uppercase tracking-widest block mb-2">السعر للليلة ($)</label>
                  <Input 
                    type="number" required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="bg-[#FDF8F5] border-[#D7CCC8] rounded-xl h-12 focus:ring-[#D35400]"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-[#8D6E63] uppercase tracking-widest block mb-2">نوع الوحدة</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-[#FDF8F5] border border-[#D7CCC8] rounded-xl h-12 px-4 focus:ring-[#D35400] outline-none font-bold text-sm"
                  >
                    <option value="room">غرفة عادية</option>
                    <option value="suite">جناح ملكي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-[#8D6E63] uppercase tracking-widest block mb-2">رابط صورة الوحدة</label>
                <Input 
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="bg-[#FDF8F5] border-[#D7CCC8] rounded-xl h-12 focus:ring-[#D35400]"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <Button type="submit" className="w-full bg-[#3E2723] hover:bg-[#D35400] text-white h-14 rounded-2xl mt-6 font-black text-lg transition-all shadow-lg shadow-brown-900/20">
                <Save className="ml-2 h-5 w-5" /> حفظ التغييرات
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
