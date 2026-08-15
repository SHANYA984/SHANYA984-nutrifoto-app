(() => {
  let deferredPrompt = null;

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isStandalone) return;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  function showInstallCard(message, actionText, action) {
    if (document.getElementById('nutrifoto-install-card')) return;

    const card = document.createElement('aside');
    card.id = 'nutrifoto-install-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', 'Instalar Nutrifoto');
    card.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;padding:16px 18px;border-radius:18px;background:#fff;box-shadow:0 12px 40px rgba(0,0,0,.18);font-family:system-ui,-apple-system,sans-serif;color:#171717;border:1px solid rgba(0,0,0,.08);max-width:520px;margin:auto';

    const title = document.createElement('strong');
    title.textContent = 'Instalá Nutrifoto en tu celular';
    title.style.cssText = 'display:block;font-size:16px;margin-bottom:6px';

    const text = document.createElement('span');
    text.textContent = message;
    text.style.cssText = 'display:block;font-size:13px;line-height:1.45;margin-bottom:12px;color:#555';

    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:8px;align-items:center';

    const install = document.createElement('button');
    install.textContent = actionText;
    install.type = 'button';
    install.style.cssText = 'border:0;border-radius:10px;padding:10px 14px;background:#6d28d9;color:#fff;font-weight:700;cursor:pointer';
    install.addEventListener('click', async () => {
      if (action) await action();
      card.remove();
    });

    const close = document.createElement('button');
    close.textContent = 'Ahora no';
    close.type = 'button';
    close.style.cssText = 'border:0;background:transparent;padding:10px;color:#666;cursor:pointer';
    close.addEventListener('click', () => card.remove());

    actions.append(install, close);
    card.append(title, text, actions);
    document.body.appendChild(card);
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    showInstallCard('Instalala gratis para abrirla desde la pantalla de inicio como una aplicación.', 'Instalar', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    });
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    document.getElementById('nutrifoto-install-card')?.remove();
  });

  if (isIOS) {
    window.addEventListener('load', () => {
      setTimeout(() => showInstallCard('En Safari: tocá Compartir y luego “Agregar a pantalla de inicio”.', 'Entendido', null), 1800);
    });
  }
})();
