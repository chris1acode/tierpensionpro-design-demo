<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LogoIcon from './LogoIcon.vue'
</script>

<template>
  <div class="intro-page">
    <div class="intro-card">
      <div class="intro-logo">
        <LogoIcon :size="64" />
        <h1>Tierpension <span>Pro</span></h1>
      </div>

      <div class="intro-content">
        <p class="eyebrow">Design Demo</p>
        <h2>Ein erster Blick auf Tierpension Pro</h2>
        <p>
          Wir entwickeln eine digitale Lösung, um den Alltag in Tierpensionen einfacher zu gestalten. 
          Ihr Feedback aus der Praxis wäre sehr wertvoll. Schauen Sie sich die Demo an! Was wirkt sinnvoll? Was würden Sie anders machen?
        </p>
        <p class="hint">
          <strong>Hinweis:</strong> Für das beste Erlebnis testen Sie die Demo bitte im <strong>Desktop-Browser</strong>. Für mobile Nutzung ist später eine App geplant.
        </p>
      </div>

      <div class="intro-actions">
        <RouterLink to="/dashboard" class="primary-button large-button">
          Demo ansehen
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro-page {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 20px;
  background: var(--bg);
}

.intro-card {
  width: min(540px, 100%);
  padding: 40px;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(36, 33, 31, 0.08);
}

.intro-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  color: var(--primary);
}


.intro-logo h1 {
  font: 700 28px Manrope, sans-serif;
  margin: 0;
  color: var(--text);
}

.intro-logo h1 span {
  color: var(--primary);
}

.intro-content {
  margin-bottom: 24px;
  text-align: left;
}

.intro-content h2 {
  font: 700 22px Manrope, sans-serif;
  margin: 8px 0 16px;
  text-align: center;
}

.intro-content p {
  margin: 0 0 12px;
  color: var(--muted);
  line-height: 1.5;
}

.intro-content .hint {
  font-size: 0.9em;
  padding: 12px;
  background: var(--bg);
  border-radius: 8px;
  border-left: 4px solid var(--primary);
  margin-top: 16px;
}

.intro-content .eyebrow {
  text-align: center;
  margin-bottom: 4px;
}

.intro-actions {
  display: flex;
  justify-content: center;
}

.large-button {
  min-height: 48px;
  padding: 0 32px;
  font-size: 16px;
  text-decoration: none;
}

@media (max-width: 480px) {
  .intro-card {
    padding: 32px 20px;
  }
}
</style>
