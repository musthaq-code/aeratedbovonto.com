// ==========================================================
// Kalimark — shared behaviour (aeratedbovonto.com + sparkling.co.in)
// ==========================================================

// ---- rising fizz bubbles behind the bottle on the home hero slides (product pages already have .pdp-bubbles) ----
document.addEventListener('DOMContentLoaded',function(){
  var cfg=[[8,10,0,7],[18,6,2.2,6],[27,14,1.1,9],[39,8,3.4,7],[52,12,.6,8],[61,6,2.8,6],[70,16,1.9,10],[79,9,.2,7],[88,7,3.9,6],[95,12,1.5,9],[33,5,4.6,5],[74,5,5.2,6],[58,10,4.1,8],[84,13,2.5,9]];
  document.querySelectorAll('.showcase .slide').forEach(function(sl){
    if(sl.querySelector('.hero-bubbles')) return;
    var b=document.createElement('div'); b.className='hero-bubbles'; b.setAttribute('aria-hidden','true');
    cfg.forEach(function(c){ var i=document.createElement('i'); i.style.cssText='--x:'+c[0]+'%;--s:'+c[1]+'px;--d:'+c[2]+'s;--w:'+c[3]+'s'; b.appendChild(i); });
    sl.insertBefore(b, sl.firstChild);
  });
});

// ---- fit the big background word (home slides + product hero) to the screen width ----
function fitBgWords(){
  document.querySelectorAll('.s-word,.pdp-word').forEach(function(el){
    var box=el.parentElement; if(!box) return;
    if(!el.dataset.split){                                 // two or more words -> one word per line
      var words=el.textContent.trim().split(/\s+/);
      if(words.length>1){ el.textContent=''; words.forEach(function(w){ var sp=document.createElement('span'); sp.textContent=w; el.appendChild(sp); }); el.classList.add('multi'); }
      el.dataset.split='1';
    }
    el.style.fontSize='100px';
    var r=el.getBoundingClientRect(); if(!r.width) return;
    var size=100*(box.clientWidth*0.94)/r.width;          // longest line fills 94% of the screen width
    var hCap=el.classList.contains('multi') ? 0.86 : 0.62; // all lines together stay inside the hero
    size=Math.min(size, 100*(box.clientHeight*hCap)/r.height);
    el.style.fontSize=Math.max(40,size)+'px';
  });
}
window.addEventListener('resize',function(){ clearTimeout(fitBgWords._t); fitBgWords._t=setTimeout(fitBgWords,120); });
window.addEventListener('load',fitBgWords);
// ---- product name (hero title): shrink until its longest word fits its column, so it never runs over the bottle/pack ----
function fitTitles(){
  document.querySelectorAll('.pdp-name,.s-name').forEach(function(el){
    var box=el.parentElement; if(!box) return;
    el.style.fontSize='';
    var avail=box.clientWidth; if(!avail) return;
    var fs=parseFloat(getComputedStyle(el).fontSize), guard=0;
    while(el.scrollWidth>avail+1 && fs>26 && guard++<80){ fs-=2; el.style.fontSize=fs+'px'; }
  });
}
window.addEventListener('resize',function(){ clearTimeout(fitTitles._t); fitTitles._t=setTimeout(fitTitles,120); });
window.addEventListener('load',fitTitles);
document.addEventListener('DOMContentLoaded',fitTitles);

// ---- show the big background word only once the Unbounded font is ready (stops the font-swap jump) ----
(function(){ var d=document.documentElement, done=function(){ fitBgWords(); fitTitles(); d.classList.add('fonts-ok'); };
  if(document.fonts && document.fonts.load){ Promise.race([document.fonts.load('700 100px Unbounded'), new Promise(function(r){ setTimeout(r,2500); })]).then(done,done); }
  else done(); })();

