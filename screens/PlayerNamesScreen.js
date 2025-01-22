import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet, ImageBackground  } from 'react-native';

const PlayerNamesScreen = ({ route, navigation }) => {
  const { playerCount, undercoverCount, mrWhiteCount } = route.params;
  const [playerNames, setPlayerNames] = useState(Array(playerCount).fill(''));

  const handleNameChange = (index, name) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = name;
    setPlayerNames(newPlayerNames);
  };

  const handleStartGame = () => {
    if (playerNames.every((name) => name.trim() !== '')) {
      navigation.navigate('Game', { playerNames, undercoverCount, mrWhiteCount });
    } else {
      Alert.alert('Erreur', 'Veuillez entrer un nom pour chaque joueur.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground 
                    source={require('../assets/images/name_player_bg.png')} 
                    style={styles.background}
      ></ImageBackground>
      <Text style={styles.title}>Entrez les noms des joueurs</Text>
      {playerNames.map((name, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text style={styles.label}>Joueur {index + 1}</Text>
          <TextInput
            style={styles.input}
            placeholder={`Nom du joueur ${index + 1}`}
            value={name}
            onChangeText={(text) => handleNameChange(index, text)}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleStartGame}>
        <Text style={styles.buttonText}>Commencer la partie</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#6a11cb',
    background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
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
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Poppins',
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
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
});

export default PlayerNamesScreen;