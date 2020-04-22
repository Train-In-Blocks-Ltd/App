<template>
  <div id="account" v-if="this.$parent.claims">
    <h1>Your Account</h1>
    <p><b>Name: </b><span>{{$parent.claims.name}}</span></p>
    <p><b>Email: </b><span>{{$parent.claims.email}}</span></p>
    <p><router-link to="/update-details" id="update-link" class="button">Update your details</router-link></p>
    <h2>Your Subscription</h2>
  </div>
</template>
