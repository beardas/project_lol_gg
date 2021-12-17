<template>
  <div class="lol">
    <img alt="LOL logo" src="../assets/lol_char.png" height="150">
    <img alt="LOL logo" src="../assets/lol_logo.png" height="150">
    <img alt="LOL logo" src="../assets/lol_char2.png" height="150">
    <Search msg="리그 오브 레전드 전적 검색"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Search from '@/components/Search_LOL.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'LOL',
  components: {
    Search,
  },
});
</script>
