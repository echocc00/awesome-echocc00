// Projects list page — search + category filter (no deps).
(function () {
  'use strict';
  var grid = document.getElementById('projGrid');
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.project-card'));
  var search = document.getElementById('projSearch');
  var chips = document.querySelectorAll('#catChips .chip');
  var empty = document.getElementById('projEmpty');
  var counts = {
    'all':       document.getElementById('count-all'),
    'security':  document.getElementById('count-security'),
    'network':   document.getElementById('count-network'),
    'content':   document.getElementById('count-content')
  };

  // Build a normalized index per card for searching.
  var index = cards.map(function (card) {
    var cat = card.querySelector('.project-tag-row .project-tag:nth-of-type(2)');
    // Second .project-tag is the category; fall back to title-only.
    var cats = Array.prototype.slice
      .call(card.querySelectorAll('.project-tag-row .project-tag'))
      .map(function (el) { return el.textContent.toLowerCase().trim(); });
    return {
      card: card,
      category: cats.length > 1 ? cats[cats.length - 1] : 'all',
      haystack: card.textContent.toLowerCase()
    };
  });

  // Update category counts.
  var initial = { all: 0, security: 0, network: 0, content: 0 };
  index.forEach(function (i) {
    initial.all++;
    if (initial[i.category] !== undefined) initial[i.category]++;
  });
  Object.keys(initial).forEach(function (k) {
    if (counts[k]) counts[k].textContent = '(' + initial[k] + ')';
  });

  function apply() {
    var q = (search.value || '').trim().toLowerCase();
    var cat = document.querySelector('#catChips .chip.active');
    var activeCat = cat ? cat.getAttribute('data-cat') : 'all';
    var visible = 0;
    index.forEach(function (i) {
      var matchCat = (activeCat === 'all') || (i.category === activeCat);
      var matchText = !q || i.haystack.indexOf(q) !== -1;
      var show = matchCat && matchText;
      i.card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    empty.style.display = visible === 0 ? '' : 'none';
  }

  search.addEventListener('input', apply);
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      apply();
    });
  });

  // Offline / online indicator (preserved from old PWA logic).
  function updateOnline() {
    document.body.dataset.online =
      navigator.onLine === false ? 'false' : 'true';
  }
  window.addEventListener('online', updateOnline);
  window.addEventListener('offline', updateOnline);
  updateOnline();
})();
