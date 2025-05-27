// components/StyledText.tsx
import { Text, TextProps } from "react-native";

// This component will be used instead of the default Text component
export function StyledText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[props.style, { fontFamily: "Virgil" }]} // Apply the font here
    />
  );
}
