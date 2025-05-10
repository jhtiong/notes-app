// Core data structure for a note in the application
export interface Note {
  id: string;          // Unique identifier for the note
  title: string;       // Title of the note
  content: string;     // Main content/body of the note
  categoryId: string;  // Reference to which category this note belongs to
  createdAt: string;   // ISO timestamp of when the note was created
  updatedAt: string;   // ISO timestamp of when the note was last updated
}

// Data structure for note categories
export interface Category {
  id: string;    // Unique identifier for the category
  name: string;  // Display name of the category
  color: string; // Color code for category styling
}

// Type definition for the navigation stack parameters
export type RootStackParamList = {
  Home: undefined;                                    // Home screen requires no parameters
  Note: { noteId?: string; categoryId?: string };    // Note screen can have optional noteId and categoryId
  Summary: { categoryId: string };                   // Summary screen requires a categoryId
  Settings: undefined;                               // Settings screen requires no parameters
};

// Predefined categories for the application
export const CATEGORIES: Category[] = [
  { id: 'work-study', name: 'Work and Study', color: '#FF6B6B' },
  { id: 'life', name: 'Life', color: '#4ECDC4' },
  { id: 'health', name: 'Health and Well-being', color: '#45B7D1' }
]; 