<template>
  <div>
    <p class="text--large">What's new in Draco 2.1?</p>
    <p class="text--large grey">Portfolio, bug fixes and better client app</p>
    <br><br>
    <p class="text--small">Portfolio</p>
    <p class="text--small grey">Add information about your business, how to pay, transformations and anything that you wish to share with your clients</p><br><br>
    <p class="text--small">Client app improvements</p>
    <p class="text--small grey">Your clients will now enjoy a better, smoother and faster interface.</p><br><br>
    <p class="text--small">Bug fixes</p>
    <p class="text--small grey">We’ve fixed a ton of problems and now it’s smoother than ever.</p><br><br>
    <br>
    <button @click="$parent.isWhatsNewOpen = false, $parent.$parent.willBodyScroll(true)" class="cancel">Close</button>
  </div>
</template>