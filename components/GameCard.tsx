import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Brain, MessageCircle, TrendingUp, PieChart, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  xp: number;
  completed?: boolean;
}

export default function GameCard({ id, title, description, icon, color, xp, completed }: GameCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/games/${id}`);
  };

  const renderIcon = () => {
    const iconSize = 24;
    
    switch (icon) {
      case 'brain':
        return <Brain size={iconSize} color="#FFFFFF" />;
      case 'message-circle':
        return <MessageCircle size={iconSize} color="#FFFFFF" />;
      case 'trending-up':
        return <TrendingUp size={iconSize} color="#FFFFFF" />;
      case 'pie-chart':
        return <PieChart size={iconSize} color="#FFFFFF" />;
      default:
        return <Brain size={iconSize} color="#FFFFFF" />;
    }
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed
      ]}
      onPress={handlePress}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        {renderIcon()}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {completed && (
            <CheckCircle size={16} color={Colors.success} />
          )}
        </View>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.footer}>
          <Text style={styles.xp}>+{xp} XP</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  xp: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});