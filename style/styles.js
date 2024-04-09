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
    backgroundColor: "#28a745",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  groupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
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
    justifyContent: "flex-start",
    alignItems: "stretch",
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    alignSelf: "center",
    width: "100%",
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
    width: "100%",
    marginBottom: 20,
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
    width: width * 0.9,
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
  modalButton3: {
    backgroundColor: "#28A745",
    borderRadius: 5,
    paddingVertical: 16,
    width: 70,
    alignItems: "center",
    marginBottom: 15,
  },
  contactItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contactNumber: {
    fontSize: 14,
  },
  buttonClose: {
    marginTop: 20,
    backgroundColor: "red",
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
