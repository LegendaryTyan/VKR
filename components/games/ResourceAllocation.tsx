import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Animated } from 'react-native';
import { CheckCircle, ArrowRight, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ResourceAllocationProps {
  onComplete: (score: number) => void;
}

interface Resource {
  id: string;
  name: string;
  icon: string;
  allocated: number;
  maxAllocation: number;
  description: string;
}

interface Department {
  id: string;
  name: string;
  icon: string;
  resourceNeeds: {
    [key: string]: number; /
  };
  currentEfficiency: number;
  description: string;
}

export default function ResourceAllocation({ onComplete }: ResourceAllocationProps) {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 'money',
      name: 'Бюджет',
      icon: 'banknote',
      allocated: 0,
      maxAllocation: 100,
      description: 'Финансовые ресурсы компании'
    },
    {
      id: 'staff',
      name: 'Персонал',
      icon: 'users',
      allocated: 0,
      maxAllocation: 100,
      description: 'Сотрудники компании'
    },
    {
      id: 'time',
      name: 'Время',
      icon: 'clock',
      allocated: 0,
      maxAllocation: 100,
      description: 'Временные ресурсы'
    },
    {
      id: 'tech',
      name: 'Технологии',
      icon: 'cpu',
      allocated: 0,
      maxAllocation: 100,
      description: 'Технологические ресурсы'
    }
  ]);

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'marketing',
      name: 'Маркетинг',
      icon: 'megaphone',
      resourceNeeds: {
        money: 30,
        staff: 20,
        time: 25,
        tech: 15
      },
      currentEfficiency: 0,
      description: 'Отдел, отвечающий за продвижение продуктов и привлечение клиентов'
    },
    {
      id: 'development',
      name: 'Разработка',
      icon: 'code',
      resourceNeeds: {
        money: 20,
        staff: 30,
        time: 30,
        tech: 40
      },
      currentEfficiency: 0,
      description: 'Отдел, отвечающий за создание и улучшение продуктов'
    },
    {
      id: 'sales',
      name: 'Продажи',
      icon: 'shopping-cart',
      resourceNeeds: {
        money: 15,
        staff: 25,
        time: 20,
        tech: 10
      },
      currentEfficiency: 0,
      description: 'Отдел, отвечающий за продажи и работу с клиентами'
    },
    {
      id: 'hr',
      name: 'HR',
      icon: 'heart',
      resourceNeeds: {
        money: 10,
        staff: 15,
        time: 15,
        tech: 5
      },
      currentEfficiency: 0,
      description: 'Отдел, отвечающий за управление персоналом'
    }
  ]);
  
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [round, setRound] = useState(1);
  const [totalEfficiency, setTotalEfficiency] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [remainingPoints, setRemainingPoints] = useState(100);
  
  const efficiencyAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const updatedDepartments = departments.map(dept => {
      let efficiency = 0;
      let totalNeeds = 0;
      
      Object.entries(dept.resourceNeeds).forEach(([resourceId, optimalAmount]) => {
        const resource = resources.find(r => r.id === resourceId);
        if (resource) {
          const allocated = resource.allocated;
          const resourceEfficiency = 100 - Math.abs(allocated - optimalAmount);
          efficiency += resourceEfficiency * (optimalAmount / 100);
          totalNeeds += optimalAmount;
        }
      });
      
      efficiency = Math.round(efficiency / (totalNeeds / 100));
      
      return {
        ...dept,
        currentEfficiency: efficiency
      };
    });
    
    setDepartments(updatedDepartments);
    
    const newTotalEfficiency = Math.round(
      updatedDepartments.reduce((sum, dept) => sum + dept.currentEfficiency, 0) / updatedDepartments.length
    );
    
    if (totalEfficiency !== newTotalEfficiency) {
      Animated.timing(efficiencyAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        efficiencyAnim.setValue(0);
      });
    }
    
    setTotalEfficiency(newTotalEfficiency);
  }, [resources]);
  
  const allocateResource = (amount: number) => {
    if (!selectedResource || !selectedDepartment || amount === 0) return;
    
    if (remainingPoints < amount) {
      amount = remainingPoints;
    }
    
    const updatedResources = resources.map(resource => {
      if (resource.id === selectedResource) {
        const newAllocated = Math.max(0, Math.min(resource.maxAllocation, resource.allocated + amount));
        return {
          ...resource,
          allocated: newAllocated
        };
      }
      return resource;
    });
    
    setResources(updatedResources);
    setRemainingPoints(prev => prev - amount);
  };
  
  const nextRound = () => {
    if (round >= 3) {
      // Game completed
      setIsCompleted(true);
      onComplete(totalEfficiency);
      return;
    }
    
    const resetResources = resources.map(resource => ({
      ...resource,
      allocated: 0
    }));
    
    setResources(resetResources);
    setRound(round + 1);
    setRemainingPoints(100);
    setSelectedResource(null);
    setSelectedDepartment(null);
  };
  
  if (isCompleted) {
    return (
      <View style={styles.completedContainer}>
        <CheckCircle size={64} color={Colors.success} />
        <Text style={styles.completedTitle}>Распределение завершено!</Text>
        <Text style={styles.completedText}>
          Итоговая эффективность компании: {totalEfficiency}%
        </Text>
        <View style={styles.efficiencyBar}>
          <View style={[styles.efficiencyFill, { width: `${totalEfficiency}%` }]} />
        </View>
      </View>
    );
  }
  
  const renderResourceIcon = (iconName: string) => {
    return <Text style={{ fontSize: 20 }}>🔄</Text>;
  };
  
  const renderDepartmentIcon = (iconName: string) => {
    return <Text style={{ fontSize: 20 }}>🏢</Text>;
  };
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.roundText}>Раунд {round}/3</Text>
          <Text style={styles.instructionText}>
            Распределите ресурсы между отделами для максимальной эффективности
          </Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>Осталось:</Text>
          <Text style={styles.pointsValue}>{remainingPoints}</Text>
        </View>
      </View>
      
      <View style={styles.efficiencyContainer}>
        <Text style={styles.efficiencyLabel}>Общая эффективность компании:</Text>
        <View style={styles.efficiencyValueContainer}>
          <Text style={styles.efficiencyValue}>{totalEfficiency}%</Text>
          <Animated.View 
            style={[
              styles.efficiencyChange,
              {
                opacity: efficiencyAnim,
                transform: [
                  {
                    translateY: efficiencyAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              }
            ]}
          >
            <Star size={16} color={Colors.success} />
          </Animated.View>
        </View>
        <View style={styles.efficiencyBar}>
          <View style={[styles.efficiencyFill, { width: `${totalEfficiency}%` }]} />
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Ресурсы</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.resourcesScroll}
        contentContainerStyle={styles.resourcesContainer}
      >
        {resources.map(resource => (
          <Pressable
            key={resource.id}
            style={[
              styles.resourceCard,
              selectedResource === resource.id && styles.selectedResourceCard
            ]}
            onPress={() => setSelectedResource(resource.id)}
          >
            {renderResourceIcon(resource.icon)}
            <Text style={[
              styles.resourceName,
              selectedResource === resource.id && styles.selectedResourceText
            ]}>
              {resource.name}
            </Text>
            <View style={styles.allocationContainer}>
              <Text style={styles.allocationText}>
                {resource.allocated}/{resource.maxAllocation}
              </Text>
              <View style={styles.allocationBar}>
                <View 
                  style={[
                    styles.allocationFill, 
                    { width: `${(resource.allocated / resource.maxAllocation) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      
      <Text style={styles.sectionTitle}>Отделы</Text>
      <View style={styles.departmentsContainer}>
        {departments.map(dept => (
          <Pressable
            key={dept.id}
            style={[
              styles.departmentCard,
              selectedDepartment === dept.id && styles.selectedDepartmentCard
            ]}
            onPress={() => setSelectedDepartment(dept.id)}
          >
            <View style={styles.departmentHeader}>
              {renderDepartmentIcon(dept.icon)}
              <Text style={[
                styles.departmentName,
                selectedDepartment === dept.id && styles.selectedDepartmentText
              ]}>
                {dept.name}
              </Text>
            </View>
            <Text style={styles.departmentDescription}>{dept.description}</Text>
            <View style={styles.departmentEfficiency}>
              <Text style={styles.efficiencyLabel}>Эффективность:</Text>
              <Text style={[
                styles.efficiencyValue,
                dept.currentEfficiency < 50 ? styles.lowEfficiency :
                dept.currentEfficiency < 75 ? styles.mediumEfficiency :
                styles.highEfficiency
              ]}>
                {dept.currentEfficiency}%
              </Text>
            </View>
            
            {selectedDepartment === dept.id && selectedResource && (
              <View style={styles.resourceNeeds}>
                <Text style={styles.resourceNeedsLabel}>
                  Оптимальное значение для {resources.find(r => r.id === selectedResource)?.name}:
                </Text>
                <Text style={styles.resourceNeedsValue}>
                  {dept.resourceNeeds[selectedResource]}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
      
      {selectedResource && selectedDepartment && (
        <View style={styles.allocationControls}>
          <Text style={styles.allocationTitle}>
            Распределение ресурса "{resources.find(r => r.id === selectedResource)?.name}" 
            для отдела "{departments.find(d => d.id === selectedDepartment)?.name}"
          </Text>
          
          <View style={styles.allocationButtons}>
            <Pressable 
              style={styles.allocationButton} 
              onPress={() => allocateResource(-10)}
              disabled={remainingPoints >= 100}
            >
              <Text style={styles.allocationButtonText}>-10</Text>
            </Pressable>
            <Pressable 
              style={styles.allocationButton} 
              onPress={() => allocateResource(-5)}
              disabled={remainingPoints >= 100}
            >
              <Text style={styles.allocationButtonText}>-5</Text>
            </Pressable>
            <Pressable 
              style={styles.allocationButton} 
              onPress={() => allocateResource(-1)}
              disabled={remainingPoints >= 100}
            >
              <Text style={styles.allocationButtonText}>-1</Text>
            </Pressable>
            <Pressable 
              style={styles.allocationButton} 
              onPress={() => allocateResource(1)}
              disabled={remainingPoints <= 0}
            >
              <Text style={styles.allocationButtonText}>+1</Text>
            </Pressable>
            <Pressable 
              style={styles.allocationButton} 
              onPress={() => allocateResource(5)}
              disabled={remainingPoints < 5}
            >
              <Text style={styles.allocationButtonText}>+5</Text>
            </Pressable>
            <Pressable 
              style={styles.allocationButton} 
              onPress={() => allocateResource(10)}
              disabled={remainingPoints < 10}
            >
              <Text style={styles.allocationButtonText}>+10</Text>
            </Pressable>
          </View>
        </View>
      )}
      
      {remainingPoints === 0 && (
        <Pressable style={styles.nextButton} onPress={nextRound}>
          <Text style={styles.nextButtonText}>
            {round < 3 ? 'Следующий раунд' : 'Завершить игру'}
          </Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </Pressable>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  roundText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    maxWidth: '80%',
  },
  pointsContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  efficiencyContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  efficiencyLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  efficiencyValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  efficiencyValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  efficiencyChange: {
    marginLeft: 8,
  },
  efficiencyBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  efficiencyFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  resourcesScroll: {
    marginBottom: 24,
  },
  resourcesContainer: {
    paddingRight: 16,
  },
  resourceCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 150,
    alignItems: 'center',
  },
  selectedResourceCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 12,
  },
  selectedResourceText: {
    color: Colors.primary,
  },
  allocationContainer: {
    width: '100%',
  },
  allocationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  allocationBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  allocationFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  departmentsContainer: {
    marginBottom: 24,
  },
  departmentCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedDepartmentCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  departmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  selectedDepartmentText: {
    color: Colors.primary,
  },
  departmentDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  departmentEfficiency: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lowEfficiency: {
    color: Colors.error,
  },
  mediumEfficiency: {
    color: Colors.warning,
  },
  highEfficiency: {
    color: Colors.success,
  },
  resourceNeeds: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceNeedsLabel: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  resourceNeedsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: 8,
  },
  allocationControls: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  allocationTitle: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  allocationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  allocationButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allocationButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
  completedText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
});