<template>
  <div class="switch-option">
    <span class="name" v-show="name">{{ name }}</span>
    <div class="switch-ellipse" :class="{ active: checked }" @click="clickSwitch">
      <span class="switch-circle" :class="{ active: checked }"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      name: {
        type: String
      },
      value: null
    },
    data() {
      return {
        checked: this.value
      };
    },
    watch: {
      value: function (newValue) {
        if (newValue !== this.checked) {
          this.checked = newValue;
        }
      },
      checked: function (newValue) {
        this.$emit('update:value', newValue);
      }
    },
    methods: {
      clickSwitch: function () {
        this.checked = !this.checked;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~common/scss/variable";

  .switch-option {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    height: 100%;

    .name {
      display: flex;
      align-items: center;
      flex: 0 1 auto;
    }

    .switch-ellipse {
      align-self: center;
      flex: 0 0 auto;
      display: inline-block;
      position: relative;
      height: 0.62rem;
      width: 1.02rem;
      background-color: #fff;
      border-radius: 1000px;
      border: 2px solid rgba(0, 0, 0, .1);
      transition: all 0.1s;

      &.active {
        background-color: #76d472;
        border-color: transparent;
        transition: all 0.2s ease 0.1s;
      }
      .switch-circle {
        position: absolute;
        display: inline-block;
        height: 0.54rem;
        width: 0.54rem;
        background: #fff;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, .1);
        box-shadow: -1px 1px 1px #999;
        top: 0;
        left: 0;
        transition: all 0.2s;

        &.active {
          left: 0.42rem;
          transition: all 0.2s ease 0.1s;
        }
      }
    }
  }
</style>
