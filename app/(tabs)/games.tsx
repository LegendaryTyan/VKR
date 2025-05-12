import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SearchX } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import GameCard from '@/components/GameCard';
import { textGames, interactiveGames } from '@/constants/gameData';

export default function GamesScreen() {
  const { completedGames } = useUserStore();
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredGames = () => {
    const allGames = [...textGames, ...interactiveGames];
    
    switch (activeTab) {
      case 'text':
        return textGames;
      case 'interactive':
        return interactiveGames;
      case 'completed':
        return allGames.filter(game => completedGames.includes(game.id));
      case 'uncompleted':
        return allGames.filter(game => !completedGames.includes(game.id));
      default:
        return allGames;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabs}
        >
          <Pressable
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Все</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'text' && styles.activeTab]}
            onPress={() => setActiveTab('text')}
          >
            <Text style={[styles.tabText, activeTab === 'text' && styles.activeTabText]}>Текстовые</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'interactive' && styles.activeTab]}
            onPress={() => setActiveTab('interactive')}
          >
            <Text style={[styles.tabText, activeTab === 'interactive' && styles.activeTabText]}>Интерактивные</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Пройденные</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'uncompleted' && styles.activeTab]}
            onPress={() => setActiveTab('uncompleted')}
          >
            <Text style={[styles.tabText, activeTab === 'uncompleted' && styles.activeTabText]}>Непройденные</Text>
          </Pressable>
        </ScrollView>
      </View>
      
      <ScrollView 
        style={styles.gamesList} 
        contentContainerStyle={styles.gamesListContent}
      >
        {filteredGames().length > 0 ? (
          <View>
            {filteredGames().map(game => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.title}
                description={game.description}
                icon={game.icon}
                color={game.color}
                xp={game.xp}
                completed={completedGames.includes(game.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <SearchX size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyStateText}>Нет игр в этой категории</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsContainer: {
    backgroundColor: Colors.card,
    paddingVertical: 8,
  },
  tabs: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.text,
    fontWeight: '500',
    fontSize: 14,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  gamesList: {
    flex: 1,
  },
  gamesListContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});