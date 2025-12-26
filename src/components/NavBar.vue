<template>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">
                <iconify-icon icon="mdi:robot-happy" width="24"></iconify-icon>
                <span class="font-serif">AI NEWS</span>
            </a>
            <ul class="nav-links">
                <li>
                    <a href="#main-sites">
                        <iconify-icon icon="material-symbols:home" width="18"></iconify-icon>
                        站点
                    </a>
                </li>
                <li>
                    <a href="#scripts">
                        <iconify-icon icon="mdi:code-braces" width="18"></iconify-icon>
                        脚本
                    </a>
                </li>
                <li>
                    <a href="#data-management">
                        <iconify-icon icon="mdi:database-settings" width="18"></iconify-icon>
                        管理
                    </a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    border-bottom: 2px solid var(--border-color);
    z-index: 1000;
    height: 60px;
}

.nav-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: 900;
    color: var(--text-primary);
    text-decoration: none;
    letter-spacing: -0.05em;
}

.nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
}

.nav-links a {
    color: var(--text-primary);
    text-decoration: none;
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.nav-links a:hover {
    color: var(--accent-red);
    text-decoration: underline;
    text-underline-offset: 4px;
}

@media (max-width: 768px) {
    .nav-links {
        display: none;
    }
}
</style>
