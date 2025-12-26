<template>
    <div class="card card-add" @click="$emit('click')">
        <div class="card-add-icon">
            <iconify-icon icon="mdi:plus" width="48"></iconify-icon>
        </div>
        <div class="card-add-text font-serif">ADD NEW SITE</div>
    </div>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.card-add {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    background: var(--bg-primary);
    border-right: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.2s ease-out;
}

.card-add:hover {
    background: var(--bg-secondary);
}

.card-add-icon {
    color: var(--text-primary);
    margin-bottom: 1rem;
}

.card-add-text {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--text-primary);
}
</style>
