<template>
    <div>
        <a v-for="x in navPages" class="w3-bar-item w3-button w3-hover-blue"
            v-bind:class="{ 'w3-hide-small': !appIsSmallScreen, 'w3-blue': appSelectedPage === x.value }"
            @click="setActivePage(x.value)">{{ x.label }}</a>
    </div>
</template>

<script>
export default {
    data() {
        return {
            navPages: [
                { label: 'Heroes', value: 'heroes' },
                { label: 'Roles', value: 'roles' }
            ]
        }
    },
    props: ['appIsSmallScreen', 'appSelectedPage'],

    // fix for the following warnings:
    // 1) Extraneous non-emits event listeners (methodName) were passed to component but could not be automatically 
    // inherited because component renders fragment or text root nodes. If the listener is intended to be a component 
    // custom event listener only, declare it using the "emits" option.
    // 2) Component emitted event "x" but it is neither declared in the emits option nor as an "y" prop.
    emits: ["set-active-page"], // emits documentation

    methods: {
        setActivePage(selectedPage) {
            this.$emit('set-active-page', selectedPage);
        }
    }
};
</script>