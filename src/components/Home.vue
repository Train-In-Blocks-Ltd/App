<style>
  .client_container p {
    display: inline;
  }
  .client_link {
    border-bottom: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    padding: 1rem 0;
    margin: 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 400;
    display: block
  }
  .client_link:hover {
    text-decoration: none;
    border-bottom: 2px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    margin-bottom: -1px
  }
  .client_container:last-of-type .client_link:hover {
    margin-bottom: calc(0.5rem - 1px)
  }
  .search {
    width: 100%;
    font-size: 1rem;
  }
</style>
<template>
  <div id="home">
    <h1>Explore</h1>
    <p>Welcome back, {{$parent.claims.name}}!</p>
    <input type="text" rel="search" placeholder="Search..." class="search"/>
    <div v-for="(clients, index) in $parent.posts"
          :key="index" class="client_container">
      <router-link class="client_link" :to="'/client/'+clients.name">
        <p><b>{{clients.name}}</b></p>
        <p> - </p>
        <p>{{clients.email}}</p>
        <p> - </p>
        <p>{{clients.number}}</p>
      </router-link>
    </div>
    <button id="add_client-link" class="button" v-on:click="save()">New client</button>
  </div>
</template>

<script>
export default {
  async created () {
    this.$parent.setup()
    this.$parent.clients()
  }
}
</script>