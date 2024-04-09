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
  groupButtonStyle: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    margin: 10,
    elevation: 3,
    flexDirection: "row", // Add this line to align icon and text
    alignItems: "center", // Add this line to center them vertically
    justifyContent: "center", // Add this line to center them horizontally
  },
  groupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8, // Add some space between the icon and text
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
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: 290,
    marginBottom: 10,
    shadowColor: "#000",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },

  iconStyle: {
    alignSelf: "center",
  },

  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },

  //Modal
  modalView: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 35,
    paddingBottom: 35,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "flex-start", // Align content to start
    alignItems: "stretch", // Stretch items to fill
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    alignSelf: "center", // Center the input fields
    width: "100%", // Use full width
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%", // Ensure it spans the full width
    marginBottom: 20, // Space between buttons and the next element
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  //----------------
  modalButton: {
    backgroundColor: "#28A745",
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 5,
    width: width * 0.5,
    alignItems: "center",
  },
  modalButton2: {
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 5,
    marginVertical: 5,
    width: (width * 0.5) / 2 - 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
