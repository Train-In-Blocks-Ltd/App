<style>
  #logout {
    z-index: 999
  }
  #logout_message {
    text-align: center;
    font-size: 2.5rem
  }
  @media (max-width: 768px) {
    #logout_message {
      text-align: center;
      font-size: 2rem;
      margin-top: 40%;
      margin-left: 0
    }
  }
</style>
<template>
  <div id="logout"> 
      <h1 id="logout_message">You have been logged out successfully</h1>
  </div>
</template>
