import { StyleSheet } from "react-native";

const DashboardStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    backgroundColor: "#eb6f1d",
    borderRadius: 30,
    padding: 20,
    marginTop: 10,
    marginLeft: 17,
    marginRight: 17,
    marginBottom: 10,
  },
  header: {
    color: "white",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  title: {
    fontFamily: "Poppins",
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "white",
    fontWeight: 600,
    marginBottom: 10,
  },
  cals: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  barContainer: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginTop: 10,
    marginBottom: 10,
  },
  barSection: {
    height: '100%',
  },
  macros: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  macroText: {
    fontSize: 15,
    color: "white",
    fontWeight: 600,
  },
  dialog: {
    backgroundColor: "#ffeed5",
    borderRadius: 30,
    padding: 20,
    marginTop: 5,
    marginLeft: 17,
    marginRight: 17,
    marginBottom: 5,
  },
  text: {
    fontSize: 20,
    color: "#FF6600",
    fontWeight: 600,
    marginBottom: 10,
  },

    mealsSection: {
        backgroundColor: "#ffeed5",
        borderRadius: 30,
        padding: 20,
        marginTop: 5,
        marginLeft: 17,
        marginRight: 17,
    },

    mealItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    },

    mealName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    },

    mealTime: {
    fontSize: 13,
    color: "#999",
    },

    mealCalories: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#db6215",
    }
});

export default DashboardStyle;