document.addEventListener('DOMContentLoaded', () => {

  // ---- scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 5) * 60 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // ---- product card tilt ----
  document.querySelectorAll('.pcard.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateY(0) rotateX(0) translateY(0)';
    });
  });

  // ---- hero parallax ----
  const heroVisual = document.getElementById('heroVisual');
  if (heroVisual) {
    window.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 980) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      heroVisual.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ---- mobile menu toggle ----
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // ---- contact form ----
  // There is no mail server behind these static pages, so the form opens the
  // visitor's email app with the message filled in, addressed to the inbox in
  // the form's data-to attribute.
  const form = document.getElementById('contactForm');
  if (form) {
    const msg = document.getElementById('formMsg');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const to = form.dataset.to;
      const site = form.dataset.site || location.hostname;
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone ? form.phone.value.trim() : '';
      const topic = form.topic.value;
      const body = form.message.value.trim() +
        '\n\n— ' + name + '\n' + email + (phone ? '\n' + phone : '') +
        '\n\nSent from the contact form on ' + site;
      const href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(topic + ' — ' + name) +
        '&body=' + encodeURIComponent(body);
      window.location.href = href;
      msg.textContent = 'Your email app should open with the message ready to send. If it doesn\'t, write to ' + to + '.';
      msg.classList.add('show');
    });
  }

  // ---- product catalogue: filters ----
  const filterBar = document.getElementById('filters');
  if (filterBar) {
    const cards = Array.from(document.querySelectorAll('.pcard[data-cat]'));
    const apply = (cat) => {
      filterBar.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.cat === cat));
      cards.forEach(c => c.classList.toggle('hide', cat !== 'all' && c.dataset.cat !== cat));
    };
    filterBar.querySelectorAll('button').forEach(b => {
      const n = b.dataset.cat === 'all' ? cards.length : cards.filter(c => c.dataset.cat === b.dataset.cat).length;
      const ct = document.createElement('span'); ct.className = 'ct'; ct.textContent = n; b.appendChild(ct);
      b.addEventListener('click', () => {
        apply(b.dataset.cat);
        history.replaceState(null, '', b.dataset.cat === 'all' ? location.pathname : '#' + b.dataset.cat);
      });
    });
    const fromHash = location.hash.replace('#', '');
    if (fromHash && filterBar.querySelector('[data-cat="' + fromHash + '"]')) apply(fromHash);
  }

  // ---- product catalogue: detail dialog ----
  const dlg = document.getElementById('productDialog');
  if (dlg) {
    const open = (card) => {
      const tpl = card.querySelector('template');
      dlg.querySelector('.pd-img').innerHTML = '';
      const img = card.querySelector('.pimg-wrap img');
      if (img) {
        const big = document.createElement('img');
        big.src = img.src; big.alt = img.alt;
        dlg.querySelector('.pd-img').appendChild(big);
      } else {
        dlg.querySelector('.pd-img').innerHTML = card.querySelector('.pimg-wrap').innerHTML;
      }
      dlg.querySelector('.pd-type').textContent = card.querySelector('.ptype').textContent;
      dlg.querySelector('.pd-name').textContent = card.querySelector('.pname').textContent;
      dlg.querySelector('.pd-body').innerHTML = tpl ? tpl.innerHTML : '';
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    };
    document.querySelectorAll('.pcard[data-cat]').forEach(card => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('click', () => open(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
      });
    });
    dlg.querySelector('.pd-close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  }

  // ---- YouTube grid ----
  // Three boxes in index.html: paste a YouTube link into data-link of each .vslot,
  // or paste YouTube's whole embed code (<iframe ...>) between <div class="vslot"> and </div>.
  // Any link style works (watch?v=, youtu.be/, shorts/, embed/, live/).
  // The thumbnail and title load automatically; clicking opens the video on YouTube.
  // A box with no link shows a "Watch on YouTube" card that opens the channel.
  const yt = document.getElementById('ytGrid');
  if (yt) {
    const channel = yt.dataset.channel;
    const esc = (t) => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    const idOf = (link) => {
      link = (link || '').trim();
      if (/^[\w-]{11}$/.test(link)) return link;
      const m = link.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/);
      return m ? m[1] : '';
    };
    yt.querySelectorAll('.vslot').forEach((slot) => {
      const inner = slot.querySelector('iframe');
      const id = idOf(slot.dataset.link) || (inner ? idOf(inner.getAttribute('src')) : '');
      if (!id) {
        slot.outerHTML = '<a class="vcard empty reveal in" href="' + esc(channel) + '" target="_blank" rel="noopener">' +
          '<span class="play">▶</span><strong>Watch on YouTube</strong><small>@kalimarkdrinks</small></a>';
        return;
      }
      const title = slot.dataset.title || '';
      const btn = document.createElement('a');
      btn.href = 'https://www.youtube.com/watch?v=' + id;
      btn.target = '_blank';
      btn.rel = 'noopener';
      btn.className = 'vcard vthumb reveal in';
      btn.setAttribute('aria-label', 'Watch on YouTube: ' + (title || 'Kalimark video'));
      btn.innerHTML = '<img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="" loading="lazy">' +
        '<span class="vshade"></span><span class="vplay" aria-hidden="true"></span>' +
        '<span class="vcap"><strong>' + esc(title) + '</strong><small>Watch on YouTube</small></span>';
      slot.replaceWith(btn);
      if (!title) {
        fetch('https://noembed.com/embed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id))
          .then(r => r.json()).then(d => {
            if (d && d.title) {
              btn.querySelector('.vcap strong').textContent = d.title;
              btn.setAttribute('aria-label', 'Watch on YouTube: ' + d.title);
            }
          }).catch(() => {});
      }
    });
  }

  // ---- footer year ----
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

});

