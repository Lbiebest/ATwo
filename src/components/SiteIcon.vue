<template>
    <div class="site-icon">
        <img 
            :src="currentUrl" 
            :alt="name"
            @error="handleError"
        >
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    customFavicon: {
        type: String,
        default: null
    }
})

const errorCount = ref(0)

const domain = computed(() => {
    try {
        return new URL(props.url).hostname
    } catch (e) {
        return ''
    }
})

const currentUrl = computed(() => {
    if (props.customFavicon && errorCount.value === 0) {
        return props.customFavicon
    }
    
    const offset = props.customFavicon ? 1 : 0
    const attempt = errorCount.value - offset
    
    if (attempt === 0) {
        return `https://www.google.com/s2/favicons?domain=${domain.value}&sz=64`
    } else if (attempt === 1) {
        return `https://icons.duckduckgo.com/ip3/${domain.value}.ico`
    }
    
    // Final fallback to ai.svg
    return '/ai.svg'
})

function handleError() {
    errorCount.value++
}

// Reset state if URL or customFavicon changes
watch([() => props.url, () => props.customFavicon], () => {
    errorCount.value = 0
})
</script>

<style scoped>
.site-icon {
    width: 40px;
    height: 40px;
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    overflow: hidden;
    transition: all 0.2s;
}

.site-icon img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    filter: grayscale(100%);
    transition: filter 0.3s;
}

/* Hover effect handled by parent SiteCard usually, but we can add micro-interaction here */
:global(.card:hover) .site-icon img {
    filter: grayscale(0%);
}
</style>
