<template>
  <div class="container1">
      <div class="left">
        <div class="left-top" style="border: 2px solid black">
          <p style="margin-left: 10px"> 选择区域类型</p>
          <el-select style="margin-left: 5px" v-model="areatype" placeholder="请选择区域">
            <el-option
                v-for="item in areaoption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        <p style="margin-left: 10px"> 选择你想查看的区域</p>
        <el-select v-if="areatype === '1'" style="margin-left: 5px" v-model="value" placeholder="请选择区域">
          <el-option
              v-for="item in stopeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
         <el-select v-if="areatype === '2'" style="margin-left: 5px" v-model="value" placeholder="请选择区域">
            <el-option
                v-for="item in slagyardoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <p> </p>
        <el-button style="margin-left: 20px   " type="primary" icon="el-icon-search" @click="changemapcenter()">搜索</el-button>
          <el-button style="margin-left: 20px   " type="primary" icon="el-icon-search" @click="showallarea()">搜索全部区域</el-button>
<!--          <el-button style="margin-left: 20px   " type="primary" icon="el-icon-search" @click="showallcar()">所有车辆目前位置</el-button>-->
<!--          <el-button style="margin-left: 20px   " type="primary" icon="el-icon-search" @click="showsinglecar()">单辆车轨迹</el-button>-->
<!--          <el-button style="margin-left: 20px   " type="primary" icon="el-icon-search" @click="clearallcar()">清除</el-button>-->
      </div>

        <div class="left_bottom" style="border: 2px solid black">
          <p style="margin-left: 10px">展示车辆目前位置</p>
          <el-button style="margin-left: 20px   " type="primary" icon="el-icon-search" @click="showallcar()">所有车辆目前位置</el-button>
          <el-button style="margin-left: 20px   " type="primary" icon="el-icon-search" @click="clearallcar()">清除</el-button>
          <p></p>
          <p style="margin-left: 10px">展示单辆车轨迹</p>
          <el-button style="margin-left: 20px   " type="primary" icon="el-icon-search" @click="showsinglecar()">单辆车轨迹</el-button>
          <p style="margin-left: 10px">聚类点显示</p>
          <el-button style="margin-left: 20px   " type="primary" icon="el-icon-search" @click="showcluster()">聚类点</el-button>
        </div>
      </div>

      <div class="date">
        <p style="height: 40px;font-size: 18px;margin-top: 5px"> {{this.datetime}}</p>
      </div>
      <div class="bmap" id="bmap" ref="bmap"></div>
  </div>
</template>

<script>




// 这个必须引入,否则不能识别bmap属性
import BMap from 'BMap'
import echarts from 'echarts'
import "echarts/extension/bmap/bmap"
import {Search, SearchCar} from "../../api/api";
import Vue from "vue";

