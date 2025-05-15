import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Keyboard, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Genre,SearchScreenProps,DropdownType } from '../types/SearchScreenType';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const GENRES = [
  { label: 'Comedy' },
  { label: 'Adventure' },
  { label: 'Thriller' },
  { label: 'Action' },
  { label: 'Drama' },
  { label: 'Romance' },
];

const YEARS:number[] = [];
for (let year = 1980; year <= 2025; year++) {
  YEARS.push(year);
}

const RATINGS = ['5.0+', '6.0+', '7.0+', '8.0+', '9.0+'];

const SearchScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | ''>('');
  const [selectedRating, setSelectedRating] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);

  const handleSearch = () => {
    Keyboard.dismiss();
    navigation.navigate('ResultScreen', { searchText, genre: selectedGenre, year: selectedYear, rating: selectedRating });
  };

  const handleGenreSelect = (genre:string) => {
    setSelectedGenre(genre);
    navigation.navigate('ResultScreen', { searchText, genre });
  };

  const renderGenreButton = ({ item }: { item: Genre }) => (
    <TouchableOpacity
      key={item.label}
      style={[
        styles.buttonWrapper,
        selectedGenre === item.label && styles.genreSelectedWrapper,
      ]}
      onPress={() => handleGenreSelect(item.label)}
    >
      <LinearGradient colors={['#FF1E1E', '#0C0F14']} style={styles.genreButton}>
        <Text style={styles.genreText}>{item.label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <TextInput
            placeholder="Search movies..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            style={styles.searchInput}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.genreContainer}>
            {GENRES.map((item) => renderGenreButton({ item }))}
          </View>

          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setActiveDropdown(activeDropdown === 'year' ? null : 'year')}
            >
              <Text style={styles.dropdownText}>{selectedYear || 'Select Year'}</Text>
              <Icon name={activeDropdown === 'year' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color="#fff" />
            </TouchableOpacity>
            {activeDropdown === 'year' && (
              <View style={styles.dropdown}>
                <ScrollView style={styles.scrollableDropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedYear('');
                      setActiveDropdown(null);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>Select Year</Text>
                  </TouchableOpacity>
                  {YEARS.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedYear(year);
                        setActiveDropdown(null);
                        navigation.navigate('ResultScreen', { year }); 
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{year}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setActiveDropdown(activeDropdown === 'rating' ? null : 'rating')}
            >
              <Text style={styles.dropdownText}>{selectedRating || 'Select Rating'}</Text>
              <Icon name={activeDropdown === 'rating' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color="#fff" />
            </TouchableOpacity>
            {activeDropdown === 'rating' && (
              <View style={styles.dropdown}>
                <ScrollView style={styles.scrollableDropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedRating('');
                      setActiveDropdown(null);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>Select Rating</Text>
                  </TouchableOpacity>
                  {RATINGS.map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedRating(rating);
                        setActiveDropdown(null);
                        navigation.navigate('ResultScreen', { rating }); 
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{rating}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0C0F14',
  },
  container: {
    padding: 16,
    flex: 1,
    marginTop: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    marginTop: 20,
    marginBottom: 45,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#1f1f1f',
    borderRadius: 25,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  buttonWrapper: {
    width: '48%',
    marginBottom: 23,
    borderRadius: 16,
  },
  genreSelectedWrapper: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
  },
  genreButton: {
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  genreText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    marginTop: 8,
  },
  scrollableDropdown: {
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
  },
});









