<template>
  <ul>
    <li v-for="item in data.aclGroups">
      <NuxtLink :to="{ query: { group: item.name } }" :class="{ active: data.selectedGroup.uuid === item.uuid }">
        {{item.name}}<button v-if="item.deletable" @click.prevent="deleteGroup(item)">×</button>
      </NuxtLink>
    </li>
    <li v-if="data.permissions.aclgroup">
      <button @click="showCreateModal = true">+</button>
    </li>
  </ul>
  <div v-if="data.permissions.config" class="config-block">
    <Heading title="그룹 설정" :level="4" folded>
      <SeedForm method="post" action="/aclgroup/group_edit">
        <input type="hidden" name="uuid" :value="data.selectedGroup.uuid">

        <div>
          <label for="nameInput">그룹 이름:</label>
          <input id="nameInput" name="name" :value="data.selectedGroup.name">
        </div>

        <div>
          <label for="cssInput">이름 CSS:</label>
          <input id="cssInput" name="userCSS" :value="data.selectedGroup.userCSS">
        </div>

        <div>
          <label for="aclMessageInput">ACL 메시지:</label>
          <textarea id="aclMessageInput" name="aclMessage" rows="5" :value="data.selectedGroup.aclMessage"/>
        </div>

        <div>
          <input id="forBlockInput" name="forBlock" type="checkbox" value="Y" :checked="data.selectedGroup.forBlock">
          <label for="forBlockInput">사용자 문서에 차단 틀 표시</label>
        </div>

        <div>
          <input id="isWarnInput" name="isWarn" type="checkbox" value="Y" :checked="data.selectedGroup.isWarn">
          <label for="isWarnInput">경고(직접 해제 가능)</label>
        </div>

        <div>
          <input id="noSignupInput" name="noSignup" type="checkbox" value="Y" :checked="data.selectedGroup.noSignup">
          <label for="noSignupInput">계정 만들기 차단</label>
        </div>

        <div>
          <label for="accessPermsInput">보기 권한</label>
          <input id="accessPermsInput" name="accessPerms" :value="data.selectedGroup.accessPerms.join(',')">
        </div>

        <div>
          <label for="addPermsInput">추가 권한</label>
          <input id="addPermsInput" name="addPerms" :value="data.selectedGroup.addPerms.join(',')">
        </div>

        <div>
          <label for="removePermsInput">삭제 권한</label>
          <input id="removePermsInput" name="removePerms" :value="data.selectedGroup.removePerms.join(',')">
        </div>

        <div>
          <label for="deleteGroupPermsInput">그룹 삭제 권한</label>
          <input id="deleteGroupPermsInput" name="deleteGroupPerms" :value="data.selectedGroup.deleteGroupPerms.join(',')">
        </div>

        <SeedButton submit>적용</SeedButton>
        <hr>
      </SeedForm>
    </Heading>
  </div>
  <SeedForm class="add-form" method="post" action="/aclgroup">
    <input type="hidden" name="group" :value="data.selectedGroup.uuid">

    <div class="form-block">
      <select name="mode" v-model="mode">
        <option value="ip">아이피</option>
        <option value="username">사용자 이름</option>
      </select>
      <ShowError tag="mode"/>
      <input v-if="mode === 'ip'" type="text" name="ip" v-model="ip" placeholder="CIDR">
      <input v-else type="text" name="username" v-model="username" placeholder="사용자 이름">
      <ShowError :tag="mode"/>
    </div>
    <div class="form-block">
      <label for="noteInput">메모 :</label>
      <input type="text" id="noteInput" name="note">
      <ShowError tag="note"/>
    </div>
    <div class="form-block">
      <label>기간 :</label>
      <DurationSelector name="duration"/>
      <ShowError tag="duration"/>
    </div>
    <div v-if="data.permissions.hidelog" class="form-block">
      <label for="hidelogInput">hidelog :</label>
      <input type="checkbox" id="hidelogInput" name="hidelog" value="Y">
      <ShowError tag="hidelog"/>
    </div>
    <SeedButton submit>추가</SeedButton>
  </SeedForm>

  <PrevNextBtn flex v-bind="pageProps"/>

  <SeedForm class="id-input-form">
    <div class="form-block">
      <input type="hidden" name="group" :value="data.selectedGroup.name">
      <input type="text" name="from" placeholder="ID">
      <SeedButton submit>Go</SeedButton>
    </div>
  </SeedForm>

  <table>
    <colgroup>
      <col style="width:150px;">
      <col style="width:150px;">
      <col>
      <col style="width:200px;">
      <col style="width:160px;">
      <col style="width:60px;">
    </colgroup>

    <thead>
    <tr>
      <th>ID</th>
      <th>대상</th>
      <th>메모</th>
      <th>생성일</th>
      <th>만료일</th>
      <th>작업</th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="item in data.groupItems">
      <td>{{item.id}}</td>
      <td>{{item.user?.name || item.ip}}</td>
      <td>{{item.note}}</td>
      <td>
        <LocalDate :date="item.createdAt"/>
      </td>
      <td>
        <LocalDate v-if="item.expiresAt" :date="item.expiresAt"/>
        <template v-else>영구</template>
      </td>
      <td>
        <SeedButton danger @click="openRemoveModal(item)">삭제</SeedButton>
      </td>
    </tr>
    </tbody>
  </table>

  <PrevNextBtn flex v-bind="pageProps"/>

  <VueFinalModal v-model="showCreateModal" v-slot="{ close }" class="aclgroup-modal" classes="thetree-modal-container" content-class="thetree-modal-content" escToClose>
    <SeedForm :beforeSubmit="goConfirm" :afterSubmit="close" method="post" action="/aclgroup/group_add">
      <h4>ACL그룹 생성</h4>
      <div>
        <p>그룹 이름:</p>
        <input type="text" name="name">
        <ShowError tag="name"/>
      </div>
      <div class="button-block">
        <SeedButton large submit>생성</SeedButton>
        <SeedButton large type="button" @click="close">취소</SeedButton>
      </div>
    </SeedForm>
  </VueFinalModal>
  <VueFinalModal v-model="removeModal.show" v-slot="{ close }" class="aclgroup-modal" classes="thetree-modal-container" content-class="thetree-modal-content" escToClose>
    <SeedForm :afterSubmit="close" method="post" action="/aclgroup/remove">
      <input type="hidden" name="uuid" :value="removeModal.uuid">
      <input type="hidden" name="group" :value="data.selectedGroup.uuid">

      <h4>ACL 요소 제거</h4>
      <div>
        <p>ID:</p>
        <span v-text="removeModal.id"/>
      </div>
      <div>
        <p>메모:</p>
        <input type="text" name="note">
        <ShowError tag="note"/>
      </div>
      <div class="button-block">
        <SeedButton large submit>삭제</SeedButton>
        <SeedButton large type="button" @click="close">취소</SeedButton>
      </div>
    </SeedForm>
  </VueFinalModal>
