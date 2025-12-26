<template>
    <div class="notification-container">
        <TransitionGroup name="notification">
            <div 
                v-for="n in notifications" 
                :key="n.id" 
                class="notification newsprint-texture"
                :class="n.type"
            >
                <div class="notification-icon">
                    <iconify-icon v-if="n.type === 'success'" icon="mdi:check-circle" width="20"></iconify-icon>
                    <iconify-icon v-else-if="n.type === 'error'" icon="mdi:alert-circle" width="20"></iconify-icon>
                    <iconify-icon v-else icon="mdi:information" width="20"></iconify-icon>
                </div>
                <div class="notification-content">
                    <div class="notification-message">{{ n.message }}</div>
                </div>
                <button class="notification-close" @click="remove(n.id)">✕</button>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
import { useNotification } from '../composables/useNotification.js'

const { notifications, remove } = useNotification()
</script>

<style scoped>
.notification-container {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
    width: calc(100% - 40px);
}

.notification {
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    padding: 1rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    box-shadow: 4px 4px 0px 0px var(--border-color);
    position: relative;
    pointer-events: auto;
}

.notification.success {
    border-left: 8px solid var(--text-primary);
}

.notification.error {
    border-left: 8px solid var(--accent-red);
}

.notification-icon {
    flex-shrink: 0;
    margin-top: 2px;
}

.notification-content {
    flex-grow: 1;
    min-width: 0;
}

.notification-message {
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.6;
    word-break: break-word;
    white-space: pre-line;
}

.notification-close {
    flex-shrink: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    color: var(--text-muted);
    transition: color 0.2s;
}

.notification-close:hover {
    color: var(--text-primary);
}

/* Transition */
.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.notification-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>
