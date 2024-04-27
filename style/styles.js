import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const prim1 = "#46467A"; //dark blue
const prim2 = "#FFC212"; //yellow
const prim3 = "#F9B0C3"; //pink
const second = "#7766C6"; //light blue
const tert = "#E0DFFD"; //grey

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: prim3,
    paddingVertical: 20,
  },
  input: {
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  logo: {
    width: 200,
    height: 200,
  },
  gif: {
    width: 200,
    height: 200,
  },
  button: {
    backgroundColor: prim2,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    margin: 10,
    elevation: 3,
    width: width * 0.8,
    alignItems: "center",
  },

  buttonText: {
    color: prim1,
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  infoText: {
    fontSize: 16,
    color: prim1,
    paddingVertical: 10,
  },
  groupButtonStyle: {
    backgroundColor: prim2,
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
    color: prim1,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  roundButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: prim1,
    position: "absolute",
    bottom: 10,
    left: "50%",
    marginLeft: -10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  buttonStyle: {
    backgroundColor: second,
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
    backgroundColor: prim3,
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

  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  groupText: {
    color: prim1,
    fontWeight: "bold",
  },
  //--------App

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
    marginTop: 30,
    marginBottom: 5,
    textAlign: "center",
    color: prim1,
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

  pickerTrigger: {
    padding: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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

  //Expenses
  memberSelect: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  membersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  membersText: {
    fontSize: 16,
    color: "#333",
  },

  expenseItem: {
    backgroundColor: "#f9f9f9", // Light grey background
    borderTopColor: "#dedede", // Light grey border
    borderBottomColor: "#dedede", // Light grey border
    borderTopWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333", // Dark text color
  },
  paidByText: {
    fontSize: 14,
    color: "#666", // Medium text color
    position: "absolute",
    bottom: 0,
    left: 15,
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff", // Your primary color
  },
  expenseDate: {
    fontSize: 14,
    color: "#666", // Medium text color
    position: "absolute",
    right: 15,
    bottom: 0,
  },

  buttonTextDate: {
    color: "#28A745", // Adjust the color to match your theme
    textAlign: "center",
    fontSize: 16,
  },
  buttonDate: {
    // Additional styling for the button
    borderWidth: 1,
    borderColor: "#28A745", // Adjust the border color to match your theme
  },

  totalExpensesContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalExpensesText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  fullSizeImage: {
    width: "100%",
    height: "90%",
    resizeMode: "contain",
  },

  modalViewSmall: {
    width: "80%",
    maxHeight: "15%",
    marginLeft: 40,
    marginTop: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },

  filterButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    margin: 10,
    marginLeft: 300,
  },

  filterButtonText: {
    textAlign: "center",
    color: "white",
  },

  filterModalButton: {
    backgroundColor: "#46467A",
    padding: 5,
    margin: 10,
  },

  closeModalButton: {
    backgroundColor: "#FF3B30",
    padding: 5,
    margin: 10,
    marginTop: 15,
    borderRadius: 5,
  },
  centeredView2: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingTop: 50,
    userInfoSection: {
      alignItems: "center",
      marginBottom: 20,
      // add other styles as needed
    },
  },
  userAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50, // This will create a round effect for the image
    marginBottom: 10,
    marginLeft: 60,
    // add other styles as needed
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 5,
    // add other styles as needed
  },
});
