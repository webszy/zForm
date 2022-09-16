<template>
  <div class="form-container">
    <h1>zForm Demo</h1>
    <z-form
        ref="form"
        :items="items"
        label-width="130px"
        label-position="left"
        @handleUploadCover="handleUploadCover"
    />
    <el-button @click="getData">获取数据</el-button>
  </div>
</template>

<script setup>
import ZForm from "@/components/zForm.vue"
import {ElButton} from 'element-plus'
import 'element-plus/theme-chalk/el-button.css'
import {ref, shallowRef} from "vue"
const form = ref(null)
const items = shallowRef([
  {
    key: 'title',
    title: '小说名',
    component: 'el-input',
    desc: '小说的名字',
    props: { placeholder: '请输入姓名' },
    rule: [{ required: true, trigger: 'blur', message: '必填项' }],
  },
  {
    key: 'avatar',
    title: '头像',
    component: 'el-input',
    props: { placeholder: 'http://xxxx.xxx/xx.jpg' },
    rule: [{ required: true, trigger: 'blur', message: '必填项' }],
    uploader: {
      emits: 'handleUploadCover',
      responseKey: 'url',
      props: {
        accept: 'image/png, image/jpeg, image/jpg',
      },
    },
  },
])
const handleUploadCover = async (file) => {
  const toBase64 = (rawFile)=>new Promise((resolve)=>{
    const reader = new FileReader();
    reader.onload = function(evt) {
      resolve(evt.target.result);
    };
    reader.readAsDataURL(file)
  })
  const str = await toBase64(file)
  return {url:str,success:true}
}
const getData = async()=> {
  const data = await form.value.getFormData()
  console.log(data)
}
</script>

<style>
.form-container h1{
  text-align: center;
}
</style>
