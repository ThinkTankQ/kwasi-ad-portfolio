import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

let lenis: Lenis | undefined;
if (!reducedMotion) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  gsap.utils.toArray<HTMLElement>('.section-heading h2, .profile__copy h2, .contact h2').forEach((heading) => {
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

document.querySelectorAll<HTMLElement>('.orbit-item').forEach((item) => {
  const focusText = document.querySelector<HTMLElement>('[data-constellation-focus]');
  const update = () => {
    const label = item.querySelector('b')?.textContent;
    const meta = item.querySelector('small')?.textContent;
    if (focusText) focusText.textContent = `${label} — ${meta}`;
  };
  item.addEventListener('mouseenter', update);
  item.addEventListener('focus', update);
});

const constellation = document.querySelector<HTMLElement>('[data-constellation]');
const archiveToggle = document.querySelector<HTMLButtonElement>('[data-archive-toggle]');
archiveToggle?.addEventListener('click', () => {
  const isGrid = constellation?.classList.toggle('is-grid') ?? false;
  archiveToggle.setAttribute('aria-expanded', String(isGrid));
  window.setTimeout(() => ScrollTrigger.refresh(), 500);
});

document.querySelectorAll<HTMLElement>('.magnetic').forEach((element) => {
  if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
  element.addEventListener('pointermove', (event) => {
    const rect = element.getBoundingClientRect();
    gsap.to(element, { x: (event.clientX - rect.left - rect.width / 2) * .12, y: (event.clientY - rect.top - rect.height / 2) * .12, duration: .3 });
  });
  element.addEventListener('pointerleave', () => gsap.to(element, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.35)' }));
});

window.addEventListener('load', () => ScrollTrigger.refresh());
window.addEventListener('pagehide', () => {
  lenis?.destroy();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
