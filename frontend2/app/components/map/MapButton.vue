<template>
	<Button
		severity="secondary"
		icon="_"
		raised
		rounded
		class="map-button"
	>
		<Icon :name="icon" />
	</Button>
</template>

<script setup lang="ts">
defineProps<{
	icon: string;
}>();
</script>

<style scoped>
.map-button {
	font-size: 1.15rem;
	aspect-ratio: 1;
}
</style>
