import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
const loader = document.querySelector<HTMLElement>('[data-loader]');
const loaderProgress = document.querySelector<HTMLElement>('[data-loader-progress]');
const loaderStatus = document.querySelector<HTMLElement>('[data-loader-status]');
const loaderPhrases = Array.from(document.querySelectorAll<HTMLElement>('[data-loader-phrase]'));

const showPhrase = (index: number) => {
  loaderPhrases.forEach((phrase, phraseIndex) => {
    phrase.classList.toggle('is-active', phraseIndex === index);
    phrase.classList.toggle('is-leaving', phraseIndex < index);
  });
};

const revealHero = () => {
  if (reducedMotion) return;
  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  timeline
    .from('.hero__frame', { clipPath: 'inset(100% 0 0 0)', duration: 1.1 })
    .from('.hero__title > span:not(.sr-only)', { yPercent: 110, opacity: 0, stagger: 0.12, duration: 1 }, '-=.75')
    .from(['.hero__eyebrow', '.hero__statement', '.hero__disciplines', '.hero__cta'], { y: 24, opacity: 0, stagger: .08, duration: .65 }, '-=.55');
};

const finishLoader = () => {
  if (!loader) return;
  sessionStorage.setItem('kwasi-loader-seen', '1');
  loader.classList.add('is-done');
  document.body.classList.remove('is-loading');
  loaderStatus?.remove();
  window.dispatchEvent(new CustomEvent('loader:done'));
  window.setTimeout(() => loader.remove(), 800);
};

