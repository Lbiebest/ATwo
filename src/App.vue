<template>
    <div class="app newsprint-texture">
        <NavBar />

        <div class="container">
            <!-- Header -->
            <header class="header">
                <div class="header-meta font-mono">VOL. 1 | {{ currentDate }} | AI EDITION</div>
                <h1 class="font-serif">AI NEWS NAVIGATION</h1>
                <p class="font-sans">快速访问各大AI公益站点 · 管理自动化脚本 · 探索数字前沿</p>
            </header>

            <!-- Main Sites Section -->
            <section class="section" id="main-sites">
                <div class="section-header">
                    <h2 class="section-title font-serif">公益站点</h2>
                    <div v-if="mainSites.length > 0" class="section-actions">
                        <div class="layout-toggle">
                            <button class="btn btn-icon btn-sm" :class="{ 'btn-primary': siteLayout === 'grid' }"
                                @click="siteLayout = 'grid'" title="网格布局">
                                <iconify-icon icon="mdi:view-grid" width="16"></iconify-icon>
                            </button>
                            <button class="btn btn-icon btn-sm" :class="{ 'btn-primary': siteLayout === 'list' }"
                                @click="siteLayout = 'list'" title="列表布局">
                                <iconify-icon icon="mdi:view-list" width="16"></iconify-icon>
                            </button>
                        </div>
                        <div class="batch-actions-header">
                            <button class="btn btn-sm" :class="isBatchMode ? 'btn-primary' : 'btn-secondary'"
                                @click="toggleBatchMode">
                                <iconify-icon
                                    :icon="isBatchMode ? 'mdi:check-circle' : 'mdi:checkbox-multiple-marked-outline'"
                                    width="16"></iconify-icon>
                                {{ isBatchMode ? '退出批量' : '批量操作' }}
                            </button>
                            <button v-if="isBatchMode && selectedSites.length > 0" class="btn btn-delete btn-sm"
                                @click="handleBatchDelete">
                                <iconify-icon icon="mdi:delete" width="16"></iconify-icon>
                                删除选中 ({{ selectedSites.length }})
                            </button>
                        </div>
                    </div>
                </div>

                <draggable v-model="mainSites" item-key="id" :class="['card-grid', siteLayout + '-view']"
                    handle=".drag-handle" :disabled="isBatchMode">
                    <template #item="{ element: site }">
                        <SiteCard :site="site" :site-key="site.id" :is-batch-mode="isBatchMode"
                            :is-selected="selectedSites.includes(site.id)" @delete="handleDeleteSite"
                            @edit="handleEditSite" @toggle-select="toggleSiteSelection" />
                    </template>
                    <template #footer>
                        <AddSiteCard v-if="!isBatchMode" @click="openAddModal" />
                    </template>
                </draggable>

                <EmptyState v-if="mainSites.length === 0" icon="📭" message="暂无站点数据" />
            </section>

            <!-- Data Management Section -->
            <section class="section" id="data-management">
                <div class="section-header">
                    <h2 class="section-title font-serif">数据管理</h2>
                </div>
                <div class="data-actions">
                    <button class="btn btn-secondary" @click="handleImport">
                        <iconify-icon icon="mdi:upload" width="16"></iconify-icon>
                        导入数据
                    </button>
                    <button class="btn btn-secondary" @click="handleExport">
                        <iconify-icon icon="mdi:download" width="16"></iconify-icon>
                        导出数据
                    </button>
                    <button class="btn btn-delete" @click="handleClearAll">
                        <iconify-icon icon="mdi:delete-sweep" width="16"></iconify-icon>
                        清空数据
                    </button>
                </div>
            </section>

            <!-- Scripts Section -->
            <section class="section" id="scripts">
                <div class="section-header">
                    <h2 class="section-title font-serif">自动化脚本</h2>
                </div>
                <ScriptEditor />
            </section>

            <!-- Footer -->
            <footer class="footer">
                <div class="footer-content font-mono">
                    EDITION: VOL 1.0 | PRINTED IN DIGITAL SPACE | © 2025 AI NEWS
                </div>
            </footer>
        </div>

        <!-- Add/Edit Site Modal -->
        <AddSiteModal :show="showModal" :edit-data="editingSite" :edit-key="editingKey" @close="closeModal"
            @save="handleSaveSite" />



        <!-- Back to Top -->
        <BackToTop />

        <!-- Notifications -->
        <Notification />

        <!-- Confirm Modal -->
        <ConfirmModal />
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import NavBar from './components/NavBar.vue'
import SiteCard from './components/SiteCard.vue'
import AddSiteCard from './components/AddSiteCard.vue'
import ScriptEditor from './components/ScriptEditor.vue'
import AddSiteModal from './components/AddSiteModal.vue'
import EmptyState from './components/EmptyState.vue'
import BackToTop from './components/BackToTop.vue'
import Notification from './components/Notification.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import { useSitesData } from './composables/useSitesData.js'
import { useScripts } from './composables/useScripts.js'
import { useNotification } from './composables/useNotification.js'
import { useConfirm } from './composables/useConfirm.js'

