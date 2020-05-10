<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="1" >VSCO Auto</v-app-bar>
    <v-content>
      <v-card class="content" elevation="0">
        <HomePage />
      </v-card>
    </v-content>
    <Dialog />
  </v-app>
</template>

<script>
import HomePage from './components/HomePage'
import Dialog from './components/Dialog'

export default {
  name: 'App',

  components: {
    HomePage,
    Dialog
  },

  data: () => ({
    //
  }),
};
</script>

<style scoped>
.content{
  padding: 20px;
  height: 100%;
}
</style>

<style>
html, body{
  overflow: hidden !important;
}
*:not(input){
  user-select: none;
}
h1, h2, h3, h4, h5, h6, div, p, span:not(.v-btn__content), label{
  cursor: default;
}
</style>