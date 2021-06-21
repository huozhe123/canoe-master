<template>

    <div id="modals1">
      dd
    </div>
      <teleport to="[data-id]">
      <div>A</div>
    </teleport>
    <teleport :to="name"  :disabled="disabled">
      <div>B</div>
    </teleport>
</template>

<script>

export default {
    name: 'Demo',
    data() {
        return {
            user: '',
            name: 'body1',
            disabled: true,
        };
    },
    props: {
    },
    async setup() {
      console.log('demo')
    const fetchUser = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ name: "Carlo", age: "20" });
          //reject("获取信息失败！");
        }, 3000);
      });
    };
    
    const user = await fetchUser();
    return { user }
    }
};
</script>

<style lang="sass" scoped>
</style>
