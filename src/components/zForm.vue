<template>
  <el-form
      v-bind="$attrs"
      ref="form"
      :model="formData"
      :rules="rules"
      :validate-on-rule-change="false"
  >
    <el-form-item v-for="item in props.items" :key="item.key" :label="item.title" :prop="item.key">
      <el-input v-if="item.component === 'el-input'" v-model.trim="formData[item.key]" v-bind="item.props" />
      <el-input-number v-else-if="item.component === 'el-input-number'" v-model.number="formData[item.key]" v-bind="item.props" />
      <el-select v-else-if="item.component === 'el-select' && Array.isArray(item.options)" v-model="formData[item.key]" v-bind="item.props">
        <el-option v-for="o in item.options" :key="o.value" :label="o.label" :value="o.value" />
      </el-select>
      <el-switch v-else-if="item.component === 'el-select'" v-model="formData[item.key]" v-bind="item.props" />
      <component v-else :is="item.component"  v-model="formData[item.key]" v-bind="item.props" />
      <el-upload
          v-if="item.uploader"
          style="margin-top:10px;"
          :before-upload="(file)=>beforeUpload(file,item)"
          :show-file-list="false"
          v-bind="item.uploader.props"
      >
        <el-button type="primary">点击上传</el-button>
      </el-upload>
      <template #label="{label}" v-if="item.desc">
        <div class="formItemLabel">
          <p>{{label}}</p>
          <el-tooltip
              effect="dark"
              :content="item.desc"
              placement="right"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>

      </template>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { QuestionFilled } from '@element-plus/icons-vue'
import {reactive, ref, shallowRef, toRaw, unref, useAttrs} from 'vue'
import {ElForm,ElFormItem,ElInput,ElInputNumber,
  ElSelect,ElOption,ElSwitch,ElUpload,ElButton,
  ElIcon,ElTooltip
} from 'element-plus'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-input-number.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/theme-chalk/el-switch.css'
import 'element-plus/theme-chalk/el-upload.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-tooltip.css'


import {getEmitName} from "@/utils";
const props = defineProps({
  initialData:{type:Object,required:false},
  items: { type: Array, required: true }
})

const formData = reactive({})
const rules = shallowRef([])
const formRef = ref(null)
const attrs = useAttrs()

(function(){
  const generateRules = () => {
    const result = {}
    let hasResult = false
    props.items
        .filter(e => typeof e.rule !== 'undefined')
        .forEach(e => {
          if (Array.isArray(e.rule)) {
            hasResult = true
            result[e.key] = e.rule
          }

        })
    if (hasResult) {
      rules.value = result
    }
  }
  const checkItems = () => {
    const keys = []
    for(const k of props.items){
      if(!k.key || !key.component){
        console.warn('zForm Warning: items中缺少key 或 component 字段')
        break
      }
      if(!keys.includes(k.key)){
        keys.push(k.key)
      }
      if(k.uploader){
        if(!k.uploader.emits){
          console.warn('zForm Warning: uploader中缺少emits 字段')
          break
        }
      }
    }
    if(keys.length !== props.items.length){
      console.warn('zForm Warning: items中有重复key')
    }
  }
  generateRules()
  checkItems()
})()


const validate = () => new Promise(resolve => {
  unref(formRef).validate(isValid => resolve(isValid))
})
const resetForm = () => unref(formRef)?.resetFields()
const getFormData = async () => {
  if(unref(rules).length){
    const isValid = await validate()
    return isValid ? toRaw(formData) : {isValid}
  }
  return toRaw(formData)
}
const beforeUpload = (rawFile, { key, uploader }) => {
  // console.log('beforeUpload', rawFile, props)
  const [fun] = getEmitName(uploader.emits)
  if (attrs[fun]) {
    attrs[fun](rawFile)
        .then(val => {
          if (uploader.afterUpload && val.success) {
            return uploader.afterUpload(val, formData)
          } else if (uploader.responseKey && val.success) {
            formData.value[key] = val[uploader.responseKey]
          }
        })
  } else {
    console.warn('not find the v-on: ', fun, ' on the LawForm,You should fix it')
  }

  return Promise.reject()
}
defineExpose({
  formRef,
  resetForm,
  getFormData
})
</script>

<style scoped>
.formItemLabel{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.formItemLabel p{
  margin: 0;
  padding: 0;
  margin-right: 10px;
}
</style>
