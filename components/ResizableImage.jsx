import React, { useState, useRef, useEffect } from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import Image from 'next/image'
import Resizeable from 'react-resizable'

const ResizableImage = ({ node, updateAttributes, deleteNode }) => {
  const [width, setWidth] = useState(node.attrs.width || 'auto')
  const [height, setHeight] = useState(node.attrs.height || 'auto')

  const handleResize = (event, { size }) => {
    setWidth(size.width)
    setHeight(size.height)
    updateAttributes({ width: `${size.width}px`, height: `${size.height}px` })
  }

  return (
    <NodeViewWrapper className="resizable-image">
      <div style={{ display: 'inline-block', width, height }}>
        <Resizeable width={width} height={height} onResize={handleResize}>
          <Image src={node.attrs.src} alt={node.attrs.alt} title={node.attrs.title} style={{ width: '100%', height: '100%' }} />
        </Resizeable>
      </div>
    </NodeViewWrapper>
  )
}

export default ResizableImage