// ==========================================================
// About page (aeratedbovonto.com): Bovonto animations
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // count-up numbers (data-count="1916", or data-since="1916" for years since)
  const nums = document.querySelectorAll('[data-count],[data-since]');
  const run = (el) => {
    const year = new Date().getFullYear();
    const target = el.dataset.since ? year - (+el.dataset.since) : +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    if (reduce || target === 0) { el.textContent = target + suffix; return; }
    const start = target > 1000 ? target - 120 : 0, t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (target - start) * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (nums.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach(e => {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    }), { threshold: .4 });
    nums.forEach(n => io.observe(n));
  }

  // one-shot animations when a block scrolls into view
  const once = (el, cls, after) => {
    if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach(e => {
      if (e.isIntersecting) {
        el.classList.add(cls);
        if (after) setTimeout(() => el.classList.add(after), 3200);
        io.disconnect();
      }
    }), { threshold: .35 });
    io.observe(el);
  };
  once(document.querySelector('.cta-bottles'), 'in');

  // scroll-linked: spinning bottle in Identity, filling bottle in Milestones
  const spin = document.getElementById('spinBottle');
  const tl = document.getElementById('milestones');
  const level = document.getElementById('fillLevel');
  const yearEl = document.getElementById('fillYear');
  const rows = tl ? Array.from(tl.querySelectorAll('.tl-row')) : [];
  const years = rows.map(r => r.querySelector('.tl-year').textContent.trim());
  if (!spin && !tl) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    if (spin && !reduce) {
      const r = spin.getBoundingClientRect();
      const p = (vh - r.top) / (vh + r.height);           // 0 → 1 while it crosses the screen
      spin.style.transform = `rotateY(${(p - .5) * 70}deg) rotate(${(p - .5) * -16}deg)`;
    }
    if (tl && level) {
      const r = tl.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (vh * .6 - r.top) / (r.height - vh * .3)));
      level.style.height = (8 + p * 92) + '%';
      let lit = -1;
      rows.forEach((row, i) => {
        const on = row.getBoundingClientRect().top < vh * .6;
        row.classList.toggle('lit', on);
        if (on) lit = i;
      });
      if (yearEl) yearEl.textContent = lit >= 0 ? years[lit] : years[0];
    }
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
});

