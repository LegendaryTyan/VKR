import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { CheckCircle, ArrowRight, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Option {
  text: string;
  outcome: string;
  points: number;
}

interface Scenario {
  title: string;
  description: string;
  options: Option[];
}

interface NegotiationGameProps {
  scenarios: Scenario[];
  onComplete: (score: number) => void;
}

export default function NegotiationGame({ scenarios, onComplete }: NegotiationGameProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [maxPossiblePoints, setMaxPossiblePoints] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const currentScenario = scenarios[currentScenarioIndex];
  
  const handleSelectOption = (optionIndex: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    setShowOutcome(true);
    
    const points = currentScenario.options[optionIndex].points;
    setTotalPoints(totalPoints + points);

    const maxPoints = Math.max(...currentScenario.options.map(opt => opt.points));
    setMaxPossiblePoints(maxPossiblePoints + maxPoints);
  };
  
  const handleNextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setSelectedOption(null);
      setShowOutcome(false);
    } else {
      setIsCompleted(true);
      const score = Math.round((totalPoints / maxPossiblePoints) * 100);
      onComplete(score);
    }
  };
  
  if (isCompleted) {
    return (
      <View style={styles.completedContainer}>
        <CheckCircle size={64} color={Colors.success} />
        <Text style={styles.completedTitle}>Сценарии завершены!</Text>
        <Text style={styles.scoreText}>
          Ваш результат: {totalPoints} из {maxPossiblePoints} возможных баллов
        </Text>
        <Text style={styles.scorePercentage}>
          {Math.round((totalPoints / maxPossiblePoints) * 100)}%
        </Text>
      </View>
    );
  }
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
    >
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentScenarioIndex) / scenarios.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Сценарий {currentScenarioIndex + 1} из {scenarios.length}
        </Text>
      </View>
      
      <View style={styles.scenarioCard}>
        <Text style={styles.scenarioTitle}>{currentScenario.title}</Text>
        <Text style={styles.scenarioDescription}>{currentScenario.description}</Text>
      </View>
      
      <Text style={styles.optionsTitle}>Выберите вариант действий:</Text>
      
      <View style={styles.optionsContainer}>
        {currentScenario.options.map((option, index) => (
          <Pressable
            key={index}
            style={[
              styles.option,
              selectedOption === index && styles.selectedOption,
              selectedOption !== null && selectedOption !== index && styles.disabledOption
            ]}
            onPress={() => handleSelectOption(index)}
            disabled={selectedOption !== null}
          >
            <Text 
              style={[
                styles.optionText,
                selectedOption === index && styles.selectedOptionText
              ]}
            >
              {option.text}
            </Text>
          </Pressable>
        ))}
      </View>
      
      {showOutcome && selectedOption !== null && (
        <View style={styles.outcomeContainer}>
          <Text style={styles.outcomeTitle}>Результат:</Text>
          <Text style={styles.outcomeText}>
            {currentScenario.options[selectedOption].outcome}
          </Text>
          <View style={styles.pointsContainer}>
            <Star size={20} color={Colors.warning} />
            <Text style={styles.pointsText}>
              +{currentScenario.options[selectedOption].points} баллов
            </Text>
          </View>
          <Pressable style={styles.nextButton} onPress={handleNextScenario}>
            <Text style={styles.nextButtonText}>
              {currentScenarioIndex < scenarios.length - 1 ? 'Следующий сценарий' : 'Завершить'}
            </Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </Pressable>
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
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  scenarioCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  scenarioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  scenarioDescription: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  option: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: Colors.primary + '20',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  outcomeContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
    lineHeight: 22,
    marginBottom: 16,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.warning,
    marginLeft: 8,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
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
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  scorePercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});