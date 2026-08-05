/**
 * ============================================================================
 * SISTEMA DE NOTIFICAÇÃO TOAST (JavaScript)
 * ============================================================================
 * Este script gerencia o evento de clique no botão e a criação dinâmica
 * de elementos de notificação (toasts) que aparecem e somem automaticamente.
 */

// Espera o DOM ser totalmente carregado para evitar erros de seleção de elementos
document.addEventListener('DOMContentLoaded', () => {
  // 1. Seleção dos elementos HTML necessários
  const btnNotify = document.getElementById('btn-notify');
  const toastContainer = document.getElementById('toast-container');

  // Verifica se os elementos existem na página
  if (!btnNotify || !toastContainer) {
    console.error('Elementos necessários para a notificação não foram encontrados.');
    return;
  }

  // 2. Adiciona o ouvinte de evento (Event Listener) no botão de clique
  btnNotify.addEventListener('click', () => {
    showToast('Notificação enviada com sucesso!');
  });

  /**
   * Função responsável por criar e exibir o Toast na tela
   * @param {string} message - A mensagem a ser exibida no Toast
   * @param {number} duration - Tempo em milissegundos até desaparecer (Padrão: 3000ms = 3s)
   */
  function showToast(message, duration = 3000) {
    // A. Criação do elemento div principal do Toast
    const toast = document.createElement('div');
    toast.classList.add('toast');

    // B. Definição do conteúdo interno do Toast (Ícone + Mensagem + Botão Fechar)
    toast.innerHTML = `
      <!-- Ícone SVG de Sucesso (Checkmark dentro de círculo) -->
      <svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>

      <!-- Mensagem da Notificação -->
      <span class="toast-message">${escapeHTML(message)}</span>

      <!-- Botão para fechar manualmente antes do tempo -->
      <button class="toast-close" aria-label="Fechar notificação">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    // C. Insere o Toast dentro do container fixo no canto superior direito
    toastContainer.appendChild(toast);

    // D. Adiciona evento ao botão de fechar manualmente (x)
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      removeToast(toast);
    });

    // E. Configura o temporizador para remover automaticamente após a duração (3 segundos)
    const autoRemoveTimer = setTimeout(() => {
      removeToast(toast);
    }, duration);

    // F. Opcional: Se o usuário passar o mouse sobre o toast, pausa o auto-remove (melhoria de UX)
    toast.addEventListener('mouseenter', () => {
      clearTimeout(autoRemoveTimer);
    });
  }

  /**
   * Função para remover o Toast com animação suave de saída
   * @param {HTMLElement} toastElement - Elemento do toast a ser removido
   */
  function removeToast(toastElement) {
    // Se o toast já estiver sendo removido, previne execuções duplicadas
    if (toastElement.classList.contains('hide')) return;

    // Adiciona a classe 'hide' que dispara a animação CSS @keyframes slideOutRight
    toastElement.classList.add('hide');

    // Aguarda o término da animação CSS (400ms) antes de remover o elemento do DOM
    toastElement.addEventListener('animationend', () => {
      if (toastElement.parentNode) {
        toastElement.remove();
      }
    });
  }

  /**
   * Função utilitária para evitar injeção de HTML malicioso (XSS)
   * @param {string} str - Texto a ser sanitizado
   * @returns {string} Texto seguro para ser inserido no HTML
   */
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
});