// ==========================================================
// Product showcase (aeratedbovonto.com home + products)
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  const show = document.getElementById('showcase');
  if (show) {
    const slides = Array.from(show.querySelectorAll('.slide'));
    const thumbs = Array.from(show.querySelectorAll('.th'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cur = 0, timer = null;
    const go = (n) => {
      cur = (n + slides.length) % slides.length;
      slides.forEach((s, i) => { s.classList.toggle('on', i === cur); s.setAttribute('aria-hidden', i === cur ? 'false' : 'true'); });
      thumbs.forEach((t, i) => t.classList.toggle('on', i === cur));
      const img = slides[cur].querySelector('img[loading]'); if (img) img.removeAttribute('loading');
    };
    const play = () => { if (reduce) return; clearInterval(timer); timer = setInterval(() => go(cur + 1), 5500); };
    const stop = () => clearInterval(timer);
    thumbs.forEach(t => t.addEventListener('click', () => { go(+t.dataset.go); play(); }));
    show.querySelector('.s-next').addEventListener('click', () => { go(cur + 1); play(); });
    show.querySelector('.s-prev').addEventListener('click', () => { go(cur - 1); play(); });
    show.addEventListener('mouseenter', stop); show.addEventListener('mouseleave', play);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : play());
    let x0 = null;
    show.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    show.addEventListener('touchend', e => {
      if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); play(); }
    });
    show.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { go(cur + 1); play(); }
      if (e.key === 'ArrowLeft') { go(cur - 1); play(); }
    });
    // preload the rest after first paint
    setTimeout(() => show.querySelectorAll('img[loading]').forEach(i => i.removeAttribute('loading')), 1500);
    go(0); play();
  }

  const rail = document.getElementById('rail');
  if (rail) {
    const step = () => Math.min(rail.clientWidth * .8, 600);
    document.querySelector('.rail-next')?.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
    document.querySelector('.rail-prev')?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
  }

  // Pick your fizz line-up: on narrow screens start scrolled to Bovonto in the middle
  const lus = document.getElementById('lineupScroll');
  if (lus) {
    let touched = false;
    const centre = () => {
      if (touched || lus.scrollWidth <= lus.clientWidth) return;
      const mid = lus.querySelector('.lb[href="product/bovonto.html"]');
      let r = lus.scrollWidth / 2;
      if (mid) { const a = mid.getBoundingClientRect(), b = lus.getBoundingClientRect(); r = a.left - b.left + lus.scrollLeft + a.width / 2; }
      lus.scrollLeft = Math.max(0, r - lus.clientWidth / 2);
    };
    ['touchstart', 'wheel', 'mousedown'].forEach(ev => lus.addEventListener(ev, () => { touched = true; }, { passive: true }));
    centre();
    requestAnimationFrame(centre);
    window.addEventListener('load', centre);
    window.addEventListener('resize', () => { touched = false; centre(); });
  }

  // product page tabs
  const tabs = document.querySelectorAll('.pdp-tabs [role="tab"]');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(o => { const on = o === t; o.classList.toggle('on', on); o.setAttribute('aria-selected', on);
      document.getElementById(o.getAttribute('aria-controls')).hidden = !on; });
  }));

  // product page suggestions: new random order on every visit, endless loop with scroll buttons
  const moreRow = document.getElementById('moreRow');
  if (moreRow) {
    const items = [...moreRow.children];
    for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
    items.forEach(el => moreRow.appendChild(el));
    // three copies side by side; we always keep the view inside the middle copy
    const clone = () => items.map(el => { const c = el.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1; return c; });
    clone().forEach(c => moreRow.insertBefore(c, moreRow.firstChild && items[0]));
    clone().forEach(c => moreRow.appendChild(c));
    const setW = () => items[items.length - 1].offsetLeft + items[items.length - 1].offsetWidth - items[0].offsetLeft;
    const jump = (x) => { moreRow.style.scrollSnapType = 'none'; moreRow.scrollLeft = x; requestAnimationFrame(() => { moreRow.style.scrollSnapType = ''; }); };
    const normalise = () => {
      const w = setW(), start = items[0].offsetLeft;
      if (moreRow.scrollLeft < start - w * 0.5) jump(moreRow.scrollLeft + w);
      else if (moreRow.scrollLeft > start + w * 0.5) jump(moreRow.scrollLeft - w);
    };
    jump(items[0].offsetLeft);
    window.addEventListener('load', () => jump(items[0].offsetLeft));
    let t = null;
    moreRow.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(normalise, 140); }, { passive: true });
    const step = () => Math.max(moreRow.clientWidth * 0.8, 200);
    const wrap = moreRow.parentElement;
    wrap.querySelector('.pm-btn.prev').addEventListener('click', () => { normalise(); moreRow.scrollBy({ left: -step(), behavior: 'smooth' }); });
    wrap.querySelector('.pm-btn.next').addEventListener('click', () => { normalise(); moreRow.scrollBy({ left: step(), behavior: 'smooth' }); });
  }

  // old links like products.html#tigo now open that product's own page
  if (/products(\.html)?$/.test(location.pathname)) {
    const h = location.hash.slice(1);
    const t = h && document.querySelector('.ptile[href="product/' + h + '.html"]');
    if (t) location.replace(t.getAttribute('href'));
  }

  // colour the product pop-up with the clicked card's colours
  const dlg = document.querySelector('dialog.pd-color');
  if (dlg) {
    document.querySelectorAll('.cblock').forEach(card => card.addEventListener('click', () => {
      dlg.style.setProperty('--c1', card.style.getPropertyValue('--c1'));
      dlg.style.setProperty('--c2', card.style.getPropertyValue('--c2'));
      const img = dlg.querySelector('.pd-img img');
      if (img) img.classList.toggle('boxed', card.classList.contains('boxed'));
    }));
  }

  // open a product straight from a link like products.html#tigo
  const id = location.hash.slice(1);
  const target = id && document.getElementById(id);
  if (target && target.classList.contains('cblock')) {
    setTimeout(() => { target.scrollIntoView({ block: 'center' }); target.click(); }, 300);
  }
});

