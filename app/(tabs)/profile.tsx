import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Edit2, RefreshCcw, ChevronRight, Award, Zap, Flame, LogOut } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import LevelProgressBar from '@/components/LevelProgressBar';

export default function ProfileScreen() {
  const router = useRouter();
  const { name, xp, level, levelTitle, loginStreak, setName, resetProgress } = useUserStore();
  const { displayName, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  
  const handleSave = () => {
    if (newName.trim()) {
      setName(newName.trim());
      setIsEditing(false);
    } else {
      Alert.alert('Ошибка', 'Имя не может быть пустым');
    }
  };
  
  const handleReset = () => {
    Alert.alert(
      'Сбросить прогресс',
      'Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Сбросить', 
          style: 'destructive',
          onPress: () => {
            resetProgress();
            Alert.alert('Готово', 'Ваш прогресс был сброшен');
          }
        }
      ]
    );
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Выход из аккаунта',
      'Вы уверены, что хотите выйти из аккаунта?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth');
          }
        }
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{displayName ? displayName[0].toUpperCase() : (name ? name[0].toUpperCase() : 'Б')}</Text>
        </View>
        
        {isEditing ? (
          <View style={styles.editNameContainer}>
            <TextInput
              style={styles.nameInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Введите имя"
              maxLength={20}
              autoFocus
            />
            <View style={styles.editActions}>
              <Pressable style={styles.editButton} onPress={() => setIsEditing(false)}>
                <Text style={{ color: Colors.error, fontSize: 20 }}>✕</Text>
              </Pressable>
              <Pressable style={styles.editButton} onPress={handleSave}>
                <Text style={{ color: Colors.success, fontSize: 20 }}>✓</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{displayName || name || 'Бизнесмен'}</Text>
            {!displayName && (
              <Pressable style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Edit2 size={16} color={Colors.primary} />
              </Pressable>
            )}
          </View>
        )}
        
        <Text style={styles.levelText}>{levelTitle}</Text>
      </View>
      
      <LevelProgressBar currentXP={xp} level={level} levelTitle={levelTitle} />
      
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Статистика</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Award size={24} color={Colors.primary} />
            <Text style={styles.statValue}>{level}</Text>
            <Text style={styles.statLabel}>Уровень</Text>
          </View>
          <View style={styles.statCard}>
            <Zap size={24} color={Colors.primary} />
            <Text style={styles.statValue}>{xp}</Text>
            <Text style={styles.statLabel}>Опыт</Text>
          </View>
          <View style={styles.statCard}>
            <Flame size={24} color={Colors.primary} />
            <Text style={styles.statValue}>{loginStreak}</Text>
            <Text style={styles.statLabel}>Серия дней</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Настройки</Text>
        
        <Pressable style={styles.settingItem} onPress={handleReset}>
          <View style={styles.settingContent}>
            <RefreshCcw size={20} color={Colors.error} />
            <Text style={[styles.settingText, { color: Colors.error }]}>Сбросить прогресс</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </Pressable>
        
        <Pressable style={styles.settingItem} onPress={handleLogout}>
          <View style={styles.settingContent}>
            <LogOut size={20} color={Colors.error} />
            <Text style={[styles.settingText, { color: Colors.error }]}>Выйти из аккаунта</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </Pressable>
        
        <View style={styles.appInfo}>
          <Text style={styles.versionText}>Версия 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 Бизнес-навыки</Text>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 8,
  },
  editNameContainer: {
    width: '100%',
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 8,
    backgroundColor: Colors.card,
    textAlign: 'center',
    marginBottom: 8,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  levelText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
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
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 24,
  },
  versionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});