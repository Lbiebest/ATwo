import { ref, watch } from 'vue'

const STORAGE_KEY = 'ai_automation_scripts'

// Shared state
const scripts = ref([])
const isLoaded = ref(false)

const saveScripts = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts.value))
}

// Auto-save on changes (for drag-and-drop)
watch(scripts, () => {
    saveScripts()
}, { deep: true })

const loadScripts = () => {
    if (isLoaded.value) return

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
        try {
            scripts.value = JSON.parse(stored)
        } catch (e) {
            console.error('Failed to parse scripts:', e)
            scripts.value = []
        }
    } else {
        // Add default scripts if none exist
        scripts.value = [
            {
                id: 'default-1',
                name: 'Hello World',
                content: 'console.log("Hello from ATwo Automation!");\nreturn "Script executed successfully!";',
                createdAt: new Date().toISOString(),
                lastRun: null
            },
            {
                id: 'default-2',
                name: '每日领取兑换码 (示例)',
                content: `// 这是一个示例脚本，演示如何调用 API\n// 请替换您的 access_token\nconst ACCESS_TOKEN = "YOUR_TOKEN_HERE";\n\ntry {\n    const response = await fetch("https://gift.wenwen12345.top/api/redeem/daily?access_token=" + ACCESS_TOKEN, {\n        method: "POST"\n    });\n    const data = await response.json();\n    return data;\n} catch (error) {\n    return "请求失败: " + error.message;\n}`,
                createdAt: new Date().toISOString(),
                lastRun: null
            }
        ]
        saveScripts()
    }
    isLoaded.value = true
}

// Initial load
loadScripts()

export function useScripts() {
    const addScript = (name, content) => {
        const newScript = {
            id: Date.now().toString(),
            name: name || '未命名脚本',
            content: content || '',
            createdAt: new Date().toISOString(),
            lastRun: null
        }
        scripts.value.push(newScript)
        saveScripts()
        return newScript
    }

    const updateScript = (id, updates) => {
        const index = scripts.value.findIndex(s => s.id === id)
        if (index !== -1) {
            scripts.value[index] = { ...scripts.value[index], ...updates }
            saveScripts()
        }
    }

    const deleteScript = (id) => {
        scripts.value = scripts.value.filter(s => s.id !== id)
        saveScripts()
    }

    const deleteMultipleScripts = (ids) => {
        scripts.value = scripts.value.filter(s => !ids.includes(s.id))
        saveScripts()
    }

    const importScripts = (newScripts) => {
        if (Array.isArray(newScripts)) {
            scripts.value = newScripts
            saveScripts()
        }
    }

    const runScript = async (id) => {
        const script = scripts.value.find(s => s.id === id)
        if (!script) return

        try {
            // Update last run time
            updateScript(id, { lastRun: new Date().toISOString() })

            // Execute script
            // Using AsyncFunction to allow await in scripts
            const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor
            const execute = new AsyncFunction(script.content)
            const result = await execute()

            return { success: true, data: result, name: script.name }
        } catch (error) {
            console.error('Script execution failed:', error)
            return { success: false, error: error.message, name: script?.name }
        }
    }

    return {
        scripts,
        addScript,
        updateScript,
        deleteScript,
        deleteMultipleScripts,
        importScripts,
        runScript
    }
}
