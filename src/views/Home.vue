<template>
  <div class="home">
    <Code />
  </div>
</template>

<script>
// @ is an alias to /src
import Code from "@/components/Code.vue";

export default {
  components: {
    Code,
  },
};
</script>

<style scoped>
.home {
  background-color: #2f2f2f;
  width: 100%;
  padding: 30px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  border-radius: 30px;
  margin-bottom: 30px;
}
</style>
