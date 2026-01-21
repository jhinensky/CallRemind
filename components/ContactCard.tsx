import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

type Contact = {
  id: number;
  name: string;
  dob: string;
  phone: string;
  lastSpoken: string;
  avatar: string;
};

type ContactCardProps = {
  contact: Contact;
  color: string;
  onAvatarPress?: () => void; 
};

const ContactCard = ({ contact, color, onAvatarPress }: ContactCardProps) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  
const isImage = contact.avatar.length > 4;

  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <TouchableOpacity 
        style={styles.photoContainer} 
        onPress={onAvatarPress}
        activeOpacity={0.7}
      >
        {isImage ? (
          <Image 
            source={{ uri: contact.avatar }} 
            style={styles.avatarImage} 
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.avatar}>{contact.avatar}</Text>
        )}
        
        <View style={styles.editIconContainer}>
          <Text style={styles.editIcon}>✎</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.cardTitle}>IDENTIFICATION</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <Text style={[styles.value, styles.valueLarge]}>{contact.name}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>DOB</Text>
          <Text style={styles.value}>{contact.dob}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{contact.phone}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Last Call</Text>
          <Text style={styles.value}>{formatDate(contact.lastSpoken)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 510,
    height: 300,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row', 
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  photoContainer: {
    width: 180,
    height: 250,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  avatar: {
    fontSize: 48,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  field: {
    marginBottom: 8,
  },
  label: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  valueLarge: {
    fontSize: 16,
  },
});

export default ContactCard;