<template>
  <div id="wrapper">
    <main>
      <div class="left-side">
        <excel-area v-on:changed="dataChanged($event)"></excel-area>
      </div>

      <div class="right-side">
        <folder-area v-on:changed="folderChanged($event)"></folder-area>
      </div>
    </main>
  </div>
</template>

<script>
import FolderArea from './home-page/folder-area'
import ExcelArea from './home-page/excel-area'

export default {
  name: 'home-page',
  components: { FolderArea, ExcelArea },
  data: function () {
    return {
      folderList: [],
      dataList: []
    }
  },
  methods: {
    folderChanged: function (folderList) {
      this.folderList = folderList
      this.compare()
    },

    dataChanged: function (dataList) {
      this.dataList = dataList
      this.compare()
    },

    compare: function () {
      this.folderList.sort((a, b) => a.number - b.number)
      this.dataList.sort((a, b) => a.number - b.number)
      const folderListHighlight = []
      const dataListHighlight = []

      let folderIndex = 0
      let dataIndex = 0

      while (folderIndex < this.folderList.length) {
        while (dataIndex < this.dataList.length) {
          let folder = this.folderList[folderIndex]
          let data = this.dataList[dataIndex]
          if (folder.number === data.number) {
            folder.isHighlight = false
            data.isHighlight = false
            folderIndex++
            dataIndex++
          } else if (folder.number < data.number) {
            folder.isHighlight = true
            folderListHighlight.push(folderIndex)
            folderIndex++
          } else if (folder.number > data.number) {
            data.isHighlight = true
            dataListHighlight.push(dataIndex)
            dataIndex++
          }
        }
      }
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}

#wrapper {
  background: radial-gradient(ellipse at top left, rgba(255, 255, 255, 1) 40%, rgba(229, 229, 229, 0.9) 100%);
  padding: 60px 80px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.area {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.button {
  width: 160px;
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.data-table {
  margin-top: 40px;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 5px 10px;
  height: 40px;
  min-width: 100px;
  border: 1px solid #ddd;
}
</style>