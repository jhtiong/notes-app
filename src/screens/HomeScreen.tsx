import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Note, Category, CATEGORIES } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

// Import category icons as images
import workIcon from '../../assets/home-work.png';
import lifeIcon from '../../assets/home-life.png';
import healthIcon from '../../assets/home-health.png';
// Import settings icon as image
import settingsIcon from '../../assets/setting.png';

// Define colors for category text
const CATEGORY_COLORS: Record<string, string> = {
  'work-study': '#FFFFFF',
  'life': '#FFFFFF',
  'health': '#FFFFFF',
};

// Type definition for navigation prop
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

/**
 * HomeScreen Component
 * Main screen of the application that displays notes organized by categories
 */
export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadNotes);
    loadNotes();
    return unsubscribe;
  }, [navigation]);

  /**
   * Loads notes from AsyncStorage
   * Updates the notes state with stored notes or empty array if none exist
   */
  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        setNotes([]);
      }
    } catch (error) {
      setNotes([]);
    }
  };

  /**
   * Deletes a note from AsyncStorage
   * @param noteId - The ID of the note to delete
   */
  const deleteNote = async (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedNotes = notes.filter(note => note.id !== noteId);
              await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
              setNotes(updatedNotes);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          }
        }
      ]
    );
  };

  /**
   * Gets the latest 3 notes for a specific category
   * @param categoryId - The ID of the category to filter notes
   * @returns Array of the 3 most recent notes for the category
   */
  const getLatestNotesForCategory = (categoryId: string) => {
    return notes
      .filter(note => note.categoryId === categoryId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  };

  /**
   * Renders the delete action for swipeable notes
   * @param noteId - The ID of the note to delete
   * @returns JSX element for the delete action
   */
  const renderRightActions = (noteId: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => deleteNote(noteId)}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  /**
   * Renders a section for a specific category with its notes
   * @param category - The category to render
   * @returns JSX element for the category section
   */
  const renderCategorySection = (category: Category) => {
    const categoryNotes = getLatestNotesForCategory(category.id);
    return (
      <View key={category.id} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          {CATEGORY_ICONS[category.id]}
          <Text style={[styles.categoryTitle, { color: CATEGORY_COLORS[category.id] }]}>{category.name}</Text>
        </View>
        {categoryNotes.map(note => (
          <Swipeable
            key={note.id}
            renderRightActions={() => renderRightActions(note.id)}
            overshootRight={false}
          >
            <TouchableOpacity
              style={styles.noteItem}
              onPress={() => navigation.navigate('Note', { noteId: note.id })}
              activeOpacity={0.8}
            >
              <Text style={styles.noteTitle} numberOfLines={2}>
                {note.content.length > 20 ? `${note.content.slice(0, 20)}...` : note.content}
              </Text>
              <View style={styles.arrowCircle}> 
                <Ionicons name="chevron-forward" size={18} color="#fff" />
              </View>
            </TouchableOpacity>
          </Swipeable>
        ))}
        {categoryNotes.length === 0 && (
          <Text style={styles.emptyText}>No notes in this category</Text>
        )}
      </View>
    );
  };

  /**
   * Renders the bottom navigation bar
   * @returns JSX element for the bottom navigation
   */
  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={28} color="#F94695" />
        <Text style={[styles.navLabel, { color: '#F94695' }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItemCenter} onPress={() => navigation.navigate('Note', {})}>
        <Ionicons name="add" size={36} color="#fff" style={styles.addIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Summary', { categoryId: CATEGORIES[0].id })}>
        <Feather name="bar-chart-2" size={28} color="#fff" />
        <Text style={[styles.navLabel, { color: '#fff' }]}>Summary</Text>
      </TouchableOpacity>
    </View>
  );

  // Main render method
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient colors={["#1B284F", "#351159", "#421C45", "#3B184E"]} style={styles.gradient}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Home</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Image source={settingsIcon} style={styles.settingsImg} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <FontAwesome5 name="clock" style={styles.recentIcon} resizeMode="contain" />
              <Text style={styles.sectionTitle}>Recently created notes</Text>
            </View>
          </View>
          <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 120 }}>
            {CATEGORIES.map(renderCategorySection)}
          </ScrollView>
          {renderBottomNav()}
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

// Styles for the HomeScreen component
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'left',
  },
  settingsImg: {
    width: 28,
    height: 28,
  },
  sectionCard: {
    marginHorizontal: 9,
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#bdbdbd',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 0,
  },
  categorySection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 4,
  },
  categoryImg: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  recentIcon: {
    width: 22,
    height: 22,
    marginTop: 7,
    fontSize: 16,
    color: '#bdbdbd',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    textAlign: 'left',
  },
  noteItem: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginBottom: 14,
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  noteTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
    marginRight: 16,
    textAlign: 'left',
  },
  arrowCircle: {
    backgroundColor: '#F94695',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  emptyText: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    textAlign: 'left',
    color: '#bdbdbd',
    fontStyle: 'italic',
    marginTop: 8,
    marginLeft: 8,
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
  deleteAction: {
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '85%',
    borderRadius: 16,
    marginLeft: 8,
  },
});

// Category icons mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'work-study': <Image source={workIcon} style={styles.categoryImg} resizeMode="contain" />,
  'life': <Image source={lifeIcon} style={styles.categoryImg} resizeMode="contain" />,
  'health': <Image source={healthIcon} style={styles.categoryImg} resizeMode="contain" />,
}; 