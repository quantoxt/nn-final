<script setup lang="ts">
import { RoleBasedRender } from "."
</script>

<template>
    <RoleBasedRender roles="author" v-bind="$attrs" :show-fallback="false">
        <slot />
    </RoleBasedRender>
</template>