<template>
  <div id="view-matches">
    <table style=" margin-left:auto; margin-right:auto;">
      <tr>
        <th>{{summoner.name}}</th>
      </tr>
      <tr>
        <td>{{summoner.queue}}</td>
      </tr>
      <tr>
        <td>{{summoner.tier}} {{summoner.rank}}</td>
      </tr>
      <tr>
        <td>{{summoner.point}} 포인트</td>
      </tr>
      <tr>
        <td>{{summoner.wins}}승 {{summoner.losses}}패</td>
      </tr>

    </table>
  </div>
</template>

<script lang="ts">

export default {
  props: {
    summoner: Object,
  },

  data (){
    return {
    }
  },

  methods: {

  },

  template: {
    
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 table {
  margin: 40px 0 0;
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


