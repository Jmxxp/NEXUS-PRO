// Legacy compatibility entry point.
// Preferred loading is directly via index.html module script tags.
(function () {
    var scripts = [
        'js/modules/00-core.js',
        'js/modules/10-init-auth-navigation.js',
        'js/modules/20-home-calendar-appointments.js',
        'js/modules/30-clients-stats.js',
        'js/modules/40-config-modals-services.js',
        'js/modules/45-script-builder.js',
        'js/modules/50-backup-ai.js',
        'js/modules/60-cashier.js',
        'js/modules/70-financial-and-final.js'
    ];

    function loadSequentially(list, index) {
        if (index >= list.length) return;
        var s = document.createElement('script');
        s.src = list[index];
        s.onload = function () { loadSequentially(list, index + 1); };
        s.onerror = function () {
            console.error('Falha ao carregar modulo:', list[index]);
            loadSequentially(list, index + 1);
        };
        (document.head || document.documentElement).appendChild(s);
    }

    if (!window.__NEXUS_WEB3_MODULES_LOADED__) {
        window.__NEXUS_WEB3_MODULES_LOADED__ = true;
        loadSequentially(scripts, 0);
    }
})();
