import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Keyboard, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Genre, DropdownType } from '../types/SearchScreenType';
import { Genres, Ratings, Years } from '../Data/constants';
import { SearchScreenNavigationProp } from '../types/SearchScreenType';
import { fetchMoviesBySearch } from '../Api/MoviesAPI';

const RECENT_SEARCHES_KEY = 'RECENT_SEARCHES_KEY';  

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | ''>('');
  const [selectedRating, setSelectedRating] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]); 
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load recent searches', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
      } catch (e) {
        console.error('Failed to save recent searches', e);
      }
    })();
  }, [recentSearches]);

  useEffect(() => {
  const handler = setTimeout(() => {
    const fetchSuggestions = async () => {
      if (searchText.trim() === '') {
        setSuggestions([]);
        return;
      }
      try {
        const data = await fetchMoviesBySearch(searchText);
        setSuggestions(data.movies || []);
      } catch (err) {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, 400);
});

  const handleSearch = () => {
    Keyboard.dismiss();

    if (searchText.trim() !== '') {
      setRecentSearches(prev => {
        const updated = [searchText, ...prev.filter(item => item !== searchText)];
        return updated.slice(0, 10); 
      });
    }

    setIsTyping(false);

    navigation.navigate('ResultScreen', {
      searchText,
      genre: selectedGenre,
      year: selectedYear,
      rating: selectedRating,
    });
  };

  const handleRemoveSearch = (text: string) => {
    setRecentSearches(prev => prev.filter(item => item !== text));
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    navigation.navigate('ResultScreen', { searchText, genre });
  };

  const handleSuggestionPress = (title: string) => {
    setSearchText(title);
    setSuggestions([]);
    setIsTyping(false);
    navigation.navigate('ResultScreen', {
      searchText: title,
      genre: selectedGenre,
      year: selectedYear,
      rating: selectedRating,
    });
  };

  const renderGenreButton = ({ item }: { item: Genre }) => (
    <TouchableOpacity
      key={item.label}
      testID={`genre-${item.label}`}
      style={[
        styles.buttonWrapper,
        selectedGenre === item.label && styles.genreSelectedWrapper,
      ]}
      onPress={() => handleGenreSelect(item.label)}>
      <LinearGradient
        colors={['#FF1E1E', '#0C0F14']}
        style={styles.genreButton}>
        <Text style={styles.genreText}>{item.label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container} testID="search-screen">
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} testID="back-arrow">
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <View style={styles.searchInputWrapper}>
            <TextInput
              testID="search-input"
              placeholder="Search movies..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                setIsTyping(true);
              }}
              onSubmitEditing={() => {
                handleSearch();
                setIsTyping(false);
              }}
              returnKeyType="search"
              style={styles.searchInput}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                testID="clear-search-text"
                onPress={() => setSearchText('')}
                style={styles.clearIcon}>
                <Icon name="close" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isTyping && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(item.title)}>
            
                  <Text style={styles.suggestionText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.genreContainer}>
            {Genres.map(item => renderGenreButton({ item }))}
          </View>

          <Text style={styles.dropdownLabel}>Release Year</Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              testID="dropdown-year"
              onPress={() =>
                setActiveDropdown(activeDropdown === 'year' ? null : 'year')
              }>
              <Text style={styles.dropdownText}>
                {selectedYear || 'Select Year'}
              </Text>
              <Icon
                name={
                  activeDropdown === 'year'
                    ? 'keyboard-arrow-up'
                    : 'keyboard-arrow-down'
                }
                size={24}
                color="#fff"
              />
            </TouchableOpacity>

            {activeDropdown === 'year' && (
              <View style={styles.dropdown}>
                <ScrollView style={styles.scrollableDropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedYear('');
                      setActiveDropdown(null);
                    }}>
                    <Text style={styles.dropdownItemText}>Select Year</Text>
                  </TouchableOpacity>
                  {Years.map(year => (
                    <TouchableOpacity
                      key={year}
                      style={styles.dropdownItem}
                      testID={`dropdown-year-${year}`}
                      onPress={() => {
                        setSelectedYear(year);
                        setActiveDropdown(null);
                        navigation.navigate('ResultScreen', { year });
                      }}>
                      <Text style={styles.dropdownItemText}>{year}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <Text style={styles.dropdownLabel}>Rating</Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              testID="dropdown-rating"
              onPress={() =>
                setActiveDropdown(activeDropdown === 'rating' ? null : 'rating')
              }>
              <Text style={styles.dropdownText}>
                {selectedRating || 'Select Rating'}
              </Text>
              <Icon
                name={
                  activeDropdown === 'rating'
                    ? 'keyboard-arrow-up'
                    : 'keyboard-arrow-down'
                }
                size={24}
                color="#fff"
              />
            </TouchableOpacity>

            {activeDropdown === 'rating' && (
              <View style={styles.dropdown}>
                <ScrollView style={styles.scrollableDropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedRating('');
                      setActiveDropdown(null);
                    }}>
                    <Text style={styles.dropdownItemText}>Select Rating</Text>
                  </TouchableOpacity>

                  {Ratings.map(rating => (
                    <TouchableOpacity
                      key={rating}
                      testID={`dropdown-rating-${rating}`}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedRating(rating);
                        setActiveDropdown(null);
                        navigation.navigate('ResultScreen', { rating });
                      }}>
                      <Text style={styles.dropdownItemText}>{rating}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {recentSearches.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.recentSearchesHeading}>Recent Searches</Text>
              {recentSearches.map(item => (
                <View key={item} style={styles.recentItemNoBg}>
                  <Icon name="search" size={20} color="#fff" style={{ marginRight: 12 }} />
                  <Text style={styles.recentText}>{item}</Text>
                  <TouchableOpacity
                    testID={`remove-${item}`}
                    onPress={() => handleRemoveSearch(item)}
                    style={{ marginLeft: 'auto' }}>
                    <Icon name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
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
    marginBottom: 15,
  },
  searchInputWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    height: 48,
    backgroundColor: '#1f1f1f',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingRight: 40,  
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  clearIcon: {
    position: 'absolute',
    right: 25,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
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
  recentSearchesHeading: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentItemNoBg: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  recentText: {
    color: '#fff',
    fontSize: 16,
  },
  suggestionsContainer: {
    maxHeight: 200,
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  suggestionItem: {
    paddingVertical: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  suggestionText: {
    color: '#fff',
    fontSize: 16,
  },
   dropdownLabel: {        
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 3,
    marginLeft: 13,
  },
});






