const {
    sitesData,
    mainSites,
    saveSite,
    deleteSite,
    deleteMultipleSites,
    exportData,
    importData,
    clearAllData
} = useSitesData()

const { scripts, importScripts, deleteMultipleScripts } = useScripts()
const { show: notify } = useNotification()
const { confirm: customConfirm } = useConfirm()

const siteLayout = ref(localStorage.getItem('site_layout') || 'grid')
watch(siteLayout, (val) => localStorage.setItem('site_layout', val))

const showModal = ref(false)

const editingSite = ref(null)
const editingKey = ref('')

const currentDate = computed(() => {
    return new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).toUpperCase()
})

function openAddModal() {
    editingSite.value = null
    editingKey.value = ''
    showModal.value = true
}

function handleEditSite(key, site) {
    editingSite.value = site
    editingKey.value = key
    showModal.value = true
}

function closeModal() {
    showModal.value = false
    editingSite.value = null
    editingKey.value = ''
}

function handleSaveSite(key, siteData, oldKey) {
    saveSite(key, siteData, oldKey)
    notify(oldKey ? '站点已更新！' : '站点已保存！')
}

async function handleDeleteSite(key) {
    if (await customConfirm(`确定要删除 "${key}" 吗？`)) {
        deleteSite(key)
    }
}

const isBatchMode = ref(false)
const selectedSites = ref([])

function toggleBatchMode() {
    isBatchMode.value = !isBatchMode.value
    if (!isBatchMode.value) {
        selectedSites.value = []
    }
}

function toggleSiteSelection(id) {
    const index = selectedSites.value.indexOf(id)
    if (index === -1) {
        selectedSites.value.push(id)
    } else {
        selectedSites.value.splice(index, 1)
    }
}

async function handleBatchDelete() {
    if (await customConfirm(`确定要删除选中的 ${selectedSites.value.length} 个站点吗？`)) {
        deleteMultipleSites(selectedSites.value)
        selectedSites.value = []
        isBatchMode.value = false
        notify('批量删除成功！')
    }
}

function handleExport() {
    exportData(scripts.value)
}

function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                const data = await importData(file)
                if (data && data.scripts) {
                    importScripts(data.scripts)
                }
                notify('数据导入成功！')
            } catch (err) {
                notify('导入失败：' + err.message, 'error')
            }
        }
    }
    input.click()
}

async function handleClearAll() {
    if (await customConfirm('确定要清空所有数据（包括站点和脚本）吗？此操作不可撤销。', '危险操作')) {
        clearAllData()
        deleteMultipleScripts(scripts.value.map(s => s.id))
        notify('已清空所有数据！')
    }
}


</script>

<style>
.header-meta {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
    letter-spacing: 0.1em;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.5rem;
}

.section-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.layout-toggle {
    display: flex;
    gap: 0.25rem;
    border: 1px solid var(--border-color);
    padding: 2px;
}

.btn-icon {
    padding: 0.5rem;
    min-width: 36px;
}

.batch-actions-header {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

/* List View Styles for Sites */
.list-view {
    grid-template-columns: 1fr !important;
    gap: 0.5rem !important;
}

.list-view :deep(.card) {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.4rem 1rem;
    gap: 1rem;
}

.list-view :deep(.card-header) {
    margin-bottom: 0;
    min-width: 160px;
    gap: 0.5rem;
}

.list-view :deep(.site-icon) {
    width: 28px;
    height: 28px;
}

.list-view :deep(.site-icon img) {
    width: 18px;
    height: 18px;
}

.list-view :deep(.card-header h3) {
    font-size: 0.95rem;
}

.list-view :deep(.card-url) {
    margin-bottom: 0;
    flex: 1;
    font-size: 0.8rem;
    opacity: 0.8;
}

.list-view :deep(.card-description),
.list-view :deep(.card-tags) {
    display: none;
}

.list-view :deep(.card-actions) {
    flex-direction: row;
    width: auto;
    gap: 0.4rem;
}

.list-view :deep(.card-actions .btn) {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
    width: auto;
    min-width: 0;
}

.list-view :deep(.action-row) {
    display: flex;
    gap: 0.4rem;
    width: auto;
}

.list-view :deep(.drag-handle) {
    top: 50%;
    right: 0.4rem;
    transform: translateY(-50%);
    font-size: 0.9rem;
}

@media (max-width: 1024px) {
    .list-view :deep(.card) {
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .list-view :deep(.card-header) {
        min-width: 100%;
    }

    .list-view :deep(.card-actions) {
        width: 100%;
        justify-content: flex-end;
    }
}

.footer {
    margin-top: 4rem;
    padding: 2rem 0;
    border-top: 1px solid var(--border-color);
    text-align: center;
}

.footer-content {
    font-size: 0.75rem;
    color: var(--text-muted);
    letter-spacing: 0.1em;
}
</style>
