// const SUITABILITY_SCORE_HIGH = 100,
//       SUITABILITY_SCORE_AVERGE = 50,
//       SUITABILITY_SCORE_LOW = 25;

// export default class CustomPalette {
//   constructor(bpmnFactory, create, elementFactory, palette, translate) {
//     this.bpmnFactory = bpmnFactory;
//     this.create = create;
//     this.elementFactory = elementFactory;
//     this.translate = translate;
//     palette.registerProvider(this);
//   }

//   getPaletteEntries() {
//     const { bpmnFactory, create, elementFactory, translate} = this;
//     function createTask(suitabilityScore) {
//       return function(event) {
//         const businessObject = bpmnFactory.create('bpmn:Task');
//         businessObject.suitable = suitabilityScore;
//         const shape = elementFactory.createShape({
//           type: 'bpmn:Task',
//           businessObject: businessObject
//         });
//         create.start(event, shape);
//       };
//     }

//     return {
//       'create.low-task': {
//         // group: 'activity',
//         className: 'bpmn-icon-task red',
//         title: translate('Create Task with low suitability score'),
//         action: {
//           dragstart: createTask(SUITABILITY_SCORE_LOW),
//           click: createTask(SUITABILITY_SCORE_LOW)
//         }
//       },
//       'create.average-task': {
//         // group: 'activity',
//         className: 'bpmn-icon-task yellow',
//         title: translate('Create Task with average suitability score'),
//         action: {
//           dragstart: createTask(SUITABILITY_SCORE_AVERGE),
//           click: createTask(SUITABILITY_SCORE_AVERGE)
//         }
//       },
//       'create.high-task': {
//         // group: 'activity',
//         className: 'bpmn-icon-task green',
//         title: translate('Create Task with high suitability score'),
//         action: {
//           dragstart: createTask(SUITABILITY_SCORE_HIGH),
//           click: createTask(SUITABILITY_SCORE_HIGH)
//         }
//       }
//     };
//   }
// }

// CustomPalette.$inject = [
//   'bpmnFactory',
//   'create',
//   'elementFactory',
//   'palette',
//   'translate'
// ];
export default class CustomPalette {
  constructor(create, elementFactory, palette) {
    this.create = create;
    this.elementFactory = elementFactory;
    palette.registerProvider(this);
  }
 
 
  // This is drawing palette Do not change the function name
  getPaletteEntries() {
    const elementFactory = this.elementFactory;
    const create = this.create;
 
    function clickEventFactory(type) {
      return function (event) {
        const taskShape = elementFactory.create('shape', {
          type: type
        });
        create.start(event, taskShape);
      };
    }
    return {
      'create.save': {
        group: 'tools',
        title: 'Save',
        className: 'icon-custom bpmn-icon-save bpmn-icon-save:hover',
        action: {
          click: clickEventFactory,
        },
      },
      'create.undo': {
        group: 'tools',
        title: 'Undo',
        className: 'icon-custom bpmn-icon-undo bpmn-icon-save:hover',
        action: {
          click: clickEventFactory,
        },
      },
      'create.redo': {
        group: 'tools',
        title: 'Redo',    
        className: 'icon-custom bpmn-icon-redo bpmn-icon-save:hover',
        action: {
          click: clickEventFactory,
        },
      },
      'create.test': {
        group: 'tools',
        title: 'Test',
        className: 'icon-custom bpmn-icon-test bpmn-icon-save:hover',
        action: {
          click: clickEventFactory,
        },
      }
    };
  }
}
CustomPalette.$inject = [
  'create',
  'elementFactory',
  'palette'
];