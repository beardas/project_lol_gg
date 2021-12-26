<template>
  <div id="search">
    <h1>{{ msg }}</h1>
    <input v-model="summoner.name" type="text" placeholder="소환사 이름 입력"/>
    <button @click="search_ID(summoner.name)">검색</button>
    <br><br>
    <div v-if="summoner.queueTypes.queue != ''">
      <div>
          <Rank :summoner="{
            queue: summoner.queueTypes.queue,
            tier: summoner.queueTypes.tier,
            rank: summoner.queueTypes.rank,
            point: summoner.queueTypes.point,
            wins: summoner.queueTypes.wins,
            losses: summoner.queueTypes.losses
            }"
          />
      </div>
    </div>
    <div v-else>
      {{summoner.queueTypes.tier}}
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from 'vue';
import Rank from '@/components/View_Rank.vue'; // @ is an alias to /src
import Matches from '@/components/View_Matches.vue';

export default defineComponent({
  components: {
    Rank,
    // Matches,
  },

  props: {
    msg: String,
  },
  data () {
    return {
      apiKey : 'RGAPI-e7de5b7b-2cbb-4730-9ba3-5efe1cde4f46',
      summoner: {
        name: '',
        queueTypes: {
          queue: '',
          tier: '',
          rank: '',
          point: '',
          wins: '',
          losses: ''
        },
      }
    }
  },
  methods: {

    async search_ID (name :string) {
      // 소환사 이름으로 ID, accountID 추출

      this.summoner.queueTypes.queue = ''
      this.summoner.queueTypes.tier = ''
      this.summoner.queueTypes.rank = ''
      this.summoner.queueTypes.point = ''
      this.summoner.queueTypes.wins = ''
      this.summoner.queueTypes.losses = ''

      let id, account, puuid;
      let link = `https://kr.api.riotgames.com/tft/summoner/v1/summoners/by-name/${name}?api_key=${this.apiKey}`;
      let response = await fetch(`${link}`
      // , {
      //   method: "GET",
      //   mode: 'no-cors',
      //   credentials: 'omit',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      // }
      );

      if (response.ok) { // HTTP 상태 코드가 200~299일 경우 응답
        let json = await response.json()
        const obj = JSON.parse(JSON.stringify(json))

        id = obj.id;
        account = obj.accountId;
        puuid = obj.puuid;

        this.search_tier(id, this.apiKey); // 티어 정보
        this.search_matches(puuid, this.apiKey); // 대전 기록

        console.log(id)

      } else {
        alert("소환사가 존재하지 않습니다.");
      }

    },

    async search_tier (id :string, api_key :string) {
      // 추출한 ID로 소환사 티어 정보 검색
      let tiers;
      let link = `https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/${id}?api_key=${api_key}`;
      const response = await fetch(link);

      if (response.ok) {
        const json = await response.json()
        const obj = JSON.parse(JSON.stringify(json))

        tiers = obj;

        if(tiers == "") { // 랭크 정보 없으면 언랭
          this.summoner.queueTypes.tier = "UNRANKED";
        }
        
        for(var i  = 0; i < tiers.length; i++){
          this.view_tier(tiers, i); 
        }

      } else {
        alert("404");
      }

    },

    async search_matches (puuid :string, api_key :string) {
        // 추출한 puuid로 대전 기록 정보 검색
      let matches;
      let num = 10;
      let link = `https://asia.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${num}&api_key=${api_key}`;
      const response = await fetch(link);

      if (response.ok) {
        const json = await response.json();
        const obj = JSON.parse(JSON.stringify(json))
        matches = obj;
        
        if(matches == "") console.log("대전 기록이 없습니다.")

        console.log(matches);
        // this.view_ingame(ingame);
      } else {
          alert("404");
      }

    },

    view_tier (tiers :any, i :number) { // 티어 출력
      
      if(JSON.parse(JSON.stringify(tiers[i])).queueType == "RANKED_TFT") {
          this.summoner.queueTypes.queue = "TFT 랭크";
      } else {
          this.summoner.queueTypes.queue = "";
      }

      this.summoner.queueTypes.tier = JSON.parse(JSON.stringify(tiers[i])).tier;
      this.summoner.queueTypes.rank = JSON.parse(JSON.stringify(tiers[i])).rank;
      this.summoner.queueTypes.point = JSON.parse(JSON.stringify(tiers[i])).leaguePoints;
      this.summoner.queueTypes.wins = JSON.parse(JSON.stringify(tiers[i])).wins;
      this.summoner.queueTypes.losses = JSON.parse(JSON.stringify(tiers[i])).losses;

      console.log(this.summoner.queueTypes.tier)
    
    },

    view_ingame (ingame :string) {
      console.log(ingame);
      // alert(JSON.parse(JSON.stringify(ingame)))
      // alert(ingame);
    },

  },
  template: {},
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
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


