<template>
    <button 
        v-show="visible" 
        class="back-to-top btn btn-primary" 
        @click="scrollToTop"
        aria-label="回到顶部"
    >
        <iconify-icon icon="mdi:arrow-up" width="24"></iconify-icon>
    </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function handleScroll() {
    visible.value = window.scrollY > 300
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 48px;
    height: 48px;
    padding: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--border-color);
    box-shadow: var(--hard-shadow);
}

.back-to-top:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px 0px var(--border-color);
}
</style>
