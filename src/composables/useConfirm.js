import { ref } from 'vue'

const isVisible = ref(false)
const title = ref('')
const message = ref('')
const resolvePromise = ref(null)

export function useConfirm() {
    function confirm(msg, t = '确认操作') {
        title.value = t
        message.value = msg
        isVisible.value = true

        return new Promise((resolve) => {
            resolvePromise.value = resolve
        })
    }

    function handleConfirm() {
        isVisible.value = false
        if (resolvePromise.value) resolvePromise.value(true)
    }

    function handleCancel() {
        isVisible.value = false
        if (resolvePromise.value) resolvePromise.value(false)
    }

    return {
        isVisible,
        title,
        message,
        confirm,
        handleConfirm,
        handleCancel
    }
}
