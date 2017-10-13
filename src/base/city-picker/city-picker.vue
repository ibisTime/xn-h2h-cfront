<template>
  <input type="text" :disabled="disabled" readonly @click="showPicker" :value="address" placeholder="请输入省市区" />
</template>
<script>
  import Picker from 'better-picker';
  import cityData from './city';

  export default {
    props: {
      province: {
        type: String,
        default: ''
      },
      city: {
        type: String,
        default: ''
      },
      district: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      address() {
        return this.province ? this.province + ' ' + this.city + ' ' + this.district : '';
      }
    },
    created() {
      this.picker = null;
      this.selectedIndex = [0, 0, 0];
      this.checked = [0, 0, 0];
      this.first = [];
      this.second = [];
      this.third = [];
    },
    mounted() {
      setTimeout(() => {
        this._initPicker();
      }, 20);
    },
    methods: {
      showPicker() {
        this.picker && this.picker.show();
      },
      _initPicker() {
        this._initSelectIndex();
        this.picker = new Picker({
          data: [this.first, this.second, this.third],
          selectedIndex: this.selectedIndex,
          title: '地址选择'
        });

        this.picker.on('picker.select', (selectedVal, selectedIndex) => {
          var text1 = this.first[selectedIndex[0]].text;
          var text2 = this.second[selectedIndex[1]].text;
          var text3 = this.third[selectedIndex[2]].text;
          this.$emit('change', text1, text2, text3);
        });

        this.picker.on('picker.change', (index, selectedIndex) => {
          if (index === 0) {
            this.firstChange(selectedIndex);
          } else if (index === 1) {
            this.secondChange(selectedIndex);
          }
        });
      },
      firstChange(selectedIndex) {
        this.second = [];
        this.third = [];
        this.checked[0] = selectedIndex;
        var firstCity = cityData[selectedIndex];
        if (firstCity.hasOwnProperty('sub')) {
          this._creatList(firstCity.sub, this.second);
          var secondCity = cityData[selectedIndex].sub[0];
          if (secondCity.hasOwnProperty('sub')) {
            this._creatList(secondCity.sub, this.third);
          } else {
            this.third = [{text: '', value: 0}];
            this.checked[2] = 0;
          }
        } else {
          this.second = [{text: '', value: 0}];
          this.third = [{text: '', value: 0}];
        }

        this.picker.refillColumn(1, this.second);
        this.picker.refillColumn(2, this.third);
        this.picker.scrollColumn(1, 0);
        this.picker.scrollColumn(2, 0);
      },
      secondChange(selectedIndex) {
        this.third = [];
        this.checked[1] = selectedIndex;
        var firstIndex = this.checked[0];
        if (cityData[firstIndex].sub[selectedIndex].hasOwnProperty('sub')) {
          var secondCity = cityData[firstIndex].sub[selectedIndex];
          this._creatList(secondCity.sub, this.third);
          this.picker.refillColumn(2, this.third);
          this.picker.scrollColumn(2, 0);
        } else {
          this.third = [{text: '', value: 0}];
          this.checked[2] = 0;
          this.picker.refillColumn(2, this.third);
          this.picker.scrollColumn(2, 0);
        }
      },
      _creatList(obj, list) {
        obj.forEach((item, index) => {
          list.push({
            text: item.name,
            value: index
          });
        });
      },
      _initSelectIndex() {
        let index0 = 0;
        let index1 = 0;
        let index2 = 0;
        if (this.province) {
          index0 = cityData.findIndex((item) => {
            return item.name === this.province;
          });
          if (index0 !== -1) {
            this.checked[0] = this.selectedIndex[0] = index0;
            index1 = cityData[index0].sub.findIndex((item) => {
              return item.name === this.city;
            });
            this.checked[1] = this.selectedIndex[1] = index1;
            index2 = cityData[index0].sub[index1].sub.findIndex((item) => {
              return item.name === this.district;
            });
            this.checked[2] = this.selectedIndex[2] = index2;
          } else {
            index0 = 0;
          }
        }
        this._creatList(cityData, this.first);
        this._creatList(cityData[index0].sub, this.second);
        this._creatList(cityData[index0].sub[index1].sub, this.third);
      }
    },
    beforeDestroy() {
      this.picker && this.picker.pickerEl.remove();
    }
  };
</script>
<style lang="scss" scoped>
</style>
