import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import Protocol from './ProtocolNode.vue'

export default Node.create({
  name: 'protocolItem',
  group: 'block',
  content: 'inline*',
  draggable: true,

  parseHTML () {
    return [
      {
        tag: 'div[data-type="protocol-item"]'
      }
    ]
  },
  renderHTML ({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'protocol-item' }), 0]
  },
  addNodeView () {
    return VueNodeViewRenderer(Protocol)
  }
})
