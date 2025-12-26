import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'aiWelfareScript'

const scriptContent = ref('')

function loadScript() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
        scriptContent.value = stored
    }
}

function saveScript() {
    localStorage.setItem(STORAGE_KEY, scriptContent.value)
    return true
}

function clearScript() {
    scriptContent.value = ''
    localStorage.removeItem(STORAGE_KEY)
}

export function useScript() {
    // Load on first use
    onMounted(() => {
        loadScript()
    })

    return {
        scriptContent,
        loadScript,
        saveScript,
        clearScript
    }
}
