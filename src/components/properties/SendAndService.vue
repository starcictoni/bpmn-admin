<template>
  <div v-if="this.data">
    <v-list>
      <div v-if="generalInfo !== null">
        <v-card
          elevation="3"
          tile
          outlined
          style="padding-bottom: 3%; margin-bottom: 2%"
        >
          <v-card-subtitle> GENERAL INFO </v-card-subtitle>
          <v-card elevation="0" tile outlined style="margin: 0px 20px -1% 20px">
            <!-- <draggable v-model="properties" draggable=".v-list-item" v-bind="{ animation: 200 }"> -->
            <v-list-item>
              <v-list-item-action>
                <v-icon>{{ getIconFor() }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-subtitle>NAME</v-list-item-subtitle>
                <v-list-item-title>{{ generalInfo.name }}</v-list-item-title>
                <v-list-item-subtitle>ID</v-list-item-subtitle>
                <v-list-item-title>{{ generalInfo.id }} </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <!-- </draggable> -->
          </v-card>
        </v-card>
      </div>

      <div v-if="properties !== null">
        <v-card
          elevation="3"
          tile
          outlined
          style="padding-bottom: 3%; margin-bottom: 2%"
        >
          <v-card-subtitle> PROPERTIES </v-card-subtitle>
          <!-- A bit bigger font -->
          <v-list v-for="v in properties" :key="v.id">
            <v-card
              elevation="0"
              tile
              outlined
              style="margin: 0px 20px -1% 20px"
            >
              <draggable
                v-model="properties"
                draggable=".v-list-item"
                v-bind="{ animation: 200 }"
              >
                <v-list-item>
                  <v-list-item-action>
                    <v-icon>{{ getIconFor(v.type) }}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-subtitle>Name</v-list-item-subtitle>
                    <v-list-item-title v-text="v.name"></v-list-item-title>
                    <!-- <v-list-item-title v-text="v.type"></v-list-item-title>
                                                <v-list-item-subtitle>Type</v-list-item-subtitle> -->
                    <v-list-item-subtitle>Value</v-list-item-subtitle>
                    <v-list-item-title v-text="v.value"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon>
                      <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </draggable>
            </v-card>
          </v-list>
        </v-card>
      </div>

      <div v-if="inputAndOutput !== null">
        <!-- <draggable v-model="inputAndOutput" draggable=".v-list-item" v-bind="{ animation: 200 }"> -->
        <v-card
          elevation="3"
          tile
          outlined
          style="padding-bottom: 3%; margin-bottom: 2%"
        >
          <v-card-subtitle> INPUT&OUTPUT </v-card-subtitle>
          <v-list v-for="v in inputAndOutput" :key="v.id">
            <v-card
              elevation="0"
              tile
              outlined
              style="margin: 0px 20px -1% 20px"
            >
              <draggable
                v-model="inputAndOutput"
                draggable=".v-list-item"
                v-bind="{ animation: 200 }"
              >
                <v-list-item>
                  <v-list-item-action>
                    <v-icon>{{ getIconFor(v.type) }}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-subtitle>Name</v-list-item-subtitle>
                    <v-list-item-title v-text="v.name"></v-list-item-title>
                    <!-- <v-list-item-title v-text="v.type"></v-list-item-title>
                                                <v-list-item-subtitle>Type</v-list-item-subtitle> -->
                    <v-list-item-subtitle>Body</v-list-item-subtitle>
                    <v-list-item-title v-text="v.body"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon>
                      <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </draggable>
            </v-card>
          </v-list>
        </v-card>
        <!-- </draggable> -->
      </div>
      <div v-if="connectorId !== null">
        <v-card
          elevation="3"
          tile
          outlined
          style="padding-bottom: 3%; margin-bottom: 2%"
        >
          <v-card-subtitle> CONNECTOR ID </v-card-subtitle>
          <v-list v-for="v in connectorId" :key="v.id">
            <v-card
              elevation="0"
              tile
              outlined
              style="margin: 0px 20px -1% 20px"
            >
              <!-- <draggable v-model="connectorId" draggable=".v-list-item" v-bind="{ animation: 200 }"> -->
              <v-list-item>
                <v-list-item-action>
                  <v-icon>{{ getIconFor(v.type) }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <!-- <v-list-item-title v-text="v.type"></v-list-item-title>
                                                <v-list-item-subtitle>Type</v-list-item-subtitle> -->
                  <v-list-item-subtitle>Body</v-list-item-subtitle>
                  <v-list-item-title v-text="v.body"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon>
                    <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <!-- </draggable>  -->
            </v-card>
          </v-list>
        </v-card>
      </div>

      <div v-if="connectorParams !== null">
        <v-card
          elevation="3"
          tile
          outlined
          style="padding-bottom: 3%; margin-bottom: 2%"
        >
          <v-card-subtitle> CONNECTOR PARAMETERS </v-card-subtitle>
          <v-list v-for="v in connectorParams" :key="v.id">
            <v-card
              elevation="0"
              tile
              outlined
              style="margin: 0px 20px -1% 20px"
            >
              <draggable
                v-model="connectorId"
                draggable=".v-list-item"
                v-bind="{ animation: 200 }"
              >
                <v-list-item>
                  <v-list-item-action>
                    <v-icon>{{ getIconFor(v.type) }}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title v-text="v.name"></v-list-item-title>
                    <v-list-item-subtitle>Name</v-list-item-subtitle>
                    <!-- <v-list-item-title v-text="v.type"></v-list-item-title>
                                                <v-list-item-subtitle>Type</v-list-item-subtitle> -->
                    <v-list-item-title v-text="v.body"></v-list-item-title>
                    <v-list-item-subtitle>Body</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon>
                      <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </draggable>
            </v-card>
          </v-list>
        </v-card>
      </div>
    </v-list>
    
    <v-btn color="grey darken-4" tile text @click="add()"> ADD NEW </v-btn>
    <v-btn v-if="changed" color="darken-1" text @click="setState()">
      CANCEL
    </v-btn>
    <v-btn v-if="changed" color="blue darken-1" text @click="save()">
      APPLY
    </v-btn>

    <v-dialog v-model="dialogShown1" max-width="600">
      <new-form-item
        @send-results="save"
        :data1="newFormItem"
        @close="dialogShown1 = false"
        :context1="context"
      ></new-form-item>
    </v-dialog>

    <v-dialog v-model="dialogShown" max-width="600">
      <form-item
        :data="formItem"
        @close="dialogShown = false"
        :context="context"
      ></form-item>
    </v-dialog>
  </div>
</template>
<script>
import { FormItemMetaModel, BpmnXml } from "@/utils/bpmn";
import draggable from "vuedraggable";

export default {
  name: "properties-sendAndService",
  props: ["data", "context", "data1", "context1"],
  components: {
    draggable,
    formItem: () => import("@/components/properties/FormItem.vue"),
    newFormItem: () => import("@/components/properties/NewFormItem.vue"),
  },
  created() {
    this.setState();
  },
  data() {
    let modeler = this.context.modeler;
    return {
      modeler,
      selectedItem: null,
      dialogShown: false,
      dialogShown1: false,
      formItem: null,
      newFormItem: null,
      cs: modeler.get("commandStack"),
      state: [],
      generalInfo: null,
      properties: null,
      inputAndOutput: null,
      connectorId: null,
      connectorParams: null,
    };
  },
  watch: {
    data() {
      this.setState();
    },
  },
  computed: {
    changed() {
      // let state = this.state.reduce((a, x) => a + ';' + x.id, '');
      // let data = this.data.formData.$children.reduce((a, x) => a + ';' + x.id, '');
      // return state != data;
      return false;
    },
  },
  methods: {
    getIconFor(type) {
      if (type === undefined) type = "camunda:property";
      return FormItemMetaModel[type].icon;
    },
    log(message) {
      console.log(message);
    },
    setState() {
      //Temporary, generalize
      this.state = BpmnXml.getAllExtensionsForSendOrServiceTask(this.data.bpmn);
      let general = this.state.find((x) => Object.keys(x) == "General");
      if (general !== undefined) this.generalInfo = Object.values(general)[0];

      let props = this.state.find((x) => Object.keys(x) == "Props");
      // debugger;
      if (props !== undefined) this.properties = Object.values(props)[0];

      let io = this.state.find((x) => Object.keys(x) == "IO");
      if (io !== undefined) this.inputAndOutput = Object.values(io)[0];
      debugger;
      let connId = this.state.find((x) => Object.keys(x) == "ConnID");
      if (connId !== undefined) this.connectorId = Object.values(connId)[0];

      let connParams = this.state.find((x) => Object.keys(x) == "ConnParams");
      if (connParams !== undefined)
        this.connectorParams = Object.values(connParams)[0];

      // debugger;
    },
    add() {
      this.newFormItem = {
        id: null,
        label: null,
        type: null,
        validation: null,
      };
      this.dialogShown1 = true;
    },

    open(formItem) {
      debugger;
      this.formItem = formItem;
      this.dialogShown = true;
    },
    save() {
      debugger;
      let temp = {};
      if (this.newFormItem != null) {
        if (this.newFormItem.validation == null) {
          this.newFormItem.validation = false;
        }
        temp = {
          $bpmn: this.newFormItem,
          id: this.newFormItem.id,
          label: this.newFormItem.label,
          type: this.newFormItem.type,
          icon: this.getIconFor(this.newFormItem.type),
          validation: {
            required: this.newFormItem.validation,
          },
        };
        this.state.push(temp);
      }
      let values = this.state.map((x) => x.$bpmn);

      let cs = this.modeler.get("commandStack");
      cs.execute("bpmn-list-update", {
        element: this.context.bpmnElement,
        currentObject: this.data.formData,
        propertyName: "$children",
        updatedObjectList: values,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.sortable-chosen {
  border: 1px solid gray !important;
}
.sortable-ghost {
  opacity: 0.2;
  background: #c8ebfb;
  text-shadow: 0 0 8px #000;
}
.v-list-item {
  cursor: move;
  border: 1px solid transparent;
}
</style>
