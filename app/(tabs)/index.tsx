import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { ActivityIndicator, FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardStyle from "../styles/DashboardStyle";

import { useUserId } from "@/hooks/useUserid";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

const GET_FOOD_LOGS = gql`
  query FoodLogs($user_id: String!) {
    foodLogs(user_id: $user_id) {
      id
      label
      kcal
      created_at
    }
  }
`;

export default function HomeScreen() {
  // still dummy macros for now (since DB doesn't store them yet)
  const carbs = 60;
  const protein = 30;
  const fats = 10;

  const userId = useUserId();

  const { data, loading, error, refetch } = useQuery(GET_FOOD_LOGS, {
    variables: { user_id: userId ?? "" },
    skip: !userId,
    fetchPolicy: "network-only",
  });

  useFocusEffect(
    useCallback(() => {
      if (userId) refetch();
    }, [userId, refetch])
  );

  if (!userId || loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#db6215", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#db6215", justifyContent: "center", padding: 16 }}>
        <Text style={{ color: "white" }}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  const logs = data?.foodLogs ?? [];

  const goal = 1600;
  const eaten = logs.reduce((sum: number, item: any) => sum + (item.kcal ?? 0), 0);
  const percent = Math.min((eaten / goal) * 100, 100);
  const remaining = Math.max(100 - percent, 0);

  const meals = logs.map((l: any) => ({
    id: String(l.id),
    name: l.label ?? "",
    calories: l.kcal ?? 0,
    time: new Date(l.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#db6215" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 0, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={DashboardStyle.container}>
          <View style={DashboardStyle.header}>
            <FontAwesome5 name="gripfire" size={40} color="white" />
            <Text style={DashboardStyle.title}>Fuelly</Text>
          </View>

          <View style={DashboardStyle.box}>
            <Text style={DashboardStyle.subtitle}>Day at a glance</Text>

            <Text style={DashboardStyle.cals}>{eaten}</Text>

            <View style={DashboardStyle.barContainer}>
              <View style={[DashboardStyle.barSection, { flex: carbs, backgroundColor: "#FFA500" }]} />
              <View style={[DashboardStyle.barSection, { flex: protein, backgroundColor: "#FF6347" }]} />
              <View style={[DashboardStyle.barSection, { flex: fats, backgroundColor: "#FFD700" }]} />
            </View>

            <View style={DashboardStyle.macros}>
              <View>
                <Text style={DashboardStyle.macroText}>Carbs</Text>
                <Text style={DashboardStyle.macroText}>187g</Text>
              </View>
              <View>
                <Text style={DashboardStyle.macroText}>Fats</Text>
                <Text style={DashboardStyle.macroText}>50g</Text>
              </View>
              <View>
                <Text style={DashboardStyle.macroText}>Protein</Text>
                <Text style={DashboardStyle.macroText}>100g</Text>
              </View>
            </View>
          </View>

          <View style={DashboardStyle.dialog}>
            <Text style={DashboardStyle.text}>Your Progress</Text>
            <Text style={[DashboardStyle.macroText, { color: "#FF6600" }]}>
              {goal} (goal) - {eaten} (eaten) = {Math.max(goal - eaten, 0)} (left)
            </Text>
            <View style={DashboardStyle.barContainer}>
              <View style={[DashboardStyle.barSection, { flex: percent, backgroundColor: "#FFA500" }]} />
              <View style={[DashboardStyle.barSection, { flex: remaining, backgroundColor: "#FF6347" }]} />
            </View>
          </View>

          <View style={DashboardStyle.mealsSection}>
            <Text style={DashboardStyle.text}>Your Meals</Text>
            <FlatList
              data={meals}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={DashboardStyle.mealItem}>
                  <View>
                    <Text style={DashboardStyle.mealName}>{item.name}</Text>
                    <Text style={DashboardStyle.mealTime}>{item.time}</Text>
                  </View>
                  <Text style={DashboardStyle.mealCalories}>{item.calories} kcal</Text>
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
