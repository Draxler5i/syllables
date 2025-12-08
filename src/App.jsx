import React, { useState, useEffect } from 'react';
import { Star, Trophy, Volume2, Check, RefreshCw, Sparkles } from 'lucide-react';

const App = () => {
  const [level, setLevel] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedSyllables, setSelectedSyllables] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [useMayus, setUseMayus] = useState(true);
  const [attempts, setAttempts] = useState(0);

  const wordsDatabase = {
    1: [
      { word: 'sol', syllables: ['sol'], image: '☀️' },
      { word: 'mar', syllables: ['mar'], image: '🌊' },
      { word: 'pan', syllables: ['pan'], image: '🍞' },
      { word: 'luz', syllables: ['luz'], image: '💡' },
      { word: 'flor', syllables: ['flor'], image: '🌸' },
      { word: 'pez', syllables: ['pez'], image: '🐟' }
    ],
    2: [
      { word: 'casa', syllables: ['ca', 'sa'], image: '🏠' },
      { word: 'luna', syllables: ['lu', 'na'], image: '🌙' },
      { word: 'gato', syllables: ['ga', 'to'], image: '🐱' },
      { word: 'perro', syllables: ['pe', 'rro'], image: '🐕' },
      { word: 'niño', syllables: ['ni', 'ño'], image: '👦' },
      { word: 'sopa', syllables: ['so', 'pa'], image: '🍲' },
      { word: 'mano', syllables: ['ma', 'no'], image: '✋🏻' }
    ],
    3: [
      { word: 'pelota', syllables: ['pe', 'lo', 'ta'], image: '⚽' },
      { word: 'camisa', syllables: ['ca', 'mi', 'sa'], image: '👕' },
      { word: 'zapato', syllables: ['za', 'pa', 'to'], image: '👟' },
      { word: 'ventana', syllables: ['ven', 'ta', 'na'], image: '🪟' },
      { word: 'helado', syllables: ['he', 'la', 'do'], image: '🍦' },
      { word: 'tomate', syllables: ['to', 'ma', 'te'], image: '🍅' },
      { word: 'paloma', syllables: ['pa', 'lo', 'ma'], image: '🕊️' },
      { word: 'banana', syllables: ['ba', 'na', 'na'], image: '🍌' }
    ],
    4: [
      { word: 'mariposa', syllables: ['ma', 'ri', 'po', 'sa'], image: '🦋' },
      { word: 'elefante', syllables: ['e', 'le', 'fan', 'te'], image: '🐘' },
      { word: 'dinosaurio', syllables: ['di', 'no', 'sau', 'rio'], image: '🦕' },
      { word: 'chocol ate', syllables: ['cho', 'co', 'la', 'te'], image: '🍫' },
      { word: 'caramelo', syllables: ['ca', 'ra', 'me', 'lo'], image: '🍬' },
      { word: 'biblioteca', syllables: ['bi', 'blio', 'te', 'ca'], image: '📚' }
    ]
  };

  const currentWord = wordsDatabase[level][currentWordIndex];
  
  const getShuffledSyllables = () => {
    const correctSyllables = [...currentWord.syllables];
    const otherWords = wordsDatabase[level].filter((_, idx) => idx !== currentWordIndex);
    const distractorSyllables = [];
    
    otherWords.slice(0, 3).forEach(w => {
      distractorSyllables.push(...w.syllables.slice(0, 2));
    });
    
    const limitedDistractors = distractorSyllables.slice(0, Math.max(4, 8 - correctSyllables.length));
    
    const allSyllables = [...correctSyllables, ...limitedDistractors];
    return allSyllables.sort(() => Math.random() - 0.5);
  };

  const [availableSyllables, setAvailableSyllables] = useState(getShuffledSyllables());

  useEffect(() => {
    setAvailableSyllables(getShuffledSyllables());
    setSelectedSyllables([]);
    setShowSuccess(false);
  }, [currentWordIndex, level]);

  const formatText = (text) => {
    return useMayus ? text.toUpperCase() : text.toLowerCase();
  };

  const handleSyllableClick = (syllable, index) => {
    setSelectedSyllables([...selectedSyllables, syllable]);
    setAvailableSyllables(availableSyllables.filter((_, i) => i !== index));
  };

  const handleRemoveSyllable = (index) => {
    const syllable = selectedSyllables[index];
    setAvailableSyllables([...availableSyllables, syllable]);
    setSelectedSyllables(selectedSyllables.filter((_, i) => i !== index));
  };

  const checkWord = () => {
    const formedWord = selectedSyllables.join('');
    const correctWord = currentWord.word.replace(/\s/g, '');
    
    setAttempts(attempts + 1);
    
    if (formedWord.toLowerCase() === correctWord.toLowerCase()) {
      setShowSuccess(true);
      setScore(score + (level * 10));
      setTimeout(() => {
        nextWord();
      }, 2000);
    } else {
      setSelectedSyllables([]);
      setAvailableSyllables(getShuffledSyllables());
    }
  };

  const nextWord = () => {
    if (currentWordIndex < wordsDatabase[level].length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      if (level < 4) {
        setLevel(level + 1);
        setCurrentWordIndex(0);
      } else {
        setCurrentWordIndex(0);
      }
    }
    setShowSuccess(false);
  };

  const resetWord = () => {
    setSelectedSyllables([]);
    setAvailableSyllables(getShuffledSyllables());
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-500" />
              <h1 className="text-3xl font-bold text-purple-600">¡Aprende a Leer!</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setUseMayus(!useMayus)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-bold"
              >
                {useMayus ? 'ABC' : 'abc'}
              </button>
              
              <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <span className="font-bold text-yellow-800">{score}</span>
              </div>
            </div>
          </div>
          
          {/* Level Selector */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {[1, 2, 3, 4].map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLevel(l);
                  setCurrentWordIndex(0);
                  setScore(0);
                }}
                className={`px-6 py-3 rounded-lg font-bold transition ${
                  level === l
                    ? 'bg-purple-600 text-white scale-110'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Nivel {l}
              </button>
            ))}
          </div>
        </div>

        {/* Main Game Area */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Image and Sound */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">{currentWord.image}</div>
            <button
              onClick={speakWord}
              className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition flex items-center gap-2 mx-auto text-lg font-bold"
            >
              <Volume2 className="w-6 h-6" />
              Escuchar
            </button>
          </div>

          {/* Word Building Area */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
              Forma la palabra:
            </h2>
            <div className="min-h-24 bg-gradient-to-r from-blue-50 to-purple-50 border-4 border-dashed border-purple-300 rounded-xl p-4 flex flex-wrap gap-3 justify-center items-center">
              {selectedSyllables.length === 0 ? (
                <p className="text-gray-400 text-lg">Toca las sílabas para formar la palabra</p>
              ) : (
                selectedSyllables.map((syllable, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRemoveSyllable(idx)}
                    className="bg-purple-500 text-white px-6 py-4 rounded-xl text-3xl font-bold hover:bg-purple-600 transition transform hover:scale-110 shadow-lg"
                  >
                    {formatText(syllable)}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Available Syllables */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-center mb-4 text-gray-700">
              Sílabas disponibles:
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {availableSyllables.map((syllable, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSyllableClick(syllable, idx)}
                  className="bg-blue-500 text-white px-6 py-4 rounded-xl text-3xl font-bold hover:bg-blue-600 transition transform hover:scale-110 shadow-lg"
                >
                  {formatText(syllable)}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={resetWord}
              className="bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition flex items-center gap-2 text-xl font-bold shadow-lg"
            >
              <RefreshCw className="w-6 h-6" />
              Reiniciar
            </button>
            
            <button
              onClick={checkWord}
              disabled={selectedSyllables.length === 0}
              className="bg-green-500 text-white px-8 py-4 rounded-xl hover:bg-green-600 transition flex items-center gap-2 text-xl font-bold shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Check className="w-6 h-6" />
              Verificar
            </button>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-6 bg-green-100 border-4 border-green-500 rounded-xl p-6 text-center animate-bounce">
              <div className="text-6xl mb-2">🎉</div>
              <p className="text-3xl font-bold text-green-700">¡Muy bien!</p>
              <p className="text-xl text-green-600 mt-2">+{level * 10} puntos</p>
            </div>
          )}

          {/* Progress */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 font-semibold">
              Palabra {currentWordIndex + 1} de {wordsDatabase[level].length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-purple-600 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentWordIndex + 1) / wordsDatabase[level].length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mt-6">
          <h3 className="text-xl font-bold text-purple-600 mb-3">💡 Consejos:</h3>
          <ul className="text-gray-700 space-y-2">
            <li>• Presiona "Escuchar" para oír la palabra</li>
            <li>• Toca las sílabas en orden para formar la palabra</li>
            <li>• Si te equivocas, toca una sílaba seleccionada para quitarla</li>
            <li>• Usa el botón ABC/abc para cambiar entre mayúsculas y minúsculas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
