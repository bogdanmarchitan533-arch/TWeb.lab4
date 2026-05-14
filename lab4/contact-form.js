/**
 * Formular contact (Lab 4): validare JavaScript; trimitere POST către script CGI.
 */
(function () {
  'use strict';

  var form = document.getElementById('form-contact');
  if (!form) return;

  var err = document.getElementById('contact-errors');

  function showErr(msgs) {
    if (!err) return;
    if (!msgs.length) {
      err.style.display = 'none';
      err.innerHTML = '';
      return;
    }
    err.style.display = 'block';
    err.innerHTML =
      '<ul>' +
      msgs.map(function (m) {
        return '<li>' + m + '</li>';
      }).join('') +
      '</ul>';
  }

  form.addEventListener('submit', function (e) {
    var nume = (document.getElementById('cf-nume') || {}).value.trim();
    var email = (document.getElementById('cf-email') || {}).value.trim();
    var subj = (document.getElementById('cf-subiect') || {}).value.trim();
    var msg = (document.getElementById('cf-mesaj') || {}).value.trim();
    var msgs = [];

    if (!nume) msgs.push('Completați numele.');
    if (!email) msgs.push('Completați email-ul.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) msgs.push('Email invalid.');
    if (!subj) msgs.push('Indicați subiectul.');
    if (!msg || msg.length < 10) msgs.push('Mesajul trebuie să aibă cel puțin 10 caractere.');

    if (msgs.length) {
      e.preventDefault();
      showErr(msgs);
      return;
    }
    showErr([]);
  });
})();
