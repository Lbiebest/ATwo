<template>
    <div class="empty-state">
        <div class="empty-state-icon">{{ icon }}</div>
        <p class="font-serif">{{ message }}</p>
    </div>
</template>

<script setup>
defineProps({
    icon: {
        type: String,
        default: '📭'
    },
    message: {
        type: String,
        default: '暂无数据'
    }
})
</script>

<style scoped>
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-muted);
    border: 1px dashed var(--border-color);
    margin: 2rem 0;
}

.empty-state-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    filter: grayscale(100%);
    opacity: 0.5;
}

.empty-state p {
    font-size: 1.25rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}
</style>