// ---- product page: flavour variants ----
(function(){
  var row=document.querySelector('.pdp-variants'); if(!row) return;
  var main=document.querySelector('.pdp-img img'), pdp=document.querySelector('.pdp'), base=main.alt.replace(/ —.*$/,'');
  row.querySelectorAll('.pv').forEach(function(b){
    b.addEventListener('click',function(){
      row.querySelectorAll('.pv').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b?'true':'false');});
      main.src=b.dataset.src; main.alt=base+' — '+b.dataset.name;
      main.style.animation='none'; void main.offsetWidth; main.style.animation='';  // replay the slide-in for the new flavour
      pdp.style.setProperty('--c1',b.dataset.c1); pdp.style.setProperty('--c2',b.dataset.c2);
    });
  });
})();

// ---- product page: swipe / drag / trackpad / arrow keys to move to the previous or next product ----
(function(){
  var hero=document.querySelector('.pdp-hero'); if(!hero) return;
  var prev=hero.querySelector('.pdp-arrow.prev'), next=hero.querySelector('.pdp-arrow.next');
  var img=hero.querySelector('.pdp-visual .pdp-img'); var going=false;
  function go(a,dir){ if(!a||going) return; going=true;
    if(img){ img.style.transition='transform .28s ease,opacity .28s ease'; img.style.transform='translateX('+(dir*-120)+'px)'; img.style.opacity='0'; }
    setTimeout(function(){ location.href=a.href; },180); }
  function settle(){ if(img){ img.style.transition='transform .3s ease'; img.style.transform=''; } }
  var skip='.pdp-variants, a, button, input, textarea, select';
  // touch + mouse drag
  var sx=0, sy=0, dx=0, active=false, horiz=null;
  hero.addEventListener('pointerdown',function(e){ if(e.button>0||e.target.closest(skip)) return; active=true; horiz=null; sx=e.clientX; sy=e.clientY; dx=0; if(img) img.style.transition='none'; });
  window.addEventListener('pointermove',function(e){ if(!active) return; dx=e.clientX-sx; var dy=e.clientY-sy;
    if(horiz===null && (Math.abs(dx)>8||Math.abs(dy)>8)) horiz=Math.abs(dx)>Math.abs(dy);
    if(horiz && img) img.style.transform='translateX('+dx*0.6+'px) rotate('+dx*0.01+'deg)'; });
  function end(){ if(!active) return; active=false;
    if(horiz && Math.abs(dx)>60){ dx<0 ? go(next,1) : go(prev,-1); } else settle(); }
  window.addEventListener('pointerup',end); window.addEventListener('pointercancel',function(){ active=false; settle(); });
  hero.style.touchAction='pan-y'; hero.addEventListener('dragstart',function(e){ e.preventDefault(); });
  // trackpad sideways scroll
  var acc=0, t; hero.addEventListener('wheel',function(e){ if(Math.abs(e.deltaX)<=Math.abs(e.deltaY)) return; e.preventDefault();
    acc+=e.deltaX; clearTimeout(t); t=setTimeout(function(){acc=0;},250);
    if(acc>120){ acc=0; go(next,1); } else if(acc<-120){ acc=0; go(prev,-1); } },{passive:false});
  // keyboard
  document.addEventListener('keydown',function(e){ if(e.target.closest('input,textarea,select,[contenteditable]')) return;
    if(e.key==='ArrowRight') go(next,1); else if(e.key==='ArrowLeft') go(prev,-1); });
  // hint for phones
  if(window.matchMedia('(pointer:coarse)').matches){ var h=document.createElement('div'); h.className='pdp-swipe'; h.textContent='Swipe for more'; var nav=hero.querySelector('.pdp-nav'); if(nav) nav.after(h); }
})();
