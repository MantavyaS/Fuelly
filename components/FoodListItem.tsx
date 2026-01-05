import FoodListStyle from "@/app/styles/FoodListStyle";
import { Food } from "@/app/types/Food";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  item: Food;
  onAdd: () => void;
}

const FoodListItem = ({ item, onAdd }: Props) => {
  const [header, subtitleRaw] = item.name.split(",");
  const subtitle = subtitleRaw ? subtitleRaw.trim() : "";

  return (
    <View>
      <View style={FoodListStyle.item}>
        <View style={FoodListStyle.textContainer}>
          <Text style={FoodListStyle.foodName}>{header}</Text>

          {subtitle ? (
            <Text style={FoodListStyle.subtitle}>{subtitle}</Text>
          ) : null}

          <Text style={FoodListStyle.foodDetail}>
            100g, {Math.round(item.calories ?? 0)} cal
          </Text>
        </View>

        <TouchableOpacity
          style={FoodListStyle.addButton}
          onPress={onAdd}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={FoodListStyle.divider} />
    </View>
  );
};

export default FoodListItem;
