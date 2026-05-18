'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { 
  Service, Product, Appointment, CartItem, Order, ContactMessage, 
  User 
} from './types';

interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface StoreState {
  users: User[];
  currentUser: User | null;
  isAdminLoggedIn: boolean;
  login: (username: string, password: string) => User | null;
  registerUser: (userData: Omit<User, 'id' | 'createdAt'>) => User | null;
  logout: () => void;
  adminLogout: () => void;
  chatHistory: AIChatMessage[];
  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  clearChat: () => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  appointments: Appointment[];
  bookings: Appointment[];
  addBooking: (booking: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  updateBookingStatus: (id: string, status: Appointment['status']) => void;
  deleteBooking: (id: string) => void;
  cart: CartItem[];
  messages: ContactMessage[];
  addMessage: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => void;
  markMessageAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  orders: Order[];
  addOrder: (
    order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'paymentStatus'> &
      Partial<Pick<Order, 'paymentStatus'>>
  ) => Order;
  clearCart: () => void;
}

// المستخدمين الأساسيين (أدمن وسكرتارية)
const STATIC_STAFF: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    password: '123',
    name: 'مدير أيلول',
    phone: '09000000',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sec-1',
    username: 'sec',
    password: '123',
    name: 'سكرتارية أيلول',
    phone: '09111111',
    role: 'secretary',
    createdAt: new Date().toISOString(),
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // --- البيانات الأولية ---
      users: STATIC_STAFF,
      currentUser: null,
      isAdminLoggedIn: false,
      chatHistory: [],
      products: [
        {
          id: 'room-deluxe-king',
          name: 'غرفة ديلوكس ملكية',
          description: 'غرفة هادئة بسرير كينغ، إضاءة دافئة، مكتب عمل، وإطلالة على حدائق المنتجع.',
          price: 620,
          category: 'room',
          image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85',
          inStock: true,
        },
        {
          id: 'room-garden',
          name: 'غرفة الحديقة',
          description: 'إقامة مريحة مع شرفة صغيرة تطل على المساحات الخضراء وخدمة قهوة صباحية.',
          price: 740,
          category: 'room',
          image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
          inStock: true,
        },
        {
          id: 'room-family',
          name: 'غرفة عائلية',
          description: 'مساحة واسعة للعائلات، سريران كبيران، منطقة جلوس، وتجهيزات مناسبة للأطفال.',
          price: 980,
          category: 'room',
          image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85',
          inStock: true,
        },
        {
          id: 'suite-royal',
          name: 'الجناح الملكي',
          description: 'جناح فاخر بإطلالة بانورامية، جاكوزي خاص، صالة استقبال، وخدمة ضيافة مميزة.',
          price: 1550,
          category: 'suite',
          image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85',
          inStock: true,
        },
        {
          id: 'suite-honeymoon',
          name: 'جناح شهر العسل',
          description: 'تصميم رومانسي، حمام رخامي، ورود موسمية، وفطور خاص داخل الجناح.',
          price: 1380,
          category: 'suite',
          image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85',
          inStock: true,
        },
        {
          id: 'suite-presidential',
          name: 'الجناح الرئاسي',
          description: 'أعلى مستويات الخصوصية مع صالة اجتماعات، تراس واسع، وخدمة كونسيرج خاصة.',
          price: 2200,
          category: 'suite',
          image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85',
          inStock: true,
        },
      ],
      services: [
        {
          id: 'service-breakfast',
          name: 'بوفيه فطور فاخر',
          description: 'تشكيلة صباحية من المخبوزات الطازجة، القهوة المختصة، وأطباق محلية وعالمية.',
          price: 85,
          duration: 60,
          department: 'hotel',
          category: 'hotel',
          image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=85',
        },
        {
          id: 'service-spa',
          name: 'جلسة سبا استرخائية',
          description: 'مساج كامل للجسم مع زيوت عطرية ودخول للساونا وغرفة البخار.',
          price: 320,
          duration: 90,
          department: 'spa',
          category: 'spa',
          image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
        },
        {
          id: 'service-fitness',
          name: 'جلسة تدريب خاصة',
          description: 'حصة رياضية فردية مع مدرب مختص وبرنامج مناسب لمستوى الضيف.',
          price: 180,
          duration: 45,
          department: 'fitness',
          category: 'fitness',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85',
        },
        {
          id: 'service-airport',
          name: 'استقبال من المطار',
          description: 'سيارة خاصة مع سائق لاستقبال الضيوف من المطار حتى الفندق.',
          price: 140,
          duration: 35,
          department: 'extra',
          category: 'extra',
          image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=85',
        },
        {
          id: 'service-dinner',
          name: 'عشاء رومانسي',
          description: 'طاولة خاصة على ضوء الشموع مع قائمة مختارة لشخصين.',
          price: 420,
          duration: 120,
          department: 'hotel',
          category: 'hotel',
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85',
        },
        {
          id: 'service-tour',
          name: 'جولة سياحية خاصة',
          description: 'رحلة قصيرة مع مرشد للتعرف على أجمل المعالم القريبة من المنتجع.',
          price: 260,
          duration: 180,
          department: 'extra',
          category: 'extra',
          image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
        },
      ],
      appointments: [],
      bookings: [],
      cart: [],
      messages: [],
      orders: [],

      // --- دوال المستخدمين ---
      login: (username, password) => {
        const allUsers = get().users;
        const user = allUsers.find(u => u.username === username && u.password === password);
        if (user) {
          set({ currentUser: user, isAdminLoggedIn: user.role === 'admin' });
          return user;
        }
        return null;
      },

      registerUser: (userData) => {
        const currentUsers = get().users;
        if (currentUsers.find(u => u.username === userData.username)) return null;

        const newUser: User = { 
          ...userData, 
          id: uuidv4(), 
          createdAt: new Date().toISOString() 
        };

        const newList = [...currentUsers, newUser];
        set({ users: newList });
        return newUser;
      },

      logout: () => set({ currentUser: null, isAdminLoggedIn: false }),
      adminLogout: () => set({ currentUser: null, isAdminLoggedIn: false }),

      // --- المساعد والخدمات والحجوزات ---
      addChatMessage: (role, content) => set((state) => ({
        chatHistory: [...state.chatHistory, { id: uuidv4(), role, content, timestamp: new Date().toLocaleTimeString('ar-SA') }]
      })),
      clearChat: () => set({ chatHistory: [] }),

      addProduct: (product) => set((state) => ({ products: [...state.products, { ...product, id: uuidv4() } as Product] })),
      updateProduct: (updated) => set((state) => ({ products: state.products.map(p => p.id === updated.id ? updated : p) })),
      deleteProduct: (id) => set((state) => ({ products: state.products.filter(p => p.id !== id) })),

      addService: (service) => set((state) => ({ services: [...state.services, { ...service, id: uuidv4() } as Service] })),
      updateService: (id, data) => set((state) => ({ services: state.services.map(s => s.id === id ? { ...s, ...data } : s) })),
      deleteService: (id) => set((state) => ({ services: state.services.filter(s => s.id !== id) })),

      addBooking: (booking) => {
        const newBooking: Appointment = { 
          ...booking, 
          patientName: booking.patientName || booking.customerName,
          patientPhone: booking.patientPhone || booking.customerPhone,
          id: uuidv4(), 
          status: 'pending', 
          createdAt: new Date().toISOString() 
        };
        set((state) => ({
          appointments: [...state.appointments, newBooking],
          bookings: [...state.bookings, newBooking],
        }));
        return newBooking;
      },
      updateBookingStatus: (id, status) => set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a),
        bookings: state.bookings.map(a => a.id === id ? { ...a, status } : a),
      })),
      deleteBooking: (id) => set((state) => ({
        appointments: state.appointments.filter(a => a.id !== id),
        bookings: state.bookings.filter(a => a.id !== id),
      })),

      addMessage: (message) => set((state) => ({
        messages: [
          ...state.messages,
          {
            ...message,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            read: false,
          },
        ],
      })),
      markMessageAsRead: (id) => set((state) => ({
        messages: state.messages.map(message => (
          message.id === id ? { ...message, read: true } : message
        )),
      })),
      deleteMessage: (id) => set((state) => ({
        messages: state.messages.filter(message => message.id !== id),
      })),

      addOrder: (order) => {
        const newOrder: Order = {
          ...order,
          id: uuidv4(),
          orderNumber: `ORD-${Date.now()}`,
          paymentStatus: order.paymentStatus || 'unpaid',
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [...state.orders, newOrder] }));
        return newOrder;
      },
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'ayloul-safe-vault-v3', // اسم جديد لتجنب أي أخطاء قديمة
      storage: createJSONStorage(() => localStorage),
      
      // دمج ذكي يمنع تكرار الموظفين ويحافظ على الزبائن الجدد
      merge: (persistedState: any, currentState) => {
        if (!persistedState) return currentState;
        
        const persistedUsers = persistedState.users || [];
        const mergedUsers = [...STATIC_STAFF];
        
        persistedUsers.forEach((pUser: User) => {
          if (!mergedUsers.find(u => u.username === pUser.username)) {
            mergedUsers.push(pUser);
          }
        });

        return {
          ...currentState,
          ...persistedState,
          users: mergedUsers,
          products: currentState.products,
          services: currentState.services,
          bookings: persistedState.bookings || persistedState.appointments || [],
          appointments: persistedState.appointments || persistedState.bookings || [],
        };
      },
    }
  )
);
