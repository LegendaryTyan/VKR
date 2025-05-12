import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Platform } from 'react-native';
import { CheckCircle, Clock, Check, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizGameProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

export default function QuizGame({ questions, onComplete }: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(30);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isAnswered) {
            handleAnswer(-1);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestionIndex]);
  
  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsCompleted(true);
        const finalScore = Math.round(((score + (isCorrect ? 1 : 0)) / questions.length) * 100);
        onComplete(finalScore);
      }
    }, 1500);
  };
  
  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return index === selectedOption ? styles.selectedOption : styles.option;
    }
    
    if (index === currentQuestion.correctAnswer) {
      return styles.correctOption;
    }
    
    if (index === selectedOption && index !== currentQuestion.correctAnswer) {
      return styles.wrongOption;
    }
    
    return styles.option;
  };
  
  const getOptionTextStyle = (index: number) => {
    if (!isAnswered) {
      return index === selectedOption ? styles.selectedOptionText : styles.optionText;
    }
    
    if (index === currentQuestion.correctAnswer) {
      return styles.correctOptionText;
    }
    
    if (index === selectedOption && index !== currentQuestion.correctAnswer) {
      return styles.wrongOptionText;
    }
    
    return styles.optionText;
  };
  
  if (isCompleted) {
    return (
      <View style={styles.completedContainer}>
        <CheckCircle size={64} color={Colors.success} />
        <Text style={styles.completedTitle}>Викторина завершена!</Text>
        <Text style={styles.scoreText}>
          Ваш результат: {score} из {questions.length} ({Math.round((score / questions.length) * 100)}%)
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
              { width: `${((currentQuestionIndex) / questions.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Вопрос {currentQuestionIndex + 1} из {questions.length}
        </Text>
      </View>
      
      <View style={styles.timerContainer}>
        <Clock size={16} color={timeLeft < 10 ? Colors.error : Colors.textSecondary} />
        <Text 
          style={[
            styles.timerText, 
            timeLeft < 10 && styles.timerWarning
          ]}
        >
          {timeLeft} сек
        </Text>
      </View>
      
      <Text style={styles.question}>{currentQuestion.question}</Text>
      
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <Pressable
            key={index}
            style={getOptionStyle(index)}
            onPress={() => handleAnswer(index)}
            disabled={isAnswered}
          >
            <Text style={getOptionTextStyle(index)}>{option}</Text>
            {isAnswered && index === currentQuestion.correctAnswer && (
              <Check size={20} color="#FFFFFF" />
            )}
            {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && (
              <X size={20} color="#FFFFFF" />
            )}
          </Pressable>
        ))}
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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  timerWarning: {
    color: Colors.error,
    fontWeight: 'bold',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  option: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  correctOption: {
    backgroundColor: Colors.success,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrongOption: {
    backgroundColor: Colors.error,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  selectedOptionText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
    flex: 1,
  },
  correctOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
  },
  wrongOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
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
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});