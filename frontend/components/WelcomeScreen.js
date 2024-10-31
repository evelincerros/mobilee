import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import PropTypes from "prop-types";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles/styles";
import picture from "../assets/picture.jpg";
import FontAwesome from "@expo/vector-icons/FontAwesome";

function WelcomeScreen({ navigation, setIsLoggedIn }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigateToCameraFeature = () => {
    navigation.navigate("CameraFeature");
  };

  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://10.200.196.203:5000/items/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch items");
      const items = await response.json();
      setData(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setIsLoggedIn(false);
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const handleEditPress = (item) => {
    setSelectedItem(item);
    setIsEditModalVisible(true);
  };

  const handleDeletePress = async (itemId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://10.200.196.203:5000/items/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Server error:", errorResponse);
        throw new Error(errorResponse.message || "Failed to delete item");
      }

      setData((prevData) => prevData.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
      Alert.alert("Error", "Failed to delete item.");
    }
  };

  const addItem = async (newItem) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://10.200.196.203:5000/items/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) throw new Error("Failed to add item");

      const savedItem = await response.json();
      setData((prevData) => [...prevData, savedItem]);
      Alert.alert("Success", "Item added successfully.");
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert("Error", "Failed to add item.");
    }
  };

  const saveEditedItem = async (editedItem) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://10.200.196.203:5000/items/${editedItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editedItem.title,
            description: editedItem.description,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update item");

      const updatedItem = await response.json();
      setData((prevData) =>
        prevData.map((item) =>
          item._id === editedItem._id ? updatedItem : item
        )
      );
      setIsEditModalVisible(false);
      Alert.alert("Success", "Item updated successfully.");
    } catch (error) {
      console.error("Error updating item:", error);
      Alert.alert("Error", "Failed to update item.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={navigateToProfile}>
          <Image source={picture} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Welcome!</Text>
      </View>
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#ff00ff" />
        ) : data.length ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity onPress={() => handleEditPress(item)}>
                    <FontAwesome name="edit" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeletePress(item._id)}>
                    <FontAwesome name="trash" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <Text>No items found</Text>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={navigateToCameraFeature}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <AddItemModal onAddItem={addItem} />
      {selectedItem && (
        <EditItemModal
          item={selectedItem}
          isVisible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onSave={saveEditedItem}
        />
      )}
    </SafeAreaView>
  );
}

WelcomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default WelcomeScreen;
