<template>
    <div class="script-container newsprint-texture">
        <div class="editor-header">
            <span class="editor-label font-mono">AUTOMATION_SCRIPTS_V2.0</span>
            <button class="btn btn-primary btn-sm" @click="openNewScript">
                <iconify-icon icon="mdi:plus" width="16"></iconify-icon>
                新建脚本
            </button>
        </div>

        <!-- Script List -->
        <div v-if="!isEditing" class="script-list">
            <div v-for="script in scripts" :key="script.id" class="script-item">
                <div class="script-info">
                    <h3 class="script-name font-serif">{{ script.name }}</h3>
                    <div class="script-meta font-mono">
                        最后运行: {{ script.lastRun ? new Date(script.lastRun).toLocaleString() : '从未' }}
                    </div>
                </div>
                <div class="script-item-actions">
                    <button class="btn btn-secondary" @click="handleRun(script.id)" :disabled="isRunning === script.id">
                        <iconify-icon :icon="isRunning === script.id ? 'mdi:loading' : 'mdi:play'" width="16" :class="{'spin': isRunning === script.id}"></iconify-icon>
                        运行
                    </button>
                    <button class="btn btn-secondary" @click="handleEdit(script)">
                        <iconify-icon icon="mdi:pencil" width="16"></iconify-icon>
                        编辑
                    </button>
                    <button class="btn btn-delete" @click="handleDelete(script.id)">
                        <iconify-icon icon="mdi:delete" width="16"></iconify-icon>
                    </button>
                </div>
            </div>
            <div v-if="scripts.length === 0" class="empty-scripts">
                <iconify-icon icon="mdi:script-text-outline" width="48"></iconify-icon>
                <p>暂无自动化脚本，点击“新建脚本”开始。</p>
            </div>
        </div>

        <!-- Editor View -->
        <div v-else class="editor-view">
            <div class="editor-controls">
                <input 
                    v-model="currentScript.name" 
                    class="script-name-input font-serif" 
                    placeholder="脚本名称..."
                />
                <div class="editor-view-actions">
                    <button class="btn btn-primary" @click="handleSave">
                        <iconify-icon icon="mdi:content-save" width="16"></iconify-icon>
                        保存
                    </button>
                    <button class="btn btn-secondary" @click="cancelEdit">
                        取消
                    </button>
                </div>
            </div>
            <textarea 
                v-model="currentScript.content"
                class="script-editor" 
                placeholder="// 在此输入您的 JavaScript 代码..."
            ></textarea>
        </div>

        <div class="script-tip font-body">
            <strong>💡 提示：</strong>脚本将保存在浏览器本地存储中。您可以编写自定义脚本来自动化访问AI站点、批量处理任务等。请确保脚本来源可信，避免执行不明代码。
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useScripts } from '../composables/useScripts.js'
import { useNotification } from '../composables/useNotification.js'
import { useConfirm } from '../composables/useConfirm.js'

const { scripts, addScript, updateScript, deleteScript, runScript } = useScripts()
const { show: notify } = useNotification()
const { confirm: customConfirm } = useConfirm()

const isEditing = ref(false)
const isRunning = ref(null)
const currentScript = reactive({
    id: null,
    name: '',
    content: ''
})

function openNewScript() {
    currentScript.id = null
    currentScript.name = ''
    currentScript.content = '// 在此输入您的 JavaScript 代码\nconsole.log("Hello from script!");'
    isEditing.value = true
}

function handleEdit(script) {
    currentScript.id = script.id
    currentScript.name = script.name
    currentScript.content = script.content
    isEditing.value = true
}

function cancelEdit() {
    isEditing.value = false
}

function handleSave() {
    if (!currentScript.name.trim()) {
        notify('请输入脚本名称', 'error')
        return
    }

    if (currentScript.id) {
        updateScript(currentScript.id, {
            name: currentScript.name,
            content: currentScript.content
        })
        notify('脚本已更新！')
    } else {
        addScript(currentScript.name, currentScript.content)
        notify('脚本已保存！')
    }
    isEditing.value = false
}

async function handleDelete(id) {
    if (await customConfirm('确定要删除此脚本吗？')) {
        deleteScript(id)
        notify('脚本已删除')
    }
}

async function handleRun(id) {
    isRunning.value = id
    const result = await runScript(id)
    isRunning.value = null
    
    if (result.success) {
        const message = result.data !== undefined 
            ? `脚本运行成功！\n结果: ${typeof result.data === 'object' ? JSON.stringify(result.data) : result.data}` 
            : '脚本运行成功！'
        notify(message, 'success')
    } else {
        notify('脚本运行失败: ' + result.error, 'error')
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
}

.editor-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
}

.script-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
}

.script-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
}

.script-item:hover {
    border-color: var(--text-primary);
    transform: translateY(-2px);
}

.script-name {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-primary);
}

.script-meta {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
}

.script-item-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.empty-scripts {
    text-align: center;
    padding: 3rem;
    color: var(--text-muted);
}

.editor-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
}

.editor-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.script-name-input {
    flex: 1;
    padding: 0.5rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid var(--border-color);
    font-size: 1.25rem;
    color: var(--text-primary);
}

.script-name-input:focus {
    outline: none;
    border-color: var(--text-primary);
}

.editor-view-actions {
    display: flex;
    gap: 0.5rem;
}

.script-editor {
    width: 100%;
    min-height: 400px;
    padding: 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.875rem;
    color: var(--text-primary);
    resize: vertical;
}

.script-editor:focus {
    outline: none;
    border-color: var(--text-primary);
}

.script-tip {
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-left: 4px solid var(--border-color);
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.6;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .script-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .script-item-actions {
        width: 100%;
        justify-content: flex-end;
    }
    
    .editor-controls {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>

