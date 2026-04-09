import {
  AIChatPlugin,
  streamInsertChunk,
  useChatChunk,
} from '@platejs/ai/react';

/**
 * Extended AIChatPlugin configured to use our /generate endpoint.
 * Includes hooks for handling AI response chunks and finishing the stream.
 */
export const aiChatPlugin = AIChatPlugin.extend({
  options: {
    chatOptions: {
      api: '/generate', // This will be intercepted by our custom aiFetch
    },
  },

  useHooks: ({ editor }) => {
    // Note: usePluginOption might need correct import path depending on version
    // Using @udecode/plate-common/react as a likely standard
    
    useChatChunk({
      editor,
      onChunk: ({ chunk, isFirst }) => {
        // Since we are currently using static JSON with the custom fetch adapter,
        // this will receive the full content in one chunk.
        streamInsertChunk(editor, chunk, {
          isFirst,
        });
      },
      onFinish: () => {
        // @ts-ignore - Plate's setOption types might vary
        editor.setOption(AIChatPlugin, 'streaming', false);
      },
    });
  },
});
