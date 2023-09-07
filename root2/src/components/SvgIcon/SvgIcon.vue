<template>
    <svg aria-hidden="true" class="svg-icon">
        <use :xlink:href="symbolId" />
    </svg>
</template>
  
<script setup>
import { computed } from 'vue'
let props = defineProps(
    {
        name: { type: String, required: true },
        prefix: { type: String, default: "icon" },
        color: { type: String, default: `#333` }
    })
//默认为icon-XXX(传过来的svg名)
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
<style scope>
.svg-icon {
    fill: currentColor;
}
</style>