var global_option;
var global_dom;
var global_charts;
export default {
  name: 'challenges',
  data(){
    return{
      //搜索的终端号
      terminal:'0',
      //当前日期和时间
      datetime: null,
      //区域类型
      areatype:'',
      //采场区域
      stopearea:[],
      //渣场区域
      slagyardarea:[],
      areaoption: [{
        value: '1',
        label: '采场'
      }, {
        value: '2',
        label: '渣场'
      },
      ],
      value:'',
      //采场
      stopeoptions:[
        {
          value: '1',
          label: '利达采坑'
        }, {
          value: '2',
          label: '蒙西北采区'
        },
        {
          value: '3',
          label: '蒙西南采区'
        },
      ],
      //渣场选择
      slagyardoptions:[
        {
          value: '1',
          label: '利达东渣场'
        }, {
          value: '2',
          label: '利达煤场'
        },
        {
          value: '3',
          label: '利达排渣场'
        },
        {
          value: '4',
          label: '利达西渣场'
        },
        {
          value: '5',
          label: '蒙西煤场'
        },
        {
          value: '6',
          label: '蒙西排土场1'
        },
        {
          value: '7',
          label: '蒙西排土场2'
        },
        {
          value: '8',
          label: '蒙西排土场3'
        },
        {
          value: '9',
          label: '蒙西排土场4'
        },
      ],

      stopeareas:[
          //利达采坑
          [[106.93328130522411,39.47386315244423], [106.93528591389676,39.47308331359599], [106.93558002636611,39.47234545795724], [106.93547166914055,39.47073774518093], [106.9353913188517,39.470431795597676], [106.93582483034564,39.469644322307936], [106.9365670736119,39.4683526664651], [106.9367500924995,39.467012865038235], [106.9375533420616,39.46646117453912], [106.93967157860747,39.46445823047036], [106.94313265779039,39.465028145693694], [106.94430974405509,39.46563321920717], [106.94447081901762,39.46854326058364], [106.94432213443682,39.46923786471333], [106.94382651916747,39.46989091987866], [106.94301419554338,39.471726827036115], [106.94275399752698,39.47358987148918], [106.94080971381513,39.47393747936455], [106.94015302358324,39.47395668564973], [106.93959545640523,39.47434081023106], [106.93460105434576,39.47441544303832], [106.93349831037146,39.47424258742824]],
        // //蒙西北采区
       [[107.04041904480762,39.65114357561267], [107.03705880717436,39.64679062417564], [107.03614539043457,39.64543895052591], [107.03191833893139,39.64616219543931], [107.02952762947469,39.64921581211213], [107.03091354800034,39.657628697492214], [107.03453349076958,39.6620612208715], [107.03958543843864,39.66259717292914], [107.04250764346288,39.66125728492871], [107.04518220399356,39.658615714739206], [107.04513267509485,39.65494031734131], [107.04354775033592,39.651839047546645], [107.04032837191936,39.65111156889202]],
        // //蒙西南采区
        [[107.02250795943631,39.63531041501741], [107.02385692436292,39.636233119320856], [107.0263992044169,39.636874993257535], [107.02894148447089,39.636393588367945], [107.03132811472565,39.63575170992792], [107.04061521941266,39.63282306335316], [107.04424704806124,39.62688536566895], [107.0406671026791,39.622070464002725], [107.02380504109655,39.62355509469528], [107.02058827857927,39.624718701712546], [107.02250795943635,39.635110041384415]]

      ],
      slagyardareas:[
        //利达东渣场
        [[106.9445581367628,39.46553978194375], [106.94457077701112,39.46583372115703], [106.94468949570219,39.46825747067865], [106.94455523527796,39.46923576392724], [106.94342344555764,39.47190477444357], [106.94356079521695,39.47359836788914], [106.94936072366787,39.473956103776274], [106.95378935879339,39.473449303851694], [106.95717771050015,39.47256751203145], [106.95806938200192,39.4690888767586], [106.95673187474925,39.465909573308195], [106.95479731001649,39.464408652893816], [106.94876366618776,39.46415521834356], [106.94469169966294,39.465399342663204]],
        //利达煤场
        [[106.9334049552812,39.470530834676794], [106.93354675275577,39.469585642519625], [106.93390124644218,39.46786008391867], [106.93479457053189,39.46806891177621], [106.93500726674374,39.46816783001452], [106.93490800851154,39.468563501550236], [106.93476621103699,39.469420782096755], [106.93461023381496,39.47050885361083], [106.93459542740506,39.47058791229157], [106.93400586054396,39.470581091918795], [106.93344855853596,39.47056972462934], [106.93340749417747,39.47056063079642]],
        //利达排渣场
        [[106.94022939015291,39.47474585684117], [106.94037848760337,39.47408718240309], [106.94070650199441,39.47404673727657], [106.94095251278769,39.474220073366126], [106.94106433587555,39.47457829990489], [106.94078105071965,39.47476896811081], [106.94040830709346,39.47479785718694], [106.94028157426057,39.47474007902256]],
        //利达西渣场
        [[106.92520965567516,39.47603722956842], [106.92388318505208,39.47679473408092], [106.92297559988891,39.47690294833247], [106.92048555854383,39.47585687012555], [106.91985723035394,39.474522195597096], [106.9218585719958,39.473692520041965], [106.92404608495316,39.4740352133282], [106.92486058445856,39.474684522256425], [106.92518638426073,39.475820798180386]],
        //蒙西煤场
        [[107.03782209804757,39.64668777866282], [107.03809296336479,39.64521556649449], [107.03897943167568,39.645094995994654], [107.03979202762734,39.64513941672978], [107.04094115321554,39.64532979098305], [107.04099040145502,39.64648471679405], [107.04087548889619,39.64691906883877], [107.0399479803857,39.646957142743844], [107.03896301559583,39.64687464925612], [107.03798625884585,39.64672235332583], [107.03784672216729,39.64669062496444]],
        //蒙西排土场1
        [[107.021621173599,39.64635448822788], [107.02270498771657,39.64679001601012], [107.02434013926182,39.646506567879946], [107.02545030019598,39.64533352254567], [107.02247334765661,39.64219476627665], [107.02162836126622,39.64634700744285]],
        //蒙西排土场2
        [[107.02247625236016,39.642176213342864], [107.0239999499199,39.637407397728204], [107.02593444576544,39.638223847518546], [107.02752547236783,39.641838885204955], [107.02843075441056,39.644789036597125], [107.0254370937758,39.64533562504735], [107.02246819216252,39.642191583326316]],
        //蒙西排土场3
        [[107.02247363241547,39.642183841117834], [107.02399271570545,39.63740948075738], [107.02209082205137,39.635817258057614], [107.02031301914963,39.63649786884222], [107.0200889805139,39.6364671342952], [107.01880799181025,39.64036171554092], [107.02078006736104,39.64177339780462], [107.02246651993266,39.64218338923799]],
        //蒙西排土场4
        [[107.02843756365753,39.64478307726629], [107.03114999915857,39.642333455622705], [107.03539451063823,39.63966228045286], [107.03539793742887,39.63966228045286], [107.03544139690264,39.6372191478858], [107.03376059806139,39.63676106375936], [107.03124999048467,39.63754742414876], [107.02976615106974,39.638344706932365], [107.02898294562256,39.63966430237051], [107.02882646030632,39.640994318161034], [107.02753601738132,39.64184664046424], [107.02753210978065,39.64184361926661], [107.02843987652169,39.644792278349]]

      ],
      area:
        [[106.93328130522411,39.47386315244423], [106.93528591389676,39.47308331359599], [106.93558002636611,39.47234545795724], [106.93547166914055,39.47073774518093], [106.9353913188517,39.470431795597676], [106.93582483034564,39.469644322307936], [106.9365670736119,39.4683526664651], [106.9367500924995,39.467012865038235], [106.9375533420616,39.46646117453912], [106.93967157860747,39.46445823047036], [106.94313265779039,39.465028145693694], [106.94430974405509,39.46563321920717], [106.94447081901762,39.46854326058364], [106.94432213443682,39.46923786471333], [106.94382651916747,39.46989091987866], [106.94301419554338,39.471726827036115], [106.94275399752698,39.47358987148918], [106.94080971381513,39.47393747936455], [106.94015302358324,39.47395668564973], [106.93959545640523,39.47434081023106], [106.93460105434576,39.47441544303832], [106.93349831037146,39.47424258742824]]

      ,
      areacenter:[106.93328130522411,39.47386315244423],
      mapcenter:[106.93328130522411,39.47386315244423],
      mapcentertest:[106.94469169966294, 39.465399342663204],
      lidacaikengcenter:[106.9445581367628,39.46553978194375],
      lidacaikeng: [ [106.9445581367628,39.46553978194375], [106.94457077701112,39.46583372115703], [106.94468949570219,39.46825747067865], [106.94455523527796,39.46923576392724], [106.94342344555764,39.47190477444357], [106.94356079521695,39.47359836788914], [106.94936072366787,39.473956103776274], [106.95378935879339,39.473449303851694], [106.95717771050015,39.47256751203145], [106.95806938200192,39.4690888767586], [106.95673187474925,39.465909573308195], [106.95479731001649,39.464408652893816], [106.94876366618776,39.46415521834356], [106.94469169966294,39.465399342663204]],
      coord:[],
      data:[],
      geoCoordMap:{},
      location:{},
      transportation_times:{}
    }
  },
  mounted () {
    this.initarea();
    setInterval(()=>{
      this.datetime = this.getdatetime();
      // if(global_option)
      // {   global_charts.setOption(global_option);
      //     console.log("gengxin");
      // }
    }, 1000)
  },
  beforeCreate() {

    // await SearchCar(this, this.terminal)
    //     .then(rsp => {
    //       // Vue.set(this.tableData, value, rsp.data.data)
    //       // this.tableData[value] = rsp.data.data;
    //       // console.log(this.tableData[value]);
    //     });

    // setInterval(()=>{
    //   // this.datetime = this.getdatetime();
    //   // if(global_option)
    //   // {   global_charts.setOption(global_option);
    //   //     console.log("gengxin");
    //   // }
    // }, 1000)

    // setInterval(()=>{
    //   global_charts.setOption(global_option);
    // }, 1000)
    // global_charts.setOption(global_option);
  },
  methods: {

    showcluster(){
      var marker;
      var data = [[106.93977,39.46789],[106.95043,39.465572],[106.95255,39.46937]];
      const bmap = global_charts
          .getModel()
          .getComponent('bmap')
          .getBMap();
      for(var i = 0; i < data.length; i++){
        var ele = data[i];
        let point = new BMap.Point(ele[0],ele[1]);

        marker = new BMap.Marker(point);        // 创建标注
        console.log(ele[0]+"  "+ ele[1])
        // marker = new BMap.Marker(point, {icon: myIcon});
        marker.setZIndex(200);
        bmap.addOverlay(marker);
      }
    },


    clearallcar(){
      const bmap = global_charts
          .getModel()
          .getComponent('bmap')
          .getBMap();
      bmap.clearOverlays();

      document.getElementById("bmap").removeAttribute("_echarts_instance_");
      // var chartDom = document.getElementById("bmap");
      var myChart = this.$echarts.init(global_dom);
      global_charts = myChart;
      // console.log("清楚后")
      // console.log(global_dom)
      global_charts.setOption(global_option);

      // this.showallarea();
      // this.showallcar();
    },
    async showsinglecar() {
      // this.terminal = '11650245350';
      this.terminal = '11650245368';
      await SearchCar(this, this.terminal)
          .then(rsp => {
            console.log(rsp);
            this.areacenter = [107.00836, 39.425373];
            this.initarea()
            // global_charts.setOption(global_option);
            // Vue.set(this.tableData, value, rsp.data.data)
            // this.tableData[value] = rsp.data.data;
            // console.log(this.tableData[value]);
          });
    },
    async showallcar() {
      this.terminal = '0';
      await SearchCar(this, this.terminal)
          .then(rsp => {
            console.log(rsp);
            this.data = rsp.data.data;
            this.geoCoordMap = rsp.data.coordmap;
            this.location = rsp.data.location;
            this.transportation_times = rsp.data.count;
            console.log(this.data)
            console.log(this.geoCoordMap)

            // Vue.set(this.tableData, value, rsp.data.data)
            // this.tableData[value] = rsp.data.data;
            // console.log(this.tableData[value]);
          });


      const bmap = global_charts
          .getModel()
          .getComponent('bmap')
          .getBMap();
      bmap.addControl(new BMap.NavigationControl());
      bmap.addControl(new BMap.ScaleControl());

      function addMarker(point, index){  // 创建图标对象
        var myIcon = new BMap.Icon("img/wacar.png", new BMap.Size(23, 25), {
          // 指定定位位置。
          // 当标注显示在地图上时，其所指向的地理位置距离图标左上
          // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
          // 图标中央下端的尖角位置。
          anchor: new BMap.Size(10, 25),
          // 设置图片偏移。
          // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
          // 需要指定大图的偏移位置，此做法与css sprites技术类似。
          imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
        });
        // 创建标注对象并添加到地图
        var marker = new BMap.Marker(point, {icon: myIcon});
        bmap.addOverlay(marker);
      }
      //
      // var point;
      var marker;
      var i = 0;
      for(var key in this.geoCoordMap){
        console.log(key + this.geoCoordMap[key]);
        var geoCoordMapElement = this.geoCoordMap[key];
        let point = new BMap.Point(geoCoordMapElement[0],geoCoordMapElement[1]);
        // let myIcon = new BMap.Icon("img/wacar.png", new BMap.Size(20, 20));
        // addMarker(point,i);
        // i++;
        marker = new BMap.Marker(point);        // 创建标注
        // marker = new BMap.Marker(point, {icon: myIcon});
        marker.setZIndex(200);


        let biaozhu1 = `此车辆终端号为：`+ key + `<br/><hr></hr>坐标点为：` + geoCoordMapElement[0] +" "+ geoCoordMapElement[1]
            + `<br/><hr></hr>当前所在区域为:` + this.location[key] + `<br/><hr></hr>当前已经运输次数:` + this.transportation_times[key];
// ``用该符号组定义字符串 ，比''好用



        let biaozhu = "此车辆终端号为："+ key + "\n坐标点为：" + geoCoordMapElement[0]+","+geoCoordMapElement[1] + "\n"
                      + "当前所在区域为:" + this.location[key] + "\n当前已经运输次数:" + this.transportation_times[key];

        var opts = {
          width: 300,
          height: 150

        };
        let infoWindow = new BMap.InfoWindow(biaozhu1, opts);




        (function(){
          marker.addEventListener("click",function(){
            // alert(biaozhu);
            bmap.openInfoWindow(infoWindow, point); // 开启信息窗口

          });
        })();

        // marker.addEventListener("click", function(){
        //
        //   // <el-alert
        //   //     title="成功提示的文案"
        //   //     type="success"
        //   //     center
        //   //     show-icon>
        //   // </el-alert>
        //   alert(biaozhu);
        //
        //
        //
        // });

        // marker.setIcon(myIcon);
        bmap.addOverlay(marker);
      }
      ///添加地图标注
      // var point = new BMap.Point(106.9445581367628,39.46553978194375);
      // bmap.centerAndZoom(point, 15);
      // var marker = new BMap.Marker(point);        // 创建标注
      // bmap.addOverlay(marker);

      ////展示地图车辆点
      // this.initarea();
    },
    getdatetime() {
      const d = new Date()
      const year = d.getFullYear();
      const month = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      const date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      const hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      const minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      const second= d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
      return year+'-'+month+'-'+date+' '+hour+':'+minute+':'+second;
    },
    showallarea(){

      // global_option = null;
      this.areacenter = [106.9427,39.4678155]
      this.initarea();
      console.log(global_option);
      var data = this.stopeareas;
      for( let i = 0; i <this.stopeareas.length; i++) {
        let j = i;
        global_option.series.push({
          type: 'custom',
          coordinateSystem: 'bmap',
          // eslint-disable-next-line no-undef
          renderItem: function renderItem(params, api) {
            var coords = data[j];
            // console.log(coords);
          // [
          // [116.7,39.53],
          // [103.73,36.03],
          // [112.91,27.87],
          // [120.65,28.01],
          // [119.57,39.95]]

            var points = [];
            for (var i = 0; i < coords.length; i++) {
              points.push(api.coord(coords[i]));
            }
            // var color = api.visual('color');
            var color = 'red';

          return {
            type: 'polygon',
            shape: {
              points: echarts.graphic.clipPointsByRect(points, {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
              })
            },
            style: api.style({
              fill: color,
              stroke: echarts.color.lift(color)
            }),
          };
        },
          itemStyle: {
            opacity: 0.5
          },
          animation: false,
          silent: true,
          data: [0],
          z: -10,
          label:{
            show:true,
            formatter: (params) => {
              // params.data.name 城市名称
              // params.data.value[2] 空气质量指数数据
              return '采坑'
              // return `${params.name} - ${params.type}`
            }
          },
        });

        // global_charts.setOption(global_option);
      }


      var data1 = this.slagyardareas;
      for( let i = 0; i <this.slagyardareas.length; i++) {
        let j = i;
        global_option.series.push({
          type: 'custom',
          coordinateSystem: 'bmap',
          // eslint-disable-next-line no-undef
          renderItem: function renderItem(params, api) {
            var coords = data1[j];
            var points = [];
            for (var i = 0; i < coords.length; i++) {
              points.push(api.coord(coords[i]));
            }
            var color = 'black';

            return {
              type: 'polygon',
              shape: {
                points: echarts.graphic.clipPointsByRect(points, {
                  x: params.coordSys.x,
                  y: params.coordSys.y,
                  width: params.coordSys.width,
                  height: params.coordSys.height
                })
              },
              style: api.style({
                fill: color,
                stroke: echarts.color.lift(color)
              })
            };
          },
          itemStyle: {
            opacity: 0.5
          },
          animation: false,
          silent: true,
          data: [0],
          z: -10,
          label:{
            show:true,
            formatter: (params) => {
              // params.data.name 城市名称
              // params.data.value[2] 空气质量指数数据
              return '渣场'
              // return `${params.name} - ${params.type}`
            }
          },
        });

        // global_charts.setOption(global_option);
      }
      console.log(global_option);
      // global_charts.setOption(global_option);
      // document.getElementById('bmap').innerHTML = "";

      var myChart = this.$echarts.init(global_dom);
      myChart.setOption(global_option);

    },
    renderItem(params, api) {
        var coords = this.area;
            // this.coord;
        // [
        // [116.7,39.53],
        // [103.73,36.03],
        // [112.91,27.87],
        // [120.65,28.01],
        // [119.57,39.95]]

        var points = [];
        for (var i = 0; i < coords.length; i++) {
          points.push(api.coord(coords[i]));
        }
        var color = api.visual('color');

        return {
          type: 'polygon',
          shape: {
            points: echarts.graphic.clipPointsByRect(points, {
              x: params.coordSys.x,
              y: params.coordSys.y,
              width: params.coordSys.width,
              height: params.coordSys.height
            })
          },
          style: api.style({
            fill: color,
            stroke: echarts.color.lift(color)
          }),

        };
      },


    changemapcenter(){
      //选择有问题 提醒
      if(this.areatype === '' || this.value ===''){

        this.$alert('请选择区域进行查询', '警告', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        });
        return;
      }
      document.getElementById('bmap').innerHTML = "";

      if(this.areatype === '1') {
        this.area = this.stopeareas[parseInt(this.value) - 1 ];
        this.areacenter = this.area[0];
      }
      else {
        this.area = this.slagyardareas[parseInt(this.value) - 1 ];
        this.areacenter = this.area[0];
      }
      // this.area = this.lidacaikeng;
      // this.areacenter = this.lidacaikengcenter;
      // this.mapcenter = this.mapcentertest;
      this.initarea();
      global_option.series = [];
      console.log(global_option);
      if(this.areatype === '1') {
        global_option.series.push({
          type: 'custom',
          coordinateSystem: 'bmap',
          // eslint-disable-next-line no-undef
          renderItem: this.renderItem,
          itemStyle: {
            opacity: 0.5
          },
          animation: false,
          silent: true,
          data: [0],
          z: -10,
          label:{
            show:true,
            formatter: (params) => {
              // params.data.name 城市名称
              // params.data.value[2] 空气质量指数数据
              return '采场'
              // return `${params.name} - ${params.type}`
            }
          },
        });
      }
      else {
        global_option.series.push({
          type: 'custom',
          coordinateSystem: 'bmap',
          // eslint-disable-next-line no-undef
          renderItem: this.renderItem,
          itemStyle: {
            opacity: 0.5
          },
          animation: false,
          silent: true,
          data: [0],
          z: -10,
          label:{
            show:true,
            formatter: (params) => {
              // params.data.name 城市名称
              // params.data.value[2] 空气质量指数数据
              return '渣场'
              // return `${params.name} - ${params.type}`
            }
          },
        });
      }
      console.log(global_option);

      console.log(global_dom)
      //清除  之前的series 数据
      document.getElementById("bmap").removeAttribute("_echarts_instance_");
      // var chartDom = document.getElementById("bmap");
      var myChart = this.$echarts.init(global_dom);
      global_charts = myChart;
      // console.log("清楚后")
      // console.log(global_dom)
      global_charts.setOption(global_option);
    },




    initarea(){

      var data1 =[
          // [{'coord': [107.00836, 39.425373], 'time': '2022-03-04 17:05:34'}, {'coord': [107.0085, 39.42551], 'time': '2022-03-04 17:05:40'}, {'coord': [107.00869, 39.42562], 'time': '2022-03-04 17:05:45'}, {'coord': [107.00876, 39.425808], 'time': '2022-03-04 17:05:50'}, {'coord': [107.00872, 39.425995], 'time': '2022-03-04 17:05:55'}, {'coord': [107.00864, 39.42616], 'time': '2022-03-04 17:06:00'}, {'coord': [107.00855, 39.42629], 'time': '2022-03-04 17:06:05'}, {'coord': [107.00844, 39.4264], 'time': '2022-03-04 17:06:10'}, {'coord': [107.00829, 39.426495], 'time': '2022-03-04 17:06:15'}, {'coord': [107.008125, 39.426582], 'time': '2022-03-04 17:06:20'}, {'coord': [107.007965, 39.426662], 'time': '2022-03-04 17:06:25'}, {'coord': [107.00779, 39.426743], 'time': '2022-03-04 17:06:30'}, {'coord': [107.00763, 39.426815], 'time': '2022-03-04 17:06:35'}, {'coord': [107.00747, 39.42689], 'time': '2022-03-04 17:06:40'}, {'coord': [107.0073, 39.42698], 'time': '2022-03-04 17:06:45'}, {'coord': [107.00713, 39.427055], 'time': '2022-03-04 17:06:50'}, {'coord': [107.0069, 39.427174], 'time': '2022-03-04 17:06:55'}, {'coord': [107.00661, 39.427353], 'time': '2022-03-04 17:07:00'}, {'coord': [107.006294, 39.427567], 'time': '2022-03-04 17:07:05'}, {'coord': [107.00595, 39.427814], 'time': '2022-03-04 17:07:10'}, {'coord': [107.00557, 39.428074], 'time': '2022-03-04 17:07:15'}, {'coord': [107.00518, 39.42834], 'time': '2022-03-04 17:07:20'}, {'coord': [107.00481, 39.42859], 'time': '2022-03-04 17:07:25'}, {'coord': [107.00439, 39.42885], 'time': '2022-03-04 17:07:30'}, {'coord': [107.00395, 39.4291], 'time': '2022-03-04 17:07:35'}, {'coord': [107.00348, 39.42933], 'time': '2022-03-04 17:07:40'}, {'coord': [107.002975, 39.429523], 'time': '2022-03-04 17:07:45'}, {'coord': [107.00235, 39.429714], 'time': '2022-03-04 17:07:51'}, {'coord': [107.0018, 39.429825], 'time': '2022-03-04 17:07:56'}, {'coord': [107.00123, 39.429924], 'time': '2022-03-04 17:08:01'}, {'coord': [107.00063, 39.430008], 'time': '2022-03-04 17:08:06'}, {'coord': [107.00008, 39.430088], 'time': '2022-03-04 17:08:11'}, {'coord': [106.9996, 39.43017], 'time': '2022-03-04 17:08:16'}, {'coord': [106.99918, 39.43028], 'time': '2022-03-04 17:08:21'}, {'coord': [106.99875, 39.430363], 'time': '2022-03-04 17:08:26'}, {'coord': [106.998344, 39.430496], 'time': '2022-03-04 17:08:31'}, {'coord': [106.99802, 39.43068], 'time': '2022-03-04 17:08:36'}, {'coord': [106.99783, 39.430912], 'time': '2022-03-04 17:08:41'}, {'coord': [106.99772, 39.43114], 'time': '2022-03-04 17:08:46'}, {'coord': [106.99765, 39.431423], 'time': '2022-03-04 17:08:51'}, {'coord': [106.99768, 39.431705], 'time': '2022-03-04 17:08:56'}, {'coord': [106.99787, 39.431904], 'time': '2022-03-04 17:09:01'}, {'coord': [106.9981, 39.432064], 'time': '2022-03-04 17:09:06'}, {'coord': [106.99835, 39.432247], 'time': '2022-03-04 17:09:11'}, {'coord': [106.9987, 39.43235], 'time': '2022-03-04 17:09:16'}, {'coord': [106.9991, 39.432476], 'time': '2022-03-04 17:09:21'}, {'coord': [106.99945, 39.43259], 'time': '2022-03-04 17:09:26'}, {'coord': [106.9998, 39.432743], 'time': '2022-03-04 17:09:31'}, {'coord': [107.00013, 39.43292], 'time': '2022-03-04 17:09:36'}, {'coord': [107.00048, 39.43303], 'time': '2022-03-04 17:09:41'}, {'coord': [107.00084, 39.433086], 'time': '2022-03-04 17:09:46'}, {'coord': [107.0012, 39.433064], 'time': '2022-03-04 17:09:51'}, {'coord': [107.00157, 39.432987], 'time': '2022-03-04 17:09:56'}, {'coord': [107.001854, 39.432922], 'time': '2022-03-04 17:10:01'}, {'coord': [107.002106, 39.4329], 'time': '2022-03-04 17:10:07'}, {'coord': [107.00235, 39.43288], 'time': '2022-03-04 17:10:12'}, {'coord': [107.002594, 39.432865], 'time': '2022-03-04 17:10:17'}, {'coord': [107.002785, 39.43278], 'time': '2022-03-04 17:10:22'}, {'coord': [107.00298, 39.43264], 'time': '2022-03-04 17:10:27'}, {'coord': [107.00309, 39.432484], 'time': '2022-03-04 17:10:32'}, {'coord': [107.003174, 39.43232], 'time': '2022-03-04 17:10:37'}, {'coord': [107.00331, 39.432148], 'time': '2022-03-04 17:10:42'}, {'coord': [107.003494, 39.43204], 'time': '2022-03-04 17:10:47'}, {'coord': [107.00362, 39.431995], 'time': '2022-03-04 17:10:52'}, {'coord': [107.00374, 39.431957], 'time': '2022-03-04 17:10:57'}, {'coord': [107.00385, 39.43192], 'time': '2022-03-04 17:11:02'}, {'coord': [107.00397, 39.43189], 'time': '2022-03-04 17:11:07'}, {'coord': [107.00409, 39.431854], 'time': '2022-03-04 17:11:12'}, {'coord': [107.00422, 39.431812], 'time': '2022-03-04 17:11:17'}, {'coord': [107.00433, 39.431755], 'time': '2022-03-04 17:11:22'}, {'coord': [107.00446, 39.4317], 'time': '2022-03-04 17:11:27'}, {'coord': [107.004585, 39.431644], 'time': '2022-03-04 17:11:32'}, {'coord': [107.004715, 39.43161], 'time': '2022-03-04 17:11:37'}, {'coord': [107.004814, 39.431698], 'time': '2022-03-04 17:11:42'}, {'coord': [107.004776, 39.431763], 'time': '2022-03-04 17:11:47'}, {'coord': [107.004776, 39.431763], 'time': '2022-03-04 17:11:52'}, {'coord': [107.004776, 39.431717], 'time': '2022-03-04 17:11:57'}, {'coord': [107.0048, 39.43168], 'time': '2022-03-04 17:12:03'}, {'coord': [107.0048, 39.43168], 'time': '2022-03-04 17:12:08'}, {'coord': [107.0048, 39.43168], 'time': '2022-03-04 17:12:13'}, {'coord': [107.0048, 39.43168], 'time': '2022-03-04 17:12:18'}, {'coord': [107.0048, 39.43168], 'time': '2022-03-04 17:12:23'}, {'coord': [107.0048, 39.43168], 'time': '2022-03-04 17:12:28'}, {'coord': [107.0048, 39.43168], 'time': '2022-03-04 17:12:33'}, {'coord': [107.0048, 39.43168], 'time': '2022-03-04 17:12:38'}, {'coord': [107.0048, 39.43168], 'time': '2022-03-04 17:12:43'}, {'coord': [107.0048, 39.43168], 'time': '2022-03-04 17:12:48'}, {'coord': [107.00477, 39.431664], 'time': '2022-03-04 17:12:53'}, {'coord': [107.00462, 39.43169], 'time': '2022-03-04 17:12:58'}, {'coord': [107.00437, 39.431774], 'time': '2022-03-04 17:13:03'}, {'coord': [107.004074, 39.43191], 'time': '2022-03-04 17:13:08'}, {'coord': [107.00382, 39.432034], 'time': '2022-03-04 17:13:13'}, {'coord': [107.003555, 39.432163], 'time': '2022-03-04 17:13:18'}, {'coord': [107.00329, 39.43236], 'time': '2022-03-04 17:13:23'}, {'coord': [107.003105, 39.432545], 'time': '2022-03-04 17:13:28'}, {'coord': [107.00299, 39.432755], 'time': '2022-03-04 17:13:33'}, {'coord': [107.00287, 39.432976], 'time': '2022-03-04 17:13:38'}, {'coord': [107.00255, 39.433113], 'time': '2022-03-04 17:13:43'}, {'coord': [107.002174, 39.433186], 'time': '2022-03-04 17:13:48'}, {'coord': [107.001755, 39.433216], 'time': '2022-03-04 17:13:53'}, {'coord': [107.00132, 39.433235], 'time': '2022-03-04 17:13:58'}, {'coord': [107.000916, 39.433224], 'time': '2022-03-04 17:14:03'}, {'coord': [107.00046, 39.433136], 'time': '2022-03-04 17:14:09'}, {'coord': [107.00015, 39.433056], 'time': '2022-03-04 17:14:14'}, {'coord': [106.99988, 39.43292], 'time': '2022-03-04 17:14:19'}, {'coord': [106.999535, 39.43277], 'time': '2022-03-04 17:14:24'}, {'coord': [106.9992, 39.43264], 'time': '2022-03-04 17:14:29'}, {'coord': [106.99886, 39.43253], 'time': '2022-03-04 17:14:34'}, {'coord': [106.99851, 39.432407], 'time': '2022-03-04 17:14:39'}, {'coord': [107.00068, 39.43006], 'time': '2022-03-04 17:15:49'}, {'coord': [107.00116, 39.42999], 'time': '2022-03-04 17:15:54'}, {'coord': [107.0017, 39.429905], 'time': '2022-03-04 17:15:59'}, {'coord': [107.0022, 39.42978], 'time': '2022-03-04 17:16:04'}, {'coord': [107.00269, 39.42964], 'time': '2022-03-04 17:16:09'}, {'coord': [107.003204, 39.429462], 'time': '2022-03-04 17:16:14'}, {'coord': [107.00381, 39.429207], 'time': '2022-03-04 17:16:20'}, {'coord': [107.00425, 39.428963], 'time': '2022-03-04 17:16:25'}, {'coord': [107.00467, 39.42871], 'time': '2022-03-04 17:16:30'}, {'coord': [107.00509, 39.428444], 'time': '2022-03-04 17:16:35'}, {'coord': [107.00546, 39.428196], 'time': '2022-03-04 17:16:40'}, {'coord': [107.00584, 39.42794], 'time': '2022-03-04 17:16:45'}, {'coord': [107.00621, 39.42768], 'time': '2022-03-04 17:16:50'}, {'coord': [107.00656, 39.42747], 'time': '2022-03-04 17:16:55'}, {'coord': [107.00686, 39.42742], 'time': '2022-03-04 17:17:00'}, {'coord': [107.00712, 39.427444], 'time': '2022-03-04 17:17:05'}, {'coord': [107.00742, 39.42754], 'time': '2022-03-04 17:17:10'}, {'coord': [107.00767, 39.42766], 'time': '2022-03-04 17:17:15'}, {'coord': [107.00792, 39.427814], 'time': '2022-03-04 17:17:20'}, {'coord': [107.0083, 39.42792], 'time': '2022-03-04 17:17:25'}, {'coord': [107.008705, 39.427963], 'time': '2022-03-04 17:17:30'}, {'coord': [107.00911, 39.428], 'time': '2022-03-04 17:17:35'}, {'coord': [107.009476, 39.428055], 'time': '2022-03-04 17:17:40'}, {'coord': [107.00978, 39.428104], 'time': '2022-03-04 17:17:45'}, {'coord': [107.010025, 39.428135], 'time': '2022-03-04 17:17:50'}, {'coord': [107.01025, 39.428158], 'time': '2022-03-04 17:17:55'}, {'coord': [107.01045, 39.428158], 'time': '2022-03-04 17:18:00'}, {'coord': [107.01063, 39.42815], 'time': '2022-03-04 17:18:05'}, {'coord': [107.0108, 39.428173], 'time': '2022-03-04 17:18:10'}, {'coord': [107.011024, 39.428196], 'time': '2022-03-04 17:18:16'}, {'coord': [107.01121, 39.42822], 'time': '2022-03-04 17:18:21'}, {'coord': [107.01138, 39.428207], 'time': '2022-03-04 17:18:26'}, {'coord': [107.01163, 39.428123], 'time': '2022-03-04 17:18:31'}, {'coord': [107.01193, 39.428043], 'time': '2022-03-04 17:18:36'}, {'coord': [107.01229, 39.42804], 'time': '2022-03-04 17:18:41'}, {'coord': [107.01262, 39.428127], 'time': '2022-03-04 17:18:46'}, {'coord': [107.012886, 39.42826], 'time': '2022-03-04 17:18:51'}, {'coord': [107.01311, 39.428303], 'time': '2022-03-04 17:18:56'}, {'coord': [107.01314, 39.428307], 'time': '2022-03-04 17:19:01'}, {'coord': [107.01314, 39.428307], 'time': '2022-03-04 17:19:06'}, {'coord': [107.013214, 39.42832], 'time': '2022-03-04 17:19:11'}, {'coord': [107.01336, 39.428314], 'time': '2022-03-04 17:19:16'}, {'coord': [107.01351, 39.428288], 'time': '2022-03-04 17:19:21'}, {'coord': [107.013664, 39.428257], 'time': '2022-03-04 17:19:26'}, {'coord': [107.0138, 39.428223], 'time': '2022-03-04 17:19:31'}, {'coord': [107.01395, 39.428192], 'time': '2022-03-04 17:19:36'}, {'coord': [107.01409, 39.42814], 'time': '2022-03-04 17:19:41'}, {'coord': [107.01421, 39.42808], 'time': '2022-03-04 17:19:46'}, {'coord': [107.014336, 39.428013], 'time': '2022-03-04 17:19:51'}],
          //   [{'coord': [106.95332, 39.472805], 'time': '211229123018'}, {'coord': [106.9534, 39.472748], 'time': '211229123023'}, {'coord': [106.95364, 39.472332], 'time': '211229123048'}, {'coord': [106.95361, 39.472424], 'time': '211229123043'}, {'coord': [106.95365, 39.472218], 'time': '211229123053'}, {'coord': [106.95346, 39.47267], 'time': '211229123028'}, {'coord': [106.953575, 39.472515], 'time': '211229123038'}, {'coord': [106.95352, 39.472595], 'time': '211229123033'}, {'coord': [106.95368, 39.472095], 'time': '211229123058'}, {'coord': [106.953735, 39.471977], 'time': '211229123103'}, {'coord': [106.95384, 39.47182], 'time': '211229123108'}, {'coord': [106.953995, 39.471615], 'time': '211229123113'}, {'coord': [106.95418, 39.471394], 'time': '211229123118'}, {'coord': [106.9544, 39.471157], 'time': '211229123123'}, {'coord': [106.95465, 39.47088], 'time': '211229123128'}, {'coord': [106.95492, 39.47058], 'time': '211229123133'}, {'coord': [106.95521, 39.470276], 'time': '211229123138'}, {'coord': [106.955444, 39.469982], 'time': '211229123143'}, {'coord': [106.95571, 39.46969], 'time': '211229123148'}, {'coord': [106.956116, 39.468304], 'time': '211229123208'}, {'coord': [106.95608, 39.467983], 'time': '211229123213'}, {'coord': [106.95598, 39.469383], 'time': '211229123153'}, {'coord': [106.95617, 39.469048], 'time': '211229123158'}, {'coord': [106.95615, 39.467777], 'time': '211229123218'}, {'coord': [106.95621, 39.46866], 'time': '211229123203'}, {'coord': [106.95631, 39.467785], 'time': '211229123223'}, {'coord': [106.95631, 39.467785], 'time': '211229123228'}, {'coord': [106.956154, 39.46777], 'time': '211229123233'}, {'coord': [106.95613, 39.46775], 'time': '211229123238'}, {'coord': [106.95613, 39.46775], 'time': '211229123243'}, {'coord': [106.95613, 39.46775], 'time': '211229123248'}, {'coord': [106.95613, 39.46775], 'time': '211229123253'}, {'coord': [106.95613, 39.46775], 'time': '211229123258'}, {'coord': [106.95613, 39.46775], 'time': '211229123303'}, {'coord': [106.95613, 39.46775], 'time': '211229123308'}, {'coord': [106.95615, 39.467785], 'time': '211229123313'}, {'coord': [106.95618, 39.467953], 'time': '211229123318'}, {'coord': [106.95614, 39.468178], 'time': '211229123323'}, {'coord': [106.95594, 39.468414], 'time': '211229123328'}, {'coord': [106.95574, 39.46874], 'time': '211229123333'}, {'coord': [106.95552, 39.469086], 'time': '211229123338'}, {'coord': [106.9553, 39.469475], 'time': '211229123343'}, {'coord': [106.95506, 39.469852], 'time': '211229123348'}, {'coord': [106.954834, 39.47021], 'time': '211229123353'}, {'coord': [106.9546, 39.470585], 'time': '211229123358'}, {'coord': [106.95434, 39.470932], 'time': '211229123403'}, {'coord': [106.954056, 39.471306], 'time': '211229123408'}, {'coord': [106.95375, 39.4717], 'time': '211229123413'}, {'coord': [106.953545, 39.472137], 'time': '211229123418'}, {'coord': [106.95339, 39.472595], 'time': '211229123423'}, {'coord': [106.953026, 39.472878], 'time': '211229123428'}, {'coord': [106.952675, 39.47267], 'time': '211229123433'}, {'coord': [106.95235, 39.47225], 'time': '211229123438'}, {'coord': [106.951935, 39.471817], 'time': '211229123443'}, {'coord': [106.951515, 39.4714], 'time': '211229123448'}, {'coord': [106.95132, 39.47092], 'time': '211229123453'}, {'coord': [106.95144, 39.4705], 'time': '211229123458'}, {'coord': [106.9519, 39.47013], 'time': '211229123503'}, {'coord': [106.95233, 39.46969], 'time': '211229123508'}, {'coord': [106.952675, 39.46916], 'time': '211229123513'}, {'coord': [106.95297, 39.468662], 'time': '211229123518'}, {'coord': [106.95355, 39.46783], 'time': '211229123528'}, {'coord': [106.95363, 39.467648], 'time': '211229123533'}, {'coord': [106.95368, 39.46756], 'time': '211229123538'}, {'coord': [106.95376, 39.46736], 'time': '211229123543'}, {'coord': [106.95386, 39.467056], 'time': '211229123548'}, {'coord': [106.95382, 39.46664], 'time': '211229123553'}, {'coord': [106.95364, 39.4662], 'time': '211229123558'}, {'coord': [106.95309, 39.46549], 'time': '211229123608'}, {'coord': [106.951935, 39.465263], 'time': '211229123618'}, {'coord': [106.95253, 39.465343], 'time': '211229123613'}, {'coord': [106.95344, 39.465767], 'time': '211229123603'}, {'coord': [106.95135, 39.465363], 'time': '211229123623'}, {'coord': [106.95078, 39.465496], 'time': '211229123628'}, {'coord': [106.95027, 39.465584], 'time': '211229123633'}, {'coord': [106.94969, 39.465736], 'time': '211229123638'}, {'coord': [106.94901, 39.46585], 'time': '211229123643'}, {'coord': [106.94834, 39.4658], 'time': '211229123648'}, {'coord': [106.94779, 39.465744], 'time': '211229123653'}, {'coord': [106.9473, 39.465813], 'time': '211229123658'}, {'coord': [106.94676, 39.465893], 'time': '211229123703'}, {'coord': [106.94619, 39.46598], 'time': '211229123708'}, {'coord': [106.94546, 39.4661], 'time': '211229123713'}, {'coord': [106.94456, 39.466225], 'time': '211229123718'}, {'coord': [106.943665, 39.46633], 'time': '211229123723'}, {'coord': [106.94303, 39.46659], 'time': '211229123728'}, {'coord': [106.942505, 39.46688], 'time': '211229123733'}, {'coord': [106.941986, 39.467068], 'time': '211229123738'}, {'coord': [106.94147, 39.46719], 'time': '211229123743'}, {'coord': [106.94098, 39.467354], 'time': '211229123748'}, {'coord': [106.940506, 39.467533], 'time': '211229123753'}, {'coord': [106.94004, 39.46782], 'time': '211229123758'}, {'coord': [106.93971, 39.468193], 'time': '211229123803'}, {'coord': [106.9396, 39.46853], 'time': '211229123808'}, {'coord': [106.93957, 39.468807], 'time': '211229123813'}, {'coord': [106.939415, 39.468903], 'time': '211229123818'}, {'coord': [106.93935, 39.46886], 'time': '211229123823'}, {'coord': [106.93947, 39.468857], 'time': '211229123829'}, {'coord': [106.939514, 39.468853], 'time': '211229123834'}, {'coord': [106.93955, 39.46881], 'time': '211229123839'}, {'coord': [106.93955, 39.46881], 'time': '211229123844'}, {'coord': [106.93955, 39.46881], 'time': '211229123849'}, {'coord': [106.93955, 39.46881], 'time': '211229123854'}, {'coord': [106.93955, 39.46881], 'time': '211229123859'}, {'coord': [106.93955, 39.46881], 'time': '211229123904'}, {'coord': [106.93955, 39.46881], 'time': '211229123904'}, {'coord': [106.93955, 39.46881], 'time': '211229123909'}, {'coord': [106.93955, 39.46881], 'time': '211229123939'}, {'coord': [106.93955, 39.46881], 'time': '211229124009'}, {'coord': [106.93955, 39.46881], 'time': '211229124039'}, {'coord': [106.93955, 39.46881], 'time': '211229124109'}, {'coord': [106.93955, 39.46881], 'time': '211229124139'}, {'coord': [106.93955, 39.46881], 'time': '211229124209'}, {'coord': [106.93955, 39.46881], 'time': '211229124216'}, {'coord': [106.93953, 39.468983], 'time': '211229124224'}, {'coord': [106.9396, 39.468918], 'time': '211229124229'}, {'coord': [106.93961, 39.46883], 'time': '211229124234'}, {'coord': [106.9396, 39.468746], 'time': '211229124239'}, {'coord': [106.93961, 39.46864], 'time': '211229124244'}, {'coord': [106.93961, 39.46855], 'time': '211229124249'}, {'coord': [106.93963, 39.46845], 'time': '211229124254'}, {'coord': [106.93967, 39.468334], 'time': '211229124259'}, {'coord': [106.93972, 39.46818], 'time': '211229124304'}, {'coord': [106.93989, 39.467953], 'time': '211229124309'}, {'coord': [106.94008, 39.46776], 'time': '211229124314'}, {'coord': [106.94018, 39.467705], 'time': '211229124319'}, {'coord': [106.94033, 39.46769], 'time': '211229124324'}, {'coord': [106.94052, 39.467648], 'time': '211229124329'}, {'coord': [106.94071, 39.467567], 'time': '211229124334'}, {'coord': [106.940834, 39.467545], 'time': '211229124339'}, {'coord': [106.940994, 39.467495], 'time': '211229124344'}, {'coord': [106.94114, 39.467457], 'time': '211229124349'}, {'coord': [106.94123, 39.467438], 'time': '211229124354'}, {'coord': [106.94132, 39.467407], 'time': '211229124359'}, {'coord': [106.94141, 39.467384], 'time': '211229124404'}, {'coord': [106.94149, 39.467365], 'time': '211229124409'}, {'coord': [106.94157, 39.467354], 'time': '211229124414'}, {'coord': [106.94165, 39.46733], 'time': '211229124419'}, {'coord': [106.94173, 39.467308], 'time': '211229124424'}, {'coord': [106.94185, 39.467274], 'time': '211229124429'}, {'coord': [106.94198, 39.467213], 'time': '211229124434'}, {'coord': [106.94209, 39.46716], 'time': '211229124439'}, {'coord': [106.94221, 39.467094], 'time': '211229124444'}, {'coord': [106.94235, 39.467037], 'time': '211229124449'}, {'coord': [106.9425, 39.466972], 'time': '211229124454'}, {'coord': [106.94266, 39.46689], 'time': '211229124459'}, {'coord': [106.942856, 39.466778], 'time': '211229124504'}, {'coord': [106.94316, 39.466618], 'time': '211229124509'}, {'coord': [106.94351, 39.466434], 'time': '211229124514'}, {'coord': [106.94397, 39.46637], 'time': '211229124519'}, {'coord': [106.94447, 39.466328], 'time': '211229124524'}, {'coord': [106.94494, 39.466305], 'time': '211229124529'}, {'coord': [106.94533, 39.466248], 'time': '211229124534'}, {'coord': [106.94562, 39.46619], 'time': '211229124539'}, {'coord': [106.945854, 39.466137], 'time': '211229124544'}, {'coord': [106.94598, 39.46612], 'time': '211229124549'}, {'coord': [106.9461, 39.466095], 'time': '211229124554'}, {'coord': [106.94622, 39.466072], 'time': '211229124559'}, {'coord': [106.94635, 39.46605], 'time': '211229124604'}, {'coord': [106.94647, 39.466026], 'time': '211229124609'}, {'coord': [106.94656, 39.46602], 'time': '211229124614'}, {'coord': [106.946655, 39.466007], 'time': '211229124619'}, {'coord': [106.94677, 39.465992], 'time': '211229124624'}, {'coord': [106.94686, 39.465977], 'time': '211229124629'}, {'coord': [106.94696, 39.46597], 'time': '211229124634'}, {'coord': [106.94706, 39.465958], 'time': '211229124639'}, {'coord': [106.94717, 39.46594], 'time': '211229124644'}, {'coord': [106.94728, 39.46592], 'time': '211229124649'}, {'coord': [106.94739, 39.465897], 'time': '211229124654'}, {'coord': [106.94745, 39.465885], 'time': '211229124659'}, {'coord': [106.947525, 39.465862], 'time': '211229124704'}, {'coord': [106.94761, 39.465847], 'time': '211229124709'}, {'coord': [106.947685, 39.46583], 'time': '211229124714'}, {'coord': [106.94777, 39.46581], 'time': '211229124719'}, {'coord': [106.94785, 39.465794], 'time': '211229124724'}, {'coord': [106.947945, 39.465775], 'time': '211229124729'}, {'coord': [106.94807, 39.465775], 'time': '211229124734'}, {'coord': [106.94832, 39.465805], 'time': '211229124739'}, {'coord': [106.948746, 39.46589], 'time': '211229124744'}, {'coord': [106.94928, 39.465904], 'time': '211229124749'}, {'coord': [106.94969, 39.465836], 'time': '211229124754'}, {'coord': [106.949875, 39.465794], 'time': '211229124759'}, {'coord': [106.94997, 39.465748], 'time': '211229124804'}, {'coord': [106.95006, 39.46569], 'time': '211229124809'}, {'coord': [106.95014, 39.46565], 'time': '211229124814'}, {'coord': [106.95024, 39.465614], 'time': '211229124819'}, {'coord': [106.95037, 39.46559], 'time': '211229124824'}, {'coord': [106.95049, 39.46557], 'time': '211229124829'}, {'coord': [106.950714, 39.46551], 'time': '211229124834'}, {'coord': [106.95093, 39.46546], 'time': '211229124839'}, {'coord': [106.9512, 39.46541], 'time': '211229124844'}, {'coord': [106.95143, 39.465336], 'time': '211229124849'}, {'coord': [106.951546, 39.465298], 'time': '211229124854'}, {'coord': [106.95165, 39.465263], 'time': '211229124859'}, {'coord': [106.951775, 39.465244], 'time': '211229124904'}, {'coord': [106.95188, 39.46524], 'time': '211229124909'}, {'coord': [106.95196, 39.46524], 'time': '211229124914'}, {'coord': [106.95205, 39.46525], 'time': '211229124919'}, {'coord': [106.95213, 39.465252], 'time': '211229124924'}, {'coord': [106.95222, 39.465256], 'time': '211229124929'}, {'coord': [106.9523, 39.465263], 'time': '211229124934'}, {'coord': [106.9524, 39.465275], 'time': '211229124939'}, {'coord': [106.95249, 39.465286], 'time': '211229124944'}, {'coord': [106.952576, 39.465305], 'time': '211229124949'}, {'coord': [106.95266, 39.46532], 'time': '211229124954'}, {'coord': [106.952736, 39.46534], 'time': '211229124959'}, {'coord': [106.95283, 39.46536], 'time': '211229125004'}, {'coord': [106.952896, 39.46538], 'time': '211229125009'}, {'coord': [106.95297, 39.465397], 'time': '211229125014'}]
        // {'coord': [106.95306, 39.465412], 'time': '211229125019'}, {'coord': [106.95313, 39.46543], 'time': '211229125024'}, {'coord': [106.95322, 39.46545], 'time': '211229125029'}, {'coord': [106.953285, 39.465485], 'time': '211229125034'}, {'coord': [106.953354, 39.465523], 'time': '211229125039'}, {'coord': [106.95341, 39.465572], 'time': '211229125044'}, {'coord': [106.95345, 39.46563], 'time': '211229125049'}, {'coord': [106.95351, 39.465717], 'time': '211229125054'}, {'coord': [106.95356, 39.465816], 'time': '211229125100'}, {'coord': [106.95359, 39.465893], 'time': '211229125104'}, {'coord': [106.95363, 39.46601], 'time': '211229125109'}, {'coord': [106.9537, 39.46615], 'time': '211229125115'}, {'coord': [106.953735, 39.466248], 'time': '211229125120'}, {'coord': [106.953766, 39.46632], 'time': '211229125125'}, {'coord': [106.95379, 39.466393], 'time': '211229125130'}, {'coord': [106.953835, 39.466465], 'time': '211229125135'}, {'coord': [106.95387, 39.466545], 'time': '211229125140'}, {'coord': [106.95391, 39.466625], 'time': '211229125145'}, {'coord': [106.95393, 39.466717], 'time': '211229125150'}, {'coord': [106.95395, 39.46681], 'time': '211229125155'}, {'coord': [106.95395, 39.4669], 'time': '211229125200'}, {'coord': [106.95393, 39.46699], 'time': '211229125205'}, {'coord': [106.95391, 39.467075], 'time': '211229125210'}, {'coord': [106.95387, 39.46716], 'time': '211229125215'}, {'coord': [106.95383, 39.46724], 'time': '211229125220'}, {'coord': [106.95377, 39.46732], 'time': '211229125225'}, {'coord': [106.953705, 39.467407], 'time': '211229125230'}, {'coord': [106.95363, 39.46752], 'time': '211229125235'}, {'coord': [106.95355, 39.467632], 'time': '211229125240'}, {'coord': [106.95349, 39.467747], 'time': '211229125245'}, {'coord': [106.95344, 39.467865], 'time': '211229125250'}, {'coord': [106.95339, 39.46797], 'time': '211229125255'}, {'coord': [106.95334, 39.468082], 'time': '211229125300'}, {'coord': [106.95326, 39.4682], 'time': '211229125305'}, {'coord': [106.953186, 39.46831], 'time': '211229125310'}, {'coord': [106.953094, 39.468426], 'time': '211229125315'}, {'coord': [106.95299, 39.468567], 'time': '211229125320'}, {'coord': [106.95286, 39.46872], 'time': '211229125325'}, {'coord': [106.95277, 39.46883], 'time': '211229125330'}, {'coord': [106.952705, 39.468933], 'time': '211229125335'}, {'coord': [106.95262, 39.469044], 'time': '211229125340'}, {'coord': [106.95257, 39.46915], 'time': '211229125345'}, {'coord': [106.95252, 39.469257], 'time': '211229125350'}, {'coord': [106.95247, 39.469364], 'time': '211229125355'}, {'coord': [106.95243, 39.46944], 'time': '211229125400'}, {'coord': [106.95239, 39.469513], 'time': '211229125405'}, {'coord': [106.95236, 39.469593], 'time': '211229125410'}, {'coord': [106.95231, 39.469666], 'time': '211229125415'}, {'coord': [106.95226, 39.469734], 'time': '211229125420'}, {'coord': [106.952, 39.47001], 'time': '211229125440'}, {'coord': [106.9514, 39.470516], 'time': '211229125515'}, {'coord': [106.95163, 39.470295], 'time': '211229125500'}, {'coord': [106.95184, 39.470135], 'time': '211229125450'}, {'coord': [106.95221, 39.469807], 'time': '211229125425'}, {'coord': [106.95192, 39.470062], 'time': '211229125445'}, {'coord': [106.95146, 39.470444], 'time': '211229125510'}, {'coord': [106.95214, 39.469883], 'time': '211229125430'}, {'coord': [106.951294, 39.470665], 'time': '211229125525'}, {'coord': [106.95173, 39.470222], 'time': '211229125455'}, {'coord': [106.95135, 39.470585], 'time': '211229125520'}, {'coord': [106.95154, 39.470375], 'time': '211229125505'}, {'coord': [106.95207, 39.469948], 'time': '211229125435'}, {'coord': [106.95126, 39.470757], 'time': '211229125530'}, {'coord': [106.95125, 39.47085], 'time': '211229125535'}, {'coord': [106.95123, 39.470943], 'time': '211229125540'}, {'coord': [106.951294, 39.471073], 'time': '211229125545'}, {'coord': [106.95142, 39.47116], 'time': '211229125550'}, {'coord': [106.95158, 39.471172], 'time': '211229125555'}, {'coord': [106.95171, 39.471096], 'time': '211229125600'}, {'coord': [106.95182, 39.471016], 'time': '211229125605'}, {'coord': [106.95193, 39.470943], 'time': '211229125610'}, {'coord': [106.95203, 39.47085], 'time': '211229125615'}, {'coord': [106.952126, 39.470768], 'time': '211229125620'}, {'coord': [106.95225, 39.47066], 'time': '211229125625'}, {'coord': [106.952385, 39.47057], 'time': '211229125630'}, {'coord': [106.95254, 39.47047], 'time': '211229125635'}, {'coord': [106.95268, 39.470375], 'time': '211229125640'}, {'coord': [106.952774, 39.470337], 'time': '211229125645'}, {'coord': [106.952866, 39.47028], 'time': '211229125650'}, {'coord': [106.95295, 39.470215], 'time': '211229125655'}, {'coord': [106.95306, 39.470142], 'time': '211229125700'}, {'coord': [106.95318, 39.47004], 'time': '211229125705'}, {'coord': [106.95335, 39.46992], 'time': '211229125710'}, {'coord': [106.95351, 39.46979], 'time': '211229125715'}, {'coord': [106.95363, 39.46968], 'time': '211229125720'}, {'coord': [106.95374, 39.469604], 'time': '211229125725'}, {'coord': [106.95385, 39.469536], 'time': '211229125730'}, {'coord': [106.95398, 39.46948], 'time': '211229125735'}, {'coord': [106.954094, 39.469402], 'time': '211229125740'}, {'coord': [106.95435, 39.46921], 'time': '211229125750'}, {'coord': [106.95453, 39.469063], 'time': '211229125755'}, {'coord': [106.95421, 39.46933], 'time': '211229125745'}, {'coord': [106.95472, 39.46889], 'time': '211229125800'}, {'coord': [106.954926, 39.46872], 'time': '211229125805'}, {'coord': [106.95513, 39.46858], 'time': '211229125810'}, {'coord': [106.955215, 39.468494], 'time': '211229125815'}, {'coord': [106.95529, 39.468403], 'time': '211229125820'}, {'coord': [106.95539, 39.46829], 'time': '211229125825'}, {'coord': [106.95549, 39.468113], 'time': '211229125830'}, {'coord': [106.955536, 39.467934], 'time': '211229125835'}, {'coord': [106.95562, 39.467712], 'time': '211229125840'}, {'coord': [106.95571, 39.46746], 'time': '211229125845'}, {'coord': [106.9558, 39.467197], 'time': '211229125850'}, {'coord': [106.955925, 39.46697], 'time': '211229125855'}, {'coord': [106.95613, 39.466915], 'time': '211229125900'}, {'coord': [106.95616, 39.46693], 'time': '211229125905'}, {'coord': [106.95607, 39.46692], 'time': '211229125910'}, {'coord': [106.95601, 39.466896], 'time': '211229125915'}, {'coord': [106.955986, 39.466877], 'time': '211229125920'}, {'coord': [106.955986, 39.466877], 'time': '211229125925'}, {'coord': [106.955986, 39.466877], 'time': '211229125930'}, {'coord': [106.955986, 39.466877], 'time': '211229125935'}, {'coord': [106.955986, 39.466877], 'time': '211229125940'}, {'coord': [106.955986, 39.466877], 'time': '211229125945'}, {'coord': [106.955986, 39.466877], 'time': '211229125950'}, {'coord': [106.955986, 39.466877], 'time': '211229125955'}, {'coord': [106.955986, 39.466877], 'time': '211229130000'}, {'coord': [106.9559, 39.46694], 'time': '211229130003'}, {'coord': [106.955795, 39.467144], 'time': '211229130008'}, {'coord': [106.95572, 39.467415], 'time': '211229130013'}, {'coord': [106.95562, 39.46768], 'time': '211229130018'}, {'coord': [106.955505, 39.467873], 'time': '211229130023'}, {'coord': [106.955505, 39.468067], 'time': '211229130028'}, {'coord': [106.95541, 39.468216], 'time': '211229130033'}, {'coord': [106.95536, 39.468323], 'time': '211229130038'}, {'coord': [106.95525, 39.46849], 'time': '211229130043'}, {'coord': [106.955055, 39.468647], 'time': '211229130048'}, {'coord': [106.95482, 39.46884], 'time': '211229130053'}, {'coord': [106.95457, 39.469063], 'time': '211229130058'}, {'coord': [106.954315, 39.469265], 'time': '211229130103'}, {'coord': [106.95407, 39.469437], 'time': '211229130108'}, {'coord': [106.95379, 39.4696], 'time': '211229130113'}, {'coord': [106.95353, 39.469814], 'time': '211229130118'}, {'coord': [106.95326, 39.470013], 'time': '211229130123'}, {'coord': [106.952995, 39.470215], 'time': '211229130128'}, {'coord': [106.9527, 39.470364], 'time': '211229130133'}, {'coord': [106.952415, 39.470577], 'time': '211229130138'}, {'coord': [106.952194, 39.470737], 'time': '211229130143'}, {'coord': [106.951965, 39.470905], 'time': '211229130148'}, {'coord': [106.95173, 39.471046], 'time': '211229130153'}, {'coord': [106.95146, 39.471024], 'time': '211229130158'}, {'coord': [106.95141, 39.470753], 'time': '211229130203'}, {'coord': [106.951614, 39.470417], 'time': '211229130208'}, {'coord': [106.95201, 39.470104], 'time': '211229130213'}, {'coord': [106.95239, 39.469692], 'time': '211229130218'}, {'coord': [106.95273, 39.469204], 'time': '211229130223'}, {'coord': [106.953026, 39.46872], 'time': '211229130228'}, {'coord': [106.95333, 39.46829], 'time': '211229130233'}, {'coord': [106.95354, 39.46794], 'time': '211229130238'}, {'coord': [106.95372, 39.4676], 'time': '211229130243'}, {'coord': [106.95387, 39.46724], 'time': '211229130248'}, {'coord': [106.953926, 39.4668], 'time': '211229130253'}, {'coord': [106.9538, 39.46639], 'time': '211229130258'}, {'coord': [106.95359, 39.465977], 'time': '211229130303'}, {'coord': [106.95071, 39.46553], 'time': '211229130333'}, {'coord': [106.95332, 39.465584], 'time': '211229130308'}, {'coord': [106.95229, 39.465324], 'time': '211229130318'}, {'coord': [106.95278, 39.46541], 'time': '211229130313'}, {'coord': [106.95125, 39.465427], 'time': '211229130328'}, {'coord': [106.95179, 39.4653], 'time': '211229130323'}, {'coord': [106.950226, 39.465626], 'time': '211229130338'}, {'coord': [106.94979, 39.46571], 'time': '211229130343'}, {'coord': [106.9492, 39.465847], 'time': '211229130348'}, {'coord': [106.94851, 39.46589], 'time': '211229130353'}, {'coord': [106.947945, 39.46576], 'time': '211229130358'}, {'coord': [106.94745, 39.465805], 'time': '211229130403'}, {'coord': [106.94674, 39.46593], 'time': '211229130409'}, {'coord': [106.94603, 39.46605], 'time': '211229130414'}, {'coord': [106.94525, 39.46616], 'time': '211229130419'}, {'coord': [106.9444, 39.466248], 'time': '211229130424'}, {'coord': [106.943565, 39.46634], 'time': '211229130429'}, {'coord': [106.94295, 39.466564], 'time': '211229130434'}, {'coord': [106.94251, 39.46686], 'time': '211229130439'}, {'coord': [106.94204, 39.467083], 'time': '211229130444'}, {'coord': [106.94147, 39.467243], 'time': '211229130449'}, {'coord': [106.94089, 39.467487], 'time': '211229130454'}, {'coord': [106.94023, 39.467674], 'time': '211229130459'}, {'coord': [106.93977, 39.468], 'time': '211229130504'}, {'coord': [106.939545, 39.46831], 'time': '211229130509'}, {'coord': [106.93957, 39.468506], 'time': '211229130514'}, {'coord': [106.93961, 39.46856], 'time': '211229130519'}, {'coord': [106.939606, 39.46853], 'time': '211229130524'}, {'coord': [106.9397, 39.468487], 'time': '211229130529'}, {'coord': [106.93971, 39.468464], 'time': '211229130534'}, {'coord': [106.93971, 39.468464], 'time': '211229130539'}, {'coord': [106.93971, 39.468464], 'time': '211229130544'}, {'coord': [106.9396, 39.468613], 'time': '211229130554'}, {'coord': [106.9396, 39.468613], 'time': '211229130559'}, {'coord': [106.9396, 39.468613], 'time': '211229130606'}, {'coord': [106.9396, 39.468613], 'time': '211229130609'}, {'coord': [106.9396, 39.468613], 'time': '211229130639'}, {'coord': [106.9396, 39.468613], 'time': '211229130709'}, {'coord': [106.94137, 39.467407], 'time': '211229131112'}, {'coord': [106.941444, 39.467392], 'time': '211229131117'}, {'coord': [106.94153, 39.467377], 'time': '211229131122'}, {'coord': [106.93962, 39.46852], 'time': '211229131017'}, {'coord': [106.941765, 39.46731], 'time': '211229131137'}, {'coord': [106.941605, 39.46736], 'time': '211229131127'}, {'coord': [106.94169, 39.46734], 'time': '211229131132'}, {'coord': [106.93968, 39.468426], 'time': '211229131022'}, {'coord': [106.93977, 39.468273], 'time': '211229131027'}, {'coord': [106.93994, 39.468044], 'time': '211229131032'}, {'coord': [106.94201, 39.467224], 'time': '211229131147'}, {'coord': [106.94022, 39.467808], 'time': '211229131037'}, {'coord': [106.940445, 39.467663], 'time': '211229131042'}, {'coord': [106.94212, 39.467167], 'time': '211229131152'}, {'coord': [106.94073, 39.467567], 'time': '211229131047'}, {'coord': [106.94091, 39.46753], 'time': '211229131052'}, {'coord': [106.94224, 39.467094], 'time': '211229131157'}, {'coord': [106.94107, 39.4675], 'time': '211229131057'}, {'coord': [106.94121, 39.467457], 'time': '211229131102'}, {'coord': [106.94238, 39.467033], 'time': '211229131202'}, {'coord': [106.94129, 39.467422], 'time': '211229131107'}, {'coord': [106.94252, 39.46697], 'time': '211229131207'}, {'coord': [106.94269, 39.466885], 'time': '211229131212'}, {'coord': [106.94289, 39.466793], 'time': '211229131217'}, {'coord': [106.9432, 39.46667], 'time': '211229131222'}, {'coord': [106.94347, 39.466473], 'time': '211229131227'}, {'coord': [106.94385, 39.46637], 'time': '211229131232'}, {'coord': [106.944336, 39.46632], 'time': '211229131237'}, {'coord': [106.944786, 39.466305], 'time': '211229131242'}, {'coord': [106.94523, 39.466263], 'time': '211229131247'}, {'coord': [106.945595, 39.466183], 'time': '211229131252'}, {'coord': [106.94588, 39.46613], 'time': '211229131257'}, {'coord': [106.94598, 39.466103], 'time': '211229131302'}, {'coord': [106.94611, 39.466084], 'time': '211229131307'}, {'coord': [106.946236, 39.466064], 'time': '211229131312'}, {'coord': [106.94635, 39.46605], 'time': '211229131317'}, {'coord': [106.946465, 39.46603], 'time': '211229131322'}, {'coord': [106.94657, 39.466015], 'time': '211229131327'}, {'coord': [106.94667, 39.465992], 'time': '211229131332'}, {'coord': [106.946785, 39.465977], 'time': '211229131337'}, {'coord': [106.94689, 39.465965], 'time': '211229131342'}, {'coord': [106.94699, 39.465954], 'time': '211229131347'}, {'coord': [106.94709, 39.465935], 'time': '211229131352'}, {'coord': [106.9472, 39.46592], 'time': '211229131357'}, {'coord': [106.94732, 39.4659], 'time': '211229131402'}, {'coord': [106.947426, 39.46588], 'time': '211229131407'}, {'coord': [106.9475, 39.465862], 'time': '211229131412'}, {'coord': [106.94759, 39.465847], 'time': '211229131417'}, {'coord': [106.9477, 39.465816], 'time': '211229131422'}, {'coord': [106.94781, 39.465797], 'time': '211229131427'}, {'coord': [106.94792, 39.465775], 'time': '211229131432'}, {'coord': [106.94804, 39.465782], 'time': '211229131437'}, {'coord': [106.94827, 39.46582], 'time': '211229131442'}, {'coord': [106.94867, 39.465878], 'time': '211229131447'}, {'coord': [106.94921, 39.465874], 'time': '211229131452'}, {'coord': [106.94965, 39.465794], 'time': '211229131457'}, {'coord': [106.949875, 39.465725], 'time': '211229131502'}, {'coord': [106.94993, 39.465706], 'time': '211229131507'}, {'coord': [106.950096, 39.465656], 'time': '211229131513'}, {'coord': [106.95021, 39.465614], 'time': '211229131518'}, {'coord': [106.95032, 39.465584], 'time': '211229131523'}, {'coord': [106.95044, 39.465553], 'time': '211229131528'}, {'coord': [106.95061, 39.465515], 'time': '211229131533'}, {'coord': [106.95082, 39.465473], 'time': '211229131538'}, {'coord': [106.95107, 39.46543], 'time': '211229131543'}, {'coord': [106.95134, 39.465355], 'time': '211229131548'}, {'coord': [106.951546, 39.465294], 'time': '211229131553'}, {'coord': [106.951645, 39.465256], 'time': '211229131558'}, {'coord': [106.95177, 39.465233], 'time': '211229131603'}, {'coord': [106.95188, 39.46522], 'time': '211229131608'}, {'coord': [106.95199, 39.465225], 'time': '211229131613'}, {'coord': [106.95207, 39.465233], 'time': '211229131618'}, {'coord': [106.95215, 39.46524], 'time': '211229131623'}, {'coord': [106.95224, 39.46525], 'time': '211229131628'}, {'coord': [106.95232, 39.465252], 'time': '211229131633'}, {'coord': [106.9524, 39.465263], 'time': '211229131638'}, {'coord': [106.95248, 39.465282], 'time': '211229131643'}, {'coord': [106.95256, 39.4653], 'time': '211229131648'}, {'coord': [106.95263, 39.46533], 'time': '211229131653'}, {'coord': [106.95271, 39.465347], 'time': '211229131658'}, {'coord': [106.95278, 39.465363], 'time': '211229131703'}, {'coord': [106.95286, 39.46539], 'time': '211229131708'}, {'coord': [106.952934, 39.465405], 'time': '211229131713'}, {'coord': [106.95301, 39.46542], 'time': '211229131718'}, {'coord': [106.95309, 39.465435], 'time': '211229131723'}, {'coord': [106.95317, 39.465454], 'time': '211229131728'}, {'coord': [106.95324, 39.46548], 'time': '211229131733'}, {'coord': [106.953316, 39.465515], 'time': '211229131738'}, {'coord': [106.95337, 39.46556], 'time': '211229131743'}, {'coord': [106.953415, 39.465614], 'time': '211229131748'}, {'coord': [106.95345, 39.465683], 'time': '211229131753'}, {'coord': [106.95351, 39.46577], 'time': '211229131758'}, {'coord': [106.95355, 39.46586], 'time': '211229131803'}, {'coord': [106.95359, 39.465973], 'time': '211229131808'}, {'coord': [106.95366, 39.466087], 'time': '211229131813'}, {'coord': [106.953705, 39.466206], 'time': '211229131818'}, {'coord': [106.95374, 39.46629], 'time': '211229131823'}, {'coord': [106.95377, 39.46637], 'time': '211229131828'}, {'coord': [106.95381, 39.466457], 'time': '211229131833'}, {'coord': [106.95384, 39.46654], 'time': '211229131838'}, {'coord': [106.95388, 39.466618], 'time': '211229131843'}, {'coord': [106.953896, 39.46668], 'time': '211229131848'}, {'coord': [106.95391, 39.466766], 'time': '211229131853'}, {'coord': [106.95392, 39.466854], 'time': '211229131858'}, {'coord': [106.95391, 39.466946], 'time': '211229131903'}, {'coord': [106.953896, 39.46703], 'time': '211229131908'}, {'coord': [106.95385, 39.467117], 'time': '211229131913'}, {'coord': [106.95381, 39.46721], 'time': '211229131918'}, {'coord': [106.953766, 39.467304], 'time': '211229131923'}, {'coord': [106.95371, 39.467396], 'time': '211229131928'}, {'coord': [106.95364, 39.46748], 'time': '211229131933'}, {'coord': [106.95357, 39.467583], 'time': '211229131938'}, {'coord': [106.95352, 39.467705], 'time': '211229131943'}, {'coord': [106.953445, 39.46782], 'time': '211229131948'}, {'coord': [106.95341, 39.467937], 'time': '211229131953'}, {'coord': [106.95337, 39.46805], 'time': '211229131958'}, {'coord': [106.953316, 39.468163], 'time': '211229132003'}, {'coord': [106.95325, 39.468273], 'time': '211229132008'}, {'coord': [106.953156, 39.468384], 'time': '211229132013'}, {'coord': [106.953026, 39.468525], 'time': '211229132018'}, {'coord': [106.952896, 39.468685], 'time': '211229132023'}, {'coord': [106.95278, 39.46882], 'time': '211229132028'}, {'coord': [106.95271, 39.46891], 'time': '211229132033'}, {'coord': [106.95264, 39.46902], 'time': '211229132038'}, {'coord': [106.952576, 39.469128], 'time': '211229132043'}, {'coord': [106.95252, 39.46923], 'time': '211229132048'}, {'coord': [106.95246, 39.46934], 'time': '211229132053'}, {'coord': [106.952446, 39.469376], 'time': '211229132058'}, {'coord': [106.95243, 39.46942], 'time': '211229132103'}, {'coord': [106.9524, 39.46948], 'time': '211229132108'}, {'coord': [106.95237, 39.469543], 'time': '211229132113'}, {'coord': [106.95235, 39.46961], 'time': '211229132118'}, {'coord': [106.9523, 39.46967], 'time': '211229132123'}, {'coord': [106.95227, 39.469723], 'time': '211229132128'}, {'coord': [106.952225, 39.46978], 'time': '211229132133'}, {'coord': [106.95218, 39.469833], 'time': '211229132138'}, {'coord': [106.95213, 39.46988], 'time': '211229132143'}, {'coord': [106.95208, 39.469933], 'time': '211229132148'}, {'coord': [106.95203, 39.46998], 'time': '211229132153'}]
              // , {'coord': [106.951965, 39.470024], 'time': '211229132158'}, {'coord': [106.951904, 39.470074], 'time': '211229132203'}, {'coord': [106.95182, 39.470127], 'time': '211229132208'}, {'coord': [106.95171, 39.47021], 'time': '211229132213'}, {'coord': [106.951614, 39.470287], 'time': '211229132218'}, {'coord': [106.951515, 39.470367], 'time': '211229132223'}, {'coord': [106.95143, 39.47044], 'time': '211229132228'}, {'coord': [106.95136, 39.470512], 'time': '211229132233'}, {'coord': [106.95126, 39.470676], 'time': '211229132243'}, {'coord': [106.95123, 39.470764], 'time': '211229132248'}, {'coord': [106.95121, 39.470848], 'time': '211229132253'}, {'coord': [106.9512, 39.470963], 'time': '211229132258'}, {'coord': [106.951225, 39.471096], 'time': '211229132303'}, {'coord': [106.951256, 39.4712], 'time': '211229132308'}, {'coord': [106.95129, 39.47128], 'time': '211229132313'}, {'coord': [106.95135, 39.471355], 'time': '211229132318'}, {'coord': [106.95142, 39.47142], 'time': '211229132323'}, {'coord': [106.95148, 39.471478], 'time': '211229132328'}, {'coord': [106.95153, 39.47152], 'time': '211229132333'}, {'coord': [106.95157, 39.47157], 'time': '211229132338'}, {'coord': [106.951614, 39.471615], 'time': '211229132343'}, {'coord': [106.95167, 39.471657], 'time': '211229132348'}, {'coord': [106.95172, 39.471703], 'time': '211229132353'}, {'coord': [106.95177, 39.471752], 'time': '211229132358'}, {'coord': [106.951805, 39.47181], 'time': '211229132403'}, {'coord': [106.95186, 39.471863], 'time': '211229132408'}, {'coord': [106.95192, 39.47193], 'time': '211229132413'}, {'coord': [106.95198, 39.472004], 'time': '211229132418'}, {'coord': [106.95204, 39.472088], 'time': '211229132423'}, {'coord': [106.95211, 39.472168], 'time': '211229132428'}, {'coord': [106.95218, 39.472248], 'time': '211229132433'}, {'coord': [106.95224, 39.47233], 'time': '211229132438'}, {'coord': [106.95231, 39.47241], 'time': '211229132443'}, {'coord': [106.9524, 39.47251], 'time': '211229132448'}, {'coord': [106.95246, 39.472588], 'time': '211229132453'}, {'coord': [106.952515, 39.472656], 'time': '211229132458'}, {'coord': [106.95257, 39.47273], 'time': '211229132503'}, {'coord': [106.95262, 39.472805], 'time': '211229132508'}, {'coord': [106.95269, 39.47288], 'time': '211229132513'}, {'coord': [106.95279, 39.47294], 'time': '211229132518'}, {'coord': [106.95296, 39.472977], 'time': '211229132523'}, {'coord': [106.953186, 39.472935], 'time': '211229132528'}, {'coord': [106.95328, 39.472885], 'time': '211229132533'}, {'coord': [106.95335, 39.472828], 'time': '211229132538'}, {'coord': [106.953415, 39.472763], 'time': '211229132543'}, {'coord': [106.95347, 39.47269], 'time': '211229132548'}, {'coord': [106.95353, 39.47261], 'time': '211229132553'}, {'coord': [106.95357, 39.472523], 'time': '211229132558'}, {'coord': [106.9536, 39.472435], 'time': '211229132603'}, {'coord': [106.95362, 39.472343], 'time': '211229132608'}, {'coord': [106.95363, 39.472244], 'time': '211229132613'}, {'coord': [106.95366, 39.472122], 'time': '211229132618'}, {'coord': [106.9537, 39.472015], 'time': '211229132623'}, {'coord': [106.95377, 39.47188], 'time': '211229132628'}, {'coord': [106.95391, 39.471687], 'time': '211229132633'}, {'coord': [106.9541, 39.471462], 'time': '211229132638'}, {'coord': [106.95432, 39.471237], 'time': '211229132643'}, {'coord': [106.95456, 39.470985], 'time': '211229132648'}, {'coord': [106.95483, 39.470695], 'time': '211229132653'}, {'coord': [106.955086, 39.4704], 'time': '211229132658'}, {'coord': [106.95535, 39.4701], 'time': '211229132703'}, {'coord': [106.95559, 39.469803], 'time': '211229132708'}, {'coord': [106.955795, 39.46947], 'time': '211229132713'}, {'coord': [106.956024, 39.46916], 'time': '211229132718'}, {'coord': [106.95612, 39.468803], 'time': '211229132723'}, {'coord': [106.95613, 39.46845], 'time': '211229132728'}, {'coord': [106.95603, 39.468143], 'time': '211229132733'}, {'coord': [106.95603, 39.46793], 'time': '211229132738'}, {'coord': [106.95617, 39.4678], 'time': '211229132743'}, {'coord': [106.9563, 39.467834], 'time': '211229132748'}, {'coord': [106.95631, 39.467865], 'time': '211229132753'}, {'coord': [106.95631, 39.467865], 'time': '211229132803'}, {'coord': [106.95631, 39.467865], 'time': '211229132808'}, {'coord': [106.95631, 39.467865], 'time': '211229132813'}, {'coord': [106.95631, 39.467865], 'time': '211229132818'}, {'coord': [106.95616, 39.467754], 'time': '211229132823'}, {'coord': [106.95615, 39.467728], 'time': '211229132828'}, {'coord': [106.95615, 39.467728], 'time': '211229132833'}, {'coord': [106.95615, 39.467728], 'time': '211229132838'}, {'coord': [106.95615, 39.467728], 'time': '211229132843'}, {'coord': [106.95615, 39.467728], 'time': '211229132848'}, {'coord': [106.95615, 39.467728], 'time': '211229132853'}, {'coord': [106.95615, 39.467728], 'time': '211229132859'}, {'coord': [106.95615, 39.467728], 'time': '211229132903'}, {'coord': [106.956184, 39.467815], 'time': '211229132905'}, {'coord': [106.95613, 39.467995], 'time': '211229132910'}, {'coord': [106.95603, 39.4682], 'time': '211229132915'}, {'coord': [106.95592, 39.468395], 'time': '211229132920'}, {'coord': [106.95564, 39.46868], 'time': '211229132931'}, {'coord': [106.95564, 39.46868], 'time': '211229132936'}, {'coord': [106.95564, 39.46868], 'time': '211229132941'}, {'coord': [106.95564, 39.46868], 'time': '211229132946'}, {'coord': [106.95564, 39.46868], 'time': '211229132951'}, {'coord': [106.95564, 39.46868], 'time': '211229132956'}, {'coord': [106.95564, 39.46868], 'time': '211229133001'}, {'coord': [106.95564, 39.46868], 'time': '211229133006'}, {'coord': [106.95564, 39.46868], 'time': '211229133011'}, {'coord': [106.95564, 39.46868], 'time': '211229133016'}, {'coord': [106.95564, 39.46868], 'time': '211229133021'}, {'coord': [106.95564, 39.46868], 'time': '211229133026'}, {'coord': [106.95559, 39.468777], 'time': '211229133031'}, {'coord': [106.95555, 39.468945], 'time': '211229133036'}, {'coord': [106.95542, 39.469173], 'time': '211229133041'}, {'coord': [106.9553, 39.46937], 'time': '211229133046'}, {'coord': [106.955215, 39.469578], 'time': '211229133051'}, {'coord': [106.95511, 39.469765], 'time': '211229133056'}, {'coord': [106.95498, 39.469975], 'time': '211229133101'}, {'coord': [106.954834, 39.470245], 'time': '211229133106'}, {'coord': [106.95462, 39.47053], 'time': '211229133111'}, {'coord': [106.954384, 39.470856], 'time': '211229133116'}, {'coord': [106.954025, 39.47117], 'time': '211229133121'}, {'coord': [106.953735, 39.471554], 'time': '211229133126'}, {'coord': [106.95353, 39.471966], 'time': '211229133131'}, {'coord': [106.95347, 39.472424], 'time': '211229133136'}, {'coord': [106.9532, 39.472813], 'time': '211229133141'}, {'coord': [106.952736, 39.472836], 'time': '211229133146'}, {'coord': [106.95243, 39.47237], 'time': '211229133151'}, {'coord': [106.95202, 39.471886], 'time': '211229133156'}, {'coord': [106.95161, 39.47146], 'time': '211229133201'}, {'coord': [106.9514, 39.471004], 'time': '211229133206'}, {'coord': [106.951454, 39.470573], 'time': '211229133211'}, {'coord': [106.95377, 39.467487], 'time': '211229133256'}, {'coord': [106.95382, 39.467377], 'time': '211229133301'}, {'coord': [106.95387, 39.467056], 'time': '211229133306'}, {'coord': [106.953766, 39.466576], 'time': '211229133311'}, {'coord': [106.95355, 39.466053], 'time': '211229133316'}, {'coord': [106.95329, 39.46561], 'time': '211229133321'}, {'coord': [106.95188, 39.4702], 'time': '211229133216'}, {'coord': [106.952736, 39.465424], 'time': '211229133326'}, {'coord': [106.95233, 39.46977], 'time': '211229133221'}, {'coord': [106.95267, 39.469273], 'time': '211229133226'}, {'coord': [106.95204, 39.46532], 'time': '211229133331'}, {'coord': [106.95297, 39.468758], 'time': '211229133231'}, {'coord': [106.953316, 39.46828], 'time': '211229133236'}, {'coord': [106.95129, 39.465378], 'time': '211229133336'}, {'coord': [106.95355, 39.467876], 'time': '211229133241'}, {'coord': [106.95372, 39.467575], 'time': '211229133246'}, {'coord': [106.9506, 39.46553], 'time': '211229133341'}, {'coord': [106.95377, 39.467487], 'time': '211229133251'}, {'coord': [106.95001, 39.465664], 'time': '211229133346'}, {'coord': [106.94941, 39.465843], 'time': '211229133351'}, {'coord': [106.94876, 39.46588], 'time': '211229133356'}, {'coord': [106.94815, 39.465805], 'time': '211229133401'}, {'coord': [106.947685, 39.465797], 'time': '211229133406'}, {'coord': [106.947105, 39.46588], 'time': '211229133411'}, {'coord': [106.94642, 39.465973], 'time': '211229133416'}, {'coord': [106.94574, 39.466095], 'time': '211229133421'}, {'coord': [106.94495, 39.466213], 'time': '211229133426'}, {'coord': [106.9441, 39.46632], 'time': '211229133431'}, {'coord': [106.94339, 39.466457], 'time': '211229133436'}, {'coord': [106.94291, 39.466732], 'time': '211229133441'}, {'coord': [106.94248, 39.466946], 'time': '211229133446'}, {'coord': [106.94199, 39.46713], 'time': '211229133451'}, {'coord': [106.94151, 39.46732], 'time': '211229133456'}, {'coord': [106.94098, 39.467487], 'time': '211229133501'}, {'coord': [106.94044, 39.467625], 'time': '211229133506'}, {'coord': [106.940125, 39.46785], 'time': '211229133511'}, {'coord': [106.93988, 39.468086], 'time': '211229133516'}, {'coord': [106.9397, 39.46823], 'time': '211229133521'}, {'coord': [106.9396, 39.46835], 'time': '211229133526'}, {'coord': [106.93962, 39.468487], 'time': '211229133531'}, {'coord': [106.9397, 39.46852], 'time': '211229133536'}, {'coord': [106.9397, 39.46852], 'time': '211229133541'}, {'coord': [106.93968, 39.468464], 'time': '211229133546'}, {'coord': [106.93971, 39.46844], 'time': '211229133551'}, {'coord': [106.93971, 39.46844], 'time': '211229133556'}, {'coord': [106.939606, 39.46842], 'time': '211229133601'}, {'coord': [106.93961, 39.46834], 'time': '211229133606'}, {'coord': [106.93963, 39.46833], 'time': '211229133611'}, {'coord': [106.93963, 39.46833], 'time': '211229133616'}, {'coord': [106.93963, 39.46833], 'time': '211229133621'}, {'coord': [106.93963, 39.46833], 'time': '211229133626'}, {'coord': [106.93963, 39.46833], 'time': '211229133631'}, {'coord': [106.93963, 39.46833], 'time': '211229133636'}, {'coord': [106.93963, 39.46833], 'time': '211229133641'}, {'coord': [106.93963, 39.46833], 'time': '211229133646'}, {'coord': [106.93963, 39.46833], 'time': '211229133651'}, {'coord': [106.93963, 39.46833], 'time': '211229133656'}, {'coord': [106.93963, 39.46833], 'time': '211229133701'}, {'coord': [106.93963, 39.46833], 'time': '211229133706'}, {'coord': [106.93963, 39.46833], 'time': '211229133711'}, {'coord': [106.93963, 39.46833], 'time': '211229133716'}, {'coord': [106.93963, 39.46833], 'time': '211229133721'}, {'coord': [106.93963, 39.46833], 'time': '211229133726'}, {'coord': [106.93963, 39.46833], 'time': '211229133731'}, {'coord': [106.93963, 39.46833], 'time': '211229133736'}, {'coord': [106.93963, 39.46833], 'time': '211229133741'}, {'coord': [106.93963, 39.46833], 'time': '211229133746'}, {'coord': [106.93963, 39.46833], 'time': '211229133751'}, {'coord': [106.93963, 39.46833], 'time': '211229133756'}, {'coord': [106.93959, 39.468403], 'time': '211229133800'}, {'coord': [106.93958, 39.46845], 'time': '211229133805'}, {'coord': [106.93958, 39.468494], 'time': '211229133810'}, {'coord': [106.93957, 39.46857], 'time': '211229133820'}, {'coord': [106.93957, 39.46857], 'time': '211229133825'}, {'coord': [106.93957, 39.46857], 'time': '211229133827'}, {'coord': [106.93957, 39.46857], 'time': '211229133830'}, {'coord': [106.93957, 39.46857], 'time': '211229133900'}, {'coord': [106.93957, 39.46857], 'time': '211229133930'}, {'coord': [106.93957, 39.46857], 'time': '211229134000'}, {'coord': [106.93957, 39.46857], 'time': '211229134030'}, {'coord': [106.93957, 39.46857], 'time': '211229134100'}, {'coord': [106.93957, 39.46857], 'time': '211229134130'}, {'coord': [106.93957, 39.46857], 'time': '211229134150'}, {'coord': [106.93957, 39.468575], 'time': '211229134158'}, {'coord': [106.93959, 39.468513], 'time': '211229134200'}, {'coord': [106.93961, 39.468414], 'time': '211229134205'}, {'coord': [106.9397, 39.46831], 'time': '211229134210'}, {'coord': [106.93984, 39.468143], 'time': '211229134216'}, {'coord': [106.93995, 39.468002], 'time': '211229134220'}, {'coord': [106.94021, 39.467785], 'time': '211229134226'}, {'coord': [106.94031, 39.467712], 'time': '211229134230'}, {'coord': [106.940414, 39.467648], 'time': '211229134236'}, {'coord': [106.940605, 39.467594], 'time': '211229134241'}, {'coord': [106.9408, 39.467537], 'time': '211229134246'}, {'coord': [106.941, 39.467484], 'time': '211229134251'}, {'coord': [106.941185, 39.46744], 'time': '211229134256'}, {'coord': [106.94127, 39.467422], 'time': '211229134301'}, {'coord': [106.94131, 39.467415], 'time': '211229134306'}, {'coord': [106.94131, 39.467415], 'time': '211229134311'}, {'coord': [106.9415, 39.46737], 'time': '211229134316'}, {'coord': [106.941574, 39.467358], 'time': '211229134321'}, {'coord': [106.941666, 39.467342], 'time': '211229134326'}, {'coord': [106.94174, 39.467323], 'time': '211229134331'}, {'coord': [106.941826, 39.46729], 'time': '211229134336'}, {'coord': [106.941925, 39.467236], 'time': '211229134341'}, {'coord': [106.94203, 39.467197], 'time': '211229134346'}, {'coord': [106.94215, 39.467144], 'time': '211229134351'}, {'coord': [106.94226, 39.46707], 'time': '211229134356'}, {'coord': [106.942406, 39.467007], 'time': '211229134401'}, {'coord': [106.94254, 39.466946], 'time': '211229134406'}, {'coord': [106.94271, 39.46685], 'time': '211229134411'}, {'coord': [106.942955, 39.46675], 'time': '211229134416'}, {'coord': [106.94326, 39.46663], 'time': '211229134421'}, {'coord': [106.94352, 39.46642], 'time': '211229134426'}, {'coord': [106.94392, 39.46635], 'time': '211229134431'}, {'coord': [106.9444, 39.466305], 'time': '211229134436'}, {'coord': [106.944855, 39.466293], 'time': '211229134441'}, {'coord': [106.9453, 39.466236], 'time': '211229134446'}, {'coord': [106.945656, 39.466167], 'time': '211229134451'}, {'coord': [106.94593, 39.46611], 'time': '211229134456'}, {'coord': [106.94599, 39.466095], 'time': '211229134501'}, {'coord': [106.94616, 39.46607], 'time': '211229134506'}, {'coord': [106.94627, 39.46605], 'time': '211229134511'}, {'coord': [106.94638, 39.46603], 'time': '211229134516'}, {'coord': [106.946495, 39.466007], 'time': '211229134521'}, {'coord': [106.946594, 39.466], 'time': '211229134526'}, {'coord': [106.946686, 39.465984], 'time': '211229134531'}, {'coord': [106.94676, 39.465977], 'time': '211229134536'}, {'coord': [106.94684, 39.465965], 'time': '211229134541'}, {'coord': [106.946915, 39.46596], 'time': '211229134546'}, {'coord': [106.94698, 39.465954], 'time': '211229134551'}, {'coord': [106.94707, 39.46594], 'time': '211229134556'}, {'coord': [106.947136, 39.465927], 'time': '211229134601'}, {'coord': [106.947205, 39.465908], 'time': '211229134606'}, {'coord': [106.94729, 39.465897], 'time': '211229134611'}, {'coord': [106.94736, 39.46588], 'time': '211229134616'}, {'coord': [106.947426, 39.46587], 'time': '211229134621'}, {'coord': [106.947495, 39.46585], 'time': '211229134626'}, {'coord': [106.94758, 39.465836], 'time': '211229134631'}, {'coord': [106.947655, 39.46582], 'time': '211229134636'}, {'coord': [106.94773, 39.465805], 'time': '211229134641'}, {'coord': [106.94781, 39.46579], 'time': '211229134646'}, {'coord': [106.94789, 39.46578], 'time': '211229134651'}, {'coord': [106.947975, 39.465782], 'time': '211229134656'}, {'coord': [106.94816, 39.46579], 'time': '211229134701'}, {'coord': [106.948494, 39.465836], 'time': '211229134706'}, {'coord': [106.94901, 39.465893], 'time': '211229134711'}, {'coord': [106.94948, 39.465862], 'time': '211229134716'}, {'coord': [106.9498, 39.46578], 'time': '211229134721'}, {'coord': [106.949905, 39.46572], 'time': '211229134726'}, {'coord': [106.94998, 39.465683], 'time': '211229134731'}, {'coord': [106.95011, 39.465637], 'time': '211229134736'}, {'coord': [106.950226, 39.465607], 'time': '211229134741'}, {'coord': [106.95034, 39.465576], 'time': '211229134746'}, {'coord': [106.950485, 39.465557], 'time': '211229134751'}, {'coord': [106.95068, 39.46551], 'time': '211229134756'}, {'coord': [106.95091, 39.46546], 'time': '211229134801'}, {'coord': [106.95115, 39.465412], 'time': '211229134806'}, {'coord': [106.95137, 39.46536], 'time': '211229134811'}, {'coord': [106.95155, 39.465298], 'time': '211229134816'}, {'coord': [106.95167, 39.465263], 'time': '211229134821'}, {'coord': [106.951775, 39.46525], 'time': '211229134826'}, {'coord': [106.9519, 39.46524], 'time': '211229134831'}, {'coord': [106.95199, 39.465237], 'time': '211229134836'}, {'coord': [106.95207, 39.46525], 'time': '211229134841'}, {'coord': [106.95215, 39.465256], 'time': '211229134846'}, {'coord': [106.95224, 39.465263], 'time': '211229134851'}, {'coord': [106.95232, 39.465263], 'time': '211229134856'}, {'coord': [106.95239, 39.465275], 'time': '211229134901'}, {'coord': [106.95247, 39.465294], 'time': '211229134906'}, {'coord': [106.95256, 39.465313], 'time': '211229134911'}, {'coord': [106.95264, 39.46533], 'time': '211229134916'}, {'coord': [106.95272, 39.465343], 'time': '211229134921'}, {'coord': [106.9528, 39.465363], 'time': '211229134926'}, {'coord': [106.95288, 39.46538], 'time': '211229134931'}, {'coord': [106.95296, 39.4654], 'time': '211229134936'}, {'coord': [106.95304, 39.46541], 'time': '211229134941'}, {'coord': [106.95312, 39.46543], 'time': '211229134946'}, {'coord': [106.95319, 39.465454], 'time': '211229134951'}, {'coord': [106.95326, 39.465485], 'time': '211229134956'}, {'coord': [106.95333, 39.46552], 'time': '211229135001'}, {'coord': [106.953384, 39.46556], 'time': '211229135006'}, {'coord': [106.95343, 39.46561], 'time': '211229135011'}, {'coord': [106.95347, 39.46567], 'time': '211229135016'}, {'coord': [106.953514, 39.46574], 'time': '211229135021'}, {'coord': [106.95355, 39.465824], 'time': '211229135026'}, {'coord': [106.95359, 39.465935], 'time': '211229135031'}, {'coord': [106.95365, 39.466057], 'time': '211229135036'}, {'coord': [106.9537, 39.466175], 'time': '211229135041'}, {'coord': [106.95374, 39.466274], 'time': '211229135046'}, {'coord': [106.953766, 39.466343], 'time': '211229135051'}, {'coord': [106.95382, 39.46643], 'time': '211229135056'}, {'coord': [106.95385, 39.46652], 'time': '211229135101'}, {'coord': [106.95389, 39.4666], 'time': '211229135106'}, {'coord': [106.953926, 39.46668], 'time': '211229135111'}, {'coord': [106.95395, 39.46677], 'time': '211229135116'}, {'coord': [106.95396, 39.466854], 'time': '211229135121'}, {'coord': [106.95395, 39.466946], 'time': '211229135126'}, {'coord': [106.95394, 39.467033], 'time': '211229135131'}, {'coord': [106.95391, 39.46712], 'time': '211229135136'}, {'coord': [106.953865, 39.467216], 'time': '211229135141'}, {'coord': [106.95383, 39.467308], 'time': '211229135146'}, {'coord': [106.95379, 39.4674], 'time': '211229135151'}, {'coord': [106.95373, 39.467476], 'time': '211229135156'}, {'coord': [106.95363, 39.467567], 'time': '211229135201'}, {'coord': [106.95355, 39.46768], 'time': '211229135206'}, {'coord': [106.95349, 39.467796], 'time': '211229135211'}, {'coord': [106.95343, 39.467907], 'time': '211229135216'}, {'coord': [106.95337, 39.46802], 'time': '211229135221'}, {'coord': [106.9533, 39.46814], 'time': '211229135226'}, {'coord': [106.95323, 39.468246], 'time': '211229135231'}, {'coord': [106.95313, 39.468365], 'time': '211229135236'}, {'coord': [106.953026, 39.468506], 'time': '211229135241'}, {'coord': [106.95289, 39.46866], 'time': '211229135246'}, {'coord': [106.95277, 39.468796], 'time': '211229135251'}, {'coord': [106.95268, 39.468895], 'time': '211229135256'}, {'coord': [106.95261, 39.46898], 'time': '211229135301'}, {'coord': [106.95255, 39.469063], 'time': '211229135306'}, {'coord': [106.95251, 39.46915], 'time': '211229135311'}, {'coord': [106.95246, 39.469242], 'time': '211229135316'}, {'coord': [106.952415, 39.469334], 'time': '211229135321'}, {'coord': [106.95238, 39.469418], 'time': '211229135326'}, {'coord': [106.95234, 39.4695], 'time': '211229135331'}, {'coord': [106.95229, 39.469585], 'time': '211229135336'}, {'coord': [106.95225, 39.469666], 'time': '211229135341'}, {'coord': [106.9522, 39.469746], 'time': '211229135346'}, {'coord': [106.95213, 39.469814], 'time': '211229135351'}, {'coord': [106.952065, 39.469887], 'time': '211229135356'}, {'coord': [106.95198, 39.469955], 'time': '211229135401'}, {'coord': [106.95191, 39.470016], 'time': '211229135406'}, {'coord': [106.95182, 39.470078], 'time': '211229135411'}, {'coord': [106.95171, 39.47016], 'time': '211229135416'}, {'coord': [106.9516, 39.470245], 'time': '211229135421'}, {'coord': [106.95149, 39.47032], 'time': '211229135426'}, {'coord': [106.9514, 39.4704], 'time': '211229135431'}, {'coord': [106.951324, 39.47047], 'time': '211229135436'}, {'coord': [106.95127, 39.47054], 'time': '211229135441'}, {'coord': [106.951225, 39.470623], 'time': '211229135446'}, {'coord': [106.951195, 39.470715], 'time': '211229135451'}, {'coord': [106.951164, 39.470806], 'time': '211229135456'}, {'coord': [106.95116, 39.470913], 'time': '211229135501'}, {'coord': [106.95119, 39.47103], 'time': '211229135506'}, {'coord': [106.95131, 39.471123], 'time': '211229135511'}, {'coord': [106.95147, 39.47115], 'time': '211229135516'}, {'coord': [106.95163, 39.471092], 'time': '211229135521'}, {'coord': [106.95175, 39.471016], 'time': '211229135526'}, {'coord': [106.951866, 39.47095], 'time': '211229135531'}, {'coord': [106.95197, 39.470863], 'time': '211229135536'}, {'coord': [106.95209, 39.47078], 'time': '211229135541'}, {'coord': [106.952225, 39.470673], 'time': '211229135547'}, {'coord': [106.95235, 39.470585], 'time': '211229135552'}, {'coord': [106.95244, 39.47052], 'time': '211229135556'}, {'coord': [106.95257, 39.470432], 'time': '211229135601'}, {'coord': [106.95271, 39.470345], 'time': '211229135607'}, {'coord': [106.952805, 39.47029], 'time': '211229135612'}, {'coord': [106.95299, 39.470173], 'time': '211229135622'}, {'coord': [106.953094, 39.47008], 'time': '211229135627'}, {'coord': [106.95323, 39.46996], 'time': '211229135632'}, {'coord': [106.95341, 39.46986], 'time': '211229135637'}, {'coord': [106.95357, 39.469727], 'time': '211229135642'}, {'coord': [106.95368, 39.469643], 'time': '211229135647'}, {'coord': [106.95379, 39.46958], 'time': '211229135652'}, {'coord': [106.95391, 39.469505], 'time': '211229135657'}, {'coord': [106.95403, 39.46943], 'time': '211229135702'}, {'coord': [106.95428, 39.46926], 'time': '211229135712'}, {'coord': [106.95415, 39.469357], 'time': '211229135707'}, {'coord': [106.95445, 39.469128], 'time': '211229135717'}, {'coord': [106.954636, 39.468967], 'time': '211229135722'}, {'coord': [106.95484, 39.468773], 'time': '211229135727'}, {'coord': [106.955055, 39.46861], 'time': '211229135732'}, {'coord': [106.95523, 39.468494], 'time': '211229135737'}, {'coord': [106.9553, 39.46842], 'time': '211229135742'}, {'coord': [106.95538, 39.46832], 'time': '211229135747'}, {'coord': [106.95548, 39.468143], 'time': '211229135752'}, {'coord': [106.955574, 39.467937], 'time': '211229135757'}, {'coord': [106.95566, 39.467754], 'time': '211229135802'}, {'coord': [106.95573, 39.467632], 'time': '211229135807'}, {'coord': [106.955734, 39.467464], 'time': '211229135812'}, {'coord': [106.9558, 39.467236], 'time': '211229135817'}, {'coord': [106.95592, 39.467026], 'time': '211229135822'}, {'coord': [106.95616, 39.466946], 'time': '211229135827'}, {'coord': [106.95633, 39.467007], 'time': '211229135832'}, {'coord': [106.95633, 39.46702], 'time': '211229135837'}, {'coord': [106.95629, 39.466976], 'time': '211229135842'}, {'coord': [106.95627, 39.46692], 'time': '211229135847'}, {'coord': [106.95625, 39.466877], 'time': '211229135852'}, {'coord': [106.95625, 39.466877], 'time': '211229135857'}, {'coord': [106.95625, 39.466877], 'time': '211229135902'}, {'coord': [106.95625, 39.466877], 'time': '211229135907'}, {'coord': [106.95625, 39.466877], 'time': '211229135912'}, {'coord': [106.95625, 39.466877], 'time': '211229135917'}, {'coord': [106.95625, 39.466877], 'time': '211229135922'}, {'coord': [106.95625, 39.466877], 'time': '211229135927'}, {'coord': [106.95625, 39.466877], 'time': '211229135932'}, {'coord': [106.95619, 39.466915], 'time': '211229135937'}, {'coord': [106.95604, 39.466934], 'time': '211229135942'}, {'coord': [106.95586, 39.467052], 'time': '211229135947'}, {'coord': [106.95577, 39.4673], 'time': '211229135952'}, {'coord': [106.955696, 39.467575], 'time': '211229135957'}, {'coord': [106.95558, 39.467865], 'time': '211229140002'}, {'coord': [106.95548, 39.468132], 'time': '211229140007'}, {'coord': [106.95535, 39.468315], 'time': '211229140012'}, {'coord': [106.95532, 39.468365], 'time': '211229140017'}, {'coord': [106.95525, 39.468483], 'time': '211229140022'}, {'coord': [106.955055, 39.468647], 'time': '211229140027'}, {'coord': [106.95474, 39.468884], 'time': '211229140032'}, {'coord': [106.95443, 39.469143], 'time': '211229140037'}, {'coord': [106.95411, 39.469383], 'time': '211229140042'}, {'coord': [106.95376, 39.46958], 'time': '211229140047'}, {'coord': [106.95342, 39.469856], 'time': '211229140052'}, {'coord': [106.95305, 39.470116], 'time': '211229140057'}, {'coord': [106.95268, 39.470337], 'time': '211229140102'}, {'coord': [106.95229, 39.47055], 'time': '211229140107'}, {'coord': [106.95208, 39.470776], 'time': '211229140112'}, {'coord': [106.951805, 39.470985], 'time': '211229140117'}, {'coord': [106.95142, 39.47102], 'time': '211229140122'}, {'coord': [106.9514, 39.47064], 'time': '211229140127'}, {'coord': [106.95179, 39.47024], 'time': '211229140132'}, {'coord': [106.95229, 39.46979], 'time': '211229140137'}, {'coord': [106.95264, 39.469284], 'time': '211229140142'}, {'coord': [106.95292, 39.46878], 'time': '211229140147'}, {'coord': [106.95324, 39.46834], 'time': '211229140152'}, {'coord': [106.9535, 39.467953], 'time': '211229140157'}, {'coord': [106.95364, 39.467617], 'time': '211229140202'}, {'coord': [106.95378, 39.467407], 'time': '211229140207'}, {'coord': [106.95387, 39.46712], 'time': '211229140212'}, {'coord': [106.95385, 39.466656], 'time': '211229140217'}, {'coord': [106.95363, 39.46615], 'time': '211229140222'}, {'coord': [106.9534, 39.465687], 'time': '211229140227'}, {'coord': [106.95294, 39.465435], 'time': '211229140232'}, {'coord': [106.95228, 39.46531], 'time': '211229140237'}, {'coord': [106.95163, 39.46531], 'time': '211229140242'}, {'coord': [106.95098, 39.46543], 'time': '211229140247'}, {'coord': [106.95033, 39.465534], 'time': '211229140252'}, {'coord': [106.94978, 39.465725], 'time': '211229140257'}, {'coord': [106.949234, 39.4658], 'time': '211229140302'}, {'coord': [106.94862, 39.46574], 'time': '211229140307'}, {'coord': [106.948, 39.465668], 'time': '211229140312'}, {'coord': [106.94736, 39.46563], 'time': '211229140317'}]


      ]
      const lines = data1.map(function (track) {
        return {
          coords: track.map(function (seg, idx) {
            return seg.coord;
          })
        };
      });

      const data = this.data;


      const geoCoordMap = this.geoCoordMap;


      const convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        return res;
      };


      var chartDom = document.getElementById("bmap");

      global_dom = chartDom;
      var myChart = this.$echarts.init(chartDom);

      global_charts = myChart;
      var option ;


      option = {
        backgroundColor: 'transparent',
        title: {
          text: '露天矿实时位置数据图',
          subtext: '',
          subtextStyle:{
            color:'#000',
            align:'right',
            fontSize:20
          },
          sublink: 'http://www.pm25.in',
          left: 'center',
          textStyle: {
            color: '#000',
            fontSize: 25
          }
        },
        tooltip : {
          trigger: 'item'
        },
        bmap: {
          // center: [104.114129, 37.550339],
          // center:[106.94022939015291,39.47474585684117],
          center:this.areacenter,
          zoom: 15,
          roam: true,
          mapStyle: {
            style:'dark',
            styleJson: [
              {
                "featureType": "water",
                "elementType": "all",
                "stylers": {
                  "color": "#044161"
                }
              },
              {
                "featureType": "land",
                "elementType": "all",
                "stylers": {
                  "color": "#004981"
                }
              },
              {
                "featureType": "boundary",
                "elementType": "geometry",
                "stylers": {
                  "color": "#064f85"
                }
              },
              {
                "featureType": "railway",
                "elementType": "all",
                "stylers": {
                  "visibility": "off"
                }
              },
              {
                "featureType": "highway",
                "elementType": "geometry",
                "stylers": {
                  "color": "#004981",
                  "visibility": "off"
                }
              },
              {
                "featureType": "highway",
                "elementType": "geometry.fill",
                "stylers": {
                  "color": "#005b96",
                  "lightness": 1,
                  "visibility": "off"
                }
              },
              {
                "featureType": "highway",
                "elementType": "labels",
                "stylers": {
                  "visibility": "off"

                }
              },
              {
                "featureType": "arterial",
                "elementType": "geometry",
                "stylers": {
                  "color": "#004981",
                  "visibility": "off"
                }
              },
              {
                "featureType": "arterial",
                "elementType": "geometry.fill",
                "stylers": {
                  "color": "#00508b",
                  "visibility": "off"
                }
              },
              {
                "featureType": "poi",
                "elementType": "all",
                "stylers": {
                  "visibility": "off"
                }
              },
              {
                "featureType": "green",
                "elementType": "all",
                "stylers": {
                  "color": "#056197",
                  "visibility": "off"
                }
              },
              {
                "featureType": "subway",
                "elementType": "all",
                "stylers": {
                  "visibility": "off"
                }
              },
              {
                "featureType": "manmade",
                "elementType": "all",
                "stylers": {
                  "visibility": "off"
                }
              },
              {
                "featureType": "local",
                "elementType": "all",
                "stylers": {
                  "visibility": "off"
                }
              },
              {
                "featureType": "arterial",
                "elementType": "labels",
                "stylers": {
                  "visibility": "off"
                }
              },
              {
                "featureType": "boundary",
                "elementType": "geometry.fill",
                "stylers": {
                  "color": "#029fd4"
                }
              },
              {
                "featureType": "building",
                "elementType": "all",
                "stylers": {
                  "color": "#1a5787"
                }
              },
              {
                "featureType": "label",
                "elementType": "all",
                "stylers": {
                  "visibility": "off"
                }
              }
            ]
          }
        },
        series : [
          // {
          //   name:'区域',
          //   type: 'custom',
          //   coordinateSystem: 'bmap',
          //   renderItem: this.renderItem,
          //   itemStyle: {
          //     opacity: 0.5
          //   },
          //   animation: false,
          //   silent: true,
          //   data: [0],
          //   z: -10,
          //   label:{
          //     show:true,
          //     formatter: (params) => {
          //       // params.data.name 城市名称
          //       // params.data.value[2] 空气质量指数数据
          //       return '采坑'
          //       // return `${params.name} - ${params.type}`
          //     }
          //   },
          //
          // },
          {
            type: 'lines',
            coordinateSystem: 'bmap',
            data: lines,
            polyline: true,
            lineStyle: {
              color: 'purple',
              opacity: 0.6,
              width: 3

            },
            lable:{
              position :'end'
            },


          },
              //单个车辆的行车轨迹
          {
            type: 'lines',
            coordinateSystem: 'bmap',
            data: lines,
            polyline: true,
            lineStyle: {
              // color: 'purple',
              // opacity: 0.6,
              // width: 3
              width: 0
            },
            lable:{
              position :'end'
            },
            effect: {
              constantSpeed: 20,
              show: true,
              trailLength: 0.5,
              symbolSize: 10
            },
            zlevel: 1
          },

            ////车辆散点图

          // {
          //   name: '车辆',
          //   type: 'scatter',
          //   coordinateSystem: 'bmap',
          //   data: convertData(data),
          //   symbolSize: function (val) {
          //     return val[2] *2;
          //   },
          //   encode: {
          //     value: 2
          //   },
          //   label: {
          //     formatter: '{b}',
          //     position: 'right',
          //     show: false
          //   },
          //   emphasis: {
          //     label: {
          //       show: true
          //     }
          //   }
          // },



        ]
      };
      global_option = option;
      if (option && typeof option === 'object') {
        myChart.setOption(option);
      }
      // 添加百度地图插件
      // const bmap = myChart
      //     .getModel()
      //     .getComponent('bmap')
      //     .getBMap();
      // bmap.addControl(new BMap.NavigationControl());
      // bmap.addControl(new BMap.ScaleControl());


      // ///添加地图标注
      // var point = new BMap.Point(106.9445581367628,39.46553978194375);
      // bmap.centerAndZoom(point, 15);
      // var marker = new BMap.Marker(point);        // 创建标注
      // bmap.addOverlay(marker);
      // bmap.setMapStyle({style:'midnight'});
      // let BMap = {};
      // BMap = window.BMap;
      // const marker = new window.BMap.Marker(106.9445581367628,39.46553978194375); // 创建标注
      // bmap.addOverlay(marker); // 将标注添加到地图中
    },



    initBmap () {
      // const myChart = this.$echarts.init(this.$refs.bmap)
      // myChart.setOption({
      //   bmap: {
      //     key: 'EQGnPyIUtYnlvEMj42bGWmuiAwPRX9Uc',
      //     center: [104.114129, 37.550339] // 当前视角中心位置的坐标
      //   }
      // })


      // 计算停留地



      // option && myChart.setOption(option);








    },




  }
}

