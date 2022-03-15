<template>
  <div v-if="this.data">
    <div v-if="general">
      <v-card elevation="3" tile outlined class="cardOutter">
        <v-card-subtitle> GENERAL INFO </v-card-subtitle>
        <v-card elevation="0" tile outlined class="cardInner">
          <v-list-item>
            <v-list-item-action>
              <v-icon>{{ getIconFor() }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-subtitle>Name</v-list-item-subtitle>
              <v-list-item-title>{{ general.name }}</v-list-item-title>
              <v-list-item-subtitle>Id</v-list-item-subtitle>
              <v-list-item-title>{{ general.id }} </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click.stop="openEditItem(general.$bpmn)">
                <v-icon color="grey lighten-1">mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </v-card>
    </div>

    <div v-if="docs">
      <v-card elevation="3" tile outlined class="cardOutter">
        <v-card-subtitle> DOCUMENTATION </v-card-subtitle>
        <v-card elevation="0" tile outlined class="cardInner">
          <v-list-item>
            <v-list-item-action>
              <v-icon>{{ getIconFor() }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-subtitle>Text</v-list-item-subtitle>
              <v-list-item-title>{{ docs.text }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click.stop="openEditItem(docs.$bpmn)">
                <v-icon color="grey lighten-1">mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </v-card>
    </div>

    <div v-if="newImprovedFormData">
      <div v-for="(v, index) in newImprovedFormData" :key="index">
        <div v-if="v.fieldGeneral != null">
          <v-card elevation="3" tile outlined class="cardOutter">
            <v-card-subtitle> USER FORM FIELD </v-card-subtitle>
            <v-card elevation="0" tile outlined class="cardInner">
              <v-card elevation="0" tile class="cardOutterForm">
                <v-card-subtitle> FORM INFO </v-card-subtitle>
                <v-card elevation="0" tile outlined class="cardInner">
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon>{{ getIconFor(v.fieldGeneral.type) }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-subtitle>ID</v-list-item-subtitle>
                      <v-list-item-title>{{
                        v.fieldGeneral.id
                      }}</v-list-item-title>
                      <v-list-item-subtitle>LABEL</v-list-item-subtitle>
                      <v-list-item-title>{{
                        v.fieldGeneral.label
                      }}</v-list-item-title>
                      <v-list-item-subtitle>TYPE</v-list-item-subtitle>
                      <v-list-item-title>{{
                        v.fieldGeneral.$type
                      }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn
                        icon
                        @click.stop="openEditItem(v.fieldGeneral.$bpmn)"
                      >
                        <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-card>
                <v-btn
                  class="buttonAddNew"
                  color="grey darken-4"
                  tile
                  outlined
                  text
                  @click="addNewItem(v.fieldGeneral)"
                >
                  ADD NEW</v-btn
                >
              </v-card>

              <div v-if="v.fieldProperties">
                <v-card elevation="0" tile class="cardOutterForm">
                  <v-card-subtitle> PROPERTIES </v-card-subtitle>
                  <v-card elevation="0" tile outlined class="cardInner">
                    <v-list-item>
                      <v-list-item-action>
                        <v-icon>{{
                          getIconFor(v.fieldProperties.type)
                        }}</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-subtitle>ID</v-list-item-subtitle>
                        <v-list-item-title>{{
                          v.fieldProperties.id
                        }}</v-list-item-title>
                        <v-list-item-subtitle>VALUE</v-list-item-subtitle>
                        <v-list-item-title>{{
                          v.fieldProperties.value
                        }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn
                          icon
                          @click.stop="
                            openEditItem(v.fieldProperties.$bpmn)
                          "
                        >
                          <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-card>
                  <v-btn
                    class="buttonAddNew"
                    color="grey darken-4"
                    tile
                    outlined
                    text
                    @click="addNewItem(v.fieldProperties)"
                  >
                    ADD NEW</v-btn
                  >
                </v-card>
              </div>

              <div v-if="v.fieldValidation">
                <v-card elevation="0" tile class="cardOutterForm">
                  <v-card-subtitle> VALIDATION </v-card-subtitle>
                  <v-card elevation="0" tile outlined class="cardInner">
                    <div
                      v-for="(x, idx) in v.fieldValidation.fieldConstraints"
                      :key="idx"
                    >
                      <v-list-item>
                        <v-list-item-action>
                          <v-icon>{{ getIconFor(x.constraintType) }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-subtitle>NAME</v-list-item-subtitle>
                          <v-list-item-title>{{ x.name }}</v-list-item-title>
                          <v-list-item-subtitle>CONFIG</v-list-item-subtitle>
                          <v-list-item-title>{{ x.config }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn icon @click.stop="openEditItem(x.$bpmn)">
                            <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </div>
                  </v-card>
                  <v-btn
                    class="buttonAddNew"
                    :right="true"
                    color="grey darken-4"
                    tile
                    outlined
                    text
                    @click="addNewItem(v.fieldValidation)"
                  >
                    ADD NEW</v-btn
                  >
                </v-card>
              </div>

            </v-card>
          </v-card>
        </div>
      </div>
    </div>

    <v-dialog v-model="dialogNew" max-width="600">
      <newFormItem
        :dataNew="dialogData"
        :contextNew="context"
        :typeNew="businessTypeObject"
        :key="newComponentKey"
        @save="save()"
        @close="closeNewItem()"
      ></newFormItem>
    </v-dialog>

    <v-dialog v-model="dialogEdit" max-width="600">
      <editFormItem
        :dataEdit="dialogData"
        :contextEdit="context"
        :key="editComponentKey"
        @save="save()"
        @close="closeEditItem()"
      ></editFormItem>
    </v-dialog>
  </div>
</template>
<script>
import { FormItemMetaModel, BpmnXml } from "@/utils/bpmn";
//import draggable from "vuedraggable";

export default {
  name: "properties-form",
  props: ["data", "context"],// "data1", "context1"],
  components: {
    //draggable,
    editFormItem: () => import("@/components/properties/EditFormItem.vue"),
    newFormItem: () => import("@/components/properties/NewFormItem.vue"),
  },
  created() {
    this.setState();
  },
  data() {
    let modeler = this.context.modeler;
    return {
      componentStateId: 0,
      newComponentKey: 0,
      editComponentKey: 0,
      modeler,
      selectedItem: null,
      dialogEdit: false,
      dialogNew: false,
      dialogData: null,
      businessTypeObject: null, 
      cs: modeler.get("commandStack"),
      state: [],
      general: null,
      docs: null,
      newImprovedFormData: null, //not old formData
    };
  },
  watch: {
    data() {
      this.setState();
    },
  },
  computed: {
    changed() {
      //let state = this.state.reduce((a, x) => a + ';' + x.id, '');
      //let data = this.data.formData.$children.reduce((a, x) => a + ';' + x.id, '');
      return false; //state != data;
    },
  },
  methods: {
    forceNewRenderer() {
      this.newComponentKey += 1;
    },
    forceEditRenderer() {
      this.editComponentKey += 1;
    },
    closeNewItem() {
      debugger;
      this.dialogNew = false;
    },
    closeEditItem() {
      this.dialogEdit = false;
    },
    openEditItem(bpmnObject) {
      this.forceEditRenderer();
      this.dialogData = { ...bpmnObject };
      this.dialogEdit = true;
    },
    addNewItem(bpmnObject) {
      debugger;
      this.forceNewRenderer()
      console.log(bpmnObject)
      this.businessTypeObject = bpmnObject.$bpmn.$type;
      console.log(this.businessTypeObject)
      this.dialogNew = true;
    },
    setState() {
      this.state = BpmnXml.getData(this.data.bpmn)
      //UserTask
      this.state = BpmnXml.getAllExtensionsForUserTask(this.data.bpmn);

      let general = this.state.find((x) => Object.keys(x) == "General");
      if (general !== undefined) {
        this.general = Object.values(general)[0];
      }

      let documentation = this.state.find((x) => Object.keys(x) == "Docs");
      if (documentation !== undefined) {
        this.docs = Object.values(documentation)[0];
      }

      let newFormData = this.state.find((x) => Object.keys(x) == "FormData");
      if (newFormData !== undefined) {
        this.newImprovedFormData = Object.values(newFormData)[0].data;
      }

      // if (this.data.formData.$type == "camunda:formData") {
      //     for (let formItem of this.data.formData.$children) {
      //         let field = {
      //             $bpmn: formItem,
      //             id: formItem.id,
      //             label: formItem.label,
      //             type: formItem.type,
      //             validation: {
      //                 required: false,
      //             },
      //         };
      //         if (formItem.$children) {
      //             for (let child of formItem.$children) {
      //                 switch (child.$type) {
      //                     case 'camunda:properties':
      //                         // console.log('properties', child.$children);
      //                         break;
      //                     case 'camunda:validation':
      //                         // console.log('validation', child.$children);
      //                         break;
      //                     case 'camunda:constraint':
      //                         break;
      //                     // TODO, finish parsing this
      //                 }
      //             }
      //         }
      //         //fields.push(field);
      //     }
      // }
      //this.state = fields;
    },

    getIconFor(type) {
      if (type === undefined) type = "camunda:property";
      return FormItemMetaModel[type].icon;
    },

    save() {
      debugger;
      let temp = {};
      if (this.dialogData != null) {
        // if (this.newFormItem.validation == null) {
        //   this.newFormItem.validation = false;
        // }
        temp = {
          $bpmn: this.dialogData,
          id: this.dialogData.id,
          label: this.dialogData.label,
          type: this.dialogData.type,
          icon: this.getIconFor(this.dialogData.type),
          validation: {
            required: this.dialogData.validation,
          },
        };
        this.state.push(temp);
      }
      let values = this.state.map((x) => x.$bpmn);

      let cs = this.modeler.get("commandStack");
      cs.execute("bpmn-list-update", {
        element: this.context.bpmnElement,
        currentObject: this.dialogData,//this.data.formData,
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
// .v-list-item {
//   cursor: move;
//   border: 1px solid transparent;
// }
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

.cardOutterForm {
  padding-bottom: 2%;
  margin-bottom: 0%;
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