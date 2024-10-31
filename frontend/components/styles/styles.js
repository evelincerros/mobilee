import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    paddingVertical: 50,
  },
  headerContainer: {
    flex: 0.17,
    justifyContent: "flex-start",
    padding: 10,
  },
  listContainer: {
    flex: 0.75,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    alignSelf: "center",
    marginBottom: 12,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: "#ADD8E6",
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  message: {
    marginTop: 20,
    color: "green",
    textAlign: "center",
  },
  buttonContainer: {
    marginVertical: 10,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    height: 80,
  },
  footerContainer: {
    flex: 0.15,
    justifyContent: "space-around",
    backgroundColor: "#f0f0f0",
    width: "80%",
    alignSelf: "center",
  },
  item: {
    flexDirection: "column",
    backgroundColor: "#ADD8E6",
    padding: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  actionText: {
    color: "blue",
    marginHorizontal: 5,
  },
  title: {
    fontSize: 32,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  profileContainer: {
    padding: 20,
  },
  profileImageLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  profileButtonContainer: {
    marginVertical: 10,
    alignSelf: "center",
  },
});
