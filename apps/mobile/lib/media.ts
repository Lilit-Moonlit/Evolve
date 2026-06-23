import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

export interface LocationData {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
}

export async function requestCameraPermissions(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === "granted";
}

export async function requestMediaLibraryPermissions(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === "granted";
}

export async function pickImage(): Promise<string | null> {
  const hasPermission = await requestMediaLibraryPermissions();
  if (!hasPermission) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    return result.assets[0].uri;
  }

  return null;
}

export async function takePhoto(): Promise<string | null> {
  const hasPermission = await requestCameraPermissions();
  if (!hasPermission) {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    return result.assets[0].uri;
  }

  return null;
}

export async function uploadToIPFS(uri: string): Promise<string> {
  const { DocumentManager } = await import("@evolve/storage");
  const documentManager = new DocumentManager();
  const cid = await documentManager.uploadDocument(uri);
  return cid;
}

export async function requestLocationPermissions(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

export async function getCurrentLocation(): Promise<LocationData | null> {
  const hasPermission = await requestLocationPermissions();
  if (!hasPermission) {
    return null;
  }

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
  if (geocode.length > 0) {
    const { city, country } = geocode[0];
    return {
      country: country || "",
      city: city || "",
      latitude,
      longitude,
    };
  }

  return {
    country: "",
    city: "",
    latitude,
    longitude,
  };
}
