import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const startGame = () => {
    navigation.navigate('PlayerCount');
  };

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo} /> 
      </View>
   
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Nouvelle Partie</Text>
        </TouchableOpacity>
      </View>

  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1b2631',
  },
  title: {
    fontSize: 36,
    fontFamily: 'LuckiestGuy',
    color: '#fff',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
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
  buttonContainer: {
    flex: 1, // Prend tout l'espace disponible en bas
    justifyContent: 'flex-end', // Aligne le bouton en bas
    alignItems: 'center',
    marginBottom: 200, // Ajuste cette valeur pour descendre le bouton
  },
  logo: {
    width: 350, 
    height: 350, 
    position: 'absolute', 
    top:170, // Ajuste cette valeur pour déplacer l'image vers le haut
    alignSelf: 'center', // Centre l'image horizontalement
  }
});

export default HomeScreen;