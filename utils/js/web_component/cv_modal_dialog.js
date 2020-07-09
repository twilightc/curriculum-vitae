const template = document.createElement('template');
template.innerHTML = `
  <style>
    :root {
      --white: #fff;
      --black: rgba(0, 0, 0, 0.8);
      --bounceEasing: cubic-bezier(0.51, 0.92, 0.24, 1.15);
    }
    * {
      padding: 0;
      margin: 0;
    }

    body {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: var(--black);
      cursor: pointer;
      visibility: hidden;
      opacity: 0;
      transition: all 0.35s ease-in;
    }

    .modal-dialog {
      position: relative;
      max-width: 1080px;
      max-height: 95vh;
      border-radius: 5px;
      background: var(--white);
      overflow: auto;
      cursor: default;
    }

    .modal.is-visible {
      visibility: visible;
      opacity: 1;
    }

    [data-animation='slideInOutLeft'] .modal-dialog {
      opacity: 0;
      transform: translateX(-100%);
      transition: all 0.4s var(--bounceEasing);
    }

    [data-animation='slideInOutLeft'].is-visible .modal-dialog {
      opacity: 1;
      transform: none;
      transition-delay: 0.1s;
    }
  </style>


  <slot></slot>
  <div class="modal" data-animation="slideInOutLeft">
    <div class="modal-dialog">
    </div>
  </div>
`;
