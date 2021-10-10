const extensionElements = businessObject.extensionElements || moddle.create('bpmn:ExtensionElements');

if (!analysisDetails) {
    analysisDetails = moddle.create('qa:AnalysisDetails');

    extensionElements.get('values').push(analysisDetails);
}

analysisDetails.lastChecked = new Date().toISOString();

modeling.updateProperties(element, {
    extensionElements,
    suitable: suitabilityScore,
});
