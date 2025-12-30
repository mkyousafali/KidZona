<script lang="ts">
  import { profileStore, updateProfile } from '$lib/stores/profile.store';
  import { languageStore } from '$lib/stores/language.store';
  import { ROUTES } from '$lib/config/routes';
  import { MODULES } from '$lib/config/app';
  import { getAgeBand } from '$lib/utils/age';
  import { speak, stopSpeaking } from '$lib/utils/sound';
  import { t } from '$lib/i18n';
  import { putInStore } from '$lib/db/indexeddb';

  let profile = null;
  let ageBand = null;
  let isSpeaking = false;
  let selectedVoice = 'female';
  let showVoiceMenu = false;
  let showLanguageMenu = false;
  let currentLanguage = 'en';

  const voiceOptions = [
    { id: 'female', label: 'Female', emoji: '👩' },
    { id: 'male', label: 'Male', emoji: '👨' },
    { id: 'girl', label: 'Girl', emoji: '👧' },
    { id: 'boy', label: 'Boy', emoji: '👦' }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  // Subscribe to language changes
  const unsubscribeLanguage = languageStore.subscribe((value) => {
    currentLanguage = value;
    console.log('Language store updated to:', value);
  });

  profileStore.subscribe((value) => {
    profile = value;
  });

  $: if (profile) {
    ageBand = getAgeBand(profile.birthDate);
  }

  $: currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  const moduleInfo = {
    computer: { icon: '💻', color: '#ff6b6b' },
    spelling: { icon: '🔤', color: '#4ecdc4' },
    languages: { icon: '🌍', color: '#ffd43b' },
    math: { icon: '🔢', color: '#51cf66' },
    science: { icon: '🧪', color: '#a78bfa' },
    animals: { icon: '🐾', color: '#f472b6' },
    sounds: { icon: '🎵', color: '#06b6d4' }
  };

  function getNextActivity() {
    // Simple logic: return first module
    return ROUTES.module('computer');
  }

  function playInstructions() {
    if (isSpeaking) {
      stopSpeaking();
      isSpeaking = false;
      return;
    }

    isSpeaking = true;
    
    // Use language-specific instructions
    const greetings = {
      en: `Hi ${profile?.name}! Welcome to KidZona. Choose a learning module to start your journey. You can choose from information technology, spelling, languages, math, science, animals, or sounds. Click on any module to begin learning!`,
      hi: `नमस्ते ${profile?.name}! किडजोना में आपका स्वागत है। सीखना शुरू करने के लिए एक शिक्षण मॉड्यूल चुनें। आप सूचना प्रौद्योगिकी, स्पेलिंग, भाषाएं, गणित, विज्ञान, जानवर, या ध्वनियों में से चुन सकते हैं।`,
      ml: `കിഡ്‌സോണയിലേക്ക് സ്വാഗതം. വിദ്യാഭ്യാസ മൊഡ്യൂളുകളിൽ ഒന്നെണ്ണം തിരഞ്ഞെടുത്ത് നിങ്ങളുടെ യാത്ര ആരംഭിക്കുക`,
      ar: `مرحبا ${profile?.name}! أهلا وسهلا بك في KidZona. اختر وحدة تعليمية لبدء رحلتك. يمكنك الاختيار من بين تكنولوجيا المعلومات والتهجئة واللغات والرياضيات والعلوم والحيوانات أو الأصوات.`
    };

    const instructionText = greetings[currentLanguage] || greetings.en;
    speak(instructionText, currentLanguage, selectedVoice).catch(err => {
      console.error('Speech error:', err);
      isSpeaking = false;
    });

    // Reset after speech ends (approximate timing)
    setTimeout(() => {
      isSpeaking = false;
    }, 8000);
  }
  function selectVoice(voiceId) {
    selectedVoice = voiceId;
    showVoiceMenu = false;
  }

  async function switchLanguage(lang) {
    console.log('Switching language to:', lang);
    
    // Update language store directly
    languageStore.set(lang);
    currentLanguage = lang;
    
    // Update profile with new language and save to database
    if (profile) {
      try {
        const updatedProfile = {
          ...profile,
          language: lang,
          updatedAt: new Date().toISOString()
        };
        updateProfile({ language: lang });
        await putInStore('profile', updatedProfile);
        console.log(`Profile and database updated with language: ${lang}`);
      } catch (error) {
        console.error('Failed to save language preference:', error);
      }
    }
    
    showLanguageMenu = false;
  }
</script>

{#if profile}
  <div class="home-container">
    <div class="header">
      <div class="language-switcher">
        <button 
          class="language-toggle" 
          on:click={() => showLanguageMenu = !showLanguageMenu}
          type="button"
        >
          <span class="current-name">{currentLang.name}</span>
          <span class="arrow">{showLanguageMenu ? '▲' : '▼'}</span>
        </button>
        
        {#if showLanguageMenu}
          <div class="language-menu">
            {#each languages as lang}
              <button
                type="button"
                class="menu-item {currentLanguage === lang.code ? 'active' : ''}"
                on:click={() => switchLanguage(lang.code)}
              >
                <span class="menu-flag">{lang.flag}</span>
                <span class="menu-name">{lang.name}</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="greeting">
      <div class="avatar">{profile.avatar}</div>
      <h1>{t('home', currentLanguage)} {profile.name}! 👋</h1>
      <p>{t('language', currentLanguage)}: {ageBand?.name}</p>
    </div>

    <div class="continue-section">
      <div class="voice-controls">
        <button class="voice-menu-button" on:click={() => showVoiceMenu = !showVoiceMenu} title="Choose voice">
          {voiceOptions.find(v => v.id === selectedVoice)?.emoji || '👩'}
        </button>
        {#if showVoiceMenu}
          <div class="voice-menu">
            {#each voiceOptions as voice}
              <button
                class="voice-option {selectedVoice === voice.id ? 'active' : ''}"
                on:click={() => selectVoice(voice.id)}
                title={voice.label}
              >
                {voice.emoji} {voice.label}
              </button>
            {/each}
          </div>
        {/if}
      </div>
      <button class="voice-button" on:click={playInstructions} title="Play instructions">
        <span class="icon">{isSpeaking ? '🔊' : '🔉'}</span>
      </button>
      <a href={getNextActivity()} class="continue-button">
        <span class="icon">▶️</span>
        <span>{t('continue', currentLanguage)} {t('language', currentLanguage)}</span>
      </a>
    </div>

    <div class="modules-grid">
      {#each MODULES as module}
        <a href={ROUTES.module(module)} class="module-tile" style="--tile-color: {moduleInfo[module].color}">
          <div class="tile-icon">{moduleInfo[module].icon}</div>
          <div class="tile-name">{t(module, currentLanguage)}</div>
        </a>
      {/each}
    </div>

    <div class="bottom-nav">
      <a href={ROUTES.rewards} class="nav-item">
        <span class="icon">🏆</span>
        <span>{t('rewards', currentLanguage)}</span>
      </a>
    </div>
  </div>
{:else}
  <p>Loading...</p>
{/if}

<style>
  .home-container {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    padding-bottom: calc(var(--spacing-xl) * 3);
  }

  .greeting {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }

  .avatar {
    font-size: 4rem;
    animation: bounce 1s ease-in-out;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  h1 {
    font-size: var(--font-size-2xl);
    color: var(--text-primary);
  }

  .greeting p {
    color: var(--text-secondary);
    font-size: var(--font-size-lg);
  }

  .header {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-lg);
  }

  .language-switcher {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .language-toggle {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-md);
    background: white;
    cursor: pointer;
    transition: all var(--transition-base);
    white-space: nowrap;
    font-size: var(--font-size-base);
  }

  .language-toggle:hover {
    border-color: var(--primary-color);
    background-color: rgba(255, 107, 107, 0.1);
  }

  .current-name {
    font-size: var(--font-size-sm);
    font-weight: 600;
  }

  .arrow {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .language-menu {
    position: absolute;
    top: calc(100% + var(--spacing-xs));
    right: 0;
    background: white;
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-md);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    z-index: 100;
    min-width: 150px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    width: 100%;
    border: none;
    background: white;
    cursor: pointer;
    transition: background-color var(--transition-base);
  }

  .menu-item:hover {
    background-color: rgba(255, 107, 107, 0.1);
  }

  .menu-item.active {
    background-color: rgba(255, 107, 107, 0.2);
    font-weight: 600;
  }

  .menu-flag {
    font-size: 1.25rem;
  }

  .menu-name {
    font-size: var(--font-size-sm);
  }

  .continue-section {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
    align-items: center;
  }

  .voice-controls {
    position: relative;
    display: flex;
    align-items: center;
  }

  .voice-menu-button {
    padding: var(--spacing-lg);
    background-color: var(--surface-color);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    font-size: 1.5rem;
    cursor: pointer;
    transition: all var(--transition-base);
    min-width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .voice-menu-button:hover {
    border-color: var(--primary-color);
    background-color: rgba(255, 107, 107, 0.1);
  }

  .voice-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    background: white;
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-md);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    z-index: 100;
    min-width: 150px;
  }

  .voice-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    width: 100%;
    border: none;
    background: white;
    cursor: pointer;
    transition: background-color var(--transition-base);
    font-size: var(--font-size-base);
    justify-content: flex-start;
  }

  .voice-option:hover {
    background-color: rgba(255, 107, 107, 0.1);
  }

  .voice-option.active {
    background-color: rgba(255, 107, 107, 0.2);
    font-weight: 600;
  }

  .voice-button {
    padding: var(--spacing-lg);
    background-color: var(--secondary-color);
    border: none;
    border-radius: var(--border-radius-lg);
    font-size: 1.5rem;
    cursor: pointer;
    transition: all var(--transition-base);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 60px;
    height: 60px;
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  }

  .voice-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
  }

  .voice-button:active {
    transform: translateY(0);
  }

  .continue-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg) var(--spacing-xl);
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border-radius: var(--border-radius-lg);
    font-size: var(--font-size-lg);
    font-weight: 600;
    text-decoration: none;
    transition: all var(--transition-base);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    border: none;
  }

  .continue-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
  }

  .modules-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }

  .module-tile {
    background-color: var(--surface-color);
    border: 2px solid var(--tile-color, var(--primary-color));
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
    text-decoration: none;
    transition: all var(--transition-base);
    cursor: pointer;
  }

  .module-tile:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    background-color: rgba(var(--tile-color), 0.05);
  }

  .tile-icon {
    font-size: 2.5rem;
  }

  .tile-name {
    font-weight: 600;
    text-align: center;
    font-size: var(--font-size-sm);
    color: var(--text-primary);
  }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--surface-color);
    border-top: 2px solid var(--border-color);
    display: flex;
    justify-content: center;
    padding: var(--spacing-md);
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--text-primary);
    text-decoration: none;
    font-size: var(--font-size-sm);
    padding: var(--spacing-md);
    transition: color var(--transition-base);
  }

  .nav-item:hover {
    color: var(--primary-color);
  }

  .nav-item .icon {
    font-size: var(--font-size-xl);
  }

  @media (max-width: 480px) {
    .home-container {
      padding: var(--spacing-md);
    }

    .avatar {
      font-size: 3rem;
    }

    h1 {
      font-size: var(--font-size-xl);
    }

    .modules-grid {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--spacing-sm);
    }

    .module-tile {
      padding: var(--spacing-md);
    }

    .tile-icon {
      font-size: 2rem;
    }
  }
</style>
