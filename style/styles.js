import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    paddingVertical: 20,
  },
  input: {
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    margin: 10,
    elevation: 3,
    width: width * 0.8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 10,
  },
  buttonStyle: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    margin: 10,
    elevation: 3,
    width: width * 0.8,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 1,
    zIndex: 10,
  },
});
