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
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [showStartMessage, setShowStartMessage] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const { roles, innocentWord: newWord } = assignRoles(playerNames.length, undercoverCount, mrWhiteCount);
    const playersWithNames = roles.map((role, index) => ({
      ...role,
      id: index,
      name: playerNames[index],
      eliminated: false,
    }));

    setPlayers(playersWithNames);
    setInnocentWord(newWord);
    startGameAnimation();
  };

  const startGameAnimation = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setGameStarted(true);
    });
  };

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

  const checkGameOver = () => {
    const innocents = players.filter((p) => p.role === 'Innocent' && !p.eliminated);
    const undercovers = players.filter((p) => p.role === 'Undercover' && !p.eliminated);
    const mrWhites = players.filter((p) => p.role === 'Mr. White' && !p.eliminated);

    if (undercovers.length === 0 && mrWhites.length === 0) {
      setWinner('Innocents');
      setGameOver(true);
      startGameAnimation();
      return true;
    }

    if (innocents.length === 0 || (innocents.length === 1 && undercovers.length === 1)) {
      setWinner('Undercover');
      setGameOver(true);
      startGameAnimation();
      return true;
    }

    return false;
  };

  const selectStartingPlayer = () => {
    const eligiblePlayers = players.filter(player => player.role !== "Mr. White");
    const randomPlayer = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];
    return randomPlayer.name;
  };

  const handleVote = (votedPlayerId) => {
    if (gameOver) return;

    const resetPlayers = players.map((p) => ({ ...p, votes: 0 }));
    const updatedPlayers = resetPlayers.map((p) => ({
      ...p,
      votes: p.id === votedPlayerId ? 1 : 0,
    }));

    const eliminated = updatedPlayers.find((p) => p.id === votedPlayerId);
    const newPlayers = updatedPlayers.map((p) =>
      p.id === votedPlayerId ? { ...p, eliminated: true } : p
    );

    setPlayers(newPlayers);
    setIsVoting(false);
    setEliminatedPlayer(eliminated);

    if (eliminated.role === 'Mr. White') {
      setIsMrWhiteModalVisible(true);
    } else {
      checkGameOver();
    }
  };

  const handleMrWhiteGuess = () => {
    if (mrWhiteGuess.toLowerCase() === innocentWord.toLowerCase()) {
      setWinner('Mr. White');
      setGameOver(true);
      startGameAnimation();
    } else {
      const innocents = players.filter((p) => p.role === 'Innocent' && !p.eliminated);
      const undercovers = players.filter((p) => p.role === 'Undercover' && !p.eliminated);
      const mrWhites = players.filter((p) => p.role === 'Mr. White' && !p.eliminated);
      
      if (undercovers.length === 0 && mrWhites.length === 0) {
        setWinner('Innocents');
        setGameOver(true);
        startGameAnimation();
      } else {
        setIsMrWhiteModalVisible(false);
        setEliminatedPlayer(null);
        setShowGuessFailedAlert(true);
      }
    }
    setMrWhiteGuess('');
  };

  const handleContinue = () => {
    if (checkGameOver()) {
      setEliminatedPlayer(null);
      setIsVoting(false);
    } else {
      setEliminatedPlayer(null);
      setIsVoting(true);
    }
  };

  const handleShowCard = () => {
    animateButton();
    setIsCardRevealed(true);
  };

  const handleNextPlayer = () => {
    animateButton();
    setIsCardRevealed(false);

    if (currentRevealingPlayerIndex + 1 >= players.length) {
      setIsRevealingCards(false);
      setShowStartMessage(true);
      setTimeout(() => {
        setShowStartMessage(false);
        setIsVoting(true);
      }, 2000);
    } else {
      setCurrentRevealingPlayerIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    const { roles, innocentWord: newWord } = assignRoles(playerNames.length, undercoverCount, mrWhiteCount);
    const playersWithNames = roles.map((role, index) => ({
      ...role,
      id: index,
      name: playerNames[index],
      eliminated: false,
    }));

    setPlayers(playersWithNames);
    setInnocentWord(newWord);
    setGameOver(false);
    setWinner(null);
    setIsRevealingCards(true);
    setCurrentRevealingPlayerIndex(0);
    setIsCardRevealed(false);
    setGameStarted(false);
    setIsMrWhiteModalVisible(false);
    setShowStartMessage(false);
    startGameAnimation();
  };

  if (players.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1b2631', '#2575fc']} style={styles.background} />
        <Text style={styles.loadingText}>Chargement des joueurs...</Text>
      </View>
    );
  }

  if (gameOver) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1b2631', '#2575fc']} style={styles.background} />
        <ImageBackground 
                    source={require('../assets/images/in_game.png')} 
                    style={styles.background}>
          <View style={styles.overlay} />
        </ImageBackground>
        <Animated.View style={[styles.endGameContainer, { opacity: fadeAnim }]}>
          <Text style={styles.endGameText}>
            {winner === 'Innocents' && "Les Innocents ont gagné !"}
            {winner === 'Undercover' && "Les Undercover ont gagné !"}
            {winner === 'Mr. White' && "Mr. White a gagné !"}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.buttonText}>Revenir à l'accueil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleRestart}>
              <Text style={styles.buttonText}>Rejouer</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }

  if (!gameStarted) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1b2631', '#2575fc']} style={styles.background} />
        <ImageBackground 
                    source={require('../assets/images/in_game.png')} 
                    style={styles.background}>
       <View style={styles.overlay} />
       </ImageBackground>
        <Animated.View style={[styles.startGameContainer, { opacity: fadeAnim }]}>
          <Text style={styles.startGameText}>Début de la partie !</Text>
        </Animated.View>
      </View>
    );
  }

  if (showStartMessage) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1b2631', '#2575fc']} style={styles.background} />
        <ImageBackground 
                    source={require('../assets/images/in_game.png')} 
                    style={styles.background}>
       <View style={styles.overlay} />
      </ImageBackground>
        <View style={styles.startGameContainer}>
          <Text style={[styles.startGameText, { fontSize: 30 }]}>
            C'est {selectStartingPlayer()} qui commence !
          </Text>
        </View>
      </View>
    );
  }

  if (isRevealingCards) {
    const currentPlayer = players[currentRevealingPlayerIndex];

    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1b2631', '#2575fc']} style={styles.background} />
        <ImageBackground 
                    source={require('../assets/images/in_game.png')} 
                    style={styles.background}>
        <View style={styles.overlay} />
         </ImageBackground>
          
        <View style={styles.nameContainer}>
          <Text style={styles.title}>{currentPlayer.name}</Text>
        </View>
        

        <View style={styles.cardContainer}>
          {isCardRevealed ? (
            <>
              <View style={styles.wordFrameContainer}>
                {currentPlayer.role === 'Mr. White' ? (
                  <Text style={styles.wordText}>Tu es le Mr. White !</Text>
                ) : (
                  <>
                    <Text style={styles.wordText}>{currentPlayer.word}</Text>
                  </>
                )}
              </View>
              <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <TouchableOpacity style={styles.button} onPress={handleNextPlayer}>
                  <Text style={styles.buttonText}>Suivant</Text>
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <TouchableOpacity style={styles.button} onPress={handleShowCard}>
                <Text style={styles.buttonText}>Voir mon mot</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1b2631', '#2575fc']} style={styles.background} />
      <ImageBackground 
                    source={require('../assets/images/in_game.png')} 
                    style={styles.background}>
       <View style={styles.overlay} />              
      </ImageBackground>
      <Modal visible={isVoting && !gameOver} transparent={true}>      
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Voter pour éliminer un joueur</Text>
            <FlatList
              data={players.filter(p => !p.eliminated)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.playerVoteCard} 
                  onPress={() => handleVote(item.id)}
                >
                  <Text style={styles.playerVoteName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.playerList}
            />
          </View>
        </View>
      </Modal>

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
            <TouchableOpacity style={styles.button} onPress={handleMrWhiteGuess}>
              <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

      {eliminatedPlayer && !gameOver && eliminatedPlayer.role !== 'Mr. White' && (
        <Modal visible={true} transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{eliminatedPlayer.name} a été éliminé !</Text>
              <Text style={styles.roleText}>Rôle : {eliminatedPlayer.role}</Text>
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
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Prend toute la place de l'ImageBackground
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Noir semi-transparent (0.5 = 50% d'opacité)
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
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
    textAlign: 'center',
  },
  endGameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  endGameText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  title: {
    fontSize: 36,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  Name: {
    fontSize: 56,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cardContainer: {
    alignItems: 'center',
    width: '80%',
    maxWidth: 400,
  },
  wordFrameContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  wordText: {
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  playerList: {
    width: '100%',
  },
  playerVoteCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%', // Ajustez à la taille souhaitée (en pourcentage de l'écran ou en pixels) // Centrer la carte horizontalement
  },
  playerVoteName: {
    fontSize: 18,
    color: '#333',
  },
  button: {
    backgroundColor: '#2575fc',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    minWidth: 200,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  roleText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});

export default GameScreen;