// screens/GameScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PlayerCard from '../components/PlayerCard';
import { assignRoles } from '../utils/roles';

const GameScreen = ({ route, navigation }) => {
  const { playerNames, undercoverCount, mrWhiteCount } = route.params;
  const [players, setPlayers] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [eliminatedPlayer, setEliminatedPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [innocentWord, setInnocentWord] = useState('');
  const [isRevealingCards, setIsRevealingCards] = useState(true);
  const [currentRevealingPlayerIndex, setCurrentRevealingPlayerIndex] = useState(0);
  const [isCardRevealed, setIsCardRevealed] = useState(false);
  const [isMrWhiteModalVisible, setIsMrWhiteModalVisible] = useState(false);
  const [mrWhiteGuess, setMrWhiteGuess] = useState('');
  const [showGuessFailedAlert, setShowGuessFailedAlert] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const [gameStarted, setGameStarted] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animation de fondu

  // Initialisation des joueurs et des rôles
  useEffect(() => {
    const { roles, innocentWord } = assignRoles(playerNames.length, undercoverCount, mrWhiteCount);
    const playersWithNames = roles.map((role, index) => ({
      ...role,
      id: index,
      name: playerNames[index],
      eliminated: false,
    }));
    setPlayers(playersWithNames);
    setInnocentWord(innocentWord);

    // Déclencher l'animation de début de partie
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // Durée de 2 secondes
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setGameStarted(true); // Passer à l'écran suivant
    });
  }, []);

  // Animation du bouton
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Vérifier si la partie est terminée
  const checkGameOver = () => {
    const innocents = players.filter((player) => player.role === 'Innocent' && !player.eliminated);
    const undercovers = players.filter((player) => player.role === 'Undercover' && !player.eliminated);
    const mrWhites = players.filter((player) => player.role === 'Mr. White' && !player.eliminated);

    if (undercovers.length === 0 && mrWhites.length === 0) {
      setWinner('Innocents');
      setGameOver(true);
      return true;
    }

    if (undercovers.length >= innocents.length + mrWhites.length) {
      setWinner('Undercover');
      setGameOver(true);
      return true;
    }

    if (mrWhites.length === 0 && winner === 'Mr. White') {
      setGameOver(true);
      return true;
    }

    return false;
  };

  // Gérer le vote pour éliminer un joueur
  const handleVote = (votedPlayerId) => {
    if (gameOver) {
      return;
    }

    const resetPlayers = players.map((player) => ({ ...player, votes: 0 }));
    const updatedPlayers = resetPlayers.map((player) => ({
      ...player,
      votes: player.id === votedPlayerId ? (player.votes || 0) + 1 : player.votes || 0,
    }));
    setPlayers(updatedPlayers);
    setIsVoting(false);

    const eliminated = updatedPlayers.reduce((prev, current) =>
      (prev.votes || 0) > (current.votes || 0) ? prev : current
    );
    setEliminatedPlayer(eliminated);

    const newPlayers = updatedPlayers.map((player) =>
      player.id === eliminated.id ? { ...player, eliminated: true } : player
    );
    setPlayers(newPlayers);

    if (eliminated.role === 'Mr. White') {
      setIsMrWhiteModalVisible(true);
    } else {
      const isGameOver = checkGameOver();
      if (isGameOver) {
        setEliminatedPlayer(null);
        setIsVoting(false);
      }
    }
  };

  // Continuer après l'élimination d'un joueur
  const handleContinue = () => {
    const isGameOver = checkGameOver();

    if (isGameOver) {
      setEliminatedPlayer(null);
      setIsVoting(false);
    } else {
      setEliminatedPlayer(null);
      setIsVoting(true);
    }
  };

  // Montrer la carte du joueur actuel
  const handleShowCard = () => {
    animateButton();
    setIsCardRevealed(true);
  };

  // Passer au joueur suivant
  const handleNextPlayer = () => {
    animateButton();
    setIsCardRevealed(false);
    setCurrentRevealingPlayerIndex((prevIndex) => prevIndex + 1);
  };

  // Si les joueurs ne sont pas encore chargés
  if (players.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Chargement des joueurs...</Text>
      </View>
    );
  }

  const getEndGameMessage = () => {
    if (winner === "Innocents") return "Les Innocents ont gagné !";
    if (winner === "Undercover") return "Les Undercover ont gagné !";
    if (winner === "Mr.White") return "Le ou les Mr. White ont gagné !";
  };

  // Si la partie est terminée
  if (gameOver) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1b2631', '#2575fc']} style={styles.background} />
        <Animated.View style={[styles.endGameContainer, { opacity: fadeAnim }]}>
          <Text style={styles.endGameText}> {getEndGameMessage()} </Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Revenir à l'accueil</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // Si l'animation de début est en cours
  if (!gameStarted) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1b2631', '#2575fc']} style={styles.background} />
        <Animated.View style={[styles.startGameContainer, { opacity: fadeAnim }]}>
          <Text style={styles.startGameText}>Début de la partie !</Text>
        </Animated.View>
      </View>
    );
  }

  // Si les cartes sont en train d'être révélées
  if (isRevealingCards) {
    const currentPlayer = players[currentRevealingPlayerIndex];

    if (currentRevealingPlayerIndex >= players.length) {
      setIsRevealingCards(false);
      setIsVoting(true);
      return null;
    }

    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1b2631', '#2575fc']} style={styles.background} />
        <Text style={styles.title}>{currentPlayer.name}</Text>

        {isCardRevealed ? (
          <>
            {currentPlayer.role === 'Mr. White' ? (
              <Text style={styles.word}>Tu es le Mr. White !</Text>
            ) : (
              <Text style={styles.word}>Mot : {currentPlayer.word}</Text>
            )}
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <TouchableOpacity style={styles.button} onPress={handleNextPlayer}>
                <Text style={styles.buttonText}>Suivant</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        ) : (
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableOpacity style={styles.button} onPress={handleShowCard}>
              <Text style={styles.buttonText}>Mot</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  }

  // Interface principale du jeu
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1b2631', '#2575fc']} style={styles.background} />

      {/* Modal de vote */}
      <Modal visible={isVoting && !gameOver} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Voter pour éliminer un joueur</Text>
            <FlatList
              data={players.filter((player) => !player.eliminated)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.playerCard} onPress={() => handleVote(item.id)}>
                  <Text style={styles.playerName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.playerList}
            />
          </View>
        </View>
      </Modal>

      {/* Modal pour Mr. White */}
      <Modal visible={isMrWhiteModalVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mr. White, devinez le mot des Innocents</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre mot"
              value={mrWhiteGuess}
              onChangeText={setMrWhiteGuess}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (mrWhiteGuess.toLowerCase() === innocentWord.toLowerCase()) {
                    setWinner('Mr. White');
                    setGameOver(true);
                  } else {
                    setIsMrWhiteModalVisible(false);
                    setEliminatedPlayer(null);
                    setShowGuessFailedAlert(true);
                  }
                  setMrWhiteGuess('');
                }}
              >
                <Text style={styles.buttonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Boîte de dialogue d'échec de Mr. White */}
      <Modal visible={showGuessFailedAlert} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mr. White n'a pas deviné le mot</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setShowGuessFailedAlert(false);
                setIsVoting(true);
              }}
            >
              <Text style={styles.buttonText}>Continuer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Affichage du résultat du vote */}
      {eliminatedPlayer && !gameOver && eliminatedPlayer.role !== 'Mr. White' && (
        <Modal visible={!!eliminatedPlayer} transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{eliminatedPlayer?.name} a été éliminé !</Text>
              <Text style={styles.role}>Rôle : {eliminatedPlayer?.role}</Text>
              <TouchableOpacity style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>Continuer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  startGameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startGameText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  endGameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endGameText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: 'LuckiestGuy',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay for better focus
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Soft border for a premium look
  },
  modalTitle: {
    fontSize: 26,
    fontFamily: 'Poppins',
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',// Stylish uppercase text
    letterSpacing: 1.2, // Slight spacing for a modern feel
  },
  playerList: {
    width: '100%',
  },
  playerCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  playerName: {
    fontSize: 18,
    fontFamily: 'Poppins',
    color: '#333',
    fontWeight: 'bold',
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
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  word: {
    fontSize: 24,
    fontFamily: 'Poppins',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default GameScreen;