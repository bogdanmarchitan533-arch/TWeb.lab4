/**
 * Formular rezervare (Lab 4): validare JavaScript, total estimat; trimitere POST către CGI.
 */
(function () {
  'use strict';

  var form = document.getElementById('form-rezervare');
  if (!form || typeof cars === 'undefined') return;

  var selMasina = document.getElementById('rez-masina');
  var inpStart = document.getElementById('rez-start');
  var inpEnd = document.getElementById('rez-end');
  var selLoc = document.getElementById('rez-loc');
  var totalBox = document.getElementById('total-box');
  var totalVal = document.getElementById('total-val');
  var errBox = document.getElementById('rezervare-errors');

  function populateCars() {
    selMasina.innerHTML =
      '<option value="">-- Selectează mașina --</option>' +
      cars
        .map(function (c) {
          return (
            '<option value="' +
            c.id +
            '">' +
            c.name +
            ' — ' +
            c.price +
            ' lei/zi</option>'
          );
        })
        .join('');
  }

  function rentalDaysInclusive(startStr, endStr) {
    if (!startStr || !endStr) return 0;
    var s = new Date(startStr + 'T12:00:00');
    var e = new Date(endStr + 'T12:00:00');
    var diff = Math.round((e - s) / 86400000);
    if (diff < 0) return -1;
    return diff + 1;
  }

  function selectedCar() {
    var id = parseInt(selMasina.value, 10);
    if (!id) return null;
    return cars.find(function (c) {
      return c.id === id;
    }) || null;
  }

  function deliveryExtra() {
    if (!selLoc) return 0;
    var opt = selLoc.options[selLoc.selectedIndex];
    return opt && opt.dataset && opt.dataset.extra ? parseInt(opt.dataset.extra, 10) || 0 : 0;
  }

  function showErrors(messages) {
    if (!errBox) return;
    if (!messages.length) {
      errBox.style.display = 'none';
      errBox.innerHTML = '';
      return;
    }
    errBox.style.display = 'block';
    errBox.innerHTML =
      '<strong>Te rugăm să corectezi:</strong><ul>' +
      messages.map(function (m) {
        return '<li>' + m + '</li>';
      }).join('') +
      '</ul>';
  }

  function calcTotal() {
    var car = selectedCar();
    var price = car ? car.price : 0;
    var extra = deliveryExtra();
    var start = inpStart.value;
    var end = inpEnd.value;
    var days = rentalDaysInclusive(start, end);

    if (!car || !start || !end || days <= 0) {
      if (totalBox) totalBox.style.display = 'none';
      return;
    }

    var total = price * days + extra;
    if (totalVal)
      totalVal.textContent =
        total + ' lei (' + days + ' ' + (days === 1 ? 'zi' : 'zile') + ')';
    if (totalBox) totalBox.style.display = 'flex';
  }

  function syncEndMin() {
    if (inpStart && inpEnd && inpStart.value) {
      inpEnd.min = inpStart.value;
      if (inpEnd.value && inpEnd.value < inpStart.value) inpEnd.value = inpStart.value;
    }
  }

  function validate() {
    var msgs = [];
    var nume = (document.getElementById('rez-nume') || {}).value;
    var prenume = (document.getElementById('rez-prenume') || {}).value;
    var tel = (document.getElementById('rez-telefon') || {}).value;
    var email = (document.getElementById('rez-email') || {}).value;

    if (!nume || !nume.trim()) msgs.push('Introduceți numele.');
    if (!prenume || !prenume.trim()) msgs.push('Introduceți prenumele.');
    if (!tel || !tel.trim()) msgs.push('Introduceți telefonul.');
    else if (tel.replace(/\D/g, '').length < 8) msgs.push('Telefonul pare incomplet.');
    if (!email || !email.trim()) msgs.push('Introduceți email-ul.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) msgs.push('Email invalid.');

    if (!selMasina.value) msgs.push('Selectați o mașină.');
    if (!inpStart.value) msgs.push('Selectați data ridicării.');
    if (!inpEnd.value) msgs.push('Selectați data returnării.');

    var days = rentalDaysInclusive(inpStart.value, inpEnd.value);
    if (inpStart.value && inpEnd.value && days < 0)
      msgs.push('Data returnării trebuie să fie după sau egală cu data ridicării.');

    return msgs;
  }

  function submitReservation(e) {
    var msgs = validate();
    showErrors(msgs);
    if (msgs.length) {
      if (e) e.preventDefault();
      return;
    }
  }

  populateCars();

  var params = new URLSearchParams(window.location.search);
  var carId = parseInt(params.get('id'), 10);
  if (carId && cars.some(function (c) { return c.id === carId; })) {
    selMasina.value = String(carId);
  }

  var today = new Date().toISOString().split('T')[0];
  inpStart.min = today;
  inpEnd.min = today;

  selMasina.addEventListener('change', calcTotal);
  inpStart.addEventListener('change', function () {
    syncEndMin();
    calcTotal();
  });
  inpEnd.addEventListener('change', calcTotal);
  if (selLoc) selLoc.addEventListener('change', calcTotal);

  form.addEventListener('submit', submitReservation);

  syncEndMin();
  calcTotal();
})();
