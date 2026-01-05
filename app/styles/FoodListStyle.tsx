import { StyleSheet } from "react-native";

const FoodListStyle = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",            
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "white",
    gap: 5,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
    marginRight: 10,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  foodDetail: {
    fontSize: 14,
    color: "#F97316",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#F97316", // orange accent
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginTop: 2,
  },
});

export default FoodListStyle;