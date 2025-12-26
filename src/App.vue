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
                </div>
                <div class="card-grid">
                    <SiteCard 
                        v-for="site in mainSites" 
                        :key="site.key"
                        :site="site"
                        :site-key="site.key"
                        @delete="handleDeleteSite"
                        @edit="handleEditSite"
                    />
                    <AddSiteCard @click="openAddModal" />
                </div>
                <EmptyState 
                    v-if="mainSites.length === 0" 
                    icon="📭" 
                    message="暂无站点数据" 
                />
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
        <AddSiteModal 
            :show="showModal" 
            :edit-data="editingSite"
            :edit-key="editingKey"
            @close="closeModal"
            @save="handleSaveSite"
        />



        <!-- Back to Top -->
        <BackToTop />

        <!-- Notifications -->
        <Notification />

        <!-- Confirm Modal -->
        <ConfirmModal />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
import { useNotification } from './composables/useNotification.js'
import { useConfirm } from './composables/useConfirm.js'

const { 
    sitesData,
    mainSites, 
    saveSite, 
    deleteSite, 
    exportData, 
    importData, 
    clearAllData
} = useSitesData()

const { show: notify } = useNotification()
const { confirm: customConfirm } = useConfirm()

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

function handleExport() {
    exportData()
}

function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                await importData(file)
                notify('数据导入成功！')
            } catch (err) {
                notify('导入失败：' + err.message, 'error')
            }
        }
    }
    input.click()
}

async function handleClearAll() {
    if (await customConfirm('确定要清空所有站点数据吗？此操作不可撤销。', '危险操作')) {
        clearAllData()
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

.data-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
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
