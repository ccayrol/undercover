// components/StartGameAnimation.js
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const StartGameAnimation = ({ onAnimationEnd }) => {
  const fadeValue = useRef(new Animated.Value(0)).current; // Animation de fondu

  useEffect(() => {
    // Déclenche l'animation au montage du composant
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 2000, // Durée de 2 secondes
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      // Appeler la fonction de fin d'animation
      onAnimationEnd();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeValue }}>
        <Text style={styles.text}>Début de la partie !</Text>
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
  },
});

export default StartGameAnimation;