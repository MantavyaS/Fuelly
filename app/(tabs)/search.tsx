import { Food } from '@/app/types/Food';
import FoodListItem from "@/components/FoodListItem";
import { useUserId } from "@/hooks/useUserid";
import { gql } from "@apollo/client";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputStyle from "../styles/InputStyle";
import MainStyle from "../styles/MainStyle";

const SEARCH_FOOD = gql`
  query SearchFood($query: String!, $amount: Float) {
    searchFood(query: $query, amount: $amount) {
      id
      name
      calories
      protein
      carbs
      fats
    }
  }
`;

const ADD_FOOD_LOG = gql`
  mutation AddFoodLog($user_id: String!, $food_id: String, $label: String!, $kcal: Int!) {
    addFoodLog(user_id: $user_id, food_id: $food_id, label: $label, kcal: $kcal) {
      id
      created_at
    }
  }
`;

export default function SearchScreen() {
  const userId = useUserId();

  const [search, setSearch] = useState("");
  const [searchFood, { data, loading, error }] = useLazyQuery<{ searchFood: Food[] }>(SEARCH_FOOD);

  const [addFoodLog, { loading: adding }] = useMutation(ADD_FOOD_LOG);

  const handleSearch = () => {
    if (search.trim() === "") return;
    searchFood({ variables: { query: search, amount: 100 } });
    setSearch("");
  };

  const onAdd = async (food: Food) => {
    if (!userId) return; // not ready yet

    await addFoodLog({
      variables: {
        user_id: userId,
        food_id: food.id.toString(),
        label: food.name,
        kcal: Math.round(food.calories ?? 0),
      },
    });
  };

  return (
    <SafeAreaView style={MainStyle.container}>
      <View style={InputStyle.container}>
        <Feather name="search" size={24} color="black" style={InputStyle.icon} />
        <TextInput
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {(loading || adding) && <ActivityIndicator size="large" color="#F97316" />}
      {error && <Text style={{ color: "red" }}>Error: {error.message}</Text>}

      <FlatList
        data={data?.searchFood || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FoodListItem item={item} onAdd={() => onAdd(item)} />
        )}
      />
    </SafeAreaView>
  );
}
