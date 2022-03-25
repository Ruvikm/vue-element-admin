<template>
  <el-select v-model="value" placeholder="请选择" @focus="getChoiceList">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.typeName"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>


<script>
import { getExChoiceListApi } from "@/api/expense";
export default {
  data() {
    return {
      options: [],
      value: "",
    };
  },
  methods:{
    async getChoiceList(){
       let res = await getExChoiceListApi(this.parms);
      if (res && res.code == 200) {
        console.log(res.data);
        this.options = res.data;
      }
    }
  }
};
</script>