import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'ai_nav_sites_v2'

// Reactive state
const sitesData = ref(loadFromStorage())

// Auto-save on changes
watch(sitesData, () => {
    saveToStorage()
}, { deep: true })

// Load from localStorage
function loadFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch (e) {
            return {}
        }
    }
    return {}
}

// Save to localStorage
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sitesData.value, null, 2))
}

// Computed: sites with main site
const mainSites = computed(() => {
    const result = []
    for (const key in sitesData.value) {
        const site = sitesData.value[key]
        if (site['main_site_exists'] && site['main_site']) {
            result.push({ key, ...site })
        }
    }
    return result
})

// Add or update site
function saveSite(key, siteData, oldKey = null) {
    if (oldKey && oldKey !== key) {
        delete sitesData.value[oldKey]
    }
    sitesData.value[key] = siteData
    // Trigger reactivity
    sitesData.value = { ...sitesData.value }
    saveToStorage()
}

// Delete site
function deleteSite(key) {
    delete sitesData.value[key]
    // Trigger reactivity
    sitesData.value = { ...sitesData.value }
    saveToStorage()
}

// Export data
function exportData() {
    const dataBlob = new Blob([JSON.stringify(sitesData.value, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'Station_' + new Date().toISOString().slice(0, 10) + '.json'
    link.click()
    URL.revokeObjectURL(url)
}

// Import data
function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result)
                sitesData.value = data
                saveToStorage()
                resolve()
            } catch (err) {
                reject(new Error('JSON格式错误'))
            }
        }
        reader.onerror = () => reject(new Error('读取文件失败'))
        reader.readAsText(file)
    })
}

// Clear all data
function clearAllData() {
    sitesData.value = {}
    saveToStorage()
}

export function useSitesData() {
    return {
        sitesData,
        mainSites,
        saveSite,
        deleteSite,
        exportData,
        importData,
        clearAllData
    }
}
