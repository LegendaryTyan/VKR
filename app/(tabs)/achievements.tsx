import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import AchievementCard from '@/components/AchievementCard';
import { achievements } from '@/constants/gameData';

export default function AchievementsScreen() {
  const { earnedAchievements } = useUserStore();

  const completionPercentage = Math.round((earnedAchievements.length / achievements.length) * 100);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ваши достижения</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${completionPercentage}%` }]} />
        </View>
        <Text style={styles.progressText}>{completionPercentage}% выполнено</Text>
      </View>
      
      <ScrollView style={styles.achievementsList} contentContainerStyle={styles.achievementsListContent}>
        {achievements.map(achievement => (
          <AchievementCard
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            icon={achievement.icon}
            xp={achievement.xp}
            earned={earnedAchievements.includes(achievement.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.card,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  achievementsList: {
    flex: 1,
  },
  achievementsListContent: {
    padding: 16,
  },
});