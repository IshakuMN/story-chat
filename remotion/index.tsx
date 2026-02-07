import { registerRoot } from 'remotion';
import { Composition } from 'remotion';
import { z } from 'zod';
import { ChatComposition } from './ChatComposition';
import { ScriptSchema, DEFAULT_SCRIPT } from '@/lib/scriptSchema';
import { calculateScriptTimeline, FPS } from '@/lib/timingUtils';

// Helper to calculate metadata (duration) based on script
const calculateMetadata = async ({ props }: { props: any }) => {
    // We cannot reliably import timingUtils here if this runs in a separate bundle, 
    // but usually in Remotion it works fine if files are in same project.
    // However, for safety, let's recalculate or trust the prop was passed? 
    // Actually, calculateScriptTimeline is pure JS, so it should work.
    const { totalDurationFrames } = calculateScriptTimeline(props.script || DEFAULT_SCRIPT);
    return {
        durationInFrames: totalDurationFrames,
        props: props
    };
};

export const RemotionRoot: React.FC = () => {
    // Default duration for initial render before props are passed
    const { totalDurationFrames: defaultDuration } = calculateScriptTimeline(DEFAULT_SCRIPT);
    
    return (
        <>
            <Composition
                id="ChatVideo"
                component={ChatComposition}
                durationInFrames={defaultDuration} // Fallback
                fps={FPS}
                width={1080}
                height={1920}
                schema={z.object({
                    script: ScriptSchema,
                })}
                defaultProps={{
                    script: DEFAULT_SCRIPT,
                }}
                calculateMetadata={calculateMetadata} // Dynamic duration!
            />
        </>
    );
};

registerRoot(RemotionRoot);
