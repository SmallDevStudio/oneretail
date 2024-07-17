import React from 'react';
import { Node, mergeAttributes } from '@tiptap/react';
import getEmbedComponent from '@/utils/getEmbedComponent';

export default Node.create({
  name: 'youtubeVideo',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'youtube-video',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['youtube-video', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node }) => {
      const { src } = node.attrs;
      return (
        <div className="embed">
          {getEmbedComponent(src)}
        </div>
      );
    };
  },
});
