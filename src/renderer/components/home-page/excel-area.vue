<template>
  <div class="area">
    <button class="button" @click="openExcel">打开 Excel</button>

    <div id="selected-excel">
      <span v-if="selectedExcel">当前 Excel： {{ selectedExcel }} </span>
    </div>
    <table id="excel-data-table" class="data-table" v-if="dataList.length > 0">
      <tr>
        <th>行号</th>
        <th>编号</th>
        <th>数字编号</th>
        <th>姓名</th>
      </tr>
      <tr v-for="(data, index) in dataList" :class="{highlight: data.isHighlight}">
        <td>{{index+1}}</td>
        <td>{{data.code}}</td>
        <td>{{data.number}}</td>
        <td>{{data.name}}</td>
      </tr>
    </table>
  </div>
</template>

<script>

const { ipcRenderer } = require('electron')
const xlsx = require('node-xlsx')

export default {
  name: 'excel-page',
  data () {
    return {
      selectedExcel: '',
      dataList: []
    }
  },
  created: function () {
    ipcRenderer.on('selected-file', (event, path) => {
      if (typeof path === 'string') {
        this.selectedExcel = path
        const sheet = xlsx.parse(path)[0]
        this.dataList = []
        sheet.data.forEach((row, index) => {
          if (index >= 3 && row !== undefined && row.length > 0) {
            let number = this.parseNumber(row[0])
            if (number !== '') {
              let data = { code: row[0], number: number, name: row[1], isHighlight: false }
              this.dataList.push(data)
            }
          }
        })
        this.$emit('changed', this.dataList)
      }
    })
  },
  methods: {
    openExcel: function () {
      ipcRenderer.send('open-file-dialog')
    },

    parseNumber: function (name) {
      let result = /.*?([1-9]\d*).*/.exec(name)
      return (result && result.length > 1) ? Number(result[1]) : ''
    },

    setHighlight: function (indexs) {
      this.dataList.forEach((data, index) => {
        if (Array.prototype.includes.call(indexs, index)) {
          data.isHighlight = true
        } else {
          data.isHighlight = false
        }
      })
    }
  }
}
</script>

<style scoped>
#selected-excel {
  margin-top: 20px;
  height: 30px;
}
.highlight {
  background: tomato;
}
</style>