import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const KEY = "fuelly_user_id";

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let id = await AsyncStorage.getItem(KEY);
      if (!id) {
        id = `device_${Math.random().toString(16).slice(2)}_${Date.now()}`;
        await AsyncStorage.setItem(KEY, id);
      }
      setUserId(id);
    })();
  }, []);

  return userId;
}
