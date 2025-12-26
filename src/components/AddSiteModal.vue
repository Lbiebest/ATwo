<template>
    <div class="modal" :class="{ active: show }" @click.self="$emit('close')">
        <div class="modal-content newsprint-texture">
            <div class="modal-header">
                <h2 class="modal-title font-serif">{{ isEdit ? 'EDIT SITE' : 'ADD NEW SITE' }}</h2>
                <button class="modal-close" @click="$emit('close')">✕</button>
            </div>

            <form @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label class="form-label">站点名称</label>
                    <input 
                        v-model="formData.siteName"
                        type="text" 
                        class="form-input" 
                        placeholder="例如：ChatGPT 镜像" 
                        required 
                    />
                </div>

                <div class="form-group">
                    <label class="form-label">主站地址</label>
                    <input 
                        v-model="formData.siteUrl"
                        type="url" 
                        class="form-input" 
                        placeholder="https://example.com" 
                        required 
                    />
                </div>

                <div class="form-group">
                    <label class="form-label">福利站名称 (可选)</label>
                    <input 
                        v-model="formData.welfareName"
                        type="text" 
                        class="form-input" 
                        placeholder="例如：ChatGPT 免费版" 
                    />
                </div>

                <div class="form-group">
                    <label class="form-label">福利站地址 (可选)</label>
                    <input 
                        v-model="formData.welfareUrl"
                        type="url" 
                        class="form-input" 
                        placeholder="https://welfare.example.com" 
                    />
                </div>

                <div class="form-group">
                    <label class="form-label">自定义 Favicon URL (可选)</label>
                    <input 
                        v-model="formData.favicon"
                        type="url" 
                        class="form-input" 
                        placeholder="https://example.com/favicon.ico" 
                    />
                </div>

                <div class="form-group">
                    <label class="form-label">支持/捐赠链接 (可选)</label>
                    <input 
                        v-model="formData.supportUrl"
                        type="url" 
                        class="form-input" 
                        placeholder="https://example.com/donate" 
                    />
                </div>

                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">
                        <iconify-icon icon="mdi:check" width="16"></iconify-icon>
                        {{ isEdit ? '更新站点' : '保存站点' }}
                    </button>
                    <button type="button" class="btn btn-secondary" @click="$emit('close')">
                        取消
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    editData: {
        type: Object,
        default: null
    },
    editKey: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['close', 'save'])

const isEdit = computed(() => !!props.editKey)

const formData = reactive({
    siteName: '',
    siteUrl: '',
    welfareName: '',
    welfareUrl: '',
    favicon: '',
    supportUrl: ''
})

// Sync form with editData when modal opens
watch(() => props.show, (newVal) => {
    if (newVal && props.editData) {
        formData.siteName = props.editKey
        formData.siteUrl = props.editData['main_site'].url
        formData.welfareName = props.editData['bonus_site']?.name || ''
        formData.welfareUrl = props.editData['bonus_site']?.url || ''
        formData.favicon = props.editData['favicon'] || ''
        formData.supportUrl = props.editData['supportUrl'] || ''
    } else if (!newVal) {
        resetForm()
    }
})

function resetForm() {
    formData.siteName = ''
    formData.siteUrl = ''
    formData.welfareName = ''
    formData.welfareUrl = ''
    formData.favicon = ''
    formData.supportUrl = ''
}

function handleSubmit() {
    const siteData = {
        "main_site_exists": true,
        "bonus_site_exists": !!formData.welfareUrl,
        "main_site": {
            "name": formData.siteName,
            "url": formData.siteUrl
        },
        "bonus_site": { 
            "name": formData.welfareName || null, 
            "url": formData.welfareUrl || null 
        },
        "favicon": formData.favicon || null,
        "supportUrl": formData.supportUrl || null
    }
    
    emit('save', formData.siteName, siteData, props.editKey)
    emit('close')
}
</script>

<style scoped>
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 2000;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal.active {
    display: flex;
}

.modal-content {
    background: var(--bg-primary);
    padding: 2.5rem;
    max-width: 500px;
    width: 100%;
    border: 4px solid var(--border-color);
    box-shadow: 12px 12px 0px 0px rgba(0,0,0,0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.5rem;
}

.modal-title {
    font-size: 1.75rem;
    font-weight: 900;
    letter-spacing: -0.02em;
}

.modal-close {
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid var(--border-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
    font-size: 1.25rem;
    transition: all 0.2s;
}

.modal-close:hover {
    background: var(--text-primary);
    color: var(--bg-primary);
}

.modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.modal-actions .btn {
    flex: 1;
}
</style>
