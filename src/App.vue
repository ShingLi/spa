<template>
  <div id="app">
    <section>
        <keep-alive exclude='movieDetail,celebrity,index-detail'>
            <router-view @isShow='isShow' :class="{'is-height':hide}"></router-view>
        </keep-alive>
    </section>
    <!-- 进入页面部分的遮罩层 -->
    <transition name='fade'>
        <welcome v-if='!show' :class="{other}"></welcome>
    </transition>
    <!-- <login></login> -->
  </div>
</template>

<script>
import welcome from 'base/welcome/welcome'

export default {
  name: 'app',
  data(){
    return {
      show:false  //欢迎页默认是关闭的
    }
  },

  components:{
      welcome
  },

  computed:{
    // 这个方法是单独控制我的那个页面的高度是100%
      hide(){
          if(this.$route.name==='mine')return true;
      },
      other(){
          if(this.$route.name!='index')return true;
      }
  },
  created(){
    this.readSession()
  },
  methods:{
    // 这个方法是进入主页后读取到数据然后inex.vue emit('isShow') 然后关闭欢迎页
      isShow(){
          setTimeout(()=>{
            this.show = true //关闭欢迎页
            // 写值到session里面 欢迎页只显示一次 刷新不显示欢迎页
            window.sessionStorage.setItem('show','true')
          },1500)
      },
      readSession(){
          let zhen = window.sessionStorage.getItem('show')
          if(zhen){

            this.show = true
          }
      }
  }
}
</script>

<style  lang='less' src='./common/less/app.less'></style>
