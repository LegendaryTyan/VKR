import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { textGames, interactiveGames } from '@/constants/gameData';

import QuizGame from '@/components/games/QuizGame';
import NegotiationGame from '@/components/games/NegotiationGame';
import MarketSimulator from '@/components/games/MarketSimulator';
import ResourceAllocation from '@/components/games/ResourceAllocation';

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addXP, completeGame } = useUserStore();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const allGames = [...textGames, ...interactiveGames];
    const foundGame = allGames.find(g => g.id === id);
    
    if (foundGame) {
      setGame(foundGame);
    }
    
    setLoading(false);
  }, [id]);
  
  const handleGameComplete = (score: number) => {
    const earnedXP = Math.round((game.xp * score) / 100);
    
    addXP(earnedXP);
    completeGame(game.id);
    
    Alert.alert(
      'Игра завершена!',
      `Вы заработали ${earnedXP} XP`,
      [
        { text: 'К списку игр', onPress: () => router.back() },
        { text: 'Играть снова', onPress: () => renderGameComponent() }
      ]
    );
  };
  
  const renderGameComponent = () => {
    switch (game.id) {
      case 'business-quiz':
        return <QuizGame questions={game.questions} onComplete={handleGameComplete} />;
      case 'negotiation-scenarios':
        return <NegotiationGame scenarios={game.scenarios} onComplete={handleGameComplete} />;
      case 'market-simulator':
        return <MarketSimulator onComplete={handleGameComplete} />;
      case 'resource-allocation':
        return <ResourceAllocation onComplete={handleGameComplete} />;
      default:
        return (
          <View style={styles.errorContainer}>
            <AlertTriangle size={48} color={Colors.warning} />
            <Text style={styles.errorText}>Игра не найдена или находится в разработке</Text>
          </View>
        );
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Загрузка...</Text>
      </View>
    );
  }
  
  if (!game) {
    return (
      <View style={styles.errorContainer}>
        <AlertTriangle size={48} color={Colors.warning} />
        <Text style={styles.errorText}>Игра не найдена</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Вернуться к списку игр</Text>
        </Pressable>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ title: game.title }} />
      <View style={styles.container}>
        {renderGameComponent()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});