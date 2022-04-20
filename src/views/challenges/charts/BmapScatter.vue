<!--<template>-->

<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: "BmapScatter"-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->

<template>
  <div class="bmap" id="bmap" ref="bmap" style="width: 100%;height: 700px;"></div>
</template>

<script>
// 这个必须引入,否则不能识别bmap属性
import 'echarts/extension/bmap/bmap'

export default {
  name: 'BmapScatter',
  mounted () {
    this.initBmap()
  },
  methods: {
    initBmap () {
      const myChart = this.$echarts.init(this.$refs.bmap)
      myChart.setOption({
        bmap: {
          key: '申请到的AK值(记得替换为自己申请的AK)',
          center: [104.114129, 37.550339] // 当前视角中心位置的坐标
        }
      })
    }
  }
}
</script>