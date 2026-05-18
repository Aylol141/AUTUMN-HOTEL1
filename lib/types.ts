// User Roles
export type UserRole = 'patient' | 'doctor' | 'secretary' | 'admin' | 'guest';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

// Department and Service Categories
export type Department = 'spa' | 'fitness' | 'hotel' | 'extra';

export const departmentLabels: Record<Department, string> = {
  spa: ' سبا وجمال',
  fitness: ' خدمات رياضية',
  hotel: ' خدمات فندقية',
  extra: ' خدمات إضافية',
};

export interface Service {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  price: number;
  duration: number | string;
  department?: Department;
  category: Department;
  image: string;
}

export interface Doctor {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  department: Department;
  serviceIds: string[];
  image: string;
  availability: DoctorAvailability[];
}

export interface DoctorAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface Appointment {
  id: string;
  patientId?: string;
  patientName?: string;
  patientPhone?: string;
  name?: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  packageName?: string;
  doctorId?: string;
  doctorName?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus?: 'pending_review' | 'paid' | 'unpaid' | 'rejected';
  paymentMethod?: 'bank' | 'sham_cash' | 'cash';
  paymentReference?: string;
  paymentNote?: string;
  patientNotes?: string; // Only visible to admin
  doctorReport?: string;
  createdAt: string;
  isFollowUp?: boolean;
}

export interface PatientReport {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  serviceName: string;
  report: string;
  date: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  totalPrice: number;
  paymentMethod: 'manual' | 'electronic';
  paymentStatus: 'paid' | 'unpaid';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// Legacy support
export type ServiceCategory = Department;
export const serviceCategoryLabels = departmentLabels;

// Booking type alias for backward compatibility
export type Booking = Appointment;
