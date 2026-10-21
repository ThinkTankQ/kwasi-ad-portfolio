export const loaderCopy = [
  { lang: 'en', label: 'English', text: 'WELCOME TO MY WORLD' },
  { lang: 'tw', label: 'Twi', text: 'AKWAABA ME WIASE MU' },
  { lang: 'fr', label: 'French', text: 'BIENVENUE DANS MON UNIVERS' },
  { lang: 'sw', label: 'Swahili', text: 'KARIBU KATIKA ULIMWENGU WANGU' }
] as const;

export const siteConfig = {
  name: 'Kwasi AD',
  handle: '@akyems_very_own',
  bookingEmail: 'quillerthelon@gmail.com',
  bookingSubject: 'Project inquiry — Kwasi AD',
  instagramUrl: 'https://www.instagram.com/akyems_very_own/',
  location: 'Available worldwide',
  description:
    'A multidisciplinary creative working across cinematography, photography, cultural campaigns and digital experiences.',
  disciplines: ['Cinematography', 'Photography', 'Digital experiences'],
  availability: 'Selected commissions · 2026'
} as const;

export const creativeTools = [
  { id: 'ae', label: 'After Effects', mark: 'Ae' },
  { id: 'ps', label: 'Photoshop', mark: 'Ps' },
  { id: 'ai', label: 'Illustrator', mark: 'Ai' },
  { id: 'warning', label: 'Production alert', mark: '!' },
  { id: 'notes', label: 'Notes', mark: '' },
  { id: 'photos', label: 'Photos', mark: '' },
  { id: 'instagram', label: 'Instagram', mark: '' },
  { id: 'mail', label: 'Mail', mark: '' },
  { id: 'trash', label: 'Archive', mark: '' }
] as const;
