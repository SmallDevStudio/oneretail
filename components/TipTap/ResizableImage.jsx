import { Node } from '@tiptap/core'
import { mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react'
import { Resizeable } from 'react-resizable'

export default Node.create({
  name: 'image',

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
      resizable: true,
    }
  },

  inline() {
    return this.options.inline
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
      },
      alt: {
        default: null,
        parseHTML: element => element.getAttribute('alt'),
      },
      title: {
        default: null,
        parseHTML: element => element.getAttribute('title'),
      },
      width: {
        default: 'auto',
        parseHTML: element => element.style.width,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImage)
  },
})

