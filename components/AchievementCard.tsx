import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Award, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  xp: number;
  earned: boolean;
}

export default function AchievementCard({ title, description, icon, xp, earned }: AchievementCardProps) {
  return (
    <View style={[styles.card, !earned && styles.locked]}>
      <View style={[styles.iconContainer, earned ? styles.earnedIcon : styles.lockedIcon]}>
        <Award size={24} color={earned ? '#FFFFFF' : Colors.textSecondary} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !earned && styles.lockedText]}>{title}</Text>
        <Text style={[styles.description, !earned && styles.lockedText]}>{description}</Text>
        <Text style={[styles.xp, !earned && styles.lockedText]}>+{xp} XP</Text>
      </View>
      {earned && (
        <View style={styles.earnedBadge}>
          <Check size={16} color="#FFFFFF" />
        </View>
      )}
    </View>
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
  locked: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  earnedIcon: {
    backgroundColor: Colors.primary,
  },
  lockedIcon: {
    backgroundColor: Colors.disabled,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  xp: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  lockedText: {
    color: Colors.textSecondary,
  },
  earnedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});