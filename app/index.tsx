// app/index.tsx
import { StyledText } from "@/components/StyledText";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function MyAppsScreen() {
  return (
    <View style={styles.container}>
      <Link href="/holy-streak-tracker" asChild>
        <Pressable
          // The style prop is now a function
          style={({ pressed }) => [
            styles.appButton, // Apply the base button styles
            pressed && { transform: [{ scale: 0.97 }] }, // Apply the shrink effect when pressed
          ]}
        >
          <StyledText style={styles.appButtonText}>
            Holy Streak Tracker
          </StyledText>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center", // This centers the button vertically
    alignItems: "center",
  },
  appButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "green",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  appButtonText: {
    fontSize: 16,
    color: "#000", // Black text
  },
});
