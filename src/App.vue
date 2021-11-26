<template>
  <div id="app" class="container">
    <div class="content">
      <div class="columns pt-6 is-multiline">
        <div class="column is-full">
          <router-view />
        </div>
      </div>
    </div>
    <footer class="pb-6">
      Developed with <span class="mr-1">❤️</span> by
      <a href="https://github.com/stockmind" target="_blank"
        >Simone Roberto Nunzi</a
      >
      from Italy
    </footer>
  </div>
</template>

<style>
html {
  min-height: 100%;
  width: 100%;
  background-color: #0e1313 !important;
}

#app {
  min-height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #5e7388;
}

#app a {
  color: #42b983;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
