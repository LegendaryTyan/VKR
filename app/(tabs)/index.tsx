import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import LevelProgressBar from '@/components/LevelProgressBar';
import MotivationalQuote from '@/components/MotivationalQuote';
import GameCard from '@/components/GameCard';
import { textGames, interactiveGames } from '@/constants/gameData';

export default function HomeScreen() {
  const router = useRouter();
  const { name, xp, level, levelTitle, completedGames, loginStreak } = useUserStore();
  const { displayName } = useAuthStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useEffect(() => {
    if (!name) {
      setShowOnboarding(true);
      router.push('/onboarding');
    }
  }, [name]);
  const recommendedGames = [...textGames, ...interactiveGames]
    .filter(game => !completedGames.includes(game.id))
    .slice(0, 3);
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Привет, {displayName || name || 'Бизнесмен'}!</Text>
          <Text style={styles.streakText}>
            {loginStreak > 0 ? `Серия входов: ${loginStreak} дней` : 'Начните свою серию входов!'}
          </Text>
        </View>
        <View style={styles.xpContainer}>
          <Text style={styles.xpText}>{xp} XP</Text>
        </View>
      </View>
      
      <LevelProgressBar currentXP={xp} level={level} levelTitle={levelTitle} />
      
      <MotivationalQuote />
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Рекомендуемые игры</Text>
          <Pressable onPress={() => router.push('/games')}>
            <Text style={styles.seeAllText}>Все игры</Text>
          </Pressable>
        </View>
        
        {recommendedGames.length > 0 ? (
          <View>
            {recommendedGames.map(game => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.title}
                description={game.description}
                icon={game.icon}
                color={game.color}
                xp={game.xp}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <CheckCircle size={48} color={Colors.success} />
            <Text style={styles.emptyStateText}>Вы прошли все игры! Скоро появятся новые.</Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ваш прогресс</Text>
          <Pressable onPress={() => router.push('/achievements')}>
            <Text style={styles.seeAllText}>Достижения</Text>
          </Pressable>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedGames.length}</Text>
            <Text style={styles.statLabel}>Игр пройдено</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{level}</Text>
            <Text style={styles.statLabel}>Уровень</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{loginStreak}</Text>
            <Text style={styles.statLabel}>Дней подряд</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  streakText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  xpContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  xpText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});