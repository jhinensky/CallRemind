import React, { useState, useEffect } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput } from 'react-native';
import ContactCard from '../components/ContactCard';

import { Contact, useContacts, choose_file, pick_image } from '../context/ContactsContext';


const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];


export default function Homes() {
  const { contacts, deleteContact, addCallHistory, import_contacts, editContact } = useContacts();
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [currentColor, setCurrentColor] = useState<string>(COLORS[0]);
  const [isShuffling, setIsShuffling] = useState(false);
  
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDob, setEditDob] = useState('');

  useEffect(() => {
    if (contacts.length > 0 && !currentContact) {
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      setCurrentContact(randomContact);
      setCurrentColor(randomColor);
    }
  }, [contacts, currentContact]);

  const shuffleThroughCards = async () => {
    if (contacts.length === 0 || isShuffling) return;

    setIsShuffling(true);
    let delay = 40;

    for (let i = 0; i < 20; i++) {
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

      setCurrentContact(randomContact);
      setCurrentColor(randomColor);

      await new Promise(resolve => setTimeout(resolve, delay));
      delay += 20;
    }

    setIsShuffling(false);
  };

  const handleCall = () => {
    if (!currentContact || isShuffling) return;
    Linking.openURL(`tel:${currentContact.phone}`);
    addCallHistory(currentContact);
    shuffleThroughCards();
  };

  const handleDelete = () => {
    if (!currentContact || isShuffling) return;
    deleteContact(currentContact.id);
    if (contacts.length > 1) {
      shuffleThroughCards();
    } else {
      setCurrentContact(null);
    }
  };

  const handleNext = () => {
    if (isShuffling) return;
    shuffleThroughCards();
  };

  const handle_contacts = () => {
    choose_file((imported) => {
      import_contacts(imported)
    })
  }

  
  const handleAvatarUpdate = () => {
    if (!currentContact || isShuffling) return;
    
    pick_image((uri) => {
      
      editContact(currentContact.id, { avatar: uri });
      
      
      setCurrentContact(prev => prev ? ({ ...prev, avatar: uri }) : null);
    });
  };

  const openEditModal = () => {
    if (!currentContact) return;
    setEditName(currentContact.name);
    setEditPhone(currentContact.phone);
    setEditDob(currentContact.dob);
    setIsEditModalVisible(true);
  };

  const saveEdit = () => {
    if (!currentContact) return;
    editContact(currentContact.id, {
      name: editName,
      phone: editPhone,
      dob: editDob
    });
    
    setCurrentContact(prev => prev ? ({...prev, name: editName, phone: editPhone, dob: editDob}) : null);
    setIsEditModalVisible(false);
  };

  if (!currentContact) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No contacts available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Contact</Text>
            
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput 
              style={styles.input} 
              value={editName} 
              onChangeText={setEditName} 
            />

            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput 
              style={styles.input} 
              value={editPhone} 
              onChangeText={setEditPhone}
              keyboardType="phone-pad" 
            />

            <Text style={styles.inputLabel}>DOB</Text>
            <TextInput 
              style={styles.input} 
              value={editDob} 
              onChangeText={setEditDob} 
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveEdit}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- NEW TITLE HERE --- */}
      <Text style={styles.appTitle}>Random Contact Caller</Text>

      <TouchableOpacity style={styles.import_btn} onPress={handle_contacts}>
        <Text style={styles.import_text}>Import Contacts</Text>
      </TouchableOpacity>

      <View>
        <ContactCard 
          contact={currentContact} 
          color={currentColor} 
          onAvatarPress={handleAvatarUpdate} 
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSmall, styles.deleteButton]}
          onPress={handleDelete}
          disabled={isShuffling}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.buttonSmall, styles.editButton]}
          onPress={openEditModal}
          disabled={isShuffling}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonLarge, styles.callButton]}
          onPress={handleCall}
          disabled={isShuffling}
        >
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSmall, styles.nextButton]}
          onPress={handleNext}
          disabled={isShuffling}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  // --- NEW STYLE HERE ---
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 20,
    marginTop: -20, // Helps pull it up slightly if the container is centered
    letterSpacing: 0.5,
  },
  // ... existing styles ...
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    width: 360,
  },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonSmall: {
    flex: 1,
  },
  buttonLarge: {
    flex: 1.5,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  editButton: {
    backgroundColor: '#95b8d1', 
  },
  callButton: {
    backgroundColor: '#34C759',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  import_btn: {
    backgroundColor:'#000000',
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:10,
    marginBottom:20
  },
  import_text: {
    color:'#fff',
    fontSize:15,
    fontWeight:'bold',
    textAlign:'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#d6eadf', 
    width: 320,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
    marginLeft: 4,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eac4d5', 
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#eac4d5', 
  },
  saveButton: {
    backgroundColor: '#809bce', 
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});