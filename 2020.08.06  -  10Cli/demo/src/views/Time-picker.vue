
<template>

  <div class="All_any_event">
    <div class="date_editor" @mouseover.prevent.stop="Time_over" @mouseout="Time_out">
      <span class="iconfont icon-shijian"></span>
      <!-- 时间图标 -->
      <input
        type="text"
        class="any_event"
        placeholder="任意时间点"
        v-model="time"
        @focus="Select_complete"
      />
      <span @click="Empty_event" class="iconfont icon-guanbi" v-show="Empty_time"></span>
      <!-- 关闭按钮 -->
      <div :class="{'time-panel':true,'time-panel_appear':flag}">
        <!--整个时间弹出-->
        <div class="time-panel_content">
          <!-- 时间点选择器的 内容部分 -->
          <div
            class="scrollbar_view"
            @scroll.passive="gethourScroll($event)"
            @mouseleave="time_leave_second($event)"
          >
            <ul class="time-spinner_list">
              <li @click="Time_position(index,$event)">
                <span>0</span>0
              </li>
              <li
                @click="Time_position(index,$event)"
                v-for="(item,index) in 23"
                :key="index"
                :value="index"
              >
                <span v-if="item<10">0</span>
                {{item}}
              </li>
            </ul>
          </div>

          <div
            class="scrollbar_view"
            @scroll.passive="getminuteScroll($event)"
            @mouseleave="time_leave_second($event)"
          >
            <ul class="time-spinner_list">
              <li @click="Time_position(index,$event)">
                <span>0</span>0
              </li>
              <li @click="Time_position(index,$event)" v-for="(item,index) in 59" :key="index">
                <span v-if="item<10">0</span>{{item}}
              </li>
            </ul>
          </div>

          <div
            class="scrollbar_view"
            @scroll.passive="getsecondScroll($event)"
            @mouseleave="time_leave_second($event)"
          >
            <ul class="time-spinner_list">
              <li @click="Time_position(index,$event)">
                <span>0</span>0
              </li>
              <li @click="Time_position(index,$event)" v-for="(item,index) in 59" :key="index">
                <span v-if="item<10">0</span>{{item}}
              </li>
            </ul>
          </div>

          <div class="time_selected">
            <!-- 选中横条 表示当前选中 -->
          </div>
        </div>
        <div class="time-panel_footer">
          <!--时间选择器的 取消确定 -->
          <button class="time_footer_cancel" @click="Determine_the_time">取消</button>
          <button class="time_footer_confirm" @click="Determine_the_time">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

    props:['set_time','Finish_time'],
  data: function () {
    return {
      time: "",
      // 这里用time给input双向绑定
      // time = hour + ":" + minute + ":" + second 拼接而成
      hour: "00",
      minute: "00",
      second: "00",
      // flag控制时间选择器的显示消失
      flag: false,
      // Empty_time用于判断输入框移入移出
      // 控制清空输入框 X 的显示和隐藏
      Empty_time: false,
      // 两个数组表示时间
      // 后续可通过分割字符串转数组自定义选择限定时间
    };
  },
  methods: {
    gethourScroll(e) {
      // 监听 小时滚动
      // 监听 小时滚动
      console.log(e.target.scrollTop);
      let Top = parseInt(e.target.scrollTop / 32);
      // if (this.time_initialization) {
      //     this.time = Top + ':' + '00' + ":" + '00';
      //     console.log(this.time)
      //     this.time_initialization = false;
      //     return;
      // }
      if (Top < 10) {
        Top = "0" + Top;
        this.hour = Top;
      }

      if (Top >= this.set_time[0] && Top <= this.Finish_time[0]) {
        this.hour = Top;
        this.time = this.hour + ":" + this.minute + ":" + this.second;
      } else {
        this.minute = "00";
        this.time = this.hour + ":" + this.minute + ":" + this.second;
      }
    },
    getminuteScroll(e) {
      // 监听 分钟滚动
      let Top = parseInt(e.target.scrollTop / 32);
      if (Top < 10) {
        Top = "0" + Top;
        this.minute = Top;
      }

      if (this.hour == this.set_time[0]) {
        // 判断是否在 小时规定的限制内
        if (Top >= this.set_time[1]) {
          this.minute = Top;
          this.time = this.hour + ":" + this.minute + ":" + this.second;
        }
      } else if (this.hour == this.Finish_time[0]) {
        if (Top <= this.Finish_time[1]) {
          if (Top == this.Finish_time[1]) {
            this.second = "00";
          }
          this.minute = Top;
          this.time = this.hour + ":" + this.minute + ":" + this.second;
        }
      } else if (this.hour > this.set_time[0]) {
        this.minute = Top;
        this.time = this.hour + ":" + this.minute + ":" + this.second;
      }
    },

    getsecondScroll(e) {
      // 监听 秒数滚动
      let Top = parseInt(e.target.scrollTop / 32);
      if (Top < 10) {
        Top = "0" + Top;
        this.second = Top;
      }

      //判断 小时区间 如果不符合不做操作
      if (this.hour >= this.set_time[0]) {
        if (
          this.hour == this.Finish_time[0] &&
          this.minute < this.Finish_time[1]
        ) {
          // 由于 在限定时间 20:30的时候 没法动秒数
          // 要在29的时候可以动 所以用<而不是<=
          // 满足以上条件让秒数失效
          this.second = Top;
          this.time = this.hour + ":" + this.minute + ":" + this.second;
        } else if (
          this.hour == this.set_time[0] &&
          this.minute >= this.set_time[1]
        ) {
          //这里判断是否在18:30的时候
          this.second = Top;
          this.time = this.hour + ":" + this.minute + ":" + this.second;
        } else if (
          this.hour > this.set_time[0] &&
          this.hour < this.Finish_time[0]
        ) {
          // 这里是正常小时在18-20之间
          this.second = Top;
          this.time = this.hour + ":" + this.minute + ":" + this.second;
        }
      }
    },

    time_leave_second(e) {
      //这里用于每一个列表鼠标移出的时候自动对齐
      let Top = e.target.scrollTop % 32;
      e.target.scrollTop -= Top;
    },
    // 这里俩事件 用于控制时间点显示 显示消失
    Select_complete() {
      this.flag = true;
      console.log("获取焦点事件触发", this.flag);
    },
    Time_over() {
      if (this.time == "" || this.time == " ") {
        this.Empty_time = false;
      } else {
        this.Empty_time = true;
      }
    },
    // input的移入移出 此处用于控制右边清空按钮的显示隐藏
    Time_out() {
      this.Empty_time = false;
    },
    Empty_event() {
      // 右侧关闭按钮点击清空 时间(input内容)
      this.time = "";
    },
    Determine_the_time() {
      // 下方button按钮确定或者取消时间
      this.flag = false;
    },

    Time_position(index, e) {
      this.flag = true;
      document.querySelector(".any_event").focus();
      console.log("列表项点击事件触发", this.flag);
      e.target.parentNode.parentNode.scrollTop = (index + 1) * 32;
    },
    mounted() {
      let { time_list_hour } = this.$refs;
      this.hour_inner = this.set_time[0];
      time_list_hour.style.top = "-" + this.hour_inner * 32 + "px";
    },
  },
};
</script>

