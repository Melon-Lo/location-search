import type { Place } from "./Place";

// 使用 interface 可以確保只拿到自己想要的 prop，排除其他用不到的資料
interface SearchResponse {
  features: {
    geometry: {
      coordinates: number[];
    }
    properties: {
      place_id: number;
      display_name: string;
    }
  }[]
}

export const search = async (term: string) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${term}&format=geojson&addressdetails=1&layer=address&limit=5`
  );

  const data: SearchResponse = await res.json();
  // 或是寫成下面這樣，都是一樣的
  // const data = (await res.json()) as SearchResponse;

  // 使用已經定義好的 interface，確保資料最後會長得像這個 type 一樣（format）
  const places: Place[] = data.features.map(feature => {
    return {
      id: feature.properties.place_id,
      name: feature.properties.display_name,
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1]
    }
  })

  return places;
};