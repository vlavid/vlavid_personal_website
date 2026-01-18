<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Repo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  topics: string[]
  fork: boolean
  updated_at: string
}

const props = defineProps<{
  username?: string
  limit?: number
}>()

const repos = ref<Repo[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const username = props.username || 'vlavid'
const limit = props.limit || 6

onMounted(async () => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}&type=owner`
    )
    
    if (!response.ok) throw new Error('Failed to fetch repos')
    
    const data: Repo[] = await response.json()
    repos.value = data.filter(repo => !repo.fork)
  } catch (e) {
    error.value = 'Could not load projects'
    console.error(e)
  } finally {
    loading.value = false
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Vue: '#41b883',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051'
}
</script>

<template>
  <div class="github-projects">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading projects...</p>
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else class="project-grid">
      <a 
        v-for="repo in repos" 
        :key="repo.id"
        :href="repo.html_url"
        target="_blank"
        rel="noopener"
        class="project-card"
      >
        <h3>{{ repo.name }}</h3>
        <p>{{ repo.description || 'No description' }}</p>
        <div class="project-meta">
          <span v-if="repo.language" class="language">
            <span 
              class="lang-dot" 
              :style="{ background: languageColors[repo.language] || '#666' }"
            ></span>
            {{ repo.language }}
          </span>
          <span class="stars">⭐ {{ repo.stargazers_count }}</span>
          <span class="updated">📅 {{ formatDate(repo.updated_at) }}</span>
        </div>
        <div v-if="repo.topics.length" class="topics">
          <span v-for="topic in repo.topics.slice(0, 3)" :key="topic" class="topic">
            {{ topic }}
          </span>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.github-projects {
  margin: 32px 0;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px;
  color: var(--vp-c-text-2);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--glass-border);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  padding: 24px;
  text-align: center;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
}

.lang-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.topic {
  font-size: 0.75rem;
  background: rgba(99, 102, 241, 0.2);
  color: var(--vp-c-brand-2);
  padding: 4px 10px;
  border-radius: 12px;
}
</style>
