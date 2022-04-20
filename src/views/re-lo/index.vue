<template>
	<div id="re-lo">
		<el-container>
			<el-main>
				<img src="../../assets/bg.png" class="bg" />
			</el-main>
			<el-aside style="margin-top: 50px;" width="500px">
				<el-card class="box-card card">
					<el-button type="text" class="forget-pass" :disabled="type===true" @click="type=!type">登录</el-button>
					<el-divider direction="vertical"></el-divider>
					<el-button type="text" class="forget-pass" :disabled="type===false" @click="type=!type">注册</el-button>
					<el-divider></el-divider>
					<el-collapse-transition>
						<form-com :type="type" :key="type"></form-com>
					</el-collapse-transition>
				</el-card>
			</el-aside>
		</el-container>
	</div>
</template>

<script>
	import FormCom from "./components/FormCom"

	export default {
		components: {
			FormCom: FormCom
		},
		name: 'relo',
		data: () => {
			return {
				type: true
			}
		},
	}
</script>

<style scoped>
	.el-aside {
		/* background-color: #D3DCE6; */
		color: #333;
		text-align: center;
		min-height: 500px;
	}

	.el-main {
		/* background-color: #E9EEF3; */
		color: #333;
		text-align: center;
	}
  /*背景图片*/
	.bg {
    margin-top: 20px;
		max-width: 650px;
    border-radius: 10px;
    height: 400px;
	}

	.card {
		margin-top: 20px;
		float: left;
		min-width: 350px;
	}
</style>
