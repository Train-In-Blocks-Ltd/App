<template>
  <div>
    <p class="text--large">What's new in Draco 2.0?</p>
    <p class="text--large grey">Interface, design, templates and more</p>
    <br><br>
    <p class="text--small">Templates</p>
    <p class="text--small grey">You can now add pre-made templates to help you speed up your programming. Use this for warm-ups, meal plans, recovery, or anything that you use on a regular basis.</p><br><br>
    <p class="text--small">Images</p>
    <p class="text--small grey">That’s right, you can now add in images to support your clients. Just paste or upload it from your storage.</p><br><br>
    <p class="text--small">Videos</p>
    <p class="text--small grey">In addition to the images, you can now add embedded videos for explanations or just to give it a personal touch.</p><br><br>
    <p class="text--small">Improved interface</p>
    <p class="text--small grey">As you can see, we have improved our design. It’s so much clearer and better to look at.</p><br><br>
    <p class="text--small">New calendar option</p>
    <p class="text--small grey">We have a new calendar view to show the sessions over 3-days rather an entire month. This makes it easier to use on mobile devices.</p><br><br>
    <p class="text--small">More multi-select options</p>
    <p class="text--small grey">You can now perform more tasks on multiple sessions. E.g. complete and incomplete.</p><br><br>
    <p class="text--small">Speed</p>
    <p class="text--small grey">The app is now super fast with some behind-the-scene changes.</p><br><br>
    <p class="text--small">Bug fixes</p>
    <p class="text--small grey">We’ve fixed a ton of problems and now it’s smoother than ever.</p><br><br>
    <br>
    <button @click="$parent.isWhatsNewOpen = false, $parent.$parent.willBodyScroll(true)" class="cancel">Close</button>
  </div>
</template>