<template>
  <div class="form-container">
    <h1>zForm Demo</h1>
    <z-form
        :items="items"
        label-width="130px"
        label-position="left"
    />
  </div>
</template>

<script setup>
import ZForm from "@/components/zForm";
import {shallowRef} from "vue";
const items = shallowRef([
  {
    key: 'title',
    title: '小说名',
    component: 'el-input',
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
</script>

<style>
.form-container h1{
  text-align: center;
}
</style>
