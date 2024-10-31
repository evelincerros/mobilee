import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles/styles";
import PropTypes from "prop-types";
import picture from "../assets/picture.jpg";

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("email");
        const storedFirstName = await AsyncStorage.getItem("firstName");
        const storedLastName = await AsyncStorage.getItem("lastName");

        if (storedEmail) setEmail(storedEmail);
        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
      } catch (error) {
        console.error("Error loading user data:", error);
        Alert.alert("Error", "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "First and last names cannot be empty.");
      return;
    }
    try {
      await AsyncStorage.setItem("firstName", firstName);
      await AsyncStorage.setItem("lastName", lastName);
      setIsModified(false);
      Alert.alert("Success", "Changes saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "Failed to save changes.");
    }
  };

  const handleChange = (setter) => (value) => {
    setter(value);
    setIsModified(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity onPress={() => console.log("Image pressed!")}>
          <Image source={picture} style={styles.profileImage} />z
        </TouchableOpacity>
        <Text>Email/Username: {email}</Text>
        <Text>First Name: {firstName}</Text>
        <Text>Last Name: {lastName}</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={handleChange(setFirstName)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={handleChange(setLastName)}
        />
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isModified ? "#1E90FF" : "#d3d3d3" },
          ]}
          onPress={handleSave}
          disabled={!isModified}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

ProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
};
