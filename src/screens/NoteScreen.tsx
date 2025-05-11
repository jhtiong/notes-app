import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Note, CATEGORIES } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';

const MAX_CONTENT_LENGTH = 200;
const MIN_CONTENT_LENGTH = 1;

type NoteScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Note'>;
type NoteScreenRouteProp = RouteProp<RootStackParamList, 'Note'>;

/**
 * NoteScreen Component
 * Screen for creating and editing notes
 * Handles both new note creation and existing note editing
 */
export default function NoteScreen() {
  const navigation = useNavigation<NoteScreenNavigationProp>();
  const route = useRoute<NoteScreenRouteProp>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing note data if noteId is provided
  useEffect(() => {
    if (route.params?.noteId) {
      loadNote(route.params.noteId);
    }
    if (route.params?.categoryId) {
      setSelectedCategory(route.params.categoryId);
    }
  }, [route.params?.noteId, route.params?.categoryId]);

  /**
   * Loads an existing note from AsyncStorage
   * @param noteId - The ID of the note to load
   */
  const loadNote = async (noteId: string) => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        const notes: Note[] = JSON.parse(storedNotes);
        const note = notes.find(n => n.id === noteId);
        if (note) {
          setTitle(note.title);
          setContent(note.content);
          setSelectedCategory(note.categoryId);
        }
      }
    } catch (error) {
      // Handle error silently
    }
  };

  /**
   * Validates the note content
   * @returns boolean indicating if the content is valid
   */
  const validateContent = (): boolean => {
    if (!content.trim()) {
      setError('Note content is required');
      return false;
    }
    if (content.trim().length < MIN_CONTENT_LENGTH) {
      setError(`Note content must be at least ${MIN_CONTENT_LENGTH} character long`);
      return false;
    }
    setError(null);
    return true;
  };

  /**
   * Saves the current note to AsyncStorage
   * Creates a new note or updates an existing one
   */
  const saveNote = async () => {
    if (!validateContent()) {
      return;
    }

    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      let notes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];
      const newNote: Note = {
        id: route.params?.noteId || Date.now().toString(),
        title,
        content: content.trim(),
        categoryId: selectedCategory,
        createdAt: route.params?.noteId ? notes.find(n => n.id === route.params?.noteId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (route.params?.noteId) {
        notes = notes.map(note => note.id === route.params?.noteId ? newNote : note);
      } else {
        notes.push(newNote);
      }
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to save note. Please try again.');
    }
  };

  /**
   * Handles content changes with length validation
   * @param text - The new content text
   */
  const handleContentChange = (text: string) => {
    if (text.length <= MAX_CONTENT_LENGTH) {
      setContent(text);
      // Clear error when user starts typing
      if (error) {
        setError(null);
      }
    }
  };
  
  // Main render method
  return (
    <LinearGradient colors={["#1B284F", "#351159", "#421C45", "#3B184E"]} style={styles.gradient}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New note</Text>
          <View style={{ width: 26 }} />
        </View>
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownOpen(!dropdownOpen)} activeOpacity={0.8}>
            <Text style={styles.dropdownText}>{CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Choose a category'}</Text>
            <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={22} color="#fff" />
          </TouchableOpacity>
          {dropdownOpen && (
            <View style={styles.dropdownList}>
              {CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.dropdownItem}
                  onPress={() => { setSelectedCategory(category.id); setDropdownOpen(false); }}
                >
                  <Text style={styles.dropdownItemText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.contentInput, error && styles.inputError]}
              placeholder="Please input note content"
              placeholderTextColor="#bdbdbd"
              value={content}
              onChangeText={handleContentChange}
              multiline
              textAlignVertical="top"
              maxLength={MAX_CONTENT_LENGTH}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Text style={styles.charCount}>{content.length}/{MAX_CONTENT_LENGTH}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.saveButton, !content.trim() && styles.saveButtonDisabled]} 
          onPress={saveNote}
          disabled={!content.trim()}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

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
  formContainer: {
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownList: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    marginBottom: 12,
    marginTop: -8,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    position: 'relative',
    marginTop: 8,
    marginBottom: 8,
  },
  contentInput: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 12,
    minHeight: 120,
    color: '#fff',
    fontSize: 16,
    padding: 14,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  charCount: {
    color: '#bdbdbd',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#F94695',
    borderRadius: 24,
    marginHorizontal: 24,
    marginTop: 32,
    marginBottom: 90,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(249, 70, 149, 0.5)',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
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