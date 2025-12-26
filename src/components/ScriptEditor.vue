<template>
    <div class="script-container newsprint-texture">
        <div class="editor-header">
            <span class="editor-label font-mono">EDITOR_V1.0</span>
        </div>
        <textarea 
            v-model="scriptContent"
            class="script-editor" 
            placeholder="// 在此输入您的自动化脚本&#10;// 示例：自动访问AI站点、批量操作等&#10;&#10;function autoVisitSites() {&#10;    // 您的代码...&#10;}&#10;&#10;// 等待用户输入..."
        ></textarea>

        <div class="script-actions">
            <button class="btn btn-primary" @click="handleSave">
                <iconify-icon icon="mdi:content-save" width="16"></iconify-icon>
                保存脚本
            </button>
            <button class="btn btn-secondary" @click="handleLoad">
                <iconify-icon icon="mdi:folder-open" width="16"></iconify-icon>
                加载脚本
            </button>
            <button class="btn btn-secondary" @click="handleClear">
                <iconify-icon icon="mdi:delete" width="16"></iconify-icon>
                清空脚本
            </button>
            <button class="btn btn-secondary" @click="showHelp">
                <iconify-icon icon="mdi:help-circle" width="16"></iconify-icon>
                帮助
            </button>
        </div>

        <div class="script-tip font-body">
            <strong>💡 提示：</strong>脚本将保存在浏览器本地存储中。您可以编写自定义脚本来自动化访问AI站点、批量处理任务等。请确保脚本来源可信，避免执行不明代码。
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotification } from '../composables/useNotification.js'
import { useConfirm } from '../composables/useConfirm.js'

const { show: notify } = useNotification()
const { confirm: customConfirm } = useConfirm()

const STORAGE_KEY = 'aiWelfareScript'
const scriptContent = ref('')

onMounted(() => {
    loadScript()
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
})

function loadScript() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
        scriptContent.value = stored
    }
}

function handleSave() {
    localStorage.setItem(STORAGE_KEY, scriptContent.value)
    notify('脚本已保存！')
}

function handleLoad() {
    loadScript()
}

async function handleClear() {
    if (await customConfirm('确定要清空脚本吗？')) {
        scriptContent.value = ''
        localStorage.removeItem(STORAGE_KEY)
    }
}

function showHelp() {
    notify('📖 自动化脚本使用帮助\n\n1. 支持 JavaScript 语法\n2. 脚本保存在本地存储\n3. 请仅运行可信的代码\n4. Ctrl+S 保存，Ctrl+L 加载', 'info', 10000);
}

function handleKeydown(e) {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        handleSave()
    } else if (e.ctrlKey && e.key === 'l') {
        e.preventDefault()
        loadScript()
    }
}
</script>

<style scoped>
.script-container {
    background: var(--bg-primary);
    padding: 2rem;
    border: 1px solid var(--border-color);
}

.editor-header {
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
}

.editor-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
}

.script-editor {
    width: 100%;
    min-height: 300px;
    padding: 1rem;
    background: transparent;
    border: 1px solid var(--border-color);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.875rem;
    color: var(--text-primary);
    resize: vertical;
    margin-bottom: 1.5rem;
}

.script-editor:focus {
    outline: none;
    background: var(--bg-secondary);
}

.script-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
}

.script-tip {
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-left: 4px solid var(--border-color);
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.6;
}

@media (max-width: 768px) {
    .script-actions {
        flex-direction: column;
    }
}
</style>
