import { defineConfig } from 'vocs';

export default defineConfig({
  description: 'Documentation for Get All Work Done API Development',
  title: 'Get All Work Done Docs',
  sidebar: [
    { text: 'Getting Started', link: '/' },
    { text: 'DB Setup', link: 'db-setup' },
    {
      text: 'MISCELLANEOUS',
      items: [{ text: 'Repo Setup', link: '/repo-setup' }],
    },
  ],
  socials: [
    {
      icon: 'github',
      link: 'https://github.com/amjedidiah',
    },
    {
      icon: 'x',
      link: 'https://twitter.com/am_jedidiah',
    },
  ],
});
