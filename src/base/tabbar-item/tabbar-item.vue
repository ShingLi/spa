<template>
	<a class="m-tabbar-item" @click=href :class="{'is-active':isActive}">
		<span class="m-tabbar-item-icon">
			<slot name='icon-normal' v-if='!isActive'></slot>
			<slot name='icon-active' v-if='isActive'></slot>
		</span>
		<span class="m-tabbar-item-text">
			<slot></slot>
		</span>
	</a>
</template>
<script>

	export default{
		props:['id'],
		methods:{
			href(){

				this.$parent.$emit('input',this.id);
				this.$router.push(this.id);
				// 提交到vuex中
				// this.$store.dispatch('async',this.id)
			}
		},
		computed:{
			isActive(){
				if(this.$parent.value==this.id){
					return true
				}
			}
		}
	}
</script>
