<template>
	<div>
		<m-header title='书影音'>
			<a slot='right' @click="$router.push({path:'/search'})">
				<img src="../../../common/images/ic_actionbar_search_icon.png" alt="" class="m-icon-img is-margin">
			</a>
			<a slot='right'>
				<img src="../../../common/images/ic_chat_green.png" alt="" class="m-icon-img">
			</a>
		</m-header>
		<!-- tab切换 -->
		<tab :line-width=1 active-color='#fc378c' v-model="currentIndex">
        	<tab-item 
        		class="vux-center" 
        		v-for="(item, index) in switchs" 
        		@click="switchs = item" 
        		:key="index"
        		:selected="switchs === item" 
        	>
        	{{item.name}}
        	</tab-item>
     	</tab>
   
		<!-- 主内容区域 -->
		<slider @switchItem='switchItem' :currentIndex='currentIndex'>
			
			<!-- 正在热映的电影 -->
			<scroll 
					class="list-scroll"
					:data='hotMovies'
					:pullup='pullup'
					:probeType='probeType'
					:listenScroll = 'true'
					@scrollToEnd='loadMore'
					@scroll = 'scroll'
			>
				<div class="list-inner">
					<movie-list :movies='hotMovies' :hasMore = 'hasMoreHotMovies' @select = 'selectMovie'></movie-list>
				</div>
			</scroll>
			<!-- 图书 -->
			<scroll 
				class='list-scroll'
				
			>
				<div class="list-inner">
					<book-list></book-list>
				</div>
			</scroll>
			<!-- tab切换的时候显示加载的动画 -->
			<loadmore :fullScreen='true' 
						v-show ="currentIndex===0&&!hotMovies.length||currentIndex===1&&bookList.length"
						style='width:50%'
			></loadmore>
			
		</slider>
		
		<Toast type='warn' v-model='toastShow'>网络错误</Toast>
		<router-view/>
	</div>
</template>
<script>
	import mHeader from 'base/header/header'
	import navbar  from 'base/navbar/navbar'
	import scroll  from 'base/scroll/scroll'
	import movieList from 'base/movie-list/movie-list'
	import Slider from 'base/slider/slider'
	import {getMovie} from 'api/movie-show'
	import {createMovieList} from 'api/movieList'
	import {mapMutations} from 'vuex'
	import { Tab, TabItem,  Swiper, SwiperItem ,Toast} from 'vux'
	const search_more = 10; //每次请求数据的长度 count
	
	export default {
		name:'audioBook',
		data(){
			return {
				switchs:[
					{id:0,name:'正在热映'},
					{id:1,name:'关注图书'}
				],
				currentIndex:0,//tab切换的当前索引
				hotMovies:[],//正在热映电影列表
				comingMovies:[],//即将上映的电影列表
				hotMovieIndex:0,//热映电影的下标 start
				pullup: true, // 支持滚动加载
				loadingFlag:true, //控制加载的速度
				hasMoreHotMovies:true, //显示底线的
				scrollY:-1,//默认的滚动位置
				toastShow:false,//默认toast 是不显示的
				bookList:[] ,//图书
				
			}
		},
		metaInfo:{
			title:'书影音'
		},
		components:{ mHeader,navbar,scroll,'movie-list':movieList,Toast,Tab,TabItem, Swiper,SwiperItem,
			loadmore:()=>import (/* webpackChunkName:'loadmore'*/'@/base/loading/loadmore'),
			bookList:()=>import(/* webpackChunkName:'bookList'*/'base/book-list/book-list'),
			Slider
		},

		created(){
			this._getMovie();
			this.probeType = 3;
		},
		methods:{
			switchItem(index){
				
				this.currentIndex= index;
			},
            // 获取正在上映的电影
			_getMovie(){
                // getMovieshi API JS里面到导出 一个方法
				getMovie(this.hotMovieIndex,search_more)
					.then(res=>{
                    // res.subjects 数据中的数组部分
					// console.log(res.subjects);
					//创建类封住数据  createMovieList(res.subjects)
					this.hotMovies = createMovieList(res.subjects)
				}).catch(err=>{
					console.log(err);
					this.toastShow = true
				})
			},
			loadMore:function(){
				if(!this.loadingFlag){
					return ;//如果上次没有加载完不加载
				}
				this.loadingFlag = false; //重置加载位置
                //加载更多的数据
				if(this.currentIndex === 0){
					if (!this.hasMoreHotMovies) { // 不存在更多电影 这里的hasMoreHotMovies is false  显示没有更多了
            			this.loadingFlag = true;
            			return;
          			}
					this.hotMovieIndex+= search_more;
					getMovie(this.hotMovieIndex,search_more).then(res=>{
						this.hotMovies = this.hotMovies.concat(createMovieList(res.subjects));
            			this._checkMore(res); //检查有没有数据了 没有this.hasMoreHotMovies为false
            			this.loadingFlag = true; //成功加载了
					})

				}

			},
			_checkMore(data){
				const movies = data.subjects;
				if(!movies.length || data.start + data.count >data.total){
					if(this.currentIndex===0){
						this.hasMoreHotMovies = false;
					}else{
						// 即将上映的电影
					}
					this.loadingFlag = true;
				}
			},
			// 记录滚动的位置
			scroll(pos){

				this.scrollY = pos.y;
				// console.log(this.scrollY)
			},
			selectMovie(movie){
				// console.log(movie);
				this.setMovie(movie)
				this.$router.push({
                    path:`/audioBook/${movie.id}`
                })
			},
			...mapMutations({
				setMovie:'setMovie'
			})


		}
	}
</script>
<style lang="less" scoped>
	.list-scroll{
		position: relative;
		height: 100%;
		overflow: hidden;
		float: left;
		div.list-inner{
			padding: 0 15px;
		}
	}
</style>
