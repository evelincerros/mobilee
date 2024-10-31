import React, { useState } from "react";
import { Text, SafeAreaView, TextInput, Button, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from "prop-types";
import styles from "./styles/styles";

export default function LoginScreen({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const handlePress = async () => {
    if (isLogin) {
      if (email === "" || password === "") {
        setMessage("Please fill out all fields.");
        return;
      }
    } else {
      if (
        email === "" ||
        password === "" ||
        firstName === "" ||
        lastName === ""
      ) {
        setMessage("Please fill out all fields.");
        return;
      }
    }

    const url = isLogin
      ? "http://10.200.196.203:5000/users/login"
      : "http://10.200.196.203:5000/users/register";

    const body = isLogin
      ? { username: email, password }
      : { username: email, password, firstname: firstName, lastname: lastName };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("");
        if (isLogin) {
          setMessage("Login successful");
          if (result.token) {
            await AsyncStorage.setItem("token", result.token);
            await AsyncStorage.setItem("email", email);
            await AsyncStorage.setItem(
              "firstName",
              result.firstname || firstName
            );
            await AsyncStorage.setItem("lastName", result.lastname || lastName);
            setIsLoggedIn(true);
            navigation.reset({
              index: 0,
              routes: [{ name: "Profile" }],
            });
          }
        } else {
          setMessage("Registration successful. You will now log in.");
          setIsLogin(true);
        }
      } else {
        setMessage(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error connecting to the server.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.headerText}>{isLogin ? "Login" : "Sign Up"}</Text>

        {!isLogin && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter first name"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                setMessage("");
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter last name"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                setMessage("");
              }}
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setMessage("");
          }}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setMessage("");
          }}
          secureTextEntry={true}
        />

        <View style={styles.buttonContainer}>
          <Button title={isLogin ? "Login" : "Sign Up"} onPress={handlePress} />
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <View style={styles.switchButtonContainer}>
          <Button
            title={isLogin ? "Switch to Sign Up" : "Switch to Login"}
            onPress={() => {
              setIsLogin(!isLogin);
              setEmail("");
              setPassword("");
              setFirstName("");
              setLastName("");
              setMessage("");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
};
