import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, Note, CATEGORIES } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';

// Import the robot and avatar images from assets
import robotImg from '../../assets/robot-illustration.png';
import workAvatar from '../../assets/work.png';
import homeAvatar from '../../assets/home.png';
import healthAvatar from '../../assets/health.png';

// Type definitions for navigation and route props
type SummaryScreenRouteProp = RouteProp<RootStackParamList, 'Summary'>;
type SummaryScreenNavigationProp = any;

/**
 * SummaryScreen Component
 * Displays statistics and summary information about notes in different categories
 */
export default function SummaryScreen() {
  const route = useRoute<SummaryScreenRouteProp>();
  const navigation = useNavigation<SummaryScreenNavigationProp>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // Load notes when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadNotes);
    loadNotes();
    return unsubscribe;
  }, [navigation]);

  /**
   * Loads notes from AsyncStorage and calculates category statistics
   * Updates both notes and categoryCounts states
   */
  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        const loadedNotes: Note[] = JSON.parse(storedNotes);
        setNotes(loadedNotes);
        const counts = CATEGORIES.reduce((acc, category) => {
          acc[category.id] = loadedNotes.filter(note => note.categoryId === category.id).length;
          return acc;
        }, {} as Record<string, number>);
        setCategoryCounts(counts);
      } else {
        setNotes([]);
        setCategoryCounts({});
      }
    } catch (error) {
      setNotes([]);
      setCategoryCounts({});
    }
  };

  /**
   * Renders the bottom navigation bar
   * @returns JSX element for the bottom navigation
   */
  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={28} color="#fff" />
        <Text style={[styles.navLabel, { color: '#fff' }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItemCenter} onPress={() => navigation.navigate('Note', {})}>
        <Ionicons name="add" size={36} color="#fff" style={styles.addIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Summary', { categoryId: CATEGORIES[0].id })}>
        <Feather name="bar-chart-2" size={28} color="#F94695" />
        <Text style={[styles.navLabel, { color: '#F94695' }]}>Summary</Text>
      </TouchableOpacity>
    </View>
  );

  // Mapping of category IDs to their avatar images
  const CATEGORY_AVATARS: Record<string, any> = {
    'work-study': workAvatar,
    'life': homeAvatar,
    'health': healthAvatar,
  };

  // Main render method
  return (
    <LinearGradient colors={["#1B284F", "#351159", "#421C45", "#3B184E"]} style={styles.gradient}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Summary</Text>
          <View style={{ width: 26 }} />
        </View>
        <View style={styles.robotContainer}>
          <Image source={robotImg} style={styles.robotImg} />
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 120 }}>
          {CATEGORIES.map(category => (
            <View key={category.id} style={styles.statCard}>
              <View style={styles.statRow}>
                <View style={styles.avatar}>
                  <Image source={CATEGORY_AVATARS[category.id]} style={styles.avatarImg} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <TouchableOpacity style={styles.detailBtn}>
                  <Text style={styles.detailBtnText}>Detail</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.countText}>This topic has a total of {categoryCounts[category.id] || 0} records.</Text>
            </View>
          ))}
        </ScrollView>
        {renderBottomNav()}
      </SafeAreaView>
    </LinearGradient>
  );
}

// Styles for the SummaryScreen component
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  robotContainer: {
    alignItems: 'flex-end',
    marginRight: 24,
    marginBottom: 8,
  },
  robotImg: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginTop: -16,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 0,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 18,
    marginHorizontal: 24,
    marginBottom: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    marginRight: 14,
  },
  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
    backgroundColor: '#fff',
  },
  categoryName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  detailBtn: {
    backgroundColor: '#F94695',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  countText: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 15,
    marginLeft: 48,
    marginTop: 2,
    marginBottom: 2,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: 'rgba(24, 16, 48, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 12,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navItemCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    backgroundColor: '#F94695',
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  addIcon: {
    alignSelf: 'center',
  },
  navLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
}); 