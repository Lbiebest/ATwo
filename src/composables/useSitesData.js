import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'ai_nav_sites_v3' // New version for array format
const OLD_STORAGE_KEY = 'ai_nav_sites_v2'

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
            return []
        }
    }

    // Migration from v2 (object format)
    const oldStored = localStorage.getItem(OLD_STORAGE_KEY)
    if (oldStored) {
        try {
            const oldData = JSON.parse(oldStored)
            const newData = Object.entries(oldData).map(([key, value]) => ({
                id: key,
                ...value
            }))
            return newData
        } catch (e) {
            return []
        }
    }

    return []
}

// Save to localStorage
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sitesData.value, null, 2))
}

// Computed: sites with main site
const mainSites = computed({
    get: () => {
        return sitesData.value.filter(site => site['main_site_exists'] && site['main_site'])
    },
    set: (newValue) => {
        sitesData.value = newValue
    }
})

// Add or update site
function saveSite(key, siteData, oldKey = null) {
    const index = sitesData.value.findIndex(s => s.id === (oldKey || key))
    const newSite = { id: key, ...siteData }

    if (index !== -1) {
        sitesData.value[index] = newSite
    } else {
        sitesData.value.push(newSite)
    }
    saveToStorage()
}

// Delete site
function deleteSite(key) {
    sitesData.value = sitesData.value.filter(s => s.id !== key)
    saveToStorage()
}

// Delete multiple sites
function deleteMultipleSites(keys) {
    sitesData.value = sitesData.value.filter(s => !keys.includes(s.id))
    saveToStorage()
}

// Export data
function exportData(scriptsData = null) {
    const exportObj = {
        sites: sitesData.value,
        scripts: scriptsData,
        version: '3.0',
        exportedAt: new Date().toISOString()
    }
    const dataBlob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ATwo_Backup_' + new Date().toISOString().slice(0, 10) + '.json'
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
                // Support multiple formats
                if (data.sites) {
                    if (Array.isArray(data.sites)) {
                        sitesData.value = data.sites
                    } else {
                        // Convert old object format in import
                        sitesData.value = Object.entries(data.sites).map(([key, value]) => ({
                            id: key,
                            ...value
                        }))
                    }
                } else if (Array.isArray(data)) {
                    sitesData.value = data
                } else {
                    // Old object format
                    sitesData.value = Object.entries(data).map(([key, value]) => ({
                        id: key,
                        ...value
                    }))
                }
                saveToStorage()
                resolve(data)
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
    sitesData.value = []
    saveToStorage()
}

export function useSitesData() {
    return {
        sitesData,
        mainSites,
        saveSite,
        deleteSite,
        deleteMultipleSites,
        exportData,
        importData,
        clearAllData
    }
}
