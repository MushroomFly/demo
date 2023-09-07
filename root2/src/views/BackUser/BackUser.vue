<template>
    <div>
    </div>
</template>
<script setup>
import { } from "@/require/index.js"
import { ref } from "vue"
import { loadingStore } from '@/stores/loadingStore.js'
let loading = loadingStore();
let { vanishLoading } = loading;
vanishLoading(false,0);
</script>
<style></style>