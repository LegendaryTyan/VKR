import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Quote } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { motivationalQuotes } from '@/constants/gameData';

export default function MotivationalQuote() {
  const [quote, setQuote] = useState('');
  
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);
  
  if (!quote) return null;
  
  return (
    <View style={styles.container}>
      <Quote size={24} color={Colors.primary} style={{ marginBottom: 8 }} />
      <Text style={styles.quoteText}>{quote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.text,
    lineHeight: 20,
  },
});