</template>
<script>
import Common from '@/mixins/common'
import NuxtLink from '@/components/global/nuxtLink'
import SeedForm from '@/components/form/seedForm'
import ShowError from '@/components/showError'
import DurationSelector from '@/components/durationSelector'
import SeedButton from '@/components/seedButton'
import PrevNextBtn from '@/components/prevNextBtn'
import LocalDate from '@/components/localDate'
import Heading from '@/components/heading'

export default {
  mixins: [Common],
  components: {
    Heading,
    LocalDate,
    PrevNextBtn,
    SeedButton,
    DurationSelector,
    ShowError,
    SeedForm,
    NuxtLink
  },
  data() {
    return {
      mode: 'ip',
      ip: '',
      username: '',

      showCreateModal: false,
      removeModal: {
        show: false,
        uuid: '',
        id: 0
      }
    }
  },
  computed: {
    pageProps() {
      const prevItem = this.data.prevItem
      const nextItem = this.data.nextItem
      return {
        prev: prevItem ? { query: { name: this.data.selectedGroup.name, until: prevItem } } : null,
        next: nextItem ? { query: { naem: this.data.selectedGroup.name, from: nextItem } } : null
      }
    }
  },
  methods: {
    goConfirm() {
      return confirm('go?')
    },
    openRemoveModal(item) {
      this.removeModal.uuid = item.uuid
      this.removeModal.id = item.id
      this.removeModal.show = true
    },
    async deleteGroup(item) {
      if(!confirm(`${item.name} 그룹을 삭제하겠습니까?`)) return

      await this.internalRequestAndProcess('/aclgroup/group_remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          uuid: item.uuid
        }).toString()
      })
    }
  }
}
</script>
<style scoped>
ul {
  border-bottom: 1px solid #ddd;
  height: 36px;
  list-style: none;
  margin-bottom: 0;
  margin-top: 0;
  padding-left: 0;
}