const runLoader = async () => {
  if (!loader) {
    revealHero();
    return;
  }

  const alreadySeen = sessionStorage.getItem('kwasi-loader-seen') === '1';
  if (alreadySeen) {
    loader.remove();
    loaderStatus?.remove();
    revealHero();
    return;
  }

  document.body.classList.add('is-loading');
  if (reducedMotion) {
    showPhrase(0);
    if (loaderProgress) loaderProgress.textContent = '100';
    if (loaderStatus) loaderStatus.textContent = 'Kwasi AD portfolio ready';
    window.setTimeout(finishLoader, 450);
    return;
  }

  const images = Array.from(document.querySelectorAll<HTMLImageElement>('img[data-preload]'));
  const tasks: Promise<unknown>[] = images.map((image) => {
    if (image.complete) return image.decode().catch(() => undefined);
    return new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  });
  if ('fonts' in document) tasks.push(document.fonts.ready);

  let loaded = 0;
  tasks.forEach((task) => task.finally(() => loaded += 1));
  const total = Math.max(tasks.length, 1);
  const start = performance.now();
  const minimum = 2400;
  const timeout = 5000;
  let displayed = 0;
  let previousPhrase = -1;

  const tick = (now: number) => {
    const elapsed = now - start;
    const actual = (loaded / total) * 100;
    const paced = Math.min(100, (elapsed / minimum) * 100);
    const target = Math.min(actual, paced, 99);
    displayed += (target - displayed) * .12;
    const value = Math.max(0, Math.floor(displayed));
    if (loaderProgress) loaderProgress.textContent = String(value);
    if (loaderStatus) loaderStatus.textContent = `Loading Kwasi AD’s portfolio, ${value} percent`;
    const phraseIndex = Math.min(3, Math.floor(value / 25));
    if (phraseIndex !== previousPhrase) {
      showPhrase(phraseIndex);
      previousPhrase = phraseIndex;
    }

    const ready = loaded >= total && elapsed >= minimum;
    const timedOut = elapsed >= timeout;
    if (ready || timedOut) {
      showPhrase(3);
      if (loaderProgress) loaderProgress.textContent = '100';
      if (loaderStatus) loaderStatus.textContent = 'Kwasi AD portfolio ready';
      window.setTimeout(finishLoader, 300);
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if (loader) window.addEventListener('loader:done', revealHero, { once: true });
runLoader();

const header = document.querySelector<HTMLElement>('[data-header]');
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > Math.min(window.innerHeight * .55, 520));
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const sectionLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-section-link], .site-header nav a'));
const observedSections = ['work', 'profile', 'contact']
  .map((id) => document.getElementById(id))
  .filter((section): section is HTMLElement => Boolean(section));

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  sectionLinks.forEach((link) => {
    const active = link.hash === `#${visible.target.id}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-25% 0px -55%', threshold: [0, .2, .5] });
observedSections.forEach((section) => sectionObserver.observe(section));

let lenis: Lenis | undefined;
if (!reducedMotion) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  gsap.utils.toArray<HTMLElement>('.section-heading h2, .profile__copy h2, .community__header h2, .contact h2').forEach((heading) => {
    gsap.from(heading, { yPercent: 24, opacity: 0, duration: 1, scrollTrigger: { trigger: heading, start: 'top 84%' } });
  });

  gsap.from('.project-card', {
    y: 90, opacity: 0, stagger: .14, duration: .9,
    scrollTrigger: { trigger: '.filmstrip__rail', start: 'top 82%' }
  });

  const collage = document.querySelector<HTMLElement>('[data-collage]');
  if (collage) {
    ScrollTrigger.create({
      trigger: collage,
      start: 'top 62%',
      onEnter: () => collage.classList.add('is-revealed'),
      onEnterBack: () => collage.classList.add('is-revealed')
    });
    gsap.to('.collage__title span:nth-child(1)', { xPercent: -10, scrollTrigger: { trigger: collage, start: 'top bottom', end: 'bottom top', scrub: .8 } });
    gsap.to('.collage__title span:nth-child(3)', { xPercent: 8, scrollTrigger: { trigger: collage, start: 'top bottom', end: 'bottom top', scrub: .8 } });
  }
}

const filmstripRail = document.querySelector<HTMLElement>('#filmstrip-rail');
const filmstripCards = Array.from(document.querySelectorAll<HTMLElement>('.project-card'));
const filmstripCurrent = document.querySelector<HTMLElement>('[data-rail-current]');
const filmstripPrev = document.querySelector<HTMLButtonElement>('[data-rail-prev]');
const filmstripNext = document.querySelector<HTMLButtonElement>('[data-rail-next]');

const updateFilmstrip = () => {
  if (!filmstripRail || !filmstripCards.length) return;
  const railLeft = filmstripRail.getBoundingClientRect().left;
  const index = filmstripCards.reduce((nearest, card, cardIndex) => {
    const distance = Math.abs(card.getBoundingClientRect().left - railLeft);
    return distance < nearest.distance ? { index: cardIndex, distance } : nearest;
  }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
  const canScroll = filmstripRail.scrollWidth - filmstripRail.clientWidth > 2;
  if (filmstripCurrent) filmstripCurrent.textContent = String(index + 1).padStart(2, '0');
  if (filmstripPrev) filmstripPrev.disabled = !canScroll || index === 0;
  if (filmstripNext) filmstripNext.disabled = !canScroll || index === filmstripCards.length - 1;
};

const scrollFilmstrip = (direction: number) => {
  if (!filmstripRail || !filmstripCards[0]) return;
  const gap = Number.parseFloat(getComputedStyle(filmstripRail).columnGap) || 0;
  filmstripRail.scrollBy({ left: direction * (filmstripCards[0].offsetWidth + gap), behavior: reducedMotion ? 'auto' : 'smooth' });
};
filmstripPrev?.addEventListener('click', () => scrollFilmstrip(-1));
filmstripNext?.addEventListener('click', () => scrollFilmstrip(1));
filmstripRail?.addEventListener('scroll', updateFilmstrip, { passive: true });
updateFilmstrip();

const projectVelocity = (velocity: number, decelerationRate = .99) => (velocity / 1000) * decelerationRate / (1 - decelerationRate);
const rubberband = (overshoot: number, dimension: number, constant = .55) =>
  (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));

const stack = document.querySelector<HTMLElement>('[data-card-stack]');
const stackCards = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-stack-card]'));
const stackPrev = document.querySelector<HTMLButtonElement>('[data-stack-prev]');
const stackNext = document.querySelector<HTMLButtonElement>('[data-stack-next]');
const stackCurrent = document.querySelector<HTMLElement>('[data-stack-current]');
let activeCard = Math.min(2, stackCards.length - 1);

const renderStack = () => {
  stackCards.forEach((card, index) => {
    let slot = index - activeCard;
    if (slot > 2) slot -= stackCards.length;
    if (slot < -2) slot += stackCards.length;
    card.style.setProperty('--slot', String(slot));
    card.style.setProperty('--drag-x', '0px');
    card.style.setProperty('--drag-r', '0deg');
    card.style.zIndex = String(10 - Math.abs(slot));
    card.classList.toggle('is-active', index === activeCard);
    if (index === activeCard) card.setAttribute('aria-current', 'true');
    else card.removeAttribute('aria-current');
  });
  if (stackCurrent) stackCurrent.textContent = String(activeCard + 1).padStart(2, '0');
};

const moveStack = (direction: number) => {
  if (!stackCards.length) return;
  activeCard = (activeCard + direction + stackCards.length) % stackCards.length;
  renderStack();
  stackCards[activeCard]?.focus({ preventScroll: true });
};

if (stack && stackCards.length) {
  if (window.matchMedia('(min-width: 801px)').matches) {
    stack.classList.add('is-stack-ready');
    renderStack();
    stackCards.forEach((card, index) => {
      let startX = 0;
      let currentX = 0;
      let dragging = false;
      let history: Array<{ x: number; time: number }> = [];

      card.addEventListener('pointerdown', (event) => {
        activeCard = index;
        renderStack();
        startX = event.clientX;
        currentX = 0;
        dragging = false;
        history = [{ x: event.clientX, time: performance.now() }];
        card.setPointerCapture(event.pointerId);
      });
      card.addEventListener('pointermove', (event) => {
        if (!card.hasPointerCapture(event.pointerId)) return;
        const raw = event.clientX - startX;
        if (!dragging && Math.abs(raw) < 10) return;
        dragging = true;
        event.preventDefault();
        currentX = Math.abs(raw) > 180 ? Math.sign(raw) * (180 + rubberband(Math.abs(raw) - 180, 240)) : raw;
        history.push({ x: event.clientX, time: performance.now() });
        history = history.filter((sample) => performance.now() - sample.time < 120);
        card.classList.add('is-dragging');
        card.style.setProperty('--drag-x', `${currentX}px`);
        card.style.setProperty('--drag-r', `${currentX * .025}deg`);
      });
      card.addEventListener('pointerup', (event) => {
        if (!card.hasPointerCapture(event.pointerId)) return;
        card.releasePointerCapture(event.pointerId);
        card.classList.remove('is-dragging');
        if (!dragging) return;
        const first = history[0];
        const last = history[history.length - 1];
        const velocity = first && last && last.time > first.time ? ((last.x - first.x) / (last.time - first.time)) * 1000 : 0;
        const projected = currentX + projectVelocity(velocity);
        if (Math.abs(projected) > 90) moveStack(projected < 0 ? 1 : -1);
        else renderStack();
        card.dataset.suppressClick = 'true';
        window.setTimeout(() => delete card.dataset.suppressClick, 0);
      });
      card.addEventListener('pointercancel', () => {
        card.classList.remove('is-dragging');
        renderStack();
      });
      card.addEventListener('click', (event) => {
        if (card.dataset.suppressClick) event.preventDefault();
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          moveStack(event.key === 'ArrowRight' ? 1 : -1);
        }
      });
    });
  } else {
    const updateMobileStack = () => {
      const index = stackCards.reduce((nearest, card, cardIndex) => {
        const distance = Math.abs(card.getBoundingClientRect().left - stack.getBoundingClientRect().left);
        return distance < nearest.distance ? { index: cardIndex, distance } : nearest;
      }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
      activeCard = index;
      if (stackCurrent) stackCurrent.textContent = String(index + 1).padStart(2, '0');
    };
    stack.addEventListener('scroll', updateMobileStack, { passive: true });
    const mobileMove = (direction: number) => {
      const target = Math.max(0, Math.min(stackCards.length - 1, activeCard + direction));
      stackCards[target]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
    };
    stackPrev?.addEventListener('click', () => mobileMove(-1));
    stackNext?.addEventListener('click', () => mobileMove(1));
  }
}
if (window.matchMedia('(min-width: 801px)').matches) {
  stackPrev?.addEventListener('click', () => moveStack(-1));
  stackNext?.addEventListener('click', () => moveStack(1));
}

document.querySelectorAll<HTMLElement>('.orbit-item').forEach((item) => {
  const focusText = document.querySelector<HTMLElement>('[data-constellation-focus]');
  const update = () => {
    const label = item.querySelector('b')?.textContent;
    const meta = item.querySelector('small')?.textContent;
    if (focusText) focusText.textContent = `${label} — ${meta}`;
  };
  item.addEventListener('mouseenter', update);
  item.addEventListener('focus', update);
  item.addEventListener('click', (event) => {
    if (!coarsePointer || item.classList.contains('is-touch-active')) return;
    event.preventDefault();
    document.querySelectorAll('.orbit-item.is-touch-active').forEach((active) => active.classList.remove('is-touch-active'));
    item.classList.add('is-touch-active');
    update();
  });
});

document.addEventListener('pointerdown', (event) => {
  if (!(event.target as Element).closest('.orbit-item')) {
    document.querySelectorAll('.orbit-item.is-touch-active').forEach((active) => active.classList.remove('is-touch-active'));
  }
});

const constellation = document.querySelector<HTMLElement>('[data-constellation]');
const archiveToggle = document.querySelector<HTMLButtonElement>('[data-archive-toggle]');
archiveToggle?.addEventListener('click', () => {
  const isGrid = constellation?.classList.toggle('is-grid') ?? false;
  archiveToggle.setAttribute('aria-expanded', String(isGrid));
  window.setTimeout(() => ScrollTrigger.refresh(), 500);
});

document.querySelectorAll<HTMLElement>('.magnetic').forEach((element) => {
  if (reducedMotion || coarsePointer) return;
  element.addEventListener('pointermove', (event) => {
    const rect = element.getBoundingClientRect();
    gsap.to(element, { x: (event.clientX - rect.left - rect.width / 2) * .12, y: (event.clientY - rect.top - rect.height / 2) * .12, duration: .3 });
  });
  element.addEventListener('pointerleave', () => gsap.to(element, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.35)' }));
});

const focusGame = document.querySelector<HTMLElement>('[data-focus-game]');
const focusStage = document.querySelector<HTMLElement>('[data-focus-stage]');
const focusReticle = document.querySelector<HTMLElement>('[data-focus-reticle]');
const focusLabel = document.querySelector<HTMLElement>('[data-focus-label]');
const focusStatus = document.querySelector<HTMLElement>('[data-focus-status]');
const bookingLink = focusGame?.querySelector<HTMLAnchorElement>('.contact__cta');

if (focusGame && focusStage && focusReticle && bookingLink) {
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let frame = 0;
  let locked = false;
  let touchDragging = false;

  const setReticle = () => {
    focusReticle.style.left = `${currentX}px`;
    focusReticle.style.top = `${currentY}px`;
  };
  const lockFocus = () => {
    if (locked) return;
    locked = true;
    focusGame.classList.add('is-locked');
    if (focusLabel) focusLabel.textContent = 'Send the brief';
    if (focusStatus) focusStatus.textContent = 'Focus locked. The booking email link is ready.';
    if (!reducedMotion) {
      focusGame.classList.add('is-flashing');
      window.setTimeout(() => focusGame.classList.remove('is-flashing'), 380);
    }
  };
  const checkFocus = () => {
    const stageRect = focusStage.getBoundingClientRect();
    const linkRect = bookingLink.getBoundingClientRect();
    const centerX = linkRect.left - stageRect.left + linkRect.width / 2;
    const centerY = linkRect.top - stageRect.top + linkRect.height / 2;
    if (Math.hypot(currentX - centerX, currentY - centerY) < Math.min(82, linkRect.width * .42)) lockFocus();
  };
  const spring = () => {
    const stiffness = .17;
    const damping = .72;
    velocityX = (velocityX + (targetX - currentX) * stiffness) * damping;
    velocityY = (velocityY + (targetY - currentY) * stiffness) * damping;
    currentX += velocityX;
    currentY += velocityY;
    setReticle();
    checkFocus();
    if (Math.abs(targetX - currentX) > .1 || Math.abs(targetY - currentY) > .1 || Math.abs(velocityX) > .1 || Math.abs(velocityY) > .1) {
      frame = requestAnimationFrame(spring);
    } else frame = 0;
  };
  const retarget = (x: number, y: number, immediate = false) => {
    const rect = focusStage.getBoundingClientRect();
    targetX = Math.max(38, Math.min(rect.width - 38, x));
    targetY = Math.max(38, Math.min(rect.height - 38, y));
    if (immediate) {
      currentX = targetX;
      currentY = targetY;
      velocityX = 0;
      velocityY = 0;
      setReticle();
      checkFocus();
    } else if (!frame) frame = requestAnimationFrame(spring);
  };

  const initialRect = focusStage.getBoundingClientRect();
  retarget(initialRect.width * .14, initialRect.height * .5, true);
  if (reducedMotion) {
    if (focusLabel) focusLabel.textContent = 'Send the brief';
  } else {
    focusStage.addEventListener('pointermove', (event) => {
      const rect = focusStage.getBoundingClientRect();
      if (coarsePointer && !touchDragging) return;
      retarget(event.clientX - rect.left, event.clientY - rect.top, coarsePointer);
    });
    focusStage.addEventListener('pointerdown', (event) => {
      if ((event.target as Element).closest('a')) return;
      touchDragging = true;
      focusStage.setPointerCapture(event.pointerId);
      const rect = focusStage.getBoundingClientRect();
      retarget(event.clientX - rect.left, event.clientY - rect.top, coarsePointer);
    });
    const releaseFocusPointer = (event: PointerEvent) => {
      touchDragging = false;
      if (focusStage.hasPointerCapture(event.pointerId)) focusStage.releasePointerCapture(event.pointerId);
    };
    focusStage.addEventListener('pointerup', releaseFocusPointer);
    focusStage.addEventListener('pointercancel', releaseFocusPointer);
  }
  bookingLink.addEventListener('focus', lockFocus);
}

const storySteps = Array.from(document.querySelectorAll<HTMLElement>('[data-story-step]'));
const storyImages = Array.from(document.querySelectorAll<HTMLElement>('[data-story-image]'));
const storyCount = document.querySelector<HTMLElement>('[data-story-count]');
let storyObserver: IntersectionObserver | undefined;

const activateStoryStep = (index: number) => {
  storySteps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
  storyImages.forEach((image, imageIndex) => image.classList.toggle('is-active', imageIndex === index));
  if (storyCount) storyCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(storySteps.length).padStart(2, '0')}`;
};

if (storySteps.length) {
  storyObserver = new IntersectionObserver((entries) => {
    const activeEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!activeEntry) return;
    activateStoryStep(storySteps.indexOf(activeEntry.target as HTMLElement));
  }, { rootMargin: '-28% 0px -42%', threshold: [0, .2, .5, .8] });
  storySteps.forEach((step, index) => {
    storyObserver?.observe(step);
    step.addEventListener('focus', () => activateStoryStep(index));
    step.addEventListener('pointerdown', () => activateStoryStep(index));
  });
}

const communityRail = document.querySelector<HTMLElement>('[data-community-rail]');
const communityCards = Array.from(document.querySelectorAll<HTMLElement>('.milestone'));
const communityCurrent = document.querySelector<HTMLElement>('[data-community-current]');
const communityPrev = document.querySelector<HTMLButtonElement>('[data-community-prev]');
const communityNext = document.querySelector<HTMLButtonElement>('[data-community-next]');
let communityIndex = 0;

const updateCommunityRail = () => {
  if (!communityRail || !communityCards.length) return;
  const railLeft = communityRail.getBoundingClientRect().left;
  communityIndex = communityCards.reduce((nearest, card, index) => {
    const distance = Math.abs(card.getBoundingClientRect().left - railLeft);
    return distance < nearest.distance ? { index, distance } : nearest;
  }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
  if (communityCurrent) communityCurrent.textContent = String(communityIndex + 1).padStart(2, '0');
  if (communityPrev) communityPrev.disabled = communityIndex === 0;
  if (communityNext) communityNext.disabled = communityIndex === communityCards.length - 1;
};

const moveCommunityRail = (direction: number) => {
  const target = Math.max(0, Math.min(communityCards.length - 1, communityIndex + direction));
  communityCards[target]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
};

communityPrev?.addEventListener('click', () => moveCommunityRail(-1));
communityNext?.addEventListener('click', () => moveCommunityRail(1));
communityRail?.addEventListener('scroll', updateCommunityRail, { passive: true });
communityRail?.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  moveCommunityRail(event.key === 'ArrowRight' ? 1 : -1);
});
updateCommunityRail();

const animatedRegions = Array.from(document.querySelectorAll<HTMLElement>('.constellation, .contact'));
const motionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('is-in-view', entry.isIntersecting));
}, { rootMargin: '15% 0px' });
animatedRegions.forEach((region) => motionObserver.observe(region));

window.addEventListener('load', () => ScrollTrigger.refresh());
window.addEventListener('pagehide', () => {
  lenis?.destroy();
  sectionObserver.disconnect();
  storyObserver?.disconnect();
  motionObserver.disconnect();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
