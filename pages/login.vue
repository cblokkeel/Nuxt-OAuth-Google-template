<script setup>
async function googleLogin() {
    const {
        data,
    } = await useFetch("/login/google");
    console.log(data.value);
    navigateTo(data.value.url, {
        external: true
    })
}
</script>

<template>
    <UButton @click="googleLogin">Login with google</UButton>
</template>
