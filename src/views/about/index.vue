<template>
	<div id="about">
		<div class="container">
			<h1 style="text-align: center; color: #409EFF;">关于</h1>
			<el-divider content-position="right">
				<p style="color: #8F8F8F;">E-CTF简介</p>
			</el-divider>
			<div class="about">
				<p>基于矿山的GPS流处理平台</p>
				<p>前端面板使用VUE+element-UI打造，操作简单，界面友好，互动性强。</p>
        <p>后端使用flask + mysql + Hbase进行交互</p>
				<p style="float: right;">mfj 编辑于: 2022.4.2</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'about'
	}
</script>

<style>
	.container {
		margin: 0 auto;
		max-width: 45%;
	}
	.about{
		text-indent:35px
	}
</style>
