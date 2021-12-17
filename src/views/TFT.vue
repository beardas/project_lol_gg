<template>
  <div class="tft">
    <img alt="TFT logo" src="../assets/tft_char.png" height="150">
    <img alt="TFT logo" src="../assets/tft_logo.png" height="150">
    <img alt="TFT logo" src="../assets/tft_char_2.png" height="150">
    <Search msg="전략적 팀 전투 전적 검색"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Search from '@/components/Search_TFT.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'TFT',
  components: {
    Search,
  },
});
</script>