import React, { useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ContactCard from '../components/ContactCard';
import { Contact, useContacts } from '../context/ContactsContext';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

export default function Homes() {
  const { contacts, deleteContact, addCallHistory } = useContacts();

  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [currentColor, setCurrentColor] = useState<string>(COLORS[0]);
  const [isShuffling, setIsShuffling] = useState(false);

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
      delay += 20; // slows down each step
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
      <View>
        <ContactCard contact={currentContact} color={currentColor} />
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: 340,
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
    flex: 0.8,
  },
  buttonLarge: {
    flex: 1.4,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  callButton: {
    backgroundColor: '#34C759',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
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
});

