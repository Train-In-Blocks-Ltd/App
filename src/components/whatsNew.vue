<template>
  <div>
    <p class="text--large">What's new in Draco 2.0?</p>
    <p class="text--large grey">Interface, design, templates and more</p>
    <br><br>
    <button @click="$parent.isWhatsNewOpen = false, $parent.$parent.willBodyScroll(true)" class="cancel">Close</button>
  </div>
</template>