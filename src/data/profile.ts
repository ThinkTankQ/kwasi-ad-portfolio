export type ProfileMedia = {
  id: string;
  file: string;
  alt: string;
  caption: string;
  credit: string;
  width: number;
  height: number;
  focalPoint: string;
};

export type ProfileStory = {
  eyebrow: string;
  title: string;
  biography: readonly string[];
  nameChapters: readonly {
    id: string;
    number: string;
    title: string;
    text: string;
    mediaId: string;
  }[];
};

export type Milestone = {
  id: string;
  period: string;
  title: string;
  role: string;
  summary: string;
  details: string;
  mediaId: string;
  verification: 'official-source' | 'cv-documented' | 'user-credited';
  sources?: readonly { label: string; url: string }[];
};

export const profileMedia: readonly ProfileMedia[] = [
  {
    id: 'yellow-portrait',
    file: 'kwasi-yellow-portrait',
    alt: 'Kwasi AD standing against a vivid yellow and green background',
    caption: 'Creative technologist / Visual storyteller',
    credit: 'Kwasi AD archive',
    width: 1440,
    height: 2160,
    focalPoint: '50% 38%'
  },
  {
    id: 'monochrome-portrait',
    file: 'kwasi-monochrome-portrait',
    alt: 'Monochrome close portrait of Kwasi AD',
    caption: 'Portrait study',
    credit: 'Kwasi AD archive',
    width: 1440,
    height: 1240,
    focalPoint: '50% 42%'
  },
  {
    id: 'production',
    file: 'kwasi-production',
    alt: 'Kwasi AD working at a computer during a live production',
    caption: 'Behind the frame',
    credit: 'Kwasi AD archive',
    width: 1440,
    height: 960,
    focalPoint: '50% 46%'
  },
  {
    id: 'gdg-speaking',
    file: 'kwasi-gdg-speaking',
    alt: 'Kwasi AD speaking at a Google Developer Groups community event',
    caption: 'Technology in public',
    credit: 'Kwasi AD archive',
    width: 1440,
    height: 2160,
    focalPoint: '50% 42%'
  },
  {
    id: 'generation-unlimited',
    file: 'kwasi-generation-unlimited',
    alt: 'Kwasi AD at a Generation Unlimited youth entrepreneurship initiative',
    caption: 'Youth entrepreneurship',
    credit: 'Kwasi AD archive',
    width: 1440,
    height: 2160,
    focalPoint: '50% 32%'
  },
  {
    id: 'generation-community',
    file: 'generation-unlimited-community',
    alt: 'Participants gathered at a Generation Unlimited community initiative',
    caption: 'Ideas become communities',
    credit: 'Kwasi AD archive',
    width: 1440,
    height: 960,
    focalPoint: '50% 44%'
  },
  {
    id: 'bica-panel',
    file: 'kwasi-bica-panel',
    alt: 'Kwasi AD contributing to a conference panel conversation',
    caption: 'Conversation as creative infrastructure',
    credit: 'ItsCaptured Images / Kwasi AD archive',
    width: 1440,
    height: 2160,
    focalPoint: '50% 38%'
  },
  {
    id: 'community-gathering',
    file: 'kwasi-community-gathering',
    alt: 'Kwasi AD taking part in a community and cultural gathering',
    caption: 'Culture, people, place',
    credit: 'Kwasi AD archive',
    width: 1440,
    height: 2158,
    focalPoint: '50% 38%'
  }
] as const;

