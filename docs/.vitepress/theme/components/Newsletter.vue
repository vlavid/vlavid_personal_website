<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const loading = ref(false)

// Placeholder action - user needs to replace this
const formAction = 'https://buttondown.email/api/emails/embed-subscribe/victorlavid' 

const submit = (e: Event) => {
  if (!formAction.includes('buttondown') && !formAction.includes('beehiiv')) {
    alert('Configura tu URL de newsletter en Newsletter.vue')
    e.preventDefault()
  }
}
</script>

<template>
  <div class="newsletter-card">
    <div class="content">
      <h3>📩 Recibe mis aprendizajes en tu correo</h3>
      <p>
        Sin spam. Solo comparto recursos, reflexiones y guías sobre AWS y crecimiento profesional.
        Date de baja cuando quieras.
      </p>
      
      <form 
        :action="formAction"
        method="post"
        target="popupwindow"
        @submit="submit"
        class="form"
      >
        <input 
          type="email" 
          v-model="email"
          name="email"
          placeholder="tu@email.com"
          required
          class="input"
        />
        <button type="submit" class="submit-btn" :disabled="loading">
          Suscribirse Gratis
        </button>
      </form>
      <div class="note">
        <small>Powered by Buttondown/Beehiiv (Free Tier)</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.newsletter-card {
  margin: 64px 0;
  padding: 2px; /* Gradient border width */
  background: var(--gradient-primary);
  border-radius: 18px;
  position: relative;
}

.content {
  background: var(--vp-c-bg-soft);
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  height: 100%;
}

h3 {
  margin: 0 0 12px;
  font-size: 1.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

p {
  margin: 0 auto 24px;
  max-width: 500px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.form {
  display: flex;
  gap: 12px;
  max-width: 480px;
  margin: 0 auto;
}

.input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.3s;
}

.input:focus {
  border-color: var(--vp-c-brand-1);
  outline: none;
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.submit-btn {
  padding: 12px 24px;
  border-radius: 12px;
  background: var(--vp-c-brand-1);
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.note {
  margin-top: 16px;
  opacity: 0.6;
  font-size: 0.8rem;
}

@media (max-width: 600px) {
  .form {
    flex-direction: column;
  }
  
  .submit-btn {
    width: 100%;
  }
}
</style>
