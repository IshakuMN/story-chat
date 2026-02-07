import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { Script } from '@/lib/scriptSchema';

// This function will be called from a Next.js API route or Server Action
export async function renderChatVideo(script: Script, onProgress?: (progress: number) => void) {
  
  // The composition is defined in remotion/index.tsx
  const entryPoint = path.join(process.cwd(), 'remotion', 'index.tsx');
  
  console.log('Bundling video...');
  
  // Create a Webpack bundle of the video
  const bundled = await bundle({
    entryPoint,
    // If you have a specific webpack config, you can provide it here
    // For standard Next.js + Tailwind setups, the default usually works but might need tweaking
    // We might need to ensure Tailwind is processed correctly in the bundle
    webpackOverride: (config) => config, 
  });

  console.log('Bundle created:', bundled);

  // Fetch the composition you want to render.
  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'ChatVideo',
    inputProps: { script },
  });

  const outputLocation = path.join(process.cwd(), 'public', 'chat-story.mp4');

  console.log('Rendering video to:', outputLocation);

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation,
    inputProps: { script },
    onProgress: ({ progress }) => {
        if (onProgress) {
            onProgress(progress);
        }
        console.log(`Rendering progress: ${Math.round(progress * 100)}%`);
    },
  });

  console.log('Render done!');
  
  return '/chat-story.mp4'; // Public URL path
}
