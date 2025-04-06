<template>
  <el-dialog v-model="localVisible" title="发布系统通知" width="50%">
    <el-form :model="form" label-width="80px">
      <el-form-item label="通知标题" required>
        <el-input v-model="form.title" placeholder="请输入通知标题" />
      </el-form-item>
      <el-form-item label="通知内容" required>
        <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请输入通知内容" />
      </el-form-item>
      <el-form-item label="通知类型">
        <el-select v-model="form.type" placeholder="请选择通知类型">
          <el-option label="普通通知" value="primary" />
          <el-option label="重要通知" value="warning" />
          <el-option label="紧急通知" value="danger" />
          <el-option label="成功通知" value="success" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布范围">
        <el-checkbox-group v-model="form.scope">
          <el-checkbox label="学生">学生</el-checkbox>
          <el-checkbox label="教师">教师</el-checkbox>
          <el-checkbox label="管理员">管理员</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handlePublish">发布</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";

interface NoticeForm {
  title: string;
  content: string;
  type: string;
  scope: string[];
}

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "publish", notice: { content: string; time: string; type: string; publisher: string }): void;
}>();

// 本地状态
const localVisible = ref(props.visible);
const form = ref<NoticeForm>({
  title: "",
  content: "",
  type: "primary",
  scope: ["学生", "教师"]
});

// 监听props变化
watch(
  () => props.visible,
  newVal => {
    localVisible.value = newVal;
  }
);

// 监听本地状态变化
watch(localVisible, newVal => {
  emit("update:visible", newVal);
});

// 处理取消按钮
const handleCancel = () => {
  localVisible.value = false;
  resetForm();
};

// 处理发布按钮
const handlePublish = () => {
  if (!form.value.title || !form.value.content) {
    ElMessage.warning("请填写完整的通知信息");
    return;
  }

  // 创建通知对象
  const newNotice = {
    content: form.value.title,
    time: new Date().toLocaleString(),
    type: form.value.type,
    publisher: "系统管理员"
  };

  // 发送发布事件
  emit("publish", newNotice);

  // 重置表单并关闭对话框
  localVisible.value = false;
  resetForm();

  ElMessage.success("通知发布成功");
};

// 重置表单
const resetForm = () => {
  form.value = {
    title: "",
    content: "",
    type: "primary",
    scope: ["学生", "教师"]
  };
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
