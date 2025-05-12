import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Briefcase, Brain, BarChart2, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';

export default function OnboardingScreen() {
  const router = useRouter();
  const setName = useUserStore(state => state.setName);
  const { displayName } = useAuthStore();
  const [userName, setUserName] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {

    if (displayName) {
      setUserName(displayName);
    }
  }, [displayName]);
  
  const steps = [
    {
      title: 'Добро пожаловать в Бизнес-навыки!',
      description: 'Платформа для развития бизнес-компетенций через игровой формат',
      icon: 'briefcase',
    },
    {
      title: 'Развивайте навыки',
      description: 'Текстовые и интерактивные игры помогут вам освоить ключевые бизнес-концепции',
      icon: 'brain',
    },
    {
      title: 'Отслеживайте прогресс',
      description: 'Система уровней и достижений поможет вам видеть свой рост',
      icon: 'barchart',
    },
    {
      title: 'Как вас зовут?',
      description: 'Введите ваше имя, чтобы начать',
      isNameInput: true,
    },
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (userName.trim()) {
        setName(userName.trim());
        router.replace('/');
      }
    }
  };
  
  const handleSkip = () => {

    setName(displayName || 'Бизнесмен');
    router.replace('/');
  };
  
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  
  const isNameValid = !currentStepData.isNameInput || userName.trim().length > 0;
  
  const renderIcon = () => {
    if (!currentStepData.icon) return null;
    
    switch (currentStepData.icon) {
      case 'briefcase':
        return <Briefcase size={64} color={Colors.primary} />;
      case 'brain':
        return <Brain size={64} color={Colors.primary} />;
      case 'barchart':
        return <BarChart2 size={64} color={Colors.primary} />;
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {currentStepData.icon && (
          <View style={styles.iconContainer}>
            {renderIcon()}
          </View>
        )}
        
        <Text style={styles.title}>{currentStepData.title}</Text>
        <Text style={styles.description}>{currentStepData.description}</Text>
        
        {currentStepData.isNameInput && (
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Ваше имя"
            maxLength={20}
            autoFocus
            editable={!displayName} 
          />
        )}
        
        {currentStepData.isNameInput && displayName && (
          <Text style={styles.authNameInfo}>
            Используется имя из вашего аккаунта
          </Text>
        )}
      </View>
      
      <View style={styles.footer}>
        <View style={styles.indicators}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentStep && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
        
        <View style={styles.buttons}>
          {!isLastStep && (
            <Pressable style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Пропустить</Text>
            </Pressable>
          )}
          
          <Pressable
            style={[styles.nextButton, !isNameValid && styles.disabledButton]}
            onPress={handleNext}
            disabled={!isNameValid}
          >
            <Text style={styles.nextButtonText}>
              {isLastStep ? 'Начать' : 'Далее'}
            </Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  authNameInfo: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    padding: 16,
  },
  skipButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: Colors.disabled,
  },
});