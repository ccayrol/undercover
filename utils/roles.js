export const assignRoles = (playerCount, undercoverCount, mrWhiteCount) => {
  const roles = Array(playerCount).fill(null);
  const wordPairs = [
    { innocent: 'Thé', undercover: 'Café' },
    { innocent: 'Chien', undercover: 'Loup' },
    { innocent: 'Plage', undercover: 'Piscine' },
    { innocent: 'Forêt', undercover: 'Jungle' },
    { innocent: 'Avion', undercover: 'Hélicoptère' },
    { innocent: 'Livre', undercover: 'Magazine' },
    { innocent: 'Panda', undercover: 'Ours' },
    { innocent: 'Guitare', undercover: 'Ukulélé' },
    { innocent: 'Pizza', undercover: 'Tarte' },
    { innocent: 'Soleil', undercover: 'Lune' },
    { innocent: 'Bateau', undercover: 'Yacht' },
    { innocent: 'Montagne', undercover: 'Colline' },
    { innocent: 'Fusée', undercover: 'Missile' },
    { innocent: 'Styliste', undercover: 'Designer' },
    { innocent: 'Burger', undercover: 'Hot-dog' },
    { innocent: 'Robot', undercover: 'Cyborg' },
    { innocent: 'Cheval', undercover: 'Âne' },
    { innocent: 'Télévision', undercover: 'Projecteur' },
    { innocent: 'Pommes', undercover: 'Poires' },
    { innocent: 'Train', undercover: 'Métro' },
    { innocent: 'Compote', undercover: 'Yaourt' },
    { innocent: 'Table', undercover: 'Bureau' },
    { innocent: 'Clown', undercover: 'Mime' },
    { innocent: 'Vélo', undercover: 'Trottinette' },
    { innocent: 'École', undercover: 'Université' },
    { innocent: 'Roi', undercover: 'Empereur' },
    { innocent: 'Fleur', undercover: 'Arbre' },
    { innocent: 'Photo', undercover: 'Image' },
    { innocent: 'Tigre', undercover: 'Lion' },
    { innocent: 'Lit', undercover: 'Canapé' },
    { innocent: 'Miroir', undercover: 'Vitre' },
    { innocent: 'Château', undercover: 'Palais' },
    { innocent: 'Fourchette', undercover: 'Cuillère' },
    { innocent: 'Cheveux', undercover: 'Barbe' },
    { innocent: 'Amitié', undercover: 'Amour' },
    { innocent: 'Chasseur', undercover: 'Pêcheur' },
    { innocent: 'Moule', undercover: 'Huître' },
    { innocent: 'Purée', undercover: 'Soupe' },
    { innocent: 'Macron', undercover: 'Trump' },
    { innocent: 'Sel', undercover: 'Poivre' },
  ];


  const randomIndex = Math.floor(Math.random() * wordPairs.length);
  const randomPair = wordPairs[randomIndex];

  // Tableau des indices disponibles
  const availableIndices = Array.from({ length: playerCount }, (_, i) => i);

  // Attribuer les rôles d'Undercover
  for (let i = 0; i < undercoverCount; i++) {
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const undercoverIndex = availableIndices.splice(randomIndex, 1)[0];
    roles[undercoverIndex] = {
      role: 'Undercover',
      word: randomPair.undercover,
    };
  }

  // Attribuer les rôles de Mr. White
  for (let i = 0; i < mrWhiteCount; i++) {
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const mrWhiteIndex = availableIndices.splice(randomIndex, 1)[0];
    roles[mrWhiteIndex] = {
      role: 'Mr. White',
      word: '', // Mr. White ne connaît pas le mot
    };
  }

  // Attribuer les rôles d'Innocent aux joueurs restants
  availableIndices.forEach((index) => {
    roles[index] = {
      role: 'Innocent',
      word: randomPair.innocent,
    };
  });

  return { roles, innocentWord: randomPair.innocent }; // Retourner aussi le mot des Innocents
};