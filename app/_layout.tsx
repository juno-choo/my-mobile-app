// app/_layout.tsx
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ActivityIndicator, Text } from "react-native"; // Make sure Text is imported

// import { useEffect } from "react"; // Temporarily disable
// import * as SplashScreen from 'expo-splash-screen'; // Temporarily disable

// SplashScreen.preventAutoHideAsync(); // Temporarily disable

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Virgil: require("../assets/fonts/Virgil.ttf"),
  });

  /* // Temporarily disable the entire useEffect hook
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
  */

  // --- We are keeping the debugging logic ---
  if (fontError) {
    console.error("Font loading error:", fontError);
    return <Text>Error loading fonts. Check the terminal.</Text>;
  }

  // If fonts are not yet loaded, show the spinner
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "my-apps",
          headerTitleAlign: "left",
          headerStyle: { backgroundColor: "#fff" },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: "Virgil", // We can re-add this later
            fontSize: 22,
          },
        }}
      />
      <Stack.Screen
        name="holy-streak-tracker"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
