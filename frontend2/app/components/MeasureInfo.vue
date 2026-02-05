<template>
	<Dialog
		:draggable="false"
		:visible="isOpen"
		position="bottom"
	>
		<template #container>
			<div class="container">
				<div class="row header">
					<span>Selected Area</span>

					<Button
						text
						rounded
						size="small"
						icon="_"
						severity="secondary"
						class="close-button"
						aria-label="Close"
						@click="$emit('close')"
					>
						<CloseIcon />
					</Button>
				</div>

				<div
					v-if="rectCoords"
					class="coords-container"
				>
					<div class="coords coords-top-left">
						<span
							v-tooltip.top="'Top-left tile coordinates'"
							class="select"
						>
							{{ rectCoords.topLeft.tile[0] }}&times;{{ rectCoords.topLeft.tile[1] }}
						</span>
						<span
							v-tooltip.top="'Top-left pixel coordinates'"
							class="select"
						>
							{{ (rectCoords.topLeft.pixel[0] ?? 0) + 1 }}&times;{{ (rectCoords.topLeft.pixel[1] ?? 0) + 1 }}
						</span>
					</div>

					<div class="coords coords-top-right">
						<span
							v-tooltip.top="'Top-right tile coordinates'"
							class="select"
						>
							{{ rectCoords.topRight.tile[0] }}&times;{{ rectCoords.topRight.tile[1] }}
						</span>
						<span
							v-tooltip.top="'Top-right pixel coordinates'"
							class="select"
						>
							{{ (rectCoords.topRight.pixel[0] ?? 0) + 1 }}&times;{{ (rectCoords.topRight.pixel[1] ?? 0) + 1 }}
						</span>
					</div>

					<div
						class="coords coords-rect"
						:style="{
							maxWidth: widthPixels > heightPixels ? '150px' : 'none',
							maxHeight: widthPixels < heightPixels ? '250px' : 'none',
							aspectRatio: `${widthPixels} / ${heightPixels}`
						}"
					>
						<span
							class="select"
						>
							{{ widthPixels.toLocaleString() }}&times;{{ heightPixels.toLocaleString() }}<br>
							{{ totalPixels.toLocaleString() }} {{ totalPixels === 1 ? "pixel" : "pixels" }}
						</span>
					</div>

					<div class="coords coords-bottom-left">
						<span
							v-tooltip.top="'Bottom-left tile coordinates'"
							class="select"
						>
							{{ rectCoords.bottomLeft.tile[0] }}&times;{{ rectCoords.bottomLeft.tile[1] }}
						</span>
						<span
							v-tooltip.top="'Bottom-left pixel coordinates'"
							class="select"
						>
							{{ (rectCoords.bottomLeft.pixel[0] ?? 0) + 1 }}&times;{{ (rectCoords.bottomLeft.pixel[1] ?? 0) + 1 }}
						</span>
					</div>

					<div class="coords coords-bottom-right">
						<span
							v-tooltip.top="'Bottom-right tile coordinates'"
							class="select"
						>
							{{ rectCoords.bottomRight.tile[0] }}&times;{{ rectCoords.bottomRight.tile[1] }}
						</span>
						<span
							v-tooltip.top="'Bottom-right pixel coordinates'"
							class="select"
						>
							{{ (rectCoords.bottomRight.pixel[0] ?? 0) + 1 }}&times;{{ (rectCoords.bottomRight.pixel[1] ?? 0) + 1 }}
						</span>
					</div>

					<div class="coords-pointer coords-pointer-top-left" />
					<div class="coords-pointer coords-pointer-top-right" />
					<div class="coords-pointer coords-pointer-bottom-left" />
					<div class="coords-pointer coords-pointer-bottom-right" />
				</div>

				<div
					v-if="rectCoords && userProfile?.role === 'admin'"
					class="actions"
				>
					<Button
						size="small"
						severity="danger"
						@click="handleClearArea"
					>
						<EraserIcon />
						Clear area
					</Button>
				</div>
			</div>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import CloseIcon from "~/components/icons/CloseIcon.vue";
import EraserIcon from "~/components/icons/EraserIcon.vue";
import { getPixelsInArea, type TileCoords } from "~/utils/coordinates";

defineProps<{
	isOpen: boolean;
	userProfile: UserProfile | null;
}>();

const emit = defineEmits<{
	close: [];
	clearPixels: [pixels: TileCoords[]];
}>();

const {
	rectCoords,
	widthPixels,
	heightPixels,
	totalPixels
} = useMeasure();

const handleClearArea = () => {
	if (!rectCoords.value) {
		return;
	}

	const pixels = getPixelsInArea(rectCoords.value);
	emit("clearPixels", pixels);
	emit("close");
};
</script>

<style scoped>
.container,
.section {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.container {
	padding: 1rem;
}

@media (min-width: 768px) {
	.container {
		width: 450px;
	}
}

.header {
	font-weight: 500;
	align-items: center;
	margin-block: calc(var(--p-button-sm-padding-x) * -0.5);
}

.close-button {
	margin-inline-start: auto;
	margin-inline-end: calc(var(--p-button-sm-padding-x) * -1);
	aspect-ratio: 1;
}

.section {
	gap: 0.25rem;
}

.row {
	display: flex;
	gap: 0.5rem;
	font-size: 0.875rem;
}

.error {
	padding: 1rem;
	text-align: center;
	color: var(--p-red-500);
}

.select {
	user-select: text;
	cursor: auto;
}

.coords {
	display: flex;
	font-size: 0.8rem;
	gap: 0.5em;
	font-feature-settings: "tnum";
}

.coords-container {
	display: grid;
	grid-template-areas:
		"top-left . . . top-right"
		". top-left-pointer . top-right-pointer ."
		". . center . ."
		". bottom-left-pointer . bottom-right-pointer ."
		"bottom-left . . . bottom-right";
	grid-template-rows: auto auto 1fr auto auto;
	grid-template-columns: auto auto 1fr auto auto;
	gap: 4px;
}

.coords-rect {
	display: flex;
	align-items: center;
	justify-content: center;
	grid-area: center;
	width: 100%;
	height: 100%;
	min-height: 4em;
	border: 1px solid var(--p-dialog-border-color);
	text-align: center;
}

.coords-top-left {
	grid-area: top-left;
	align-self: start;
	justify-self: start;
	position: relative;
}

.coords-top-right {
	grid-area: top-right;
	align-self: start;
	justify-self: end;
	position: relative;
}

.coords-bottom-left {
	grid-area: bottom-left;
	align-self: end;
	justify-self: start;
	position: relative;
}

.coords-bottom-right {
	grid-area: bottom-right;
	align-self: end;
	justify-self: end;
	position: relative;
}

.coords-pointer {
	position: relative;
	width: 0.75em;
	height: 0.75em;
	border-top: 1px solid var(--p-dialog-border-color);
}

.coords-pointer-bottom-left,
.coords-pointer-bottom-right {
	border-top: 0;
	border-bottom: 1px solid var(--p-dialog-border-color);
}

.coords-pointer-top-left {
	grid-area: top-left-pointer;
	top: -2px;
	left: -2px;
	transform: rotate(45deg);
	transform-origin: 0 50%;
}

.coords-pointer-top-right {
	grid-area: top-right-pointer;
	top: -2px;
	right: -2px;
	transform: rotate(-45deg);
	transform-origin: 100% 50%;
}

.coords-pointer-bottom-left {
	grid-area: bottom-left-pointer;
	bottom: -2px;
	left: -2px;
	transform: rotate(-45deg);
	transform-origin: 0 50%;
}

.coords-pointer-bottom-right {
	grid-area: bottom-right-pointer;
	bottom: -2px;
	right: -2px;
	transform: rotate(45deg);
	transform-origin: 100% 50%;
}

.actions {
	display: flex;
	gap: 0.5rem;
	width: 100%;
}

.actions button {
	flex: 1;
}
</style>
