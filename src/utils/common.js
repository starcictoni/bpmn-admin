export function isInputFileValid(file) {
    if(file == null) return true;
    var fileExtension = file.type == "" ? file.name.split('.').pop() : file.type;
    if(fileExtension == 'bpmn' || fileExtension == 'text/xml') return true; 
    return false;
}
export function getNameFromFile(file) {
    if(file == null) return null;
    var name = file.type == "" ? file.name.split('.').shift() : "New Process Name";
    return name;
}
export function reMapDataTableValues(table) {
    if(table == null ) return []; //was null

    function setActiveToYesAndNo(active) {
        if(active == null) return null;
        if(active == "Yes" || active == "No") return active;
        return active == true ? active = "Yes" : active = "No"; 
    }
    function setTimeAndDateFormat(date) {
        if(date == null) return null;
        if(!(new Date(date).getTime() > 0)) return date; 
        var newDate = new Date(date)
        return newDate.toLocaleDateString("en-GB") + " " + newDate.toLocaleTimeString("en-GB", {hour: '2-digit', minute: '2-digit'}); 
    }
    table.forEach(row => {
        row.created = setTimeAndDateFormat(row.created);
        row.is_active = setActiveToYesAndNo(row.is_active);
        if(row?.last_modified_date) row.last_modified_date = setTimeAndDateFormat(row.last_modified_date);
    });
    return table;
}
export function isItemProcessDefinition(item) {
    return item.process_version_id === undefined ? true : false;
}
export function showCorrespondingDeactivateText(item) {
    if(item == null) return null;
    let text = "";
    if(isItemProcessDefinition(item)) {
        text = "Are you sure that you want to deactivate this Process definition?"
    } else {
        text = "Are you sure that you want to deactivate this Process version?"
    }
    return text;
}
export function showCorrespondingActivateText(item) {
    if(item == null) return null;
    let text = "";
    if(isItemProcessDefinition(item)) {
        if(item.versions.length == 1) text = "Are you sure you want to activate this Process definition?"
        if(item.versions.length > 1) text = "Please, select a version that you want to activate with Process definition."
    } else {
        text = "Are you sure you want to activate this Process version?"
    }
    return text;
}
export function isExtensionValid(filename) {
    if(filename == null) return true;
    var fileExtension = filename.split('.').pop();
    if(fileExtension == 'bpmn' || fileExtension == 'xml') return true; 
    return false;
}
export function isInputValid(input) {
    if(input == null) return false;
    input = input.trim()
    if(input == "") return false;
    return true;
}
export function exportItem(item) {
    let binaryFile = new Blob([item.xml_definition], { type: "text/bpmn" });
    let a = document.createElement("a");
    if (isItemProcessDefinition(item)) {
        a.download = item.process_definition_name + ".bpmn";
    } else {
        a.download = item.process_version_name + ".bpmn";
    }
    a.href = window.URL.createObjectURL(binaryFile);
    a.click();
}
export function exportDiagram(name, xml) {
    let binaryFile = new Blob([xml], { type: "text/bpmn" });
    let a = document.createElement("a");
    a.download = name + ".bpmn";
    a.href = window.URL.createObjectURL(binaryFile);
    a.click();
}
export function showCorrespondingBanner(item) {
    if(item == null) return null;
    //aktivacija
    //verzija - Ako aktiviras ovo, druga verzija ce se deaktivirati
    //deaktivacija
    //definicija - Ako deaktiviras ovo, onda ces deaktivirati i njihove verzije
    //verzija - Ako deaktiviras ovu verziju, onda ces deaktivirati i definiciju

    // v-model="showBanner"
    // :icon="bannerIcon"
    // :icon-color="bannerIconColor"
    // :color="bannerColor"
}
export function findAndReplace(table, item, type) {
    let idx = null;
    if(table == null || table == []) return []; //didnt exist
    if(item == null || item == {}) return [];
    if(type == "definition") {
        idx = table.findIndex((x) => x.process_definition_id == item.process_definition_id);
    }
    else {
        idx = table.findIndex((x) => x.process_version_id == item.process_version_id);
    }
    table.splice(idx, 1, item);
    table = reMapDataTableValues(table)
    return table;
}
export function findAndRemove(table, id, type) {
    let idx = null;
    if(table == null || table == []) return []; //didnt exist
    if(type == "definition") {
        idx = table.findIndex(x => x.process_definition_id == id);
    }
    else {
        idx = table.findIndex(x => x.process_version_id == id);
    }
    table.splice(idx, 1);
    table = reMapDataTableValues(table)
    return table;
}
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}