import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const CHAINS = [
  { label: "Arbitrum Sepolia", value: "arbitrumSepolia" },
  { label: "Polygon Amoy", value: "polygonAmoy" },
  { label: "Optimism Sepolia", value: "optimismSepolia" },
  { label: "Base Sepolia", value: "baseSepolia" },
];

export default function BridgeScreen() {
  const [sourceChain, setSourceChain] = useState<string>(CHAINS[0].value);
  const [destChain, setDestChain] = useState<string>(CHAINS[1].value);
  const [amount, setAmount] = useState<string>("");

  const handleTransfer = () => {
    // TODO: integrate LayerZero SDK for actual transfer
    console.log("Transfer:", { sourceChain, destChain, amount });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bridge Tokens</Text>

      <Text style={styles.label}>Вихідна мережа</Text>
      <Picker
        selectedValue={sourceChain}
        onValueChange={(itemValue) => setSourceChain(itemValue)}
        style={styles.picker}
      >
        {CHAINS.map((c) => (
          <Picker.Item key={c.value} label={c.label} value={c.value} />
        ))}
      </Picker>

      <Text style={styles.label}>Цільова мережа</Text>
      <Picker
        selectedValue={destChain}
        onValueChange={(itemValue) => setDestChain(itemValue)}
        style={styles.picker}
      >
        {CHAINS.map((c) => (
          <Picker.Item key={c.value} label={c.label} value={c.value} />
        ))}
      </Picker>

      <Text style={styles.label}>Сума токену</Text>
      <TextInput
        style={styles.input}
        placeholder="0.0"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.button} onPress={handleTransfer}>
        <Text style={styles.buttonText}>Transfer</Text>
      </TouchableOpacity>

      <Text style={styles.gasPlaceholder}>Оцінка газу: —</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
  },
  picker: {
    backgroundColor: "#f0f0f0",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#add8e6", // light blue background
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#4b0082", // indigo text (purple hover effect simulated)
    fontSize: 16,
    fontWeight: "600",
  },
  gasPlaceholder: {
    marginTop: 16,
    fontStyle: "italic",
    color: "#666",
  },
});
