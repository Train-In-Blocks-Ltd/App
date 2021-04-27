<style>
div[data-type='protocol-item'] {
  padding: .6rem;
  border: 1px solid var(--base);
  border-radius: 5px;
  width: fit-content
}
div[data-type='protocol-item'],
.protocol_item {
  font-weight: bold
}
.protocol_item {
  width: fit-content;
  min-width: 10rem;
  border: 2px solid var(--base_light);
  border-radius: 5px;
  transition: var(--transition_standard)
}
.protocol_item .label {
  position: relative;
  width: fit-content;
  left: 1rem;
  top: 0;
  background-color: var(--base_light);
  color: var(--fore);
  font-size: .8rem;
  font-weight: bold;
  padding: .4rem .6rem;
  letter-spacing: 1px;
  border-radius: 0 0 5px 5px;
  transition: var(--transition_standard)
}
.protocol_item .content {
  margin: 1rem
}
#rich_editor:focus-within .protocol_item {
  border-color: var(--base)
}
#rich_editor:focus-within .protocol_item .label {
  background-color: var(--base)
}
</style>

<template>
  <node-view-wrapper class="protocol_item">
    <div class="label">
      Tracked data
    </div>
    <node-view-content class="content" />
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-2'

export default {
  components: {
    NodeViewWrapper,
    NodeViewContent
  },
  props: nodeViewProps
}
</script>
