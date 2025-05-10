import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView , Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// Import settings icons as images
import customerIcon from '../../assets/online-customer.png';
import agreementIcon from '../../assets/user-agreement.png';
import privacyIcon from '../../assets/privacy.png';
import aboutIcon from '../../assets/about-us.png';

// Define settings menu options with their icons
const SETTINGS_OPTIONS = [
  { label: 'Online Customer', icon: customerIcon },
  { label: 'User Agreement', icon: agreementIcon },
  { label: 'Privacy Policy', icon: privacyIcon }, 
  { label: 'About Us', icon: aboutIcon },
];

// Type definition for navigation prop
type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

/**
 * SettingsScreen Component
 * Displays application settings and provides functionality to manage notes
 */
export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [showClearedPopup, setShowClearedPopup] = useState(false);

  /**
   * Clears all notes from AsyncStorage after user confirmation
   * Shows a success popup and navigates back to home screen
   */
  const clearAllNotes = async () => {
    Alert.alert(
      'Delete All Notes',
      'Are you sure you want to delete all notes? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              await AsyncStorage.removeItem('notes');
              setShowClearedPopup(true);
              setTimeout(() => {
                setShowClearedPopup(false);
                navigation.navigate('Home');
              }, 1500);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete notes');
            }
          }
        }
      ]
    );
  };

  // Main render method
  return (
    <LinearGradient colors={["#1B284F", "#351159", "#421C45", "#3B184E"]} style={styles.gradient}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 26 }} />
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 120 }}>
          {SETTINGS_OPTIONS.map((option, idx) => (
            <TouchableOpacity key={option.label} style={styles.optionRow}>
               <Image source={option.icon} style={styles.settingsImg} resizeMode="contain" />
               <Text style={styles.optionLabel}>{option.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#F94695" style={styles.optionArrow} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.deleteButton} onPress={clearAllNotes}>
          <Text style={styles.deleteButtonText}>Delete All Notes</Text>
        </TouchableOpacity>
        {showClearedPopup && (
          <View style={styles.popupOverlay}>
            <LinearGradient
              colors={["#C724E1", "#4E22CC"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.popupBox}
            >
              <Text style={styles.popupText}>All notes have been cleared</Text>
            </LinearGradient>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

// Styles for the SettingsScreen component
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
    paddingBottom: 50,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 0,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  optionArrow: {
    alignSelf: 'center',
  },
  deleteButton: {
    backgroundColor: '#F94695',
    borderRadius: 24,
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 90,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  deleteButtonText: {
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
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  popupBox: {
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 220,
    minHeight: 60,
  },
  popupText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  settingsImg: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
}); 