<style  scoped>
html,
body {
  width: 100%;
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  list-style: none;
  text-decoration: none;
  border: none;
  outline: none;
  background-color: transparent;
}

.any_event {
  height: 38px;
  padding: 0px 30px;
  border-radius: 6px;
  color: #606266;
  /* 192,196,204  hover色号*/
}

.date_editor {
  display: flex;
  align-items: center;
  position: relative;
  /* width: 220px; */
  font-size: 14px;
  border-radius: 6px;
  transition: border-color 0.5s;
  border: 1px solid #dcdfe6;
}

.date_editor > .icon-shijian {
  position: absolute;
  font-size: 14px;
  left: 11px;
  top: 11px;
  color: #dcdfe6;
}

.date_editor > .icon-guanbi {
  position: absolute;
  font-size: 12px;
  right: 11px;
  top: 12px;
  color: #dcdfe6;
}

.editor_time {
  margin-left: 10px;
}

.All_any_event {
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.date_editor_backcolor {
  border-color: #ccc;
}

.time-panel_footer {
  border-top: 1px solid #e4e4e4;
  padding: 4px;
  display: flex;
  justify-content: flex-end;
  height: 36px;
}

.time-panel_footer > button {
  font-size: 12px;
  margin: 0 5px;
  padding: 0 5px;
}

.time_footer_confirm {
  font-weight: 800;
  color: #409eff;
}

.time-panel {
  position: absolute;
  top: 58px;
  border: 1px solid #e4e7ed;
  height: 0px;
  overflow: hidden;
  opacity: 0;
  left: 0px;
  /* position: relative; */
  transition: all 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.time-panel_appear {
  height: 226px;
  opacity: 1;
}

.time-panel::after {
  content: "";
  position: absolute;
  background-color: transparent;
  border: 8px solid transparent;
  border-bottom: 10px solid #fff;
  left: 20%;
  top: -16px;
  /* box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); */
}

.time-panel_content {
  width: 180px;
  height: 190px;
  position: relative;
  display: flex;
  /* background-color: red; */
}

.scrollbar_view {
  width: 32px;
  flex-grow: 1;
  text-align: center;
  overflow: auto;
}

.scrollbar_view::-webkit-scrollbar {
  display: none;
}

.scrollbar_view_inner {
  overflow: hidden;
}

.scrollbar_view::after {
  content: "";
  display: block;
  width: 100%;
  height: 80px;
}

.scrollbar_view::before {
  content: "";
  display: block;
  width: 100%;
  height: 80px;
}

.scrollbar_view_inner {
  width: 32px;
  flex-grow: 1;
  text-align: center;
  overflow: hidden;
}

.scrollbar_view_inner::after {
  content: "";
  display: block;
  width: 100%;
  height: 80px;
}

.scrollbar_view_inner::before {
  content: "";
  display: block;
  width: 100%;
  height: 80px;
}

.time-spinner_list > li {
  height: 32px;
  line-height: 32px;
  font-size: 12px;
}

.time-spinner_list > li:hover {
  background-color: #f5f7fa;
}

.time_selected {
  position: absolute;
  height: 30px;
  width: 145px;
  left: 18px;
  top: 50%;
  transform: translate(0, -50%);
  border-top: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  /* border: 1px solid #333; */
  /* background-color: red; */
}

.time-spinner_list {
  width: 100%;
  white-space: nowrap;
}

.time-spinner_list_two {
  width: 100%;
  white-space: nowrap;
  position: relative;
}

.time-spinner_list_two > li {
  height: 32px;
  line-height: 32px;
  font-size: 12px;
}

.Current_options {
  color: #000;
  font-weight: 500;
}

.Selected_item {
  color: #303133;
  font-weight: 700;
}

.Not_currently_selected {
  color: #c0c4cc;
}

.Up_time {
  padding-top: 16px;
  display: flex;
  text-align: center;
}

.Up_time > div {
  width: 30px;
  font-size: 8px;
  color: #ccc;
  flex-grow: 1;
  transition: all 0.3s;
}

.Up_time > div:hover {
  color: #409eff;
}

.time-panel_appear_inner {
  height: 295px;
  opacity: 1;
}
</style>