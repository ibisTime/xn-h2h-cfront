<template>
  <input type="text" :disabled="disabled" readonly @click="showPicker" :value="date" placeholder="请选择日期" />
</template>
<script>
  import Picker from 'better-picker';
  import {getYears, getMonths, getDays, getCurDatas} from './util';

  export default {
    props: {
      year: {
        type: String,
        default: ''
      },
      month: {
        type: String,
        default: ''
      },
      day: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      date() {
        return this.year ? this.year + '-' + this.month + '-' + this.day : '';
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
          title: '日期选择'
        });

        this.picker.on('picker.select', (selectedVal, selectedIndex) => {
          var text1 = this.first[selectedIndex[0]].value + '';
          var text2 = this.second[selectedIndex[1]].value + '';
          var text3 = this.third[selectedIndex[2]].value + '';
          this.$emit('change', text1, text2, text3);
        });

        this.picker.on('picker.change', (index, selectedIndex) => {
          if (index === 0) {
            this.firstChange(selectedIndex);
          } else if (index === 1) {
            this.secondChange(selectedIndex);
          } else {
            this.thirdChange(selectedIndex);
          }
        });
      },
      firstChange(selectedIndex) {
        this.checked[0] = selectedIndex;
        // 如果月份选择了2月
        if (this.checked[1] === 1) {
          let _days = getDays(this.first[this.checked[0]].value, '02');
          if (_days.length !== this.third.length) {
            let scrollIndex = this.checked[2];
            if(scrollIndex + 1 > _days.length) {
              scrollIndex = _days.length - 1;
            }
            this.checked[2] = scrollIndex;
            this.third = _days;
            this.picker.refillColumn(2, this.third);
            this.picker.scrollColumn(2, scrollIndex);
          }
        }
      },
      secondChange(selectedIndex) {
        this.checked[1] = selectedIndex;
        let _month = (this.checked[1] + 1) + '';
        _month = '00'.substr(_month.length) + _month;
        let _days = getDays(this.first[this.checked[0]].value, _month);
        if (_days.length !== this.third.length) {
          let scrollIndex = this.checked[2];
          if(scrollIndex + 1 > _days.length) {
            scrollIndex = _days.length - 1;
          }
          this.checked[2] = scrollIndex;
          this.third = _days;
          this.picker.refillColumn(2, this.third);
          this.picker.scrollColumn(2, scrollIndex);
        }
      },
      thirdChange(selectedIndex) {
        this.checked[2] = selectedIndex;
      },
      _initSelectIndex() {
        let index0 = 0;
        let index1 = 0;
        let index2 = 0;
        if (this.year) {
          this.first = getYears();
          this.second = getMonths();
          // this.third = getDays();
          index0 = this.first.findIndex((item) => {
            return +item.value === +this.year;
          });
          index1 = +this.month - 1;
          index2 = +this.day - 1;
          this.third = getDays(this.year, this.month);
        } else {
          let result = getCurDatas();
          index0 = result.selectedIndex[0];
          index1 = result.selectedIndex[1];
          index2 = result.selectedIndex[2];
          this.first = result.datas[0];
          this.second = result.datas[1];
          this.third = result.datas[2];
        }
        this.selectedIndex[0] = this.checked[0] = index0;
        this.selectedIndex[1] = this.checked[1] = index1;
        this.selectedIndex[2] = this.checked[2] = index2;
      }
    },
    beforeDestroy() {
      this.picker && this.picker.pickerEl.remove();
    }
  };
</script>
<style lang="scss" scoped>
</style>
