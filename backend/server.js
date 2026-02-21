import cors from "cors";
import "dotenv/config";
import express from "express";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";

import fetch from "node-fetch";
import { pool } from "./db.js";

// optional: quick startup DB check
pool.query("select 1")
  .then(() => console.log("Supabase DB connected"))
  .catch(err => console.error("DB connection failed", err));

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

  type FoodLog {
    id: ID!
    user_id: String
    food_id: String
    label: String
    kcal: Int
    created_at: String
  }

  type Query {
    searchFood(query: String!, amount: Float): [Food]
    foodLogs(user_id: String!): [FoodLog]
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

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health route: no writes, just keeps DB connection warm
app.get("/health", async (req, res) => {
  try {
    await pool.query("select 1");
    res.status(200).json({ ok: true, db: "up" });
  } catch (err) {
    res.status(503).json({ ok: false, db: "down" });
  }
});

// Apollo server
const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();

// GraphQL endpoint (you can keep it "/" if you want, but /graphql is standard)
app.use("/graphql", expressMiddleware(apolloServer));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`GraphQL ready at http://localhost:${PORT}/graphql`);
  console.log(`Health check at http://localhost:${PORT}/health`);
});