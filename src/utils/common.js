export function isInputFileValid(file) {
    if(file == null) return true;
    var fileExtension = file.type == "" ? file.name.split('.').pop() : file.type;
    if(fileExtension == 'bpmn' || fileExtension == 'text/xml') return true; 
    return false;
}