ul:after, ul:before {
  content: " ";
  display: table;
}

li {
  float: left;
  margin-bottom: -1px;
}

li+li {
  margin-left: .2rem;
}

li>a, li>button {
  border: 1px solid;
  border-color: #ddd #ddd transparent;
  border-radius: .25rem .25rem 0 0;
  display: block;
  padding: .5em 1em;
}

li>a,li>a>button, li>button {
  background: none;
  cursor: pointer;
  font-size: .9rem;
}

li>a>button {
  border: none;
  display: inline-block;
}

li>a:hover {
  text-decoration: none!important
}

li>a.active, li>button.active {
  background-color: #fff;
  color: #55595c;
}

.theseed-dark-mode ul {
  border-bottom: 1px solid #383b40;
}

.theseed-dark-mode li>a,.theseed-dark-mode li>button {
  border-color: #383b40 #383b40 transparent;
  color: #ddd;
}

.theseed-dark-mode li>a>button {
  color: #ddd;
}

.theseed-dark-mode li>a.active, .theseed-dark-mode li>button.active {
  background-color: #27292d;
}

table {
  background-color: transparent;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 1rem;
  max-width: 100%;
  width: 100%;
}

table td, table th {
  border-top: 1px solid #eceeef;
  line-height: 1.5;
  padding: .5rem .7rem;
}

table tr:last-of-type td {
  border-bottom: 1px solid #eceeef;
}

table th {
  border-bottom: 2px solid #eceeef;
  text-align: left;
  vertical-align: bottom;
}

div.form-block, label {
  margin-bottom: 15px;
  vertical-align: middle;
}

input, select {
  background-color: #fff;
  background-image: none;
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  display: inline-block;
  font-size: .9rem;
  line-height: 1.5;
  margin: 0 0 0 .7rem;
  padding: .25rem .5rem;
}

form.add-form input[type=text] {
  width: 50%;
}

.theseed-dark-mode input, .theseed-dark-mode select {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
}

form.add-form {
  border-bottom: 1px solid #ccc;
  clear: both;
  margin-bottom: 1rem;
  margin-top: 1em;
  padding-bottom: 1rem;
}

form.id-input-form {
  float: right;
}

div.aclgroup-modal form {
  box-sizing: border-box;
  flex: 1 0 auto;
  font-size: 14px;
  padding: 15px;
  width: 100%
}

div.aclgroup-modal form div p {
  margin-bottom: 0
}

div.aclgroup-modal form h4 {
  font-weight: 600;
  margin: 0;
  padding: 0;
}

div.aclgroup-modal form input {
  margin: 0;
}

div.aclgroup-modal form input:not([type=checkbox]) {
  width: 100%;
}

div.aclgroup-modal form div.button-block {
  float: right;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

div.config-block {
  clear: both;
}
</style>