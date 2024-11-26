import { useState, useEffect } from "react";
import { Preset } from "@/types/api";

export const usePresets = (defaultValue: Preset[] = []) => {
  const [data, setData] = useState<Preset[]>(defaultValue);
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

export const useResize = () => {
  const [loading, setLoading] = useState(false);

  async function execute(data: {
    image: string;
    left: string;
    right: string;
    top: string;
    bottom: string;
  }) {
    setLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    return fetch("/api/resize", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        const resultUrl = data?.results?.[0]?.image;
        console.log("resize result -> ", resultUrl);
        if (!resultUrl) return;
        return resultUrl;
      })
      .catch(error => {
        console.error("Error on resize ->", error);
      })
      .finally(() => setLoading(false));
  }

  return { loading, execute };
};
