import * as syncGuide from './how-to-sync-images-to-voiceover.jsx';

// Add new posts here, newest first.
const modules = [syncGuide];

export const posts = modules.map((m) => ({ meta: m.meta, Content: m.default }));

export function getPostBySlug(slug) {
  return posts.find((p) => p.meta.slug === slug);
}
