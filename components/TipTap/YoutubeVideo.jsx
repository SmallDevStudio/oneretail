// components/YoutubeVideo.js
import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import ReactPlayer from 'react-player';

const YouTubeComponent = ({ node, updateAttributes, deleteNode }) => {
  const { src, width, height } = node.attrs;

  return (
    <NodeViewWrapper className="youtube-video" style={{ position: 'relative' }}>
      <ReactPlayer url={src} controls width={width} height={height} />
      <button
        style={{
          position: 'absolute',
          top: 5,
          right: 5,
          background: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
        }}
        onClick={deleteNode}
      >
        X
      </button>
    </NodeViewWrapper>
  );
};

const YouTube = Node.create({
  name: 'youtubeVideo',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '250px',
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
    return ['youtube-video', HTMLAttributes];
  },
  addNodeView() {
    return ReactNodeViewRenderer(YouTubeComponent);
  },
});

export default YouTube;
