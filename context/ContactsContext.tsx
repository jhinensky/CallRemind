import React, { createContext, useContext, useState, ReactNode } from 'react';


export type Contact = {
  id: number;
  name: string;
  dob: string;
  phone: string;
  lastSpoken: string;
  avatar: string;
};

export type CallHistoryItem = {
  id: number;
  contact: Contact;
  type: 'outgoing' | 'incoming';
  timestamp: string;
};

type ContactsContextType = {
  contacts: Contact[];
  callHistory: CallHistoryItem[];
  deleteContact: (id: number) => void;
  addCallHistory: (contact: Contact) => void;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: 1, name: 'Sarah Johnson', dob: '04/12/1985', phone: '+15551234567', lastSpoken: '2025-01-15', avatar: '👩' },
  { id: 2, name: 'Michael Chen', dob: '08/23/1990', phone: '+15552345678', lastSpoken: '2025-01-10', avatar: '👨' },
  { id: 3, name: 'Emma Davis', dob: '11/30/1988', phone: '+15553456789', lastSpoken: '2025-01-05', avatar: '👩‍🦰' },
  { id: 4, name: 'James Wilson', dob: '02/17/1992', phone: '+15554567890', lastSpoken: '2024-12-28', avatar: '🧔' },
  { id: 5, name: 'Olivia Martinez', dob: '07/09/1987', phone: '+15555678901', lastSpoken: '2024-12-20', avatar: '👱‍♀️' },
];

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export function ContactsProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);

  const deleteContact = (id: number) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const addCallHistory = (contact: Contact) => {
    const newCall: CallHistoryItem = {
      id: Date.now(),
      contact,
      type: 'outgoing',
      timestamp: new Date().toISOString(),
    };
    setCallHistory(prev => [newCall, ...prev]);
  };

  return (
    <ContactsContext.Provider value={{ contacts, callHistory, deleteContact, addCallHistory }}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContacts must be used within ContactsProvider');
  }
  return context;
}

