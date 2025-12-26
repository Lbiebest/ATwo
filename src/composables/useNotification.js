import { reactive } from 'vue'

const notifications = reactive([])

export function useNotification() {
    function show(message, type = 'success', duration = 3000) {
        const id = Date.now()
        notifications.push({ id, message, type })

        if (duration > 0) {
            setTimeout(() => {
                remove(id)
            }, duration)
        }
    }

    function remove(id) {
        const index = notifications.findIndex(n => n.id === id)
        if (index !== -1) {
            notifications.splice(index, 1)
        }
    }

    return {
        notifications,
        show,
        remove
    }
}
