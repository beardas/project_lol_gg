<template>
  <div id="search">
    <h1>{{ msg }}</h1>
    <input v-model="summoner.name" type="text" placeholder="소환사 이름 입력"/>
    <button @click="search_ID(summoner.name)">검색</button>
    <br><br>
    <div>
      <!-- 인게임 -->
      {{summoner.ingame}}
    </div>
    <br><br>
    <div v-if="summoner.queueTypes[0].queue != ''">
      <div v-if="summoner.queueTypes[1].queue != ''">
          <Rank v-for="(item, i) in summoner.queueTypes"
          :key="i"
          :summoner="{
            queue: summoner.queueTypes[i].queue,
            tier: summoner.queueTypes[i].tier,
            rank: summoner.queueTypes[i].rank,
            point: summoner.queueTypes[i].point,
            wins: summoner.queueTypes[i].wins,
            losses: summoner.queueTypes[i].losses
            }"
          />
      </div>
      <div v-else>
          <Rank :summoner="{
            queue: summoner.queueTypes[0].queue,
            tier: summoner.queueTypes[0].tier,
            rank: summoner.queueTypes[0].rank,
            point: summoner.queueTypes[0].point,
            wins: summoner.queueTypes[0].wins,
            losses: summoner.queueTypes[0].losses
            }"
          />
      </div>
    </div>
    <div v-else>
      <!-- UNRANKED -->
      {{summoner.queueTypes[0].tier}}
    </div>

<!-- 대전 기록 -->
    <!-- <div>
      {{summoner.matches}}
    </div> -->
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from 'vue';
import Rank from '@/components/View_Rank.vue'; // @ is an alias to /src
import Matches from '@/components/View_Matches.vue';
import { createNamespacedHelpers } from 'vuex';

export default defineComponent({
  components: {
    Rank,
    // Matches,
  },

  props: {
    msg: String,
  },

  data (){
    return {
      apiKey : 'RGAPI-e7de5b7b-2cbb-4730-9ba3-5efe1cde4f46',
      summoner: {
        name: '',
        ingame: '',
        queueTypes: [{
          queue: '',
          tier: '',
          rank: '',
          point: '',
          wins: '',
          losses: ''
        },
        {
          queue: '',
          tier: '',
          rank: '',
          point: '',
          wins: '',
          losses: ''
        }
        ],
        matches: [{
          matchId: '',
          names: [],
          champions: '',
          spells: '',
        }],
      },
    }
  },


  methods: {
    async search_ID (name :string) {
      // 소환사 이름으로 ID, accountID 추출

      this.summoner.queueTypes[0].queue = ''
      this.summoner.queueTypes[1].queue = ''
      this.summoner.queueTypes[0].tier = ''
      this.summoner.queueTypes[1].tier = ''
      this.summoner.queueTypes[0].rank = ''
      this.summoner.queueTypes[1].rank = ''
      this.summoner.queueTypes[0].point = ''
      this.summoner.queueTypes[1].point = ''
      this.summoner.queueTypes[0].wins = ''
      this.summoner.queueTypes[1].wins = ''
      this.summoner.queueTypes[0].losses = ''
      this.summoner.queueTypes[1].losses = ''

      let id, account, puuid;
      let link = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${this.apiKey}`;
      let response = await fetch(`${link}` // cors정책 우회
      // , {
      //     method: "GET",
      //   mode: 'no-cors',
      //   credentials: 'omit',
      //   headers: {
      //       'Content-Type': 'application/json',
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
        this.search_inGame(id, this.apiKey); // 인게임 정보
        this.search_matches(puuid, this.apiKey); // 대전기록 정보

        console.log(id)

      } else {
        alert("소환사가 존재하지 않습니다.");
      }
      
    },

    async search_tier (id :string, api_key :string) {
      // 추출한 ID로 소환사 티어 정보 검색
      let queueTypes;
      let link = `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${api_key}`;
      const response = await fetch(link);

      if (response.ok) {
        const json = await response.json()
        const obj = JSON.parse(JSON.stringify(json))

        queueTypes = obj;
        
        if(queueTypes == "") { // 랭크 정보 없으면 언랭
          this.summoner.queueTypes[0].tier = "UNRANKED";
        }

        for(var i  = 0; i < queueTypes.length; i++){
          this.view_tier(queueTypes, i);
        }

      } else {
        alert("404");
      }

    },

    async search_matches (puuid :string, api_key :string) {
        // 추출한 puuid로 대전 기록 정보 검색
      let matches, matchIds;
      let num = 10;
      let link = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${num}&api_key=${api_key}`;
      const response = await fetch(link);

      if (response.ok) {
        const json = await response.json();
        const obj = JSON.parse(JSON.stringify(json))
        matches = obj;
        
        if(matches == "") console.log("대전 기록이 없습니다.")

        for(var i = 0; i < num; i++) {
          this.search_match(JSON.parse(JSON.stringify(matches))[i], i, api_key)
        }
        // this.view_ingame(ingame);
      } else {
          alert("404");
      }

    },

    async search_match (matchId :string, i :number, api_key :string) {
        // 추출한 puuid로 대전 기록 정보 검색
      let match_info;
      let link = `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${api_key}`;
      const response = await fetch(link);

      if (response.ok) {
        const json = await response.json();
        const obj = JSON.parse(JSON.stringify(json))
        match_info = obj;
        
        this.summoner.matches[0].matchId = match_info.metadata.matchId
        this.summoner.matches[0].names = match_info.info.participants[0].summonerName

        console.log(match_info);

      } else {
          // alert("404");
      }
    },


    async search_inGame (id :string, api_key :string) {
      // 추출한 ID로 인게임 정보 검색
      let ingame;
      let link = `https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${id}?api_key=${api_key}`;
      const response = await fetch(link
      , {
          method: "GET",
        mode: 'no-cors',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });

      if (response.ok) {
        const json = await response.json();
        const obj = JSON.parse(JSON.stringify(json))
        ingame = obj;

        this.summoner.ingame = "게임 중 입니다."
        
        this.view_ingame(ingame);
      } else {
        this.summoner.ingame = "게임 중이 아닙니다."
      }
    },

    view_tier (queueTypes :any, i :number) { // 티어 출력

        if(JSON.parse(JSON.stringify(queueTypes[i])).queueType == "RANKED_SOLO_5x5") {
          this.summoner.queueTypes[i].queue = "솔로 랭크";
        } else if(JSON.parse(JSON.stringify(queueTypes[i])).queueType == "RANKED_FLEX_SR") {
          this.summoner.queueTypes[i].queue = "자유 랭크";
        }

        this.summoner.queueTypes[i].tier = JSON.parse(JSON.stringify(queueTypes[i])).tier;
        this.summoner.queueTypes[i].rank = JSON.parse(JSON.stringify(queueTypes[i])).rank;
        this.summoner.queueTypes[i].point = JSON.parse(JSON.stringify(queueTypes[i])).leaguePoints;
        this.summoner.queueTypes[i].wins = JSON.parse(JSON.stringify(queueTypes[i])).wins;
        this.summoner.queueTypes[i].losses = JSON.parse(JSON.stringify(queueTypes[i])).losses;

    },

    view_ingame (ingame :string) {
      
      console.log(ingame);
      console.log(JSON.parse(JSON.stringify(ingame)).gameId)
    },

  },

  template: {

  },
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


