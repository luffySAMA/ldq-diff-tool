<template>
  <div id="floder-area" class="area">
    <div>
      <button id="open-file-button" class="button" @click="openFolder">打开文件夹</button>
      <button id="rename-button" class="button" @click="rename">重命名</button>
    </div>

    <div id="selected-dir">
      <span v-if="selectedDir">当前文件夹： {{ selectedDir }} </span>
    </div>
    <table id="folder-data-table" class="data-table" v-if="folderList.length > 0">
      <tr>
        <th>行号</th>
        <th>文件夹</th>
        <th>数字编号</th>
        <th>名字</th>
      </tr>
      <tr v-for="(folder, index) in folderList" :class="{highlight: folder.isHighlight}">
        <td>{{index+1}}</td>
        <td>{{folder.fileName}}</td>
        <td>{{folder.number}}</td>
        <td>{{folder.name}}</td>
      </tr>
    </table>
  </div>
</template>

<script>

const { ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')

export default {
  name: 'folder-page',
  data () {
    return {
      selectedDir: '',
      folderList: []
    }
  },
  created: function () {
    ipcRenderer.on('selected-directory', (event, path) => {
      if (typeof path === 'string') {
        this.selectedDir = path
        fs.readdir(path, (err, folderList) => {
          if (!err) {
            this.folderList = folderList.map(folder => {
              return { fileName: folder, number: this.parseNumber(folder), name: this.parseName(folder), isHighlight: false }
            })
            this.$emit('changed', this.folderList)
          }
        })
      }
    })
  },
  methods: {
    openFolder: function () {
      ipcRenderer.send('open-dir-dialog')
    },

    parseNumber: function (folder) {
      let result = /.*?([1-9]\d*)(.*)/.exec(folder)
      return (result && result.length > 1) ? Number(result[1]) : ''
    },

    parseName: function (folder) {
      let result = /.*?([1-9]\d*)(.*)/.exec(folder)
      return (result && result.length > 2) ? result[2] : ''
    },

    rename: function () {
      this.folderList.forEach(folder => {
        fs.rename(path.join(this.selectedDir, folder.fileName), path.join(this.selectedDir, folder.number + ''), (err) => {
          if (err) {
            console.error(err)
          }
        })
      })
    },
    setHighlight: function (indexs) {
      this.folderList.forEach((folder, index) => {
        if (Array.prototype.includes.call(indexs, index)) {
          folder.isHighlight = true
        } else {
          folder.isHighlight = false
        }
      })
    }
  }
}
</script>

<style scoped>
#selected-dir {
  margin-top: 20px;
  height: 30px;
}

.highlight {
  background: darkseagreen;
}
</style>