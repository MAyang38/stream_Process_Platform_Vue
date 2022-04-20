<template>
  <div class="container1">
    <div class="left">
      <el-row class="tac">
<!--        <el-col :span="12">-->
<!--          <h5>默认颜色</h5>-->
<!--          <el-menu-->
<!--              default-active="2"-->
<!--              class="el-menu-vertical-demo"-->
<!--              @open="handleOpen"-->
<!--              @close="handleClose">-->
<!--            <el-submenu index="1">-->
<!--              <template slot="title">-->
<!--                <i class="el-icon-location"></i>-->
<!--                <span>导航一</span>-->
<!--              </template>-->
<!--              <el-menu-item-group>-->
<!--                <template slot="title">分组一</template>-->
<!--                <el-menu-item index="1-1">选项1</el-menu-item>-->
<!--                <el-menu-item index="1-2">选项2</el-menu-item>-->
<!--              </el-menu-item-group>-->
<!--              <el-menu-item-group title="分组2">-->
<!--                <el-menu-item index="1-3">选项3</el-menu-item>-->
<!--              </el-menu-item-group>-->
<!--              <el-submenu index="1-4">-->
<!--                <template slot="title">选项4</template>-->
<!--                <el-menu-item index="1-4-1">选项1</el-menu-item>-->
<!--              </el-submenu>-->
<!--            </el-submenu>-->
<!--            <el-menu-item index="2">-->
<!--              <i class="el-icon-menu"></i>-->
<!--              <span slot="title">导航二</span>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="3" disabled>-->
<!--              <i class="el-icon-document"></i>-->
<!--              <span slot="title">导航三</span>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="4">-->
<!--              <i class="el-icon-setting"></i>-->
<!--              <span slot="title">导航四</span>-->
<!--            </el-menu-item>-->
<!--          </el-menu>-->
<!--        </el-col>-->
        <el-col :span="15">

          <el-menu :default-active="defaultmenu.toString()"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
            <el-menu-item index="1" @click="changemodel(1)">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>车辆时间轨迹</span>
              </template>
<!--              <el-menu-item-group>-->
<!--                <template slot="title">分组一</template>-->
<!--                <el-menu-item index="1-1">选项1</el-menu-item>-->
<!--                <el-menu-item index="1-2">选项2</el-menu-item>-->
<!--              </el-menu-item-group>-->
<!--              <el-menu-item-group title="分组2">-->
<!--                <el-menu-item index="1-3">选项3</el-menu-item>-->
<!--              </el-menu-item-group>-->
<!--              <el-submenu index="1-4">-->
<!--                <template slot="title">选项4</template>-->
<!--                <el-menu-item index="1-4-1">选项1</el-menu-item>-->
<!--              </el-submenu>-->
            </el-menu-item>
            <el-menu-item index="2" @click="changemodel(2)">
              <i class="el-icon-menu"></i>
              <span slot="title">车辆行走距离</span>
            </el-menu-item>
            <el-menu-item index="3" @click="changemodel(3)">
              <i class="el-icon-menu"></i>
              <span slot="title">车辆超速</span>
            </el-menu-item>
            <el-menu-item index="4" @click="changemodel(4)">
              <i class="el-icon-document"></i>
              <span slot="title">车辆数据频率</span>
            </el-menu-item>
            <el-menu-item index="5" @click="changemodel(5)">
              <i class="el-icon-setting"></i>
              <span slot="title">车辆角度超限</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
        <div class="right" v-if="menumodel===1">
                <el-table
                    :data="tableData[1]"
                    height="450"
                    border
                    style="width: 100%">
                  <el-table-column
                      prop="date"
                      label="日期"
                      width="180">
                  </el-table-column>
                  <el-table-column
                      prop="name"
                      label="终端号"
                      width="180">
                  </el-table-column>
                  <el-table-column
                      prop="address"
                      label="GPS">
                  </el-table-column>
                </el-table>
        </div>

    <div class="right" v-if="menumodel===2">
      <el-table
          :data="tableData[2]"
          height="450"
          border
          style="width: 100%">
        <el-table-column
            prop="date"
            label="日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="车辆终端号"
            width="180">
        </el-table-column>
        <el-table-column
            prop="address"
            label="行走距离">
        </el-table-column>
      </el-table>
    </div>

    <div class="right" v-if="menumodel===3">
      <el-table
          :data="tableData[3]"
          height="450"
          border
          style="width: 100%">
        <el-table-column
            prop="date"
            label="日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="车辆终端号"
            width="180">
        </el-table-column>
        <el-table-column
            prop="address"
            label="速度超限达到一定时间">
        </el-table-column>
      </el-table>
    </div>

    <div class="right" v-if="menumodel===4">
      <el-table
          :data="tableData[4]"
          height="450"
          border
          style="width: 100%">
        <el-table-column
            prop="date"
            label="日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="车辆终端号"
            width="180">
        </el-table-column>
        <el-table-column
            prop="dataFrequency"
            label="平均数据频率">
        </el-table-column>
        <el-table-column
            prop="maxdataFrequency"
            label="最大相邻数据频率">
        </el-table-column>
        <el-table-column
            prop="mindataFrequency"
            label="最小相邻数据频率">
        </el-table-column>
      </el-table>
    </div>

    <div class="right" v-if="menumodel===5">
      <el-table
          :data="tableData[5]"
          height="450"
          border
          style="width: 100%">
        <el-table-column
            prop="date"
            label="日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="车辆终端号"
            width="180">
        </el-table-column>
        <el-table-column
            prop="lastDirection"
            label="车辆上一次角度朝向">
        </el-table-column>
        <el-table-column
            prop="nowDirection"
            label="车辆目前角度朝向">
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import {Login, Search} from "../../api/api";
import Vue from "vue";

export default {
  data() {
    return {
      menumodel:1,
      defaultmenu: 5,
      hasData:1,
      distanceData:[],
      speedData:[],
      //六个位置分别放六块数据
      tableData: [[{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }
      ],  [],[],[],[],[]   ]
    }
  },
  methods:{
    async changemodel(value) {
      this.menumodel = value;
      console.log(this.menumodel);
      // let rsp = await Search(this, {
      //   'type': this.menumodel
      // });
      // if (!this.tableData[value]){
        await Search(this, this.menumodel)
            .then(rsp =>{
              Vue.set(this.tableData, value, rsp.data.data)
                // this.tableData[value] = rsp.data.data;
                console.log(this.tableData[value]);
            });
        // this.tableData[value] = rsp.data.data;
        // console.log(this.tableData[value])
      // }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style>
.container1 {
  position: absolute;
  width: 100%;
  height: 100%;
}

.left {
    position: absolute;
    width: 30%;
    height: 100%;
  }

  .right {
    position: absolute;
    left: 25%;
    width: 60%;
}


</style>