export const profileStory: ProfileStory = {
  eyebrow: '04 / Profile',
  title: 'Sunday-born. Universe-minded.',
  biography: [
    'Kwasi AD is an independent creative technologist and visual storyteller based in Gaborone, working across cinematography, photography, digital experience and cultural strategy. Trained in software engineering and multimedia, he learned early to see images and interfaces as the same kind of system: both guide attention, create feeling and help people find their place inside an idea.',
    'His practice has moved through product research, campaign strategy, content direction and image-making, including work connected to AfroChella and AfroFuture and creative leadership across technology, telecommunications and culture. Beyond client work, he helps build the communities where Africa’s next ideas can meet—through Deep Learning IndabaX South Africa, AMLD Africa, Google Developer Groups, responsible-AI workshops and youth entrepreneurship initiatives.',
    'Kwasi is the Akan day name for a boy born on Sunday. In the Akan calendar, Sunday carries an association with awiase: the universe, everything under the sun. That becomes a useful creative compass. His work is not about collecting disciplines; it is about joining them into coherent worlds—framing a live moment, designing the path through it, and leaving behind something people can enter, remember and share.'
  ],
  nameChapters: [
    {
      id: 'sunday',
      number: '01',
      title: 'Sunday',
      text: 'Kwasi is an Akan day name for a boy born on Sunday: an origin carried forward, not a costume put on.',
      mediaId: 'yellow-portrait'
    },
    {
      id: 'universe',
      number: '02',
      title: 'Universe',
      text: 'Sunday’s association with awiase—everything under the sun—offers a way to think in systems, relationships and whole worlds.',
      mediaId: 'monochrome-portrait'
    },
    {
      id: 'practice',
      number: '03',
      title: 'Practice',
      text: 'Camera, interface, strategy and community are not separate lanes. They are instruments for framing an idea from every useful angle.',
      mediaId: 'production'
    }
  ]
} as const;

export const milestones: readonly Milestone[] = [
  {
    id: 'builder-origins',
    period: '2014—16',
    title: 'Builder origins',
    role: 'Software engineering, multimedia and community',
    summary: 'The practice began where code, image and emerging technology met.',
    details: 'Alongside Software Engineering and Multimedia studies, Kwasi became active in GDG Gaborone and earned early recognition through the Orange Young Developer Challenge, Ampion Venture Bus Southern Africa and Seedstars Botswana.',
    mediaId: 'gdg-speaking',
    verification: 'cv-documented'
  },
  {
    id: 'systems-people',
    period: '2017—23',
    title: 'Systems and people',
    role: 'Developer and UX researcher',
    summary: 'Technical systems became a way to understand people, access and behaviour.',
    details: 'Work spanning the Botswana Harvard AIDS Institute Partnership and a Spotify UX research internship added research discipline to a visual and technical foundation.',
    mediaId: 'production',
    verification: 'cv-documented'
  },
  {
    id: 'culture-scale',
    period: 'From 2019',
    title: 'Culture at scale',
    role: 'Digital content and visual storytelling',
    summary: 'Culture-led campaigns turned live energy into digital worlds.',
    details: 'Through AfroChella and AfroFuture, Kwasi’s practice expanded across content direction, digital platforms, campaign systems and the visual rhythm surrounding major cultural moments.',
    mediaId: 'community-gathering',
    verification: 'cv-documented'
  },
  {
    id: 'strategy-motion',
    period: '2019—24',
    title: 'Strategy in motion',
    role: 'Creative leadership and digital strategy',
    summary: 'Multidisciplinary teams connected campaign thinking to experiences people could feel.',
    details: 'Leadership across design, content and digital strategy included coordinating creative teams and contributing to technology, telecommunications, finance and culture campaigns.',
    mediaId: 'bica-panel',
    verification: 'cv-documented'
  },
  {
    id: 'african-ai',
    period: 'Ongoing',
    title: 'African AI communities',
    role: 'Marketing, communications and community organising',
    summary: 'The work extends beyond technology into the networks that make knowledge travel.',
    details: 'Kwasi contributes to Deep Learning IndabaX South Africa and AMLD Africa, alongside community organising with GDG Gaborone and the GDG Johannesburg core team.',
    mediaId: 'gdg-speaking',
    verification: 'official-source',
    sources: [
      { label: 'Deep Learning IndabaX South Africa', url: 'https://indabax.co.za/' },
      { label: 'AMLD Africa team', url: 'https://www.mlafrica.org/about' }
    ]
  },
  {
    id: 'public-voice',
    period: 'Recent work',
    title: 'Convening and public voice',
    role: 'Facilitation, speaking and cultural connection',
    summary: 'A creative practice can also make the room where other ideas become possible.',
    details: 'Recent involvement includes responsible-AI workshops, Generation Unlimited youth entrepreneurship, digital-access conversations and cultural gatherings that connect people across disciplines.',
    mediaId: 'generation-unlimited',
    verification: 'official-source',
    sources: [
      { label: 'Responsible AI workshop', url: 'https://luma.com/3ur8056o' }
    ]
  }
] as const;

export const getProfileMedia = (id: string) => profileMedia.find((item) => item.id === id) ?? profileMedia[0];
