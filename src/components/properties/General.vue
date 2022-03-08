<template>
  <div>
    <v-card elevation="0" tile class="cardOutterValidation">
      <!-- <v-card-subtitle> GENERAL </v-card-subtitle> -->
      <v-card elevation="0" tile outlined class="cardInner">
        <v-list-item>
          <v-list-item-action>
            <v-icon>{{ getIconFor() }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-subtitle>ID</v-list-item-subtitle>
            <v-list-item-title>{{ state.id }}</v-list-item-title>
            <v-list-item-subtitle>NAME</v-list-item-subtitle>
            <v-list-item-title>{{ state.name || "No available data" }}</v-list-item-title>
            <div v-if="showBody">
              <v-list-item-subtitle>BODY</v-list-item-subtitle>
              <v-list-item-title>{{ state.body }}</v-list-item-title>
            </div>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click.stop="openEditItem(state)">
              <v-icon color="grey lighten-1">mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-card>
    </v-card>
    <!-- Edit field -->
    <v-dialog v-model="dialogShown" max-width="600">
      <editFormItem
        :dataTwo="childData"
        :contextTwo="context"
        :key="componentKey"
        @close="closeEditItem()"
      ></editFormItem>
    </v-dialog>
  </div>
</template>

<script>
import { FormItemMetaModel } from "@/utils/bpmn.js";
export default {
  name: "properties-general",
  props: ["data", "context"],
  components: {
    editFormItem: () => import("@/components/properties/EditFormItem.vue"),
  },
  created() {
    this.setState();
  },
  data() {
    let modeler = this.context.modeler;
    return {
      componentKey: 0,
      modeler: modeler,
      dialogShown: false,
      showBody: false,
      childData: null,
      cs: modeler.get("commandStack"),
      state: {
        id: null,
        name: null,
        body: null,
      },
    };
  },
  watch: {
    data() {
      this.setState();
    },
  },
  computed: {
    changed() {
      debugger;
      //   let bpmnType = this.data.bpmn.$type || undefined;
      //   for (let att in this.state) {
      //     //Collaboration
      //     if (bpmnType != undefined && bpmnType == "bpmn:Collaboration") {
      //       if (this.state[att] != this.data.bpmn.participants[0][att]) {
      //         return true;
      //       }
      //       // else {
      //       //     return false;
      //       // }
      //     }
      //     //Sequence Flow
      //     else if (bpmnType != undefined && bpmnType == "bpmn:SequenceFlow") {
      //       //Strange behaviour id-name
      //       if (this.state?.body != this.data.bpmn?.conditionExpression?.body) {
      //         return true;
      //       } else if (this.state["id"] != this.data["id"]) {
      //         return true;
      //       } else if (this.state["name"] != this.data["name"]) {
      //         return true;
      //       }
      //       // else {
      //       //     return false;
      //       // }
      //     }
      //     //Everything else
      //     else {
      //       if (this.state[att] != this.data[att]) {
      //         return true;
      //       }
      //       // else {
      //       //     return false;
      //       // }
      //     }
      //   }
      return false;
    },
  },
  methods: {
    closeEditItem() {
      debugger;
      this.dialogShown = false;
    },
    openEditItem(bpmnObject) {
      debugger;
      this.forceRenderer();
      this.childData = { ...bpmnObject };
      this.dialogShown = true;
    },
    //Forces rerendering of the component
    forceRenderer() {
      this.componentKey += 1;
    },
    getIconFor(type) {
      if (type === undefined) type = "camunda:property";
      return FormItemMetaModel[type].icon;
    },
    setState() {
      let bpmnType = this.data.bpmn.$type || undefined;
      this.showBody = false;
      for (let att in this.state) {
        //Collaboration
        if (bpmnType != undefined && bpmnType == "bpmn:Collaboration") {
          this.state[att] = this.data.bpmn.participants[0][att];
        }
        //Sequence Flow
        else if (bpmnType != undefined && bpmnType == "bpmn:SequenceFlow") {
          //Condition Expression
          if (
            this.data.bpmn.conditionExpression != undefined &&
            att == "body"
          ) {
            this.state[att] = this.data.bpmn.conditionExpression.body;
            this.showBody = true;
          } else {
            this.state[att] = this.data[att];
          }
        }
        //Everything else
        else {
          this.state[att] = this.data[att];
        }
      }
    },
    save() {
      let updates = [];
      for (let att in this.state) {
        if (this.state[att] != this.data[att]) {
          updates.push({
            cmd: "bpmn-update",
            context: {
              element: this.context.bpmnElement,
              businessObject: this.context.bpmnElement.businessObject,
              properties: { [att]: this.state[att] },
            },
          });
        }
      }
      this.cs.execute("bpmn-multi-update", updates);
    },
  },
};
</script>
