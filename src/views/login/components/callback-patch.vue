<template>
  <Form ref="formCom"
        class="xtx-form"
        :validation-schema="mySchema"
        v-slot="{errors}"
        autocomplete="off">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field :class="{err:errors.account}"
               v-model="form.account"
               name="account"
               class="input"
               type="text"
               placeholder="请输入用户名" />
      </div>
      <div v-if="errors.account"
           class="error">{{errors.account}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err:errors.mobile}"
               v-model="form.mobile"
               name="mobile"
               class="input"
               type="text"
               placeholder="请输入手机号" />
      </div>
      <div v-if="errors.mobile"
           class="error">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err:errors.code}"
               v-model="form.code"
               name="code"
               class="input"
               type="text"
               placeholder="请输入验证码" />
        <span @click="send"
              class="code"> {{time===0?'发送验证码':`${time}秒后发送`}}</span>
      </div>
      <div v-if="errors.code"
           class="error">{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err:errors.password}"
               v-model="form.password"
               name="password"
               class="input"
               type="password"
               placeholder="请输入密码" />
      </div>
      <div v-if="errors.password"
           class="error">{{errors.password}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err:errors.rePassword}"
               v-model="form.rePassword"
               name="rePassword"
               class="input"
               type="password"
               placeholder="请确认密码" />
      </div>
      <div v-if="errors.rePassword"
           class="error">{{errors.rePassword}}</div>
    </div>
    <a @click="submit()"
       href="javascript:;"
       class="submit">立即提交</a>
  </Form>
</template>

<script>
import { reactive, ref, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/lib/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackPatch',
  components: {
    Form, Field
  },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 1. 表单校验 多两个校验：用户名是否存在，再次输入密码是否一致
    // 2. 发送短信验证码：接口API定义
    // 3. 完善信息

    // 表单数据对象
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })
    // 校验规则对象
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }

    // 发送短信验证码
    // pause 暂停 resume 开始
    // useIntervalFn(回调函数,执行间隔,是否立即开启)
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })
    // 发送验证码
    const formCom = ref(null)
    const send = async () => {
      // 验证手机号格式,成功valid为true,失败为错误字段
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          // 没有倒计时才可以发送
          await userQQPatchCode(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }

    // 完善信息
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = await formCom.value.validate()
      console.log(valid)
      if (valid) {
        userQQPatchLogin({
          unionId: props.unionId,
          ...form
        }).then(data => {
          // 实现和之前登录一样的逻辑
          // 1. 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeLocalCart').then(() => {
            // 2. 跳转到来源页或者首页
            router.push(store.state.user.redirectUrl)
            // 3. 成功提示
            Message({ type: 'success', text: 'QQ完善信息成功' })
          })
        }).catch(e => {
          Message({ type: 'success', text: '完善信息失败' })
        })
      }
    }

    return { form, mySchema, send, time, formCom, submit }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
