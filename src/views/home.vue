<template>
  <div>
      <top></top>
      <router-view></router-view>
  </div>
</template>

<script>
import top from '@/views/top.vue'
export default {
  name: 'home',
  components: {
      top,
  },
  data () {
    return {
      
    }
  },
  methods: {
      

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
