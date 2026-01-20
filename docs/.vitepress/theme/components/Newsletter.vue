<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const loading = ref(false)
const status = ref<'idle' | 'success' | 'error'>('idle')
const message = ref('')

// TODO: Replace with your Terraform Output URL
const API_URL = 'https://REPLACE_ME_WITH_YOUR_API_GATEWAY_URL/subscribe'

const submit = async (e: Event) => {
  e.preventDefault()
  if (API_URL.includes('REPLACE_ME')) {
    alert('Despliega la infraestructura primero y actualiza la URL en Newsletter.vue')
    return
  }

  loading.value = true
  status.value = 'idle'
  message.value = ''

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })
    
    const data = await res.json()
    
    if (res.ok) {
        status.value = 'success'
        message.value = '¡Gracias por suscribirte!'
        email.value = ''
    } else {
        throw new Error(data.message || 'Error al suscribirse')
    }
  } catch (err: any) {
    status.value = 'error'
    message.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="newsletter-card">
    <div class="content">
      <h3>📩 Recibe mis aprendizajes en tu correo</h3>
      <p>
        Infraestructura inmutable, despliegues serverless y estrategia de carrera. 
        Sin spam, directo a tu inbox.
      </p>
      
      <form @submit="submit" class="form">
        <input 
          type="email" 
          v-model="email"
          name="email"
          placeholder="tu@email.com"
          required
          class="input"
          :disabled="loading || status === 'success'"
        />
        <button type="submit" class="submit-btn" :disabled="loading || status === 'success'">
          {{ loading ? 'Enviando...' : (status === 'success' ? '¡Suscrito!' : 'Suscribirse') }}
        </button>
      </form>

      <div v-if="message" class="feedback" :class="status">
        {{ message }}
      </div>

      <div class="note">
        <small>Powered by AWS Serverless (Lambda + DynamoDB)</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.newsletter-card {
  margin: 64px 0;
  padding: 2px;
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
  min-width: 140px;
}

.submit-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.feedback {
  margin-top: 16px;
  font-weight: 500;
  font-size: 0.9rem;
}

.feedback.success { color: #10b981; }
.feedback.error { color: #ef4444; }

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
