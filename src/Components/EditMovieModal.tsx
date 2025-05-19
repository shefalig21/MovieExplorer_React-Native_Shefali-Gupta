import React, { useState, useEffect } from "react";
import { View, Modal, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, ActivityIndicator} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary } from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import { updateMovie } from "../Api/AdminAPI";
import { EditMovieModalProps,Movie,ImageAsset } from "../types/EditModalType";
import Toast from "react-native-toast-message";

const EditMovieModal = ({ visible, onClose, movie }: EditMovieModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [releaseYear, setReleaseYear] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [director, setDirector] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [poster, setPoster] = useState<ImageAsset | null>(null);
  const [banner, setBanner] = useState<ImageAsset | null>(null);
  const [isPremium, setIsPremium] = useState<"true" | "false">("false");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movie) {
      setTitle(movie.title || "");
      setDescription(movie.description || "");
      setGenre(movie.genre || "");
      setReleaseYear(String(movie.release_year || ""));
      setRating(String(movie.rating || ""));
      setDirector(movie.director || "");
      setDuration(movie.duration || "");
      setIsPremium(movie.is_premium ? "true" : "false");
      setPoster({ uri: movie.poster_url });
      setBanner(movie.banner_url ? { uri: movie.banner_url } : null);
    }
  }, [movie]);

  const handleImagePick = async (type: "poster" | "banner") => {
    const result = await launchImageLibrary({ mediaType: "photo" });
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const image: ImageAsset  = result.assets[0];
      if (type === "poster") {
        setPoster(image);
      } else if (type === "banner") {
        setBanner(image);
      }
    }
  };

const handleSubmit = async () => {
  if (!title.trim() || !genre.trim() || !releaseYear.trim() || !poster) {
    Toast.show({
      type: 'error',
      text1: 'Validation Error',
      text2: 'Please fill in all required fields (Title, Genre, Release Year, Poster).',
    });
    return;
  }

  const updatedMovie = {
    id: movie.id,
    title,
    description,
    genre,
    release_year: releaseYear,
    rating,
    director,
    duration,
    is_premium: isPremium === "true",
  };

  setLoading(true); 

  try {
    const formData = new FormData();
    for (const key in updatedMovie) {
      const value = updatedMovie[key as keyof typeof updatedMovie];
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    }

    if (poster?.uri) {
      formData.append("poster", {
        uri: poster.uri,
        name: poster.name || "poster.jpg",
        type: poster.type || "image/jpeg",
      } as any);
    }

    if (banner?.uri) {
      formData.append("banner", {
        uri: banner.uri,
        name: banner.name || "banner.jpg",
        type: banner.type || "image/jpeg",
      } as any);
    }

    await updateMovie(movie.id, formData);
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Movie updated successfully.',
    });
    onClose();
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Update Failed',
      text2: 'Failed to update the movie. Please try again.',
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} testID="back-button">
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Movie</Text>
        </View>

        <ScrollView>
          {[{ label: "Title", value: title, setter: setTitle, required: true },
            { label: "Genre", value: genre, setter: setGenre, required: true },
            { label: "Release Year", value: releaseYear, setter: setReleaseYear, keyboardType: "numeric", required: true },
            { label: "Rating", value: rating, setter: setRating },
            { label: "Director", value: director, setter: setDirector },
            { label: "Duration", value: duration, setter: setDuration },
          ].map((field, idx) => (
            <View key={idx} style={styles.inputWrapper}>
              <Text style={[styles.label]} testID={`label-${field.label}`}>
                {field.label}
                {field.required && <Text style={styles.required}>*</Text>}
              </Text>
              <TextInput
              testID={`input-${field.label}`}
                style={[styles.input, field.multiline && styles.textArea]}
                value={field.value}
                onChangeText={field.setter}
                placeholder={`Enter ${field.label}`}
                placeholderTextColor="#888"
                multiline={field.multiline}
                keyboardType={field.keyboardType}
              />
            </View>
          ))}

          <View style={styles.inputWrapper}>
            <Text style={styles.label} testID="is-premium-label">Is Premium?
              <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={isPremium}
                onValueChange={(itemValue) => setIsPremium(itemValue)}
                dropdownIconColor="#fff"
                style={styles.picker}
                testID="premium-picker"
              >
                <Picker.Item label="False" value="false" />
                <Picker.Item label="True" value="true" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label} testID="poster-label">
              Poster Image
              <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => handleImagePick("poster")} testID="poster-button">
              <Text style={styles.uploadText}>{poster ? "Change Poster" : "Select Poster"}</Text>
            </TouchableOpacity>
            {poster && <Image source={{ uri: poster.uri }} style={styles.imagePreview} />}
  
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label} testID="banner-label">Banner Image</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => handleImagePick("banner")} testID="banner-button">
              <Text style={styles.uploadText}>{banner ? "Change Banner" : "Select Banner"}</Text>
            </TouchableOpacity>
            {banner && <Image source={{ uri: banner.uri }} style={styles.imagePreview} />}
          </View>

          <TouchableOpacity
           style={styles.submitButton}
           onPress={handleSubmit}
           disabled={loading}
           testID="submit-button"
>
           {loading ? (
          <ActivityIndicator size="small" color="#fff" />
           ) : (
           <Text style={styles.submitText}>Save Movie</Text>
           )}
           </TouchableOpacity>
           
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EditMovieModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0F14",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  label: {
    color: "#fff",
    marginBottom: 6,
    fontSize: 14,
  },
  required: {
    color: "red",
  },
  input: {
    backgroundColor: "#1A1C22",
    color: "#fff",
    borderRadius: 6,
    padding: 10,
  },
  textArea: {
    height: 120,
  },
  uploadButton: {
    backgroundColor: "#1A1C22",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  uploadText: {
    color: "#888",
  },
  imagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 6,
    marginTop: 10,
  },
  pickerWrapper: {
    backgroundColor: "#1A1C22",
    borderRadius: 6,
  },
  picker: {
    color: "#fff",
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#FF0000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 50,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});















