// app/holy-streak-tracker.tsx

import { StyledText } from "@/components/StyledText";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native"; // 1. Import Modal instead of Alert
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "streakResetTimestamp";

export default function HolyStreakTrackerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // --- State Management ---
  const [resetTimestamp, setResetTimestamp] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // 2. Add new state to control the modal's visibility
  const [isModalVisible, setModalVisible] = useState(false);

  // ... (useEffect for loading timestamp remains the same) ...
  useEffect(() => {
    const loadTimestamp = async () => {
      const storedTimestamp = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTimestamp) {
        setResetTimestamp(parseInt(storedTimestamp, 10));
      }
      setIsLoaded(true);
    };
    loadTimestamp();
  }, []);

  const updateDisplay = useCallback(() => {
    // If no streak is active yet, explicitly set everything to 0 and stop.
    if (resetTimestamp === null) {
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      return;
    }

    const now = Date.now();
    const totalElapsedMs = now - resetTimestamp;

    // This part is still correct: calculates full days passed.
    const completedCycles = Math.floor(totalElapsedMs / TWENTY_FOUR_HOURS_MS);

    // This is the time elapsed within the CURRENT 24-hour cycle.
    // We will use this for our h:m:s count-up display.
    const elapsedInCurrentCycleMs = totalElapsedMs % TWENTY_FOUR_HOURS_MS;

    // --- NEW LOGIC ---
    // We calculate hours, minutes, and seconds based on the elapsed time, not the remaining time.
    const totalElapsedSecondsInCycle = Math.floor(
      elapsedInCurrentCycleMs / 1000
    );
    const h = Math.floor(totalElapsedSecondsInCycle / 3600);
    const m = Math.floor((totalElapsedSecondsInCycle % 3600) / 60);
    const s = totalElapsedSecondsInCycle % 60;

    // Update state with the correct count-up values
    setDays(completedCycles);
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  }, [resetTimestamp]);

  useEffect(() => {
    if (!isLoaded) return;
    updateDisplay();
    const intervalId = setInterval(updateDisplay, 1000);
    return () => clearInterval(intervalId);
  }, [isLoaded, updateDisplay]);

  // --- Event Handlers ---
  // This function now just opens the modal
  const handleEndStreakPress = () => {
    setModalVisible(true);
  };

  // This new function contains the actual reset logic
  const performStreakReset = async () => {
    const nowTimestamp = Date.now();
    await AsyncStorage.setItem(STORAGE_KEY, String(nowTimestamp));
    setResetTimestamp(nowTimestamp);
    setModalVisible(false); // Close the modal after resetting
  };

  // --- JSX Rendering ---
  return (
    <View style={styles.container}>
      {/* Your custom back button */}
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          { top: insets.top + 10 },
          pressed && { transform: [{ scale: 0.95 }] },
        ]}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </Pressable>

      {/* Your timer display */}
      <View style={styles.timeContainer}>
        <View style={styles.titleContainer}>
          <StyledText style={styles.titleText}>Days being Holy</StyledText>
          <Image
            source={require("../assets/images/sloppy-underline.png")}
            style={styles.underlineImage}
          />
        </View>
        <StyledText style={styles.timerText}>{days} days</StyledText>
        <StyledText style={styles.timerText}>{hours} hours</StyledText>
        <StyledText style={styles.timerText}>{minutes} minutes</StyledText>
        <StyledText style={styles.timerText}>{seconds} seconds</StyledText>
      </View>

      {/* The "End" button now opens the modal */}
      <Pressable
        onPress={handleEndStreakPress}
        // The style prop now becomes a function that checks the "pressed" state
        style={({ pressed }) => [
          styles.endButton, // Apply the base styles every time
          // If the button is pressed, apply an additional style to shrink it
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
      >
        <StyledText style={styles.endButtonText}>End</StyledText>
      </Pressable>

      {/* 3. The Custom Modal Component */}
      <Modal
        visible={isModalVisible}
        transparent={true} // This is key for the blurred background effect
        animationType="fade"
        onRequestClose={() => setModalVisible(false)} // For Android back button
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            {/* Close 'X' Button */}
            <Pressable
              onPress={() => setModalVisible(false)}
              // The style prop is now a function
              style={({ pressed }) => [
                styles.closeButton, // Apply the base positioning styles
                // If pressed, make the icon slightly transparent
                pressed && { opacity: 0.6 },
              ]}
            >
              <Ionicons name="close-circle" size={30} color="red" />
            </Pressable>
            <StyledText style={styles.modalText}>
              Are you sure want to end it?
            </StyledText>

            {/* Yes/No Buttons */}
            <View style={styles.modalActionButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.yesButton,
                  pressed && { transform: [{ scale: 0.97 }] },
                ]}
                onPress={performStreakReset}
              >
                <StyledText style={styles.modalButtonText}>Yes</StyledText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 4. Add all the new styles for the modal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  timeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  titleContainer: {
    alignItems: "center",
    marginBottom: 40, // Adds space between the title and the timer
  },
  titleText: {
    fontSize: 35, // Large "h1" like text
    textAlign: "center",
  },
  underlineImage: {
    // Give it a fixed, obvious size
    width: 277,
    height: 50,

    // We are temporarily removing the negative margin
    // marginTop: -15,
  },
  timerText: {
    fontSize: 28,
    marginVertical: 8,
  },
  backButton: {
    position: "absolute",
    left: 20,
    zIndex: 1,
  },
  endButton: {
    backgroundColor: "salmon",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 50,
  },
  endButtonText: {
    color: "white",
    fontSize: 18,
  },
  // --- Modal Styles ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "lightyellow", // The yellow box
    borderRadius: 20,
    padding: 30,
    paddingTop: 40, // More padding at top for the 'X' button
    width: "85%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  modalActionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  modalButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    elevation: 2,
    marginHorizontal: 10,
  },
  yesButton: {
    backgroundColor: "#FF4136", // Red color for "Yes"
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
