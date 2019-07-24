<!-- svg格式的图标渲染 -->
<template>
    <svg class="icon" aria-hidden="true"><use :xlink:href="'#'+name"></use></svg>
</template>
<script>
export default {
    props: ['name']
}
</script>
