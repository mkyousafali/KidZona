// Google Cloud TTS Configuration
const GOOGLE_CLOUD_TTS_API = 'https://texttospeech.googleapis.com/v1/text:synthesize';
const GOOGLE_CLOUD_API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY || '';

// Voice mapping for Google Cloud TTS
const GOOGLE_VOICES: Record<string, Record<string, string>> = {
  en: {
    female: 'en-US-Neural2-A',
    male: 'en-US-Neural2-C',
    girl: 'en-US-Neural2-F',      // Different female voice
    boy: 'en-US-Neural2-D'        // Different male voice
  },
  hi: {
    female: 'hi-IN-Neural2-A',
    male: 'hi-IN-Neural2-B',
    girl: 'hi-IN-Neural2-A',
    boy: 'hi-IN-Neural2-B'
  },
  ml: {
    female: 'ml-IN-Standard-A',
    male: 'ml-IN-Standard-B',
    girl: 'ml-IN-Standard-A',
    boy: 'ml-IN-Standard-B'
  },
  ar: {
    female: 'ar-XA-Standard-A',
    male: 'ar-XA-Standard-B',
    girl: 'ar-XA-Standard-A',
    boy: 'ar-XA-Standard-B'
  }
};

export function playSound(soundName: string): void {
  try {
    const audio = new Audio(`/audio/${soundName}.mp3`);
    audio.play().catch((error) => console.warn('Failed to play sound:', error));
  } catch (error) {
    console.warn('Sound playback error:', error);
  }
}

export function playSfx(type: 'success' | 'error' | 'click'): void {
  const soundMap: Record<string, string> = {
    success: 'success',
    error: 'error',
    click: 'click'
  };

  playSound(soundMap[type]);
}
export async function speak(text: string, language: string = 'en', voiceType: string = 'female'): Promise<void> {
  // For English, always use Web Speech API
  if (language === 'en') {
    speakWithWebSpeechAPI(text, language, voiceType);
    return;
  }

  // For other languages, try Google Cloud TTS first if API key is available
  if (GOOGLE_CLOUD_API_KEY) {
    try {
      await speakWithGoogleCloud(text, language, voiceType);
      return;
    } catch (error) {
      console.warn('Google Cloud TTS failed, falling back to Web Speech API:', error);
    }
  }

  // Fallback to Web Speech API
  speakWithWebSpeechAPI(text, language, voiceType);
}

async function speakWithGoogleCloud(text: string, language: string, voiceType: string): Promise<void> {
  const voiceId = GOOGLE_VOICES[language]?.[voiceType] || GOOGLE_VOICES['en']['female'];
  
  // Adjust pitch and rate based on voice type for more distinct sounds
  const voiceSettings: Record<string, { pitch: number; speakingRate: number }> = {
    female: { pitch: 0, speakingRate: 0.95 },      // Adult female, normal speed
    male: { pitch: -8, speakingRate: 0.9 },        // Lower pitch, slightly slower
    girl: { pitch: 6, speakingRate: 1.1 },         // Higher pitch (child-like), faster
    boy: { pitch: -4, speakingRate: 1.0 }          // Slightly lower pitch, normal speed
  };

  const settings = voiceSettings[voiceType] || voiceSettings['female'];
  
  const payload = {
    input: { text },
    voice: {
      languageCode: language === 'ar' ? 'ar-XA' : (language === 'en' ? 'en-US' : `${language}-IN`),
      name: voiceId
    },
    audioConfig: {
      audioEncoding: 'MP3',
      pitch: settings.pitch,
      speakingRate: settings.speakingRate
    }
  };

  const response = await fetch(`${GOOGLE_CLOUD_TTS_API}?key=${GOOGLE_CLOUD_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Google Cloud TTS error: ${response.status}`);
  }

  const data = await response.json();
  const audioContent = data.audioContent;

  // Play the audio
  const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
  await audio.play();
  
  console.log(`Playing Google Cloud TTS: ${voiceId} (${voiceType}) for language: ${language}`);
}

function speakWithWebSpeechAPI(text: string, language: string, voiceType: string): void {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Map language codes to BCP 47 language tags
  const languageMap: Record<string, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    ml: 'ml-IN',
    ar: 'ar-SA'
  };

  const targetLang = languageMap[language] || 'en-US';
  utterance.lang = targetLang;

  // Configure voice based on voice type with better distinction
  const voiceConfig: Record<string, { pitch: number; rate: number }> = {
    female: { pitch: 1.3, rate: 0.85 },      // Higher pitch, slower - adult female
    male: { pitch: 0.6, rate: 0.85 },        // Much lower pitch, slower - adult male
    girl: { pitch: 1.6, rate: 1.1 },         // Highest pitch, faster - child girl
    boy: { pitch: 1.2, rate: 1.1 }           // Higher pitch than male, faster - child boy
  };

  const config = voiceConfig[voiceType] || voiceConfig['female'];
  
  utterance.pitch = config.pitch;
  utterance.rate = config.rate;
  utterance.volume = 1.0;
  
  console.log(`Web Speech API - ${voiceType}: pitch=${config.pitch}, rate=${config.rate}`);

  // Load available voices - may need a small delay on some browsers
  let voices = window.speechSynthesis.getVoices();
  
  // If voices not loaded yet, wait for them to load
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      selectAndSetVoice(utterance, voices, targetLang, language, voiceType);
      window.speechSynthesis.speak(utterance);
    };
    console.log('Voices loading, waiting for onvoiceschanged event...');
  } else {
    selectAndSetVoice(utterance, voices, targetLang, language, voiceType);
    window.speechSynthesis.speak(utterance);
  }
}

