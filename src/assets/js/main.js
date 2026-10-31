/* Codel — comportamento do site (menu, vídeo, formulário e eventos para o GTM) */
(function () {
  "use strict";
  window.dataLayer = window.dataLayer || [];
  var WHATS = "5534996723880";

  // Menu no celular
  var btn = document.querySelector(".menu-btn");
  var menu = document.getElementById("menu");
  if (btn && menu) {
    btn.addEventListener("click", function () {
      var aberto = menu.classList.toggle("aberto");
      btn.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
  }

  // Evento de clique no telefone (para criar conversão no GTM, se desejado)
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href^="tel:"]');
    if (a) window.dataLayer.push({ event: "clique_telefone", pagina: location.pathname });
  });

  // Vídeo: só carrega o YouTube quando a pessoa clica (página mais leve)
  document.querySelectorAll(".video[data-video]").forEach(function (box) {
    var capa = box.querySelector(".video-capa");
    if (!capa) return;
    capa.addEventListener("click", function (ev) {
      ev.preventDefault();
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + box.dataset.video + "?autoplay=1&rel=0";
      f.title = "Vídeo da Codel";
      f.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      box.replaceChildren(f);
    });
  });

  // Formulário de orçamento
  var form = document.getElementById("form-orcamento");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var botao = form.querySelector('button[type="submit"]');

  function valor(nome) { var c = form.elements[nome]; return c ? c.value.trim() : ""; }
  function mostrar(msg, tipo) { status.textContent = msg; status.className = "form-status " + (tipo || ""); }

  function valida() {
    var ok = true;
    ["nome", "telefone", "mensagem"].forEach(function (n) {
      var c = form.elements[n];
      var vazio = !c.value.trim();
      c.setAttribute("aria-invalid", vazio ? "true" : "false");
      if (vazio && ok) { c.focus(); ok = false; }
    });
    return ok;
  }

  // Sem chave do Web3Forms configurada: monta a mensagem e abre o WhatsApp
  function viaWhatsApp() {
    var texto = "Olá! Gostaria de um orçamento de coleta.\n" +
      "Nome: " + valor("nome") + "\n" +
      (valor("empresa") ? "Empresa: " + valor("empresa") + "\n" : "") +
      "Telefone: " + valor("telefone") + "\n" +
      (valor("email") ? "E-mail: " + valor("email") + "\n" : "") +
      "Material: " + valor("mensagem");
    window.dataLayer.push({ event: "formulario_orcamento", forma: "whatsapp", origem: form.dataset.origem });
    // Link com "whatsapp" no endereço, para o gatilho de conversão do GTM
    var a = document.createElement("a");
    a.href = "https://api.whatsapp.com/send?phone=" + WHATS + "&text=" + encodeURIComponent(texto);
    a.target = "_blank"; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    mostrar("Abrimos o WhatsApp com a sua mensagem pronta. É só enviar.", "ok");
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (form.elements.botcheck && form.elements.botcheck.checked) return; // robô
    if (!valida()) { mostrar("Preencha nome, telefone e o que precisa descartar.", "erro"); return; }

    var chave = form.dataset.chave;
    if (!chave) { viaWhatsApp(); return; }

    var dados = new FormData(form);
    dados.append("access_key", chave);
    dados.append("origem", form.dataset.origem || location.pathname);
    if (valor("email")) dados.append("replyto", valor("email"));

    botao.disabled = true;
    mostrar("Enviando…");
    fetch("https://api.web3forms.com/submit", { method: "POST", body: dados, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.success) throw new Error(res.message || "erro");
        window.dataLayer.push({ event: "formulario_orcamento", forma: "email", origem: form.dataset.origem });
        form.reset();
        mostrar("Recebemos seu pedido! Retornaremos em breve, em horário comercial.", "ok");
      })
      .catch(function () {
        mostrar("Não foi possível enviar agora. Tente pelo WhatsApp: (34) 99672-3880.", "erro");
      })
      .finally(function () { botao.disabled = false; });
  });
})();
