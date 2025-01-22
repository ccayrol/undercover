import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlayerCard = ({ player, showRole }) => {
  return (
    <View style={styles.card}>
      {player.role !== 'Mr. White' && <Text style={styles.word}>{player.word}</Text>}
      {showRole && <Text style={styles.role}>Rôle : {player.role}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 16,
    color: '#666',
  },
  word: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default PlayerCard;