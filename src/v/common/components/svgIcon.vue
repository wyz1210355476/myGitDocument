<template>
    <span>
        <svg class="icon" aria-hidden="true">
            <use :xlink:href="'#'+name"></use>
        </svg>
    </span>
</template>
<style type="text/css">
.icon {
   width: 1em; height: 1em;
   vertical-align: -0.15em;
   fill: currentColor;
   overflow: hidden;
   transform: scale(1.6)
}
</style>

<script>
export default {
    data() {
        return {

        };
    },
    mounted() {
    },
    props:['name']
};
</script>

