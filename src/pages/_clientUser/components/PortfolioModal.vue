<template>
    <div v-html="portfolio.notes" />
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: mapState(["portfolio"]),
};
</script>
