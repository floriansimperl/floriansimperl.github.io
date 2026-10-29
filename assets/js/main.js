(function () {
  var nav = document.getElementById('nav');
  var links = document.getElementById('nav-links');
  var toggle = document.querySelector('.nav__toggle');

  // Site root, derived from this script's own path (works on index and sub pages)
  var root = document.currentScript.getAttribute('src').replace(/assets\/js\/main\.js.*$/, '');
  var projects = window.PROJECTS || [];
  var posts = window.POSTS || [];

  // Turns the nav link ending in `hash` into a dropdown listing every item
  function addDropdown(hash, items) {
    var link = links.querySelector('a[href$="' + hash + '"]');
    if (!link || !items.length) return;
    var dropdown = document.createElement('div');
    dropdown.className = 'nav__dropdown';
    link.parentNode.insertBefore(dropdown, link);
    dropdown.appendChild(link);
    var menu = document.createElement('ul');
    menu.className = 'nav__menu';
    items.forEach(function (item) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = root + item.href;
      a.textContent = item.title;
      li.appendChild(a);
      menu.appendChild(li);
    });
    dropdown.appendChild(menu);
  }

  // Fills a grid with the newest cards; the rest sit behind a "Show all" button
  function fillGrid(selector, items, noun, buildCard) {
    var grid = document.querySelector(selector);
    if (!grid || !items.length) return;
    var latest = parseInt(grid.dataset.latest, 10) || 4;
    grid.innerHTML = '';
    items.forEach(function (item, i) {
      var card = buildCard(item);
      card.hidden = i >= latest;
      grid.appendChild(card);
    });
    if (items.length <= latest) return;
    var more = document.createElement('div');
    more.className = 'grid__more';
    var btn = document.createElement('button');
    btn.className = 'btn btn--primary';
    btn.type = 'button';
    var allLabel = 'Show all ' + noun + ' (' + items.length + ')';
    btn.textContent = allLabel;
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', expanded);
      Array.prototype.forEach.call(grid.children, function (c, i) {
        c.hidden = !expanded && i >= latest;
      });
      btn.textContent = expanded ? 'Show fewer ' + noun : allLabel;
    });
    more.appendChild(btn);
    grid.insertAdjacentElement('afterend', more);
  }

  function projectCard(p) {
    var card = document.createElement('a');
    card.className = 'project';
    card.href = root + p.href;
    card.style.setProperty('--h', p.hue);
    if (p.image) {
      var img = document.createElement('img');
      img.src = root + p.image;
      img.alt = '';
      card.appendChild(img);
    }
    var title = document.createElement('span');
    title.textContent = p.title;
    card.appendChild(title);
    return card;
  }

  function postCard(p) {
    var card = document.createElement('article');
    card.className = 'card post';
    var img = document.createElement('div');
    img.className = 'post__img';
    if (p.image) {
      var contain = p.fit === 'contain';
      img.style.background = (contain ? '#fff ' : '') + 'url("' + root + p.image + '") center / ' + (contain ? 'contain' : 'cover') + ' no-repeat';
    }
    var body = document.createElement('div');
    body.className = 'post__body';
    var time = document.createElement('time');
    time.textContent = p.date;
    var title = document.createElement('h3');
    title.textContent = p.title;
    var excerpt = document.createElement('p');
    excerpt.textContent = p.excerpt;
    var more = document.createElement('a');
    more.href = root + p.href;
    more.innerHTML = 'Read more &rarr;';
    [time, title, excerpt, more].forEach(function (el) { body.appendChild(el); });
    card.appendChild(img);
    card.appendChild(body);
    return card;
  }

  addDropdown('#projects', projects);
  addDropdown('#blog', posts);
  fillGrid('.projects', projects, 'projects', projectCard);
  fillGrid('.posts', posts, 'posts', postCard);

  // Solid navbar after scrolling past the top
  function onScroll() {
    nav.classList.toggle('is-solid', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', false);
    }
  });

  // Highlight current section in the nav
  var navAnchors = links.querySelectorAll('a');
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id], section[id]').forEach(function (s) {
    sectionObserver.observe(s);
  });

  // Skill bars and counters animate when visible
  function animateCount(el) {
    var target = +el.dataset.count;
    var start = performance.now();
    var duration = 1600;
    (function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  var revealObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      if (el.dataset.count) animateCount(el);
      if (el.dataset.value) el.style.width = el.dataset.value + '%';
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count], [data-value]').forEach(function (el) {
    revealObserver.observe(el);
  });

  // Testimonial slider
  var slides = document.querySelectorAll('.slide');
  var dots = document.getElementById('dots');
  var current = 0;
  var timer;
  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.classList.toggle('is-active', n === current); });
    dots.querySelectorAll('button').forEach(function (d, n) { d.classList.toggle('is-active', n === current); });
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(function () { show(current + 1); }, 15000);
  }
  slides.forEach(function (_, i) {
    var b = document.createElement('button');
    b.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
    b.addEventListener('click', function () { show(i); restart(); });
    dots.appendChild(b);
  });
  if (slides.length) {
    show(0);
    restart();
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
