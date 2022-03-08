<template>
  <XtxDialog :title="(formData.id?'编辑':'添加')+'收货地址'"
             v-model:visible="dialogVisible">
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input v-model="formData.receiver"
                   class="input"
                   placeholder="请输入收货人" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input v-model="formData.contact"
                   class="input"
                   placeholder="请输入手机号" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity :fullLocation="formData.fullLocation"
                     @change="changeCity"
                     placeholder="请选择所在地区" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input v-model="formData.address"
                   class="input"
                   placeholder="请输入详细地址" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input v-model="formData.postalCode"
                   class="input"
                   placeholder="请输入邮政编码" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input v-model="formData.addressTags"
                   class="input"
                   placeholder="请输入地址标签，逗号分隔" />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <XtxButton @click="dialogVisible=false"
                 type="gray"
                 style="margin-right:20px">取消</XtxButton>
      <XtxButton @click="submit"
                 type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { ref, reactive } from 'vue'
import { addAddress, editAddress } from '@/api/order'
import Message from '@/components/lib/Message'
export default {
  name: 'AddressEdit',
  setup (props, { emit }) {
    const dialogVisible = ref(false)
    // 打开对话框函数
    const open = (address) => {
      // 先填充数据 - 编辑
      if (address.id) {
        for (const key in formData) {
          formData[key] = address[key]
        }
      } else {
        // 先清空数据 - 添加
        for (const key in formData) {
          if (key !== 'isDefault') {
            formData[key] = ''
          }
        }
      }
      dialogVisible.value = true
    }
    // 表单数据
    const formData = reactive({
      id: '',
      receiver: '',
      contact: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      postalCode: '',
      addressTags: '',
      isDefault: 0,
      fullLocation: ''
    })
    // 城市选中
    const changeCity = (result) => {
      formData.provinceCode = result.provinceCode
      formData.cityCode = result.cityCode
      formData.countyCode = result.fullLocation
      formData.fullLocation = result.fullLocation
    }
    // 提交收货地址
    const submit = () => {
      // 省略了校验
      if (formData.id) {
        // 修改请求
        editAddress(formData).then(data => {
          Message({ type: 'success', text: '修改收货地址成功' })
          dialogVisible.value = false
          emit('on-success', formData)
        })
      } else {
        // 添加请求
        addAddress(formData).then((data) => {
          formData.id = data.result.id
          Message({ type: 'success', text: '添加收货地址成功' })
          dialogVisible.value = false
          emit('on-success', formData)
        })
      }
    }
    return { dialogVisible, open, formData, changeCity, submit }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
