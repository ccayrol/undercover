import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

const PlayerCountScreen = ({ navigation }) => {
  const [playerCount, setPlayerCount] = useState(4); // Valeur par défaut
  const [undercoverCount, setUndercoverCount] = useState(1); // Valeur par défaut
  const [mrWhiteCount, setMrWhiteCount] = useState(0); // Valeur par défaut

  const handleNext = () => {
    // Validation des valeurs
    if (playerCount >= 4 && undercoverCount >= 1 && mrWhiteCount >= 0 && undercoverCount + mrWhiteCount < playerCount) {
      navigation.navigate('PlayerNames', {
        playerCount,
        undercoverCount,
        mrWhiteCount,
      });
    } else {
      alert('Veuillez entrer des valeurs valides.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
              source={require('../assets/images/background.png')} 
              style={styles.background}
      ></ImageBackground>
      <Text style={styles.title}>Configuration de la partie</Text>

      {/* Sélection du nombre de joueurs */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre de joueurs (4-20)</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={playerCount}
            onValueChange={(itemValue) => setPlayerCount(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: 17 }, (_, i) => i + 4).map((value) => (
              <Picker.Item key={value} label={`${value}`} value={value} />
            ))}
          </Picker>
        </View>
        
      </View>

      {/* Sélection du nombre d'Undercover */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre d'Undercover</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={undercoverCount}
            onValueChange={(itemValue) => setUndercoverCount(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: playerCount - 1 }, (_, i) => i + 1).map((value) => (
              <Picker.Item key={value} label={`${value}`} value={value} />
            ))}
          </Picker>
        </View>
       
      </View>

      {/* Sélection du nombre de Mr. White */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre de Mr. White</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={mrWhiteCount}
            onValueChange={(itemValue) => setMrWhiteCount(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: playerCount - undercoverCount }, (_, i) => i).map((value) => (
              <Picker.Item key={value} label={`${value}`} value={value} />
            ))}
          </Picker>
        </View>
        
      </View>

      {/* Bouton Suivant */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Suivant</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 28,
    fontFamily: 'LuckiestGuy',
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: '#fff',
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#2575fc',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  pickerContainer: {
    width: '100%',
    borderRadius: 10, // Bords arrondis
    overflow: 'hidden', // Masque le contenu dépassant (utile pour arrondir les bords)
    borderWidth: 1,
  },
});

export default PlayerCountScreen;