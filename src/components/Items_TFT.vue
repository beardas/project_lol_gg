<template>
    <div class="item" style="margin-top: 50px;">
        <table class="table" :class="{on :activeTable}" style="margin:auto;" @mouseover="activeTable = true" @mouseleave="activeTable = false">
            <tr v-for="(item, idx) in items" :key="idx" :class="{main :idx==='element_items', on :activeTr[idx]}"
                @mouseover="activeTr[idx] = true" @mouseleave="activeTr[idx] = false">
                <td :class="{main :index==0, on :activeTd[index]}" v-for="(i, index) in item" :key="index"
                    @mouseover="activeTd[index] = true" @mouseleave="activeTd[index] = false">
                    <img :src="getPic(i.image)" alt="" width="64" style="border-radius: 10px;">
                </td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from 'vue';
import itemsJson from '@/json/TFT_items.json'

export default defineComponent({
    components: {},
    props: [],
    data() {
        return {
            items : itemsJson,
            activeTable : '',
            activeTr : [],
            activeTd : [],
        }
    },

    async created() {

    },

    mounted() {

    },

    methods : {
        getPic(name: string) {
            if(name.length > 0) return require(`@/assets/TFT_items/${name}`)
        },
    },
    
})
</script>

<style>
.table.on > tr > td:not(.on) {
    filter: grayscale(1);
    opacity: .6;
}

.table.on > tr.on,
.table.on > tr.on > td.on,
.table.on > tr.main > td.on,
.table.on > tr > td.on,
.table.on > tr.on > td.main {
    filter: none;
    opacity: 1;
}

.table.on > tr > td.on,
.table.on > tr.on > td:not(.on):not(.main) {
    filter: grayscale(.5);
    opacity: .8;
}

</style>