import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Contact = {
  id: number;
  name: string;
  dob: string;
  phone: string;
  lastSpoken: string;
  avatar: string;
};

type CallHistoryItem = {
  id: number;
  contact: Contact;
  type: 'outgoing' | 'incoming';
  timestamp: string;
};

export default function RecentScreen() {
  const callHistory: CallHistoryItem[] = []; // This would come from shared state/context later

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recent</Text>
      
      {callHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No recent calls</Text>
        </View>
      ) : (
        callHistory.map((call) => (
          <View key={call.id} style={styles.callItem}>
            <View style={styles.callInfo}>
              <Text style={styles.callName}>{call.contact.name}</Text>
              <Text style={styles.callPhone}>{call.contact.phone}</Text>
            </View>
            <View style={styles.callMeta}>
              <Text style={styles.callType}>
                {call.type === 'outgoing' ? '↗ Outgoing' : '↙ Incoming'}
              </Text>
              <Text style={styles.callTime}>{formatDate(call.timestamp)}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#000',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  callItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  callInfo: {
    flex: 1,
  },
  callName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  callPhone: {
    fontSize: 14,
    color: '#666',
  },
  callMeta: {
    alignItems: 'flex-end',
  },
  callType: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  callTime: {
    fontSize: 12,
    color: '#999',
  },
});
