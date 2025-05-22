import React, { useState } from 'react';
import { View,Text,Modal,TextInput,TouchableOpacity,StyleSheet,ScrollView,Alert,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { addMovie } from '../Api/AdminAPI';
import { AddMovieModalProps, MovieFormData } from '../types/MovieFormTYpes';
import Toast from 'react-native-toast-message';
import { Genres } from '../Data/constants';

const AddMovieModal = ({ visible, onClose, testID }: AddMovieModalProps) => {
  const [form, setForm] = useState<MovieFormData>({
    title: '',
    genre: '',
    release_year: '',
    rating: '',
    director: '',
    duration: '',
    streaming_platform: '',
    main_lead: '',
    description: '',
    premium: false,
  });

  const [posterUri, setPosterUri] = useState<string | null>(null);
  const [bannerUri, setBannerUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [genreDropdownVisible, setGenreDropdownVisible] = useState(false);
  const [premiumDropdownVisible, setPremiumDropdownVisible] = useState(false);

  const handleImagePicker = (type: 'poster' | 'banner') => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
        Alert.alert('Error', 'There is an error picking the image.');
      } else {
        const uri = response.assets?.[0]?.uri;
        if (type === 'poster') setPosterUri(uri || null);
        if (type === 'banner') setBannerUri(uri || null);
      }
    });
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { title, genre, release_year } = form;
    if (!title || !genre || !release_year || !posterUri) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all required fields.',
      });
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
          formData.append(key, value);
        });

        formData.append('poster', {
          uri: posterUri,
          name: 'poster.jpg',
          type: 'image/jpeg',
        });

        if (bannerUri) {
          formData.append('banner', {
            uri: bannerUri,
            name: 'banner.jpg',
            type: 'image/jpeg',
          });
        }

        await addMovie(formData);

        Toast.show({
          type: 'success',
          text1: 'Movie added successfully',
        });

        setForm({
          title: '',
          genre: '',
          release_year: '',
          rating: '',
          director: '',
          duration: '',
          streaming_platform: '',
          main_lead: '',
          description: '',
          premium: false,
        });
        setPosterUri(null);
        setBannerUri(null);
        onClose();
      } catch (error: any) {
        console.error('Error adding movie:', error.message);
        Alert.alert('Error', 'Failed to add movie. Please try again.');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <Modal visible={visible} animationType="slide" testID={testID}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} testID="back-button">
            <Icon name="arrow-back" size={24} color="#fff" style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Movie</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>
              Title <Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              testID="input-title"
              style={styles.input}
              placeholder="Enter Title"
              placeholderTextColor="#888"
              value={form.title}
              onChangeText={(value) => handleChange('title', value)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>
              Genre <Text style={styles.required}> *</Text>
            </Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={[styles.input, styles.dropdownInput]}
                onPress={() => setGenreDropdownVisible(!genreDropdownVisible)}
              >
                <Text style={{ color: form.genre ? '#fff' : '#888', flex: 1 }}>
                  {form.genre || 'Select Genre'}
                </Text>
                <Icon
                  name={genreDropdownVisible ? 'arrow-drop-up' : 'arrow-drop-down'}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
              {genreDropdownVisible && (
                <View style={styles.dropdown}>
                  <ScrollView nestedScrollEnabled={true}>
                    {Genres.map((item) => (
                      <TouchableOpacity
                        key={item.label}
                        style={styles.dropdownItem}
                        onPress={() => {
                          handleChange('genre', item.label);
                          setGenreDropdownVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          {[ 
            { key: 'release_year', label: 'Release Year' },
            { key: 'rating', label: 'Rating' },
            { key: 'director', label: 'Director' },
            { key: 'duration', label: 'Duration' },
            { key: 'streaming_platform', label: 'Streaming Platform' },
            { key: 'main_lead', label: 'Main Lead' },
            { key: 'description', label: 'Description', multiline: true },
          ].map(({ key, label, multiline }) => (
            <View key={key} style={styles.inputWrapper}>
              <Text style={styles.label}>
                {label}
                {['Release Year'].includes(label) && <Text style={styles.required}> *</Text>}
              </Text>
              <TextInput
                testID={`input-${key}`}
                style={[styles.input, multiline && styles.textArea]}
                placeholder={`Enter ${label}`}
                placeholderTextColor="#888"
                multiline={multiline}
                value={form[key as keyof MovieFormData] as string}
                onChangeText={(value) => handleChange(key, value)}
              />
            </View>
          ))}

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Premium</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={[styles.input, styles.dropdownInput]}
                onPress={() => setPremiumDropdownVisible(!premiumDropdownVisible)}
              >
                <Text style={{ color: '#fff', flex: 1 }}>
                  {form.premium ? 'True' : 'False'}
                </Text>
                <Icon
                  name={premiumDropdownVisible ? 'arrow-drop-up' : 'arrow-drop-down'}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
              {premiumDropdownVisible && (
                <View style={styles.dropdown}>
                  {['true', 'false'].map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setForm((prev) => ({ ...prev, premium: value === 'true' }));
                        setPremiumDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{value}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>
               Poster Image <Text style={styles.required}> *</Text>
             </Text>
             <TouchableOpacity
               testID="poster-button"
               style={styles.uploadButton}
               onPress={() => handleImagePicker('poster')}
             >
               <Text style={styles.uploadText}>
                 {posterUri ? 'Change Poster' : 'Select Poster'}
               </Text>
             </TouchableOpacity>
           </View>

           <View style={styles.inputWrapper}>
             <Text style={styles.label}>Banner Image</Text>
             <TouchableOpacity
               testID="banner-button"
               style={styles.uploadButton}
               onPress={() => handleImagePicker('banner')}
             >
               <Text style={styles.uploadText}>
                 {bannerUri ? 'Change Banner' : 'Select Banner'}
               </Text>
             </TouchableOpacity>
           </View>

          <TouchableOpacity
             style={styles.submitButton}
             onPress={handleSubmit}
             testID="submit-button"
           disabled={loading}
           >
             {loading ? (
               <ActivityIndicator size="small" color="#fff" />
             ) : (
               <Text style={styles.submitText}>Add Movie</Text>
             )}
         </TouchableOpacity>
        </ScrollView>
       </View>
     </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backIcon: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    marginBottom: 6,
  },
  required: {
    color: 'red',
  },
  input: {
    backgroundColor: '#1A1C22',
    color: '#fff',
    padding: 12,
    borderRadius: 6,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdown: {
    backgroundColor: '#1A1C22',
    borderRadius: 6,
    marginTop: 5,
    maxHeight: 200,
    width: '100%',
  },
  dropdownItem: {
    padding: 12,
  },
  dropdownItemText: {
    color: '#fff',
  },
     uploadButton: {
     backgroundColor: '#1A1C22',
    height: 100,
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius: 6,
   },
   uploadText: {
     color: '#888',
   },
   submitButton: {
     backgroundColor: '#FF0000',
     padding: 14,
     borderRadius: 8,
     alignItems: 'center',
     marginTop: 20,
   },
   submitText: {
     color: '#fff',
     fontWeight: 'bold',
     fontSize: 16,
   },
});

export default AddMovieModal;















































