<template>
  <div class="w3-bar w3-black">
    <navigation :app-is-small-screen="false" :app-selected-page="toggleValue" @set-active-page="setAppActivePage" />
    <a href="javascript:void(0)" class="w3-bar-item w3-button w3-right w3-hide-large w3-hide-medium"
      v-on:click="burgerClicked">&#9776;</a>
  </div>
  <div id="demo" class="w3-bar-block w3-black w3-hide w3-hide-large w3-hide-medium">
    <navigation :app-is-small-screen="true" :app-selected-page="toggleValue" @set-active-page="setAppActivePage" />
  </div>
  <div style="margin-top: 20px; font-family: arial, sans-serif;;">
    <component :is="activeComp"></component>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggleValue: "heroes"
    }
  },
  computed: {
    activeComp() {
      return this.toggleValue
    },
  },
  methods: {
    burgerClicked() {
      var x = document.getElementById("demo");
      if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
      } else {
        x.className = x.className.replace(" w3-show", "");
      }
    },
    setAppActivePage(selectedPage) {
      this.toggleValue = selectedPage
    }
  }
}
</script>

<style>
table {
  border-collapse: collapse;
  width: 100%;
  background-color: black;
  color: white;
  table-layout: fixed;
}

td,
th {
  border: 0px;
  text-align: left;
  padding: 8px;
}

td {
  word-wrap: break-word;;
}

tr:nth-child(even) {
  background-color: #3D4449;
}

.link-style {
  font-weight: bold;
  color: #2196f3;
  ;
}

.link-style:hover {
  color: red;
  cursor: pointer;
}
</style>