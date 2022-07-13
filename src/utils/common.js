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
    if(table == null) return null;

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
