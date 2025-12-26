<template>
    <div class="card hard-shadow-hover">
        <div class="card-header">
            <SiteIcon 
                :url="site['main_site'].url" 
                :name="site['main_site'].name"
                :custom-favicon="site.favicon"
            />
            <h3 class="card-title">{{ site['main_site'].name }}</h3>
        </div>
        <div class="card-url font-mono">{{ site['main_site'].url }}</div>
        <p class="card-description">AI公益服务 · {{ siteKey }}</p>
        <div class="card-tags">
            <span class="tag">主站</span>
            <span v-if="site['bonus_site_exists']" class="tag tag-welfare">福利站</span>
        </div>
        <div class="card-actions">
            <a :href="site['main_site'].url" target="_blank" class="btn btn-primary">
                <iconify-icon icon="mdi:open-in-new" width="14"></iconify-icon>
                访问
            </a>
            <a 
                v-if="site['bonus_site_exists'] && site['bonus_site'].url" 
                :href="site['bonus_site'].url" 
                target="_blank" 
                class="btn btn-secondary welfare-btn"
            >
                <iconify-icon icon="mdi:gift" width="14"></iconify-icon>
                {{ site['bonus_site'].name || '福利站' }}
            </a>
            <button 
                v-else 
                class="btn btn-disabled" 
                disabled
            >
                <iconify-icon icon="mdi:gift-off" width="14"></iconify-icon>
                不存在福利站
            </button>
            <a 
                v-if="site.supportUrl" 
                :href="site.supportUrl" 
                target="_blank" 
                class="btn btn-secondary support-btn"
            >
                <iconify-icon icon="mdi:heart" width="14"></iconify-icon>
                支持
            </a>
            <div class="action-row">
                <button class="btn btn-secondary" @click.stop="$emit('edit', siteKey, site)">
                    <iconify-icon icon="mdi:pencil" width="14"></iconify-icon>
                    编辑
                </button>
                <button class="btn btn-delete" @click.stop="$emit('delete', siteKey)">
                    <iconify-icon icon="mdi:delete" width="14"></iconify-icon>
                    删除
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import SiteIcon from './SiteIcon.vue'

const props = defineProps({
    site: {
        type: Object,
        required: true
    },
    siteKey: {
        type: String,
        required: true
    }
})

defineEmits(['delete', 'edit'])
</script>

<style scoped>
.card {
    background: var(--bg-primary);
    padding: 1.5rem;
    border-right: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    transition: all 0.2s ease-out;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.card-title {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.2;
}

.card-url {
    color: var(--text-muted);
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.card-description {
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
    text-align: justify;
}

.card-tags {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.tag {
    font-family: 'Inter', sans-serif;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--border-color);
    color: var(--text-primary);
}

.tag-welfare {
    background: var(--text-primary);
    color: var(--bg-primary);
}

.card-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.btn-disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-style: dashed;
}

.action-row {
    display: flex;
    gap: 0.5rem;
}

.action-row .btn {
    flex: 1;
}

.card-actions > .btn {
    width: 100%;
}

.support-btn {
    border-color: var(--accent-red);
    color: var(--accent-red);
}

.support-btn:hover {
    background: var(--accent-red);
    color: white;
}

.welfare-btn:hover {
    background: var(--text-primary);
    color: var(--bg-primary);
}
</style>
