// info.js
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const infoId = params.get('id');
  
    const titleEl = document.getElementById('infoTitle');
    const contentEl = document.getElementById('infoContent');
  
    if (infoId && typeof infoData !== 'undefined' && infoData[infoId]) {
      const data = infoData[infoId];
      titleEl.textContent = data.title;
      contentEl.innerHTML = data.content;
      document.title = `${data.title} — UPD`;
    } else {
      titleEl.textContent = "Información no encontrada";
      contentEl.innerHTML = `
        <p>Lo sentimos, no pudimos encontrar la página que buscas. Por favor verifica el enlace o regresa al inicio.</p>
        <a href='index.html' class='btn btn-primary' style='margin-top:20px; display:inline-block;'>
            Volver al Inicio
        </a>
      `;
    }
});