function selectAndSetVoice(utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[], targetLang: string, langCode: string, voiceType: string): void {
  const selectedVoice = selectVoiceByLanguage(voices, targetLang, langCode, voiceType);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    console.log(`Using voice: ${selectedVoice.name} for language: ${langCode}`);
  } else {
    console.warn(`No voice found for ${langCode}, using system default`);
  }
}

function selectVoiceByLanguage(voices: SpeechSynthesisVoice[], fullLang: string, langCode: string, voiceType: string): SpeechSynthesisVoice | null {
  const langPrefix = fullLang.split('-')[0]; // e.g., 'en', 'hi', 'ml', 'ar'
  
  // First, try to find exact language match
  let matchingVoices = voices.filter(v => v.lang.startsWith(langPrefix));
  
  // If no exact match, try full language code
  if (matchingVoices.length === 0) {
    matchingVoices = voices.filter(v => v.lang.toLowerCase() === fullLang.toLowerCase());
  }
  
  // If still no match, try related language families
  if (matchingVoices.length === 0) {
    const languageGroups: Record<string, string[]> = {
      'hi': ['en', 'ur'], // Hindi - try English or Urdu
      'ml': ['en', 'ta'], // Malayalam - try English or Tamil
      'ar': ['en', 'fr'], // Arabic - try English or French
      'en': ['en'] // English
    };
    
    const relatedLangs = languageGroups[langPrefix] || ['en'];
    for (const relLang of relatedLangs) {
      matchingVoices = voices.filter(v => v.lang.startsWith(relLang));
      if (matchingVoices.length > 0) {
        console.warn(`No native voice for ${langPrefix}, using ${relLang} as fallback`);
        break;
      }
    }
  }
  
  // If still no match, just use any available voice
  if (matchingVoices.length === 0) {
    console.warn(`No voice found for ${langPrefix}, using first available voice`);
    return voices[0];
  }

  // Detailed voice type matching
  if (voiceType === 'female') {
    // Look for adult female voices
    const femaleKeywords = ['female', 'woman', 'lady', 'female voice', 'woman voice'];
    for (const keyword of femaleKeywords) {
      const voice = matchingVoices.find(v => v.name.toLowerCase().includes(keyword.toLowerCase()));
      if (voice) {
        console.log(`Selected FEMALE voice: "${voice.name}"`);
        return voice;
      }
    }
  } else if (voiceType === 'male') {
    // Look for adult male voices
    const maleKeywords = ['male', 'man', 'gentleman', 'male voice', 'man voice'];
    for (const keyword of maleKeywords) {
      const voice = matchingVoices.find(v => v.name.toLowerCase().includes(keyword.toLowerCase()));
      if (voice) {
        console.log(`Selected MALE voice: "${voice.name}"`);
        return voice;
      }
    }
  } else if (voiceType === 'girl') {
    // Look for child/girl voices
    const girlKeywords = ['girl', 'child', 'kid', 'young female', 'little girl'];
    for (const keyword of girlKeywords) {
      const voice = matchingVoices.find(v => v.name.toLowerCase().includes(keyword.toLowerCase()));
      if (voice) {
        console.log(`Selected GIRL voice: "${voice.name}"`);
        return voice;
      }
    }
    // Fallback to female if no girl voice found
    const femaleVoice = matchingVoices.find(v => v.name.toLowerCase().includes('female'));
    if (femaleVoice) {
      console.log(`Selected GIRL voice (fallback to female): "${femaleVoice.name}"`);
      return femaleVoice;
    }
  } else if (voiceType === 'boy') {
    // Look for child/boy voices
    const boyKeywords = ['boy', 'child', 'kid', 'young male', 'little boy'];
    for (const keyword of boyKeywords) {
      const voice = matchingVoices.find(v => v.name.toLowerCase().includes(keyword.toLowerCase()));
      if (voice) {
        console.log(`Selected BOY voice: "${voice.name}"`);
        return voice;
      }
    }
    // Fallback to male if no boy voice found
    const maleVoice = matchingVoices.find(v => v.name.toLowerCase().includes('male'));
    if (maleVoice) {
      console.log(`Selected BOY voice (fallback to male): "${maleVoice.name}"`);
      return maleVoice;
    }
  }

  // Last resort: return first available voice with logging
  console.log(`No specific voice match for ${voiceType}, using default: "${matchingVoices[0].name}"`);
  return matchingVoices[0];
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}