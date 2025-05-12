import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Animated } from 'react-native';
import { XCircle, Trophy, Clock, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface MarketSimulatorProps {
  onComplete: (score: number) => void;
}

interface MarketEvent {
  title: string;
  description: string;
  options: {
    text: string;
    effect: {
      money: number;
      customers: number;
      reputation: number;
    };
    outcome: string;
  }[];
}

// Sample market events
const marketEvents: MarketEvent[] = [
  {
    title: 'Экономический кризис',
    description: 'Начался экономический кризис. Как вы отреагируете?',
    options: [
      {
        text: 'Сократить расходы и персонал',
        effect: { money: 5000, customers: -20, reputation: -10 },
        outcome: 'Вы сэкономили деньги, но потеряли часть клиентов и репутацию.'
      },
      {
        text: 'Инвестировать в маркетинг, чтобы привлечь клиентов',
        effect: { money: -3000, customers: 15, reputation: 5 },
        outcome: 'Вы потратили деньги на маркетинг, но привлекли новых клиентов.'
      },
      {
        text: 'Не менять стратегию',
        effect: { money: -1000, customers: -5, reputation: 0 },
        outcome: 'Вы продолжили работать как обычно, но немного потеряли в доходах и клиентах.'
      }
    ]
  },
  {
    title: 'Новый конкурент',
    description: 'На рынке появился новый сильный конкурент с агрессивной ценовой политикой.',
    options: [
      {
        text: 'Снизить цены, чтобы конкурировать',
        effect: { money: -2000, customers: 10, reputation: -5 },
        outcome: 'Вы снизили цены, что привлекло клиентов, но снизило прибыль и немного повредило имиджу премиум-бренда.'
      },
      {
        text: 'Улучшить качество продукта/услуги',
        effect: { money: -4000, customers: 5, reputation: 15 },
        outcome: 'Вы инвестировали в качество, что укрепило вашу репутацию и привлекло лояльных клиентов.'
      },
      {
        text: 'Запустить рекламную кампанию, подчеркивающую ваши преимущества',
        effect: { money: -3000, customers: 8, reputation: 8 },
        outcome: 'Ваша рекламная кампания помогла выделиться на фоне конкурента.'
      }
    ]
  },
  {
    title: 'Технологический прорыв',
    description: 'В вашей отрасли произошел технологический прорыв. Новые технологии могут изменить рынок.',
    options: [
      {
        text: 'Быстро внедрить новые технологии',
        effect: { money: -8000, customers: 20, reputation: 15 },
        outcome: 'Вы стали одним из первых, кто внедрил новые технологии, что привлекло много новых клиентов.'
      },
      {
        text: 'Подождать и посмотреть, как рынок отреагирует',
        effect: { money: 0, customers: -5, reputation: -5 },
        outcome: 'Вы решили не рисковать, но некоторые клиенты ушли к более инновационным конкурентам.'
      },
      {
        text: 'Инвестировать в исследования для создания собственной технологии',
        effect: { money: -5000, customers: 0, reputation: 10 },
        outcome: 'Вы начали разрабатывать собственную технологию, что укрепило вашу репутацию как инноватора.'
      }
    ]
  },
  {
    title: 'Изменение потребительских предпочтений',
    description: 'Клиенты начинают предпочитать экологичные и устойчивые продукты/услуги.',
    options: [
      {
        text: 'Полностью пересмотреть продуктовую линейку',
        effect: { money: -6000, customers: 15, reputation: 20 },
        outcome: 'Вы полностью обновили продукты, что привлекло новых клиентов и значительно улучшило репутацию.'
      },
      {
        text: 'Добавить несколько экологичных опций',
        effect: { money: -2000, customers: 8, reputation: 5 },
        outcome: 'Вы расширили ассортимент, что позволило удержать существующих клиентов и привлечь новых.'
      },
      {
        text: 'Сосредоточиться на маркетинге существующих продуктов',
        effect: { money: -1000, customers: -5, reputation: -10 },
        outcome: 'Вы попытались представить существующие продукты как экологичные, но клиенты не были убеждены.'
      }
    ]
  },
  {
    title: 'Возможность расширения',
    description: 'У вас появилась возможность выйти на новый рынок или открыть новый филиал.',
    options: [
      {
        text: 'Агрессивно расширяться',
        effect: { money: -10000, customers: 30, reputation: 5 },
        outcome: 'Вы инвестировали значительные средства в расширение, что привлекло много новых клиентов.'
      },
      {
        text: 'Расширяться постепенно',
        effect: { money: -5000, customers: 15, reputation: 10 },
        outcome: 'Вы выбрали стратегию постепенного роста, что позволило контролировать риски.'
      },
      {
        text: 'Отказаться от расширения и сосредоточиться на текущем бизнесе',
        effect: { money: 2000, customers: 0, reputation: 0 },
        outcome: 'Вы решили оптимизировать текущий бизнес, что позволило немного увеличить прибыль.'
      }
    ]
  }
];

export default function MarketSimulator({ onComplete }: MarketSimulatorProps) {
  const [money, setMoney] = useState(10000);
  const [customers, setCustomers] = useState(50);
  const [reputation, setReputation] = useState(50);
  const [day, setDay] = useState(1);
  const [currentEvent, setCurrentEvent] = useState<MarketEvent | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const moneyAnim = React.useRef(new Animated.Value(0)).current;
  const customersAnim = React.useRef(new Animated.Value(0)).current;
  const reputationAnim = React.useRef(new Animated.Value(0)).current;

  const [moneyAnimDirection, setMoneyAnimDirection] = useState(0);
  const [customersAnimDirection, setCustomersAnimDirection] = useState(0);
  const [reputationAnimDirection, setReputationAnimDirection] = useState(0);

  useEffect(() => {
    if (!currentEvent && !gameOver && !gameWon) {
      const randomIndex = Math.floor(Math.random() * marketEvents.length);
      setCurrentEvent(marketEvents[randomIndex]);
    }
  }, [currentEvent, gameOver, gameWon]);

  useEffect(() => {
    if (money <= 0) {
      setGameOver(true);
      onComplete(Math.min(Math.round((day / 10) * 100), 100));
    } else if (money >= 50000) {
      setGameWon(true);
      onComplete(100);
    }
  }, [money, day]);

  useEffect(() => {
    if (!currentEvent && !gameOver && !gameWon) {
      const dailyIncome = Math.round(customers * (reputation / 50));
      setMoney(prev => prev + dailyIncome);

      setMoneyAnimDirection(1);
      Animated.timing(moneyAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        moneyAnim.setValue(0);
        setMoneyAnimDirection(0);
      });
    }
  }, [day, currentEvent]);
  
  const handleSelectOption = (optionIndex: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    setShowOutcome(true);
    
    const option = currentEvent!.options[optionIndex];
    
    setMoneyAnimDirection(option.effect.money > 0 ? 1 : -1);
    setCustomersAnimDirection(option.effect.customers > 0 ? 1 : -1);
    setReputationAnimDirection(option.effect.reputation > 0 ? 1 : -1);

    Animated.parallel([
      Animated.timing(moneyAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(customersAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(reputationAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start(() => {
      moneyAnim.setValue(0);
      customersAnim.setValue(0);
      reputationAnim.setValue(0);
      setMoneyAnimDirection(0);
      setCustomersAnimDirection(0);
      setReputationAnimDirection(0);
    });

    setMoney(prev => prev + option.effect.money);
    setCustomers(prev => Math.max(0, Math.min(100, prev + option.effect.customers)));
    setReputation(prev => Math.max(0, Math.min(100, prev + option.effect.reputation)));
  };
  
  const handleNextDay = () => {
    setDay(prev => prev + 1);
    setCurrentEvent(null);
    setSelectedOption(null);
    setShowOutcome(false);
  };
  
  if (gameOver) {
    return (
      <View style={styles.gameOverContainer}>
        <XCircle size={64} color={Colors.error} />
        <Text style={styles.gameOverTitle}>Банкротство!</Text>
        <Text style={styles.gameOverText}>
          Ваша компания обанкротилась на день {day}.
        </Text>
        <Text style={styles.gameOverStats}>
          Клиенты: {customers}{"\n"}
          Репутация: {reputation}
        </Text>
      </View>
    );
  }
  
  if (gameWon) {
    return (
      <View style={styles.gameWonContainer}>
        <Trophy size={64} color={Colors.warning} />
        <Text style={styles.gameWonTitle}>Успех!</Text>
        <Text style={styles.gameWonText}>
          Вы достигли финансового успеха за {day} дней!
        </Text>
        <Text style={styles.gameWonStats}>
          Деньги: ${money}{"\n"}
          Клиенты: {customers}{"\n"}
          Репутация: {reputation}
        </Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>День</Text>
          <Text style={styles.statValue}>{day}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Деньги</Text>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>${money}</Text>
            <Animated.Text 
              style={[
                styles.statChange,
                { 
                  color: moneyAnimDirection > 0 ? Colors.success : Colors.error,
                  opacity: moneyAnim,
                  transform: [
                    {
                      translateY: moneyAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, moneyAnimDirection > 0 ? -10 : 10],
                      }),
                    },
                  ],
                }
              ]}
            >
              {moneyAnimDirection > 0 ? '+' : ''}{currentEvent && selectedOption !== null ? currentEvent.options[selectedOption].effect.money : ''}
            </Animated.Text>
          </View>
        </View>
      </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Клиенты</Text>
            <Text style={styles.metricValue}>{customers}</Text>
            <Animated.Text 
              style={[
                styles.metricChange,
                { 
                  color: customersAnimDirection > 0 ? Colors.success : Colors.error,
                  opacity: customersAnim,
                }
              ]}
            >
              {customersAnimDirection > 0 ? '+' : ''}{currentEvent && selectedOption !== null ? currentEvent.options[selectedOption].effect.customers : ''}
            </Animated.Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${customers}%` }]} />
          </View>
        </View>
        
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Репутация</Text>
            <Text style={styles.metricValue}>{reputation}</Text>
            <Animated.Text 
              style={[
                styles.metricChange,
                { 
                  color: reputationAnimDirection > 0 ? Colors.success : Colors.error,
                  opacity: reputationAnim,
                }
              ]}
            >
              {reputationAnimDirection > 0 ? '+' : ''}{currentEvent && selectedOption !== null ? currentEvent.options[selectedOption].effect.reputation : ''}
            </Animated.Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${reputation}%` }]} />
          </View>
        </View>
      </View>
      
      {currentEvent && (
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>{currentEvent.title}</Text>
          <Text style={styles.eventDescription}>{currentEvent.description}</Text>
          
          {!showOutcome && (
            <View style={styles.optionsContainer}>
              {currentEvent.options.map((option, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.option,
                    selectedOption === index && styles.selectedOption
                  ]}
                  onPress={() => handleSelectOption(index)}
                  disabled={selectedOption !== null}
                >
                  <Text style={styles.optionText}>{option.text}</Text>
                  <View style={styles.optionEffects}>
                    <Text style={[
                      styles.optionEffect,
                      option.effect.money > 0 ? styles.positiveEffect : styles.negativeEffect
                    ]}>
                      {option.effect.money > 0 ? '+' : ''}{option.effect.money}$
                    </Text>
                    <Text style={[
                      styles.optionEffect,
                      option.effect.customers > 0 ? styles.positiveEffect : styles.negativeEffect
                    ]}>
                      {option.effect.customers > 0 ? '+' : ''}{option.effect.customers} клиенты
                    </Text>
                    <Text style={[
                      styles.optionEffect,
                      option.effect.reputation > 0 ? styles.positiveEffect : styles.negativeEffect
                    ]}>
                      {option.effect.reputation > 0 ? '+' : ''}{option.effect.reputation} репутация
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
          
          {showOutcome && selectedOption !== null && (
            <View style={styles.outcomeContainer}>
              <Text style={styles.outcomeTitle}>Результат:</Text>
              <Text style={styles.outcomeText}>
                {currentEvent.options[selectedOption].outcome}
              </Text>
              <Pressable style={styles.nextButton} onPress={handleNextDay}>
                <Text style={styles.nextButtonText}>Следующий день</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          )}
        </View>
      )}
      
      {!currentEvent && !gameOver && !gameWon && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Загрузка следующего дня...</Text>
        </View>
      )}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statChange: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  metricsContainer: {
    marginBottom: 16,
  },
  metricItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 4,
  },
  metricChange: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  eventCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  optionsContainer: {
    marginBottom: 8,
  },
  option: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  optionEffects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionEffect: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  positiveEffect: {
    backgroundColor: Colors.success + '20',
    color: Colors.success,
  },
  negativeEffect: {
    backgroundColor: Colors.error + '20',
    color: Colors.error,
  },
  outcomeContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
  },
  outcomeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  outcomeText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  gameOverTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.error,
    marginTop: 16,
    marginBottom: 8,
  },
  gameOverText: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  gameOverStats: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  gameWonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  gameWonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.success,
    marginTop: 16,
    marginBottom: 8,
  },
  gameWonText: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  gameWonStats: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});