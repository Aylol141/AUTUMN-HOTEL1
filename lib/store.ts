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
  addBooking: (booking: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  updateBookingStatus: (id: string, status: Appointment['status']) => void;
  deleteBooking: (id: string) => void;
  cart: CartItem[];
  messages: ContactMessage[];
  orders: Order[];
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
        { id: 'p1', name: 'الجناح الملكي', description: 'إطلالة بانورامية مع جاكوزي خاص', price: 1500, category: 'أجنحة', image: '', inStock: true },
        { id: 'p2', name: 'غرفة ديلوكس', description: 'راحة وهدوء للأزواج', price: 600, category: 'غرف', image: '', inStock: true }
      ],
      services: [
        { id: 's1', name: 'جلسة مساج سويدي', description: 'استرخاء عضلي كامل', price: 300, duration: 60, department: 'hijama-massage', image: '' },
        { id: 's2', name: 'ليزر كربون لنضارة الوجه', description: 'تقنية حديثة لنضارة فورية', price: 450, duration: 45, department: 'laser', image: '' }
      ],
      appointments: [],
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
          id: uuidv4(), 
          status: 'pending', 
          createdAt: new Date().toISOString() 
        };
        set((state) => ({ appointments: [...state.appointments, newBooking] }));
        return newBooking;
      },
      updateBookingStatus: (id, status) => set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a)
      })),
      deleteBooking: (id) => set((state) => ({ appointments: state.appointments.filter(a => a.id !== id) })),
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
          users: mergedUsers
        };
      },
    }
  )
);