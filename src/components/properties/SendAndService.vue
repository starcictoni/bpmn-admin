<template>
  <div v-if="this.data">
    <v-list>
      <div v-if="generalInfo !== null">
        <v-card elevation="3" tile outlined class="cardOutter">
          <v-card-subtitle> GENERAL INFO </v-card-subtitle>
          <v-card elevation="0" tile outlined class="cardInner">
            <v-list-item>
              <v-list-item-action>
                <v-icon>{{ getIconFor() }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-subtitle>Name</v-list-item-subtitle>
                <v-list-item-title>{{ generalInfo.name }}</v-list-item-title>
                <v-list-item-subtitle>Id</v-list-item-subtitle>
                <v-list-item-title>{{ generalInfo.id }} </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click.stop="editExistingItem(generalInfo)">
                  <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-card>
        </v-card>
      </div>

      <div v-if="connectorId !== null">
        <v-card elevation="3" tile outlined class="cardOutter">
          <v-card-subtitle> CONNECTOR ID </v-card-subtitle>
          <v-list v-for="v in connectorId" :key="v.body">
            <v-card elevation="0" tile outlined class="cardInner">
              <v-list-item>
                <v-list-item-action>
                  <v-icon>{{ getIconFor(v.type) }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-subtitle>Body</v-list-item-subtitle>
                  <v-list-item-title v-text="v.body"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click.stop="editExistingItem(v)">
                    <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-card>
          </v-list>
        </v-card>
      </div>

      <div v-if="connectorParams !== null">
        <v-card elevation="3" tile outlined class="cardOutter">
          <v-card-subtitle> CONNECTOR PARAMETERS </v-card-subtitle>
          <v-list v-for="v in connectorParams" :key="v.name">
            <v-card elevation="0" tile outlined class="cardInner">
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
                    <v-list-item-title v-text="v.body"></v-list-item-title>
                    <v-list-item-subtitle>Body</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click.stop="editExistingItem(v)">
                      <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </draggable>
            </v-card>
          </v-list>
          <v-btn
            class="buttonAddNew"
            color="grey darken-4"
            tile
            outlined
            text
            @click="addNewItem()"
          >
            ADD NEW
          </v-btn>
        </v-card>
      </div>

      <div v-if="properties !== null">
        <v-card elevation="3" tile outlined class="cardOutter">
          <v-card-subtitle> PROPERTIES </v-card-subtitle>
          <v-list v-for="v in properties" :key="v.id">
            <v-card elevation="0" tile outlined class="cardInner">
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
                    <v-list-item-subtitle>Value</v-list-item-subtitle>
                    <v-list-item-title v-text="v.value"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click.stop="editExistingItem(v)">
                      <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </draggable>
            </v-card>
          </v-list>
          <v-btn
            class="buttonAddNew"
            color="grey darken-4"
            tile
            outlined
            text
            @click="add()"
          >
            ADD NEW
          </v-btn>
        </v-card>
      </div>

      <div v-if="inputAndOutput !== null">
        <v-card elevation="3" tile outlined class="cardOutter">
          <v-card-subtitle> INPUT&OUTPUT </v-card-subtitle>
          <v-list v-for="v in inputAndOutput" :key="v.name">
            <v-card elevation="0" tile outlined class="cardInner">
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
                    <v-list-item-subtitle>Body</v-list-item-subtitle>
                    <v-list-item-title v-text="v.body"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click.stop="editExistingItem(v)">
                      <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </draggable>
            </v-card>
          </v-list>
          <v-btn
            class="buttonAddNew"
            color="grey darken-4"
            tile
            outlined
            text
            @click="add()"
          >
            ADD NEW
          </v-btn>
        </v-card>
      </div>
    </v-list>
    <v-btn v-if="changed" color="darken-1" text @click="setState()">
      CANCEL
    </v-btn>
    <v-btn v-if="changed" color="blue darken-1" text @click="save()">
      APPLY
    </v-btn>

    <!-- New -->
    <v-dialog v-model="dialogShown1" max-width="600">
      <formItem
        @send-results="save"
        @close="dialogShown1 = false"
        :data="childData"
        :context="context"
      ></formItem>
    </v-dialog>

    <!-- Edit  -->
    <v-dialog v-model="dialogShown" max-width="600">
      <formItem
        :dataTwo="childData"
        @Close="close()"
        :contextTwo="context"
        :key="componentKey"
      ></formItem>
    </v-dialog>
  </div>
</template>

<script>
import { SendAndServiceItemMetaModel, BpmnXml } from "@/utils/bpmn";
import draggable from "vuedraggable";

export default {
  name: "properties-sendAndService",
  props: ["data", "context", "data1", "context1"],
  components: {
    draggable,
    formItem: () => import("@/components/properties/FormItem.vue"),
  },
  created() {
    this.setState();
  },
  data() {
    let modeler = this.context.modeler;
    return {
      componentKey: 0,
      modeler,
      selectedItem: null,
      dialogShown: false,
      dialogShown1: false,
      childData: null,
      oldFormData: null,
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
      debugger;
      this.forceRenderer()
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
    forceRenderer() {
      this.componentKey += 1;
    },
    close() {
      debugger;
      //this.childData = {... this.oldFormData };
      this.dialogShown = false;
    },
    // close() {
    //   this.dialogShown = false;
    //   this.formData = false;
    // },
    getIconFor(type) {
      if (type === undefined) type = "camunda:property";
      return SendAndServiceItemMetaModel[type].icon;
    },
    log(message) {
      console.log(message);
    },
    setState() {
      //Temporary, generalize
      debugger;
      this.state = BpmnXml.getAllExtensionsForSendOrServiceTask(this.data.bpmn);
      let general = this.state.find((x) => Object.keys(x) == "General");
      if (general !== undefined) this.generalInfo = Object.values(general)[0];

      let props = this.state.find((x) => Object.keys(x) == "Props");

      if (props !== undefined) this.properties = Object.values(props)[0];

      let io = this.state.find((x) => Object.keys(x) == "IO");
      if (io !== undefined) this.inputAndOutput = Object.values(io)[0];
      // debugger;
      let connId = this.state.find((x) => Object.keys(x) == "ConnID");
      if (connId !== undefined) this.connectorId = Object.values(connId)[0];

      let connParams = this.state.find((x) => Object.keys(x) == "ConnParams");
      if (connParams !== undefined)
        this.connectorParams = Object.values(connParams)[0];
    },
    addNewItem() {
      this.formData = {
        id: null,
        label: null,
        type: null,
        validation: null,
      };
      this.dialogShown1 = true;
    },

    editExistingItem(bpmnObject) {
      debugger;
      this.forceRenderer();
      //this.oldFormData = { ...bpmnObject };
      this.childData = { ...bpmnObject };
      this.dialogShown = true;
    },
    save() {
      debugger;
      let temp = {};
      if (this.childData != null) {
        if (this.childData.validation == null) {
          this.childData.validation = false;
        }
        temp = {
          $bpmn: this.childData,
          id: this.childData.id,
          label: this.childData.label,
          type: this.childData.type,
          icon: this.getIconFor(this.forchildDataData.type),
          validation: {
            required: this.childData.validation,
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
.v-card__subtitle,
.v-card__text {
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.375rem;
  letter-spacing: 0.0071428571em;
  margin-left: 0.5%;
}

.buttonAddNew {
  margin: 1% 0% 0% calc(2% - 1px);
}

.cardInner {
  margin: 0% 2% 0% 2%;
}

.cardOutter {
  padding-bottom: 2%;
  margin-bottom: 2%;
}

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