//
// window.alert = alert;
//
// function alert(data) {
//
//   var a = document.createElement("div"),
//
//       p = document.createElement("p"),
//
//       btn = document.createElement("div"),
//
//       textNode = document.createTextNode(data ? data : ""),
//
//       btnText = document.createTextNode("确定");
//
// // 控制样式
//
//   css(a, {
//
//     "position" : "fixed",
//
//     "left" : "0",
//
//     "right" : "0",
//
//     "top" : "20%",
//
//     "width" : "200px",
//
//     "margin" : "0 auto",
//
//     "background-color" : "#1e3cff",
//
//     "font-size" : "20px",
//
//     "text-align" : "center"
//
//   });
//
//   css(btn, {
//
//     "background" : "blue",
//
//   })
//
// // 内部结构套入
//
//   p.appendChild(textNode);
//
//   btn.appendChild(btnText);
//
//   a.appendChild(p);
//
//   a.appendChild(btn);
//
// // 整体显示到页面内
//
//   document.getElementsByTagName("body")[0].appendChild(a);
//
// // 确定绑定点击事件删除标签
//
//   btn.onclick = function(){
//
//     a.parentNode.removeChild(a);
//
//   }
//
// }
//
// function css(targetObj, cssObj) {
//
//   var str = targetObj.getAttribute("style") ? targetObj.getAttribute("style") : "";
//
//   for(var i in cssObj) {
//
//     str += i + ":" + cssObj[i] + ";";
//
//   }
//
//   targetObj.style.cssText = str;
//
// }
</script>
<style>
.anchorBL{
  display:none
}
.container1{

  height: 100%;
}
.bmap{
  position: absolute;
  left: 28.5%;
  width: 70%;
  height: 86%;
  margin-bottom: 15px;
}

.left{
  position: absolute;
  width: 28%;
  height: 100%;
}
.left-top{
  width: 80%;
  height: 40%;
}
.left_bottom{
  width: 80%;
  height: 40%;
}
.date{
  z-index: 111;
  position: absolute;
  left:80%;
  width:200px;
  font-size: 15px;

}
</style>