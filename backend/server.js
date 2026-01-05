import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import 'dotenv/config';
import fetch from "node-fetch";
import { pool } from "./db.js";

pool.query("select 1")
  .then(() => console.log("✅ Supabase DB connected"))
  .catch(err => console.error("❌ DB connection failed", err));

const typeDefs = `
    type Food {
        id: ID!
        name: String!
        quantity: String
        calories: Float
        protein: Float
        carbs: Float
        fats: Float
    }
    type Query {
        searchFood(query: String!, amount: Float): [Food]
        foodLogs(user_id: String!): [FoodLog]
    }

    type FoodLog {
        id: ID!
        user_id: String
        food_id: String
        label: String
        kcal: Int
        created_at: String
    }

    type Mutation {
    addFoodLog(
        user_id: String!
        food_id: String
        label: String!
        kcal: Int!
    ): FoodLog
    }
`;

const resolvers = {
  Query: {
    searchFood: async (_, { query, amount = 100 }) => {
      const API_KEY = process.env.USDA_API_KEY;

      const res = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&api_key=${API_KEY}`
      );

      const data = await res.json();
      if (!data.foods) return [];

      return data.foods.map(food => {
        const getVal = (name) =>
          food.foodNutrients.find(n => n.nutrientName === name)?.value || 0;

        const factor = amount / 100;

        return {
          id: food.fdcId,
          name: food.description,
          quantity: amount + "g",
          calories: getVal("Energy") * factor,
          protein: getVal("Protein") * factor,
          carbs: getVal("Carbohydrate, by difference") * factor,
          fats: getVal("Total lipid (fat)") * factor,
        };
      });
    },

    foodLogs: async (_, { user_id }) => {
      const { rows } = await pool.query(
        `SELECT id, user_id, food_id, label, kcal, created_at
         FROM food_log
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 200`,
        [user_id]
      );
      return rows;
    },
  },

  Mutation: {
    addFoodLog: async (_, { user_id, food_id, label, kcal }) => {
      const { rows } = await pool.query(
        `INSERT INTO food_log (user_id, food_id, label, kcal)
         VALUES ($1, $2, $3, $4)
         RETURNING id, user_id, food_id, label, kcal, created_at`,
        [user_id, food_id ?? null, label, kcal]
      );
      return rows[0];
    },
  },
};


const server = new ApolloServer({
    typeDefs, resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: {port: 4000},
});

console.log(`Server running at: ${url}`);