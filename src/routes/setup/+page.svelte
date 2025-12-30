<script lang="ts">
  import { createProfile } from '$lib/stores/profile.store';
  import { languageStore } from '$lib/stores/language.store';
  import { putInStore } from '$lib/db/indexeddb';
  import { goto } from '$app/navigation';
  import { ROUTES } from '$lib/config/routes';
  import { DEFAULT_LANGUAGE } from '$lib/config/app';
  import { t } from '$lib/i18n';

  let name = '';
  let birthDate = '';
  let avatar = '😊';
  let loading = false;
  let showLanguageMenu = false;
  let displayDate = '';

  function formatDateForInput(ddmmyyyy) {
    // Convert dd-mm-yyyy to yyyy-mm-dd for internal use
    if (!ddmmyyyy || ddmmyyyy.length < 10) return '';
    const [day, month, year] = ddmmyyyy.split('-');
    return `${year}-${month}-${day}`;
  }

  function formatDateForDisplay(yyyymmdd) {
    // Convert yyyy-mm-dd to dd-mm-yyyy for display
    if (!yyyymmdd || yyyymmdd.length < 10) return '';
    const [year, month, day] = yyyymmdd.split('-');
    return `${day}-${month}-${year}`;
  }

  function handleDateInput(e) {
    const input = e.target;
    let value = input.value.trim();
    
    // Auto-format as user types: add hyphens after 2 and 5 characters
    if (value.length === 2 && !value.includes('-')) {
      value = value + '-';
    } else if (value.length === 5 && (value.match(/-/g) || []).length === 1) {
      value = value + '-';
    }
    
    displayDate = value;
    // Convert dd-mm-yyyy to yyyy-mm-dd
    if (value.length === 10 && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
      birthDate = formatDateForInput(displayDate);
    }
  }

  const avatarOptions = ['😊', '😄', '😎', '🤗', '😍', '🎉', '🌟', '💫'];
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  function switchInterfaceLanguage(lang: string): void {
    languageStore.set(lang);
    showLanguageMenu = false;
  }

  $: currentLang = languages.find(l => l.code === $languageStore) || languages[0];

  async function handleSubmit() {
    if (!name.trim() || !displayDate) {
      alert(t('fill_all_fields', $languageStore));
      return;
    }

    // Validate date format
    if (!/^\d{2}-\d{2}-\d{4}$/.test(displayDate)) {
      alert(t('invalid_date_format', $languageStore) || 'Invalid date format. Please use DD-MM-YYYY');
      return;
    }

    // Ensure birthDate is properly formatted
    if (!birthDate) {
      birthDate = formatDateForInput(displayDate);
    }

    loading = true;

    try {
      const profile = createProfile(name, birthDate, avatar, $languageStore);
      await putInStore('profile', profile);
      goto(ROUTES.home);
    } catch (error) {
      console.error('Failed to create profile:', error);
      alert(t('failed_create_profile', $languageStore));
    } finally {
      loading = false;
    }
  }
</script>

<div class="setup-container">
  <div class="header">
    <h1>{t('create_profile', $languageStore)}</h1>
  </div>
  
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
            class="menu-item {$languageStore === lang.code ? 'active' : ''}"
            on:click={() => switchInterfaceLanguage(lang.code)}
          >
            <span class="menu-name">{lang.name}</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="name">{t('whats_your_name', $languageStore)}</label>
      <input
        id="name"
        type="text"
        bind:value={name}
        placeholder={t('enter_name', $languageStore)}
        disabled={loading}
      />
    </div>

    <div class="form-group">
      <label for="birthdate">{t('when_born', $languageStore)}</label>
      <input
        id="birthdate"
        type="text"
        inputmode="numeric"
        bind:value={displayDate}
        placeholder="DD-MM-YYYY"
        maxlength="10"
        on:input={handleDateInput}
        disabled={loading}
      />
    </div>

    <div class="form-group">
      <label>{t('choose_avatar', $languageStore)}</label>
      <div class="avatar-grid">
        {#each avatarOptions as option}
          <button
            type="button"
            class="avatar-button {avatar === option ? 'selected' : ''}"
            on:click={() => (avatar = option)}
            disabled={loading}
          >
            {option}
          </button>
        {/each}
      </div>
    </div>

    <button type="submit" class="primary-button" disabled={loading}>
      {loading ? t('creating', $languageStore) : t('get_started', $languageStore)}
    </button>
  </form>
</div>

<style>
  .setup-container {
    max-width: 500px;
    margin: 0 auto;
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: var(--spacing-md);
  }

  h1 {
    font-size: var(--font-size-2xl);
    color: var(--primary-color);
    margin: 0;
    text-align: center;
  }

  .language-switcher {
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-lg);
    flex-shrink: 0;
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
  }

  .language-toggle:hover {
    border-color: var(--primary-color);
  }

  .current-flag {
    font-size: 1.5rem;
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

  form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  label {
    font-weight: 600;
    font-size: var(--font-size-lg);
  }

  input {
    padding: var(--spacing-md);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    transition: border-color var(--transition-base);
  }

  input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-md);
  }

  .avatar-button {
    font-size: 2rem;
    padding: var(--spacing-lg);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .avatar-button:hover {
    transform: scale(1.1);
  }

  .avatar-button.selected {
    border-color: var(--primary-color);
    background-color: rgba(255, 107, 107, 0.1);
  }

  .language-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }

  .language-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    background: white;
  }

  .language-button:hover {
    transform: scale(1.05);
    border-color: var(--primary-color);
  }

  .language-button.selected {
    border-color: var(--primary-color);
    background-color: rgba(255, 107, 107, 0.1);
  }

  .flag {
    font-size: 2rem;
  }

  .lang-name {
    font-size: var(--font-size-base);
    font-weight: 600;
  }

  .primary-button {
    padding: var(--spacing-lg);
    background-color: var(--primary-color);
    color: white;
    font-size: var(--font-size-lg);
    font-weight: 600;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .primary-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  }

  .primary-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    .setup-container {
      padding: var(--spacing-lg);
    }

    .avatar-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
