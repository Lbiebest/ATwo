<template>
    <div class="modal" :class="{ active: isVisible }" @click.self="handleCancel">
        <div class="modal-content newsprint-texture">
            <div class="modal-header">
                <h2 class="modal-title font-serif">{{ title }}</h2>
                <button class="modal-close" @click="handleCancel">✕</button>
            </div>
            <div class="modal-body">
                <p class="confirm-message">{{ message }}</p>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" @click="handleCancel">取消</button>
                <button class="btn btn-primary" @click="handleConfirm">确定</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useConfirm } from '../composables/useConfirm.js'

const { isVisible, title, message, handleConfirm, handleCancel } = useConfirm()
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
    z-index: 9999;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal.active {
    display: flex;
}

.modal-content {
    background: var(--bg-primary);
    padding: 2rem;
    max-width: 400px;
    width: 100%;
    border: 4px solid var(--border-color);
    box-shadow: 12px 12px 0px 0px rgba(0,0,0,0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.5rem;
}

.modal-title {
    font-size: 1.5rem;
    margin: 0;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-primary);
}

.modal-body {
    margin-bottom: 2rem;
}

.confirm-message {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-primary);
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
</style>
