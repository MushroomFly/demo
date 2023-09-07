<template>
    <div id="aplayer" class="music"></div>
</template>
<script setup>
import axios from "axios"
import { onMounted, reactive } from "vue";
import 'APlayer/dist/APlayer.min.css';
import APlayer from 'APlayer';
let options = reactive({ audio: [], theme: '#FADFA3', lrcType: 1, fixed: true, listFolded: false });
onMounted(async () => {
    options.container = document.getElementById('aplayer');
})
let init = async () => {
    let { data } = await axios({ method: `get`, url: '/musicApi/?type=playlist&id=4882838181' })
    data = data.splice(0, 20);
    options.audio.push(...data);
    const ap = new APlayer(options)
}
init();
</script>