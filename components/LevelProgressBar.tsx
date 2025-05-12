import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import Colors from '@/constants/colors';
import { levels } from '@/constants/gameData';

interface LevelProgressBarProps {
  currentXP: number;
  level: number;
  levelTitle: string;
}

export default function LevelProgressBar({ currentXP, level, levelTitle }: LevelProgressBarProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const currentLevelInfo = levels.find(l => l.level === level) || levels[0];
  const nextLevelInfo = levels.find(l => l.level === level + 1) || levels[levels.length - 1];
  
  const xpForCurrentLevel = currentLevelInfo.xpRequired;
  const xpForNextLevel = nextLevelInfo.xpRequired;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const xpProgress = currentXP - xpForCurrentLevel;
  
  const progressPercentage = Math.min(xpProgress / xpNeeded, 1);
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);
  
  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.levelInfo}>
        <Text style={styles.levelTitle}>{levelTitle}</Text>
        <Text style={styles.levelNumber}>Уровень {level}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { width }]} />
      </View>
      
      <View style={styles.xpInfo}>
        <Text style={styles.xpText}>
          {xpProgress} / {xpNeeded} XP до следующего уровня
        </Text>
        {level < levels.length && (
          <Text style={styles.nextLevelText}>
            Следующий: {nextLevelInfo.title}
          </Text>
        )}
      </View>
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
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  levelNumber: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  progressContainer: {
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
  xpInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  nextLevelText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});