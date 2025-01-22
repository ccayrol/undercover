// components/EndGameAnimation.js
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const EndGameAnimation = ({ winner, onGoHome }) => {
  const fadeValue = useRef(new Animated.Value(0)).current; // Animation de fondu

  useEffect(() => {
    // Déclenche l'animation au montage du composant
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 2000, // Durée de 2 secondes
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeValue }}>
        <Text style={styles.text}>{winner} a gagné !</Text>
        <TouchableOpacity style={styles.button} onPress={onGoHome}>
          <Text style={styles.buttonText}>Revenir à l'accueil</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6a11cb', // Couleur de fond pour correspondre au dégradé
  },
  text: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
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
    fontWeight: 'bold',
  },
});

export default EndGameAnimation;