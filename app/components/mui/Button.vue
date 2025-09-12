<script setup lang="ts">
import { icons, type IconName } from "~/assets/icons/icons";

const props = defineProps({
	// Content
	text: {
		type: String,
		default: "Click me",
	},
	icon: {
		type: String as () => IconName | null,
		default: null,
	},
	iconPosition: {
		type: String as () => "left" | "right",
		default: "right",
	},
	// Style control
	variant: {
		type: String as () => "primary" | "secondary" | "ghost",
		default: "primary",
	},
	size: {
		type: String as () => "sm" | "md" | "lg",
		default: "md",
	},
	customClass: {
		type: String,
		default: "",
	},

	// Behavior
	disabled: {
		type: Boolean,
		default: false,
	},
});

const buttonClasses = computed(() => [
	`btn-${props.variant}`,
	`btn-${props.size}`,
	props.customClass,
	{ "opacity-50 cursor-not-allowed": props.disabled },
]);
const isHovered = ref(false);
const currentIcon = computed(() => {
	if (!props.icon || !icons[props.icon]) return null;
	return icons[props.icon];
});
</script>

<template>
	<button
		:class="buttonClasses"
		:disabled="disabled"
		class="base-btn-styles transition-all"
		@mouseenter="isHovered = true"
		@mouseleave="isHovered = false"
	>
		<span
			v-if="currentIcon && iconPosition === 'left'"
			class="icon-left icon"
			v-html="isHovered ? currentIcon.hover : currentIcon.default"
		/>
		{{ text }}
		<span
			v-if="currentIcon && iconPosition === 'right'"
			class="icon-right icon"
			v-html="isHovered ? currentIcon.hover : currentIcon.default"
		/>
	</button>
</template>

<style scoped>
@reference "tailwindcss";

button {
    cursor: pointer;
    gap: 7px;
    transition: all .2s !important;
    @apply flex items-center justify-center
}

.base-btn-styles {
    @apply  hover:cursor-pointer shadow-md rounded-tl-3xl rounded-br-3xl font-bold px-4 hover:rounded-tr-3xl hover:rounded-tl-none hover:rounded-bl-3xl hover:rounded-br-none;
}

/* Variants */
.btn-primary {
    @apply bg-[var(--color-secondary)] text-white hover:bg-[var(--color-primary)];
}

.btn-primary:hover {
    background: var(--color-primary);
}

.btn-secondary {
    background: var(--color-dark);
    @apply text-white;
}

.btn-ghost {
    background: var(--alpha-background);
    @apply border border-[var(--gray)] hover:bg-[var(--light)] hover:text-[var(--dark)];
}

/* Sizes */
.btn-sm {
    @apply h-8 gap-1.5 px-3 has-[>svg]:px-2.5;
}

.btn-md {
    @apply h-10  px-5 has-[>svg]:px-3;
}

.btn-lg {
    @apply h-12  px-8 has-[>svg]:px-4;
}
.icon-left, .icon-right{
    color: white;
}
.icon-left {
    @apply w-4 h-4;
}

.icon-right {
    @apply w-5 h-5;
}
</style>