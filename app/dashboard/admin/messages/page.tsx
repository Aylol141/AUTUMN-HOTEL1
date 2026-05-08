'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import type { ContactMessage } from '@/lib/types';
import { 
  MessageSquare, 
  Phone, 
  Trash2, 
  Mail, 
  MailOpen, 
  Clock, 
  User, 
  MessageCircle, 
  ExternalLink,
  Inbox
} from 'lucide-react';

export default function AdminMessagesPage() {
  const messages = useStore((state) => state.messages);
  const markMessageAsRead = useStore((state) => state.markMessageAsRead);
  const deleteMessage = useStore((state) => state.deleteMessage);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredMessages = messages
    .filter((msg) => {
      if (filter === 'unread') return !msg.read;
      if (filter === 'read') return msg.read;
      return true;
    })
    .reverse();

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.read) {
      markMessageAsRead(message.id);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة نهائياً؟')) {
      deleteMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2D1B14]">مركز الرسائل</h1>
          <p className="text-[#8D6E63] text-sm mt-1">إدارة استفسارات النزلاء وطلبات المساعدة</p>
        </div>
        
        <div className="flex bg-[#FDF8F5] p-1 rounded-2xl border border-[#D7CCC8]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter('all')}
            className={`rounded-xl px-4 ${filter === 'all' ? 'bg-[#D35400] text-white' : 'text-[#8D6E63]'}`}
          >
            الكل ({messages.length})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter('unread')}
            className={`rounded-xl px-4 ${filter === 'unread' ? 'bg-[#D35400] text-white' : 'text-[#8D6E63]'}`}
          >
            غير مقروء ({unreadCount})
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        
        {/* Messages List - Inbox Style */}
        <div className="lg:col-span-1 bg-white rounded-[2rem] border border-[#D7CCC8] overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 bg-[#FDF8F5] border-b border-[#D7CCC8] flex items-center justify-between">
            <span className="font-bold text-[#3E2723] flex items-center gap-2">
              <Inbox className="h-4 w-4" /> صندوق الوارد
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#D7CCC8]/50">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-20 text-[#8D6E63]">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>لا توجد رسائل حالياً</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleViewMessage(message)}
                  className={`p-5 cursor-pointer transition-all relative hover:bg-[#FDF8F5] ${
                    selectedMessage?.id === message.id ? 'bg-[#F4ECE8]' : ''
                  }`}
                >
                  {!message.read && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#D35400]" />
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-bold ${message.read ? 'text-[#8D6E63]' : 'text-[#2D1B14]'}`}>
                      {message.name}
                    </span>
                    <span className="text-[10px] text-[#8D6E63] font-medium">
                      {new Date(message.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  
                  <p className={`text-xs line-clamp-2 leading-relaxed ${message.read ? 'text-[#8D6E63]/70' : 'text-[#3E2723]'}`}>
                    {message.message}
                  </p>
                  
                  <div className="mt-2 flex items-center gap-2">
                    {message.read ? (
                      <MailOpen className="h-3 w-3 text-[#D7CCC8]" />
                    ) : (
                      <Mail className="h-3 w-3 text-[#D35400]" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail - Premium View */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-[2rem] border border-[#D7CCC8] h-full flex flex-col shadow-sm overflow-hidden">
              {/* Detail Header */}
              <div className="p-8 border-b border-[#D7CCC8] bg-[#FDF8F5]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#3E2723] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-black/10">
                      {selectedMessage.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-[#2D1B14]">{selectedMessage.name}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#8D6E63] mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {selectedMessage.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> 
                          {new Date(selectedMessage.createdAt).toLocaleString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    onClick={() => handleDelete(selectedMessage.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Message Content */}
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="bg-[#FDF8F5] rounded-[1.5rem] p-8 border border-[#D7CCC8]/30">
                  <p className="text-[#3E2723] whitespace-pre-wrap leading-loose text-lg italic font-medium">
                    "{selectedMessage.message}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-8 border-t border-[#D7CCC8] bg-white mt-auto">
                <div className="flex gap-4">
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full h-12 border-[#D7CCC8] text-[#3E2723] rounded-xl hover:bg-[#FDF8F5]">
                      <Phone className="ml-2 h-4 w-4" /> اتصال مباشر
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full h-12 bg-[#D35400] hover:bg-[#3E2723] text-white rounded-xl shadow-lg shadow-orange-900/20">
                      <MessageCircle className="ml-2 h-4 w-4" /> واتساب
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-[#D7CCC8] h-full flex flex-col items-center justify-center text-center p-12 border-dashed">
              <div className="bg-[#FDF8F5] w-24 h-24 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="h-10 w-10 text-[#D7CCC8]" />
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-2">اختر رسالة لعرضها</h3>
              <p className="text-[#8D6E63] max-w-xs">
                انقر على أي رسالة من قائمة البريد الجانبية لاستعراض محتواها والرد على النزيل.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}