import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as picker from 'expo-document-picker'
import papa from 'papaparse'


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
  import_contacts:(new_contacts:Contact[])=>void
}

const INITIAL_CONTACTS: Contact[] = [
  { id: 1, name: 'Sarah Johnson', dob: '04/12/1985', phone: '+15551234567', lastSpoken: '2025-01-15', avatar: '👩' },
  { id: 2, name: 'Michael Chen', dob: '08/23/1990', phone: '+15552345678', lastSpoken: '2025-01-10', avatar: '👨' },
  { id: 3, name: 'Emma Davis', dob: '11/30/1988', phone: '+15553456789', lastSpoken: '2025-01-05', avatar: '👩‍🦰' },
  { id: 4, name: 'James Wilson', dob: '02/17/1992', phone: '+15554567890', lastSpoken: '2024-12-28', avatar: '🧔' },
  { id: 5, name: 'Olivia Martinez', dob: '07/09/1987', phone: '+15555678901', lastSpoken: '2024-12-20', avatar: '👱‍♀️' },
  { id: 6, name: 'Daniel Thompson', dob: '03/14/1984', phone: '+15556789012', lastSpoken: '2025-01-18', avatar: '👨‍🦱' },
  { id: 7, name: 'Sophia Lee', dob: '09/02/1993', phone: '+15557890123', lastSpoken: '2025-01-12', avatar: '👩‍🎓' },
  { id: 8, name: 'Ethan Brown', dob: '12/21/1989', phone: '+15558901234', lastSpoken: '2025-01-08', avatar: '👨‍💼' },
  { id: 9, name: 'Isabella Rossi', dob: '06/05/1991', phone: '+15559012345', lastSpoken: '2024-12-30', avatar: '👩‍🎨' },
  { id: 10, name: 'Noah Patel', dob: '01/27/1995', phone: '+15550123456', lastSpoken: '2024-12-22', avatar: '👨‍💻' },
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

  const import_contacts=(new_contacts:Contact[])=>
  {
    setContacts(prev=>[...prev,...new_contacts]);
  }

  return (
    <ContactsContext.Provider value={{ contacts, callHistory, deleteContact, addCallHistory,import_contacts}}>
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

const read=async(uri:string):Promise<string>=>
{
  const res=await fetch(uri)
  const text=await res.text()
  return text
}
const parse=(data:string):Contact[]=>
{
  const results=papa.parse(data,{header:true})
  return results.data.map((row:any,index:number)=>
    (
      {
        id:index,
        name:row.name,
        dob:row.dob||'',
        phone:row.phone||'',
        lastSpoken:row.lastSpoken||new Date().toISOString(),
        avatar:row.avatar||'👤'
      }
    )
  )
}
export const choose_file=async(loaded:(contacts:Contact[])=>void)=>
{
  const result=await picker.getDocumentAsync({type:'text/csv'})
  if(!result.canceled)
  {
    const uri=result.assets[0].uri
    const data=await read(uri)
    const contacts=await parse(data)
    loaded(contacts)
  }
}

