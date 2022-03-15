<template>
  <v-card tile outlined>
    <v-card-title class="cardTitle"> EDIT FIELD </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-show="id != null"
          outlined
          clearable
          v-model="dataEdit.id"
          label="Id"
        ></v-text-field>
        <v-text-field
          v-show="name != null"
          outlined
          clearable
          v-model="state.name"
          label="Name"
        ></v-text-field>
        <v-text-field
          v-show="label != null"
          outlined
          clearable
          v-model="label"
          label="Label"
        ></v-text-field>
        <v-text-field
          v-show="body != null"
          outlined
          clearable
          v-model="body"
          label="Body"
        ></v-text-field>
        <v-text-field
          v-show="value != null"
          outlined
          clearable
          v-model="value"
          label="Value"
        ></v-text-field>
        <v-text-field
          v-show="type != null"
          disabled
          outlined
          clearable
          v-model="type"
          label="Type"
        ></v-text-field>
        <!-- <v-select v-model="data.type" :items="types" item-value="type" item-text="name" label="Item type">
                        <template v-slot:item="{ item }">
                            <v-list-item-icon>
                                <v-icon v-text="item.icon"></v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.name"></v-list-item-title>
                            </v-list-item-content>
                        </template>
                    </v-select> -->
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        large
        tile
        outlined
        class="buttonApply"
        color="blue darken-1"
        text
        @click="$emit('save')"
      >
        Apply
      </v-btn>
      <v-btn
        large
        tile
        outlined
        class="buttonClose"
        color="red darken-1"
        text
        @click="$emit('close')"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { FormItemMetaModel, SendAndServiceItemMetaModel } from "@/utils/bpmn";
export default {
  name: "properties-edit-form-item",
  props: ["dataEdit", "contextEdit"],
  data() {
    return {
      state: null,
      id: null,
      label: null,
      name: null,
      body: null,
      value: null,
      type: null,
      originalData: null,
      types: Object.values(FormItemMetaModel),
      someOtherType: SendAndServiceItemMetaModel,
      // modeler: this.context1.modeler,
    };
  },
  created() {
    this.setState();
  },
  methods: {
    setState() {
      debugger;
      this.state = this.dataEdit
      this.id = this.dataEdit?.id;
      this.label = this.state?.label;
      this.name = this.state?.name;
      this.body = this.state?.body;
      this.value = this.state?.value;
      this.type = this.state?.type;
    },
    getIconFor(type) {
      if (type === undefined) type = "camunda:property";
      return (
        SendAndServiceItemMetaModel[type].icon || FormItemMetaModel[type].icon
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.cardTitle {
  // font-family: sans-serif;
  margin-top: 2%;
  font-weight: 400 !important;
  font-size: 20px;
  color: rgba(53, 50, 50, 0.753);
}
.v-dialog > .v-card > .v-card__subtitle,
.v-dialog > .v-card > .v-card__text {
  padding: 3% 4% 0% 4%;
}
.v-text-field .v-input__control,
.v-text-field .v-input__slot,
.v-text-field fieldset {
  border-color: rgb(224, 224, 224, 1);
}
.v-text-field--outlined {
  border-radius: 0px !important;
  :hover {
    border-color: rgb(224, 224, 224, 1);
  }
}
.theme--light.v-btn.v-btn--outlined.v-btn--text {
  border-color: rgb(153, 153, 153) !important;
}

.theme--light.v-btn.v-btn--outlined.v-btn--text {
  border-color: rgb(224, 224, 224, 1);
}
.buttonApply {
  margin: 1% 1% 4% 0%;
}
.buttonClose {
  margin: 1% calc(2% - 2px) 4% 0%;
}
</style>

