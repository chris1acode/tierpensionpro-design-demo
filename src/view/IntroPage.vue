<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppButton from '../components/AppButton.vue'
import LogoIcon from '../components/LogoIcon.vue'
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-app-bg p-5">
    <div class="w-full max-w-[540px] rounded-[20px] border border-app-border bg-app-surface px-5 py-8 text-center shadow-[0_20px_50px_rgba(36,33,31,0.08)] min-[480px]:p-10">
      <div class="mb-6 flex flex-col items-center gap-4 text-primary">
        <LogoIcon :size="64" />
        <h1 class="m-0 text-[28px] font-bold text-app-text [font-family:'Manrope',sans-serif]">Tierpension <span class="text-primary">Pro</span></h1>
      </div>

      <div class="mb-6 text-left">
        <p class="mb-1 text-center text-[13px] font-bold uppercase tracking-[0.1em] text-[#a34b1b]">Design Demo</p>
        <h2 class="mb-4 mt-2 text-center text-[22px] font-bold [font-family:'Manrope',sans-serif]">Ein erster Blick auf Tierpension Pro</h2>
        <p class="mb-3 leading-[1.5] text-app-muted">
          Wir entwickeln eine digitale Lösung, um den Alltag in Tierpensionen einfacher zu gestalten.
          Ihr Feedback aus der Praxis wäre sehr wertvoll. Schauen Sie sich die Demo an! Was wirkt sinnvoll? Was würden Sie anders machen?
        </p>
        <p class="mb-3 mt-4 rounded-lg border-l-4 border-primary bg-app-bg p-3 text-[0.9em] leading-[1.5] text-app-muted">
          <strong>Hinweis:</strong> Für das beste Erlebnis testen Sie die Demo bitte im <strong>Desktop-Browser</strong>. Für mobile Nutzung ist später eine App geplant.
        </p>
      </div>

      <div class="flex justify-center">
        <AppButton to="/dashboard" variant="primary" class="min-h-12 px-8 text-base">
          Demo ansehen
        </AppButton>
      </div>
    </div>
  </div>
</template>
