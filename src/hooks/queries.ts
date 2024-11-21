import { API_URL } from "@/lib/constants";
import { Preset } from "@/types/api";
import { useState, useEffect } from "react";

export const usePresets = () => {
  const [data, setData] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const response = await fetch(`/api/preset`);
        const resData = await response.json();
        setData(resData["size_presets"]);
      } catch (err) {
        console.error("Failed to fetch presets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPresets();
  }, []);

  return { data, loading };
};
