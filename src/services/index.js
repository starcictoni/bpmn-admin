import axios from 'axios';

let Service = axios.create({
    baseURL: process.env.VUE_APP_BPMN_SERVER,
    //timeout: 10000,
});

let errorMessage = {
    data: null,
    message: "Server error",
    color: "red darken-3",
    show: true
}

let warningMessage = {
    data: null,
    message: "Oops, Something Went Wrong. Please try again.",
    color: "yellow darken-1",
    show: true,
}

let successNoMessage = {
    data: null,
    message: null,
    color: null,
    show: false
}

let successMessage = {
    data: null,
    message: "",
    color: "green darken-1",
    show: true
}
let ProcessDefinition = {
    async getProcessDefinition(definitionId) {
        try {
            let result = await Service.get(`/process-definition/${definitionId}`);
            if(result?.data.length == 0) {
                warningMessage.data = {}
                return warningMessage;
            }
            successNoMessage.data = JSON.parse(result.data);
            return successNoMessage
        }
        catch(e) { return errorMessage; }
    },
    async getProcessDefinitions() {
        try {
            let result = await Service.get('/process-definition');
            if(result?.data.length == 0) {
                warningMessage.data = []
                return warningMessage;
            }
            successNoMessage.data = JSON.parse(result.data);
            return successNoMessage
        }
        catch(e) { return errorMessage; }
    },
    async addProcessDefinition(data) {
        try {
            let result = await Service.post('/process-definition', data);
            if(result?.data.length == 0) {
                warningMessage.data = []
                return warningMessage;
            }
            successMessage.data = JSON.parse(result.data);
            successMessage.message = "Successfully added"
            return successMessage
        }
        catch(e) { return errorMessage; }
    },
    async activateProcessDefinition(processDefinitionId, processVersionId) {
        try {
            let data = {
                "process_definition_id": processDefinitionId,
                "process_version_id": processVersionId
            }
            let result = await Service.patch(`/process-definition/active`, data);
            successMessage.data = JSON.parse(result.data);
            successMessage.message = "Successfully activated"
            return successMessage
        }
        catch(e) { return errorMessage; }
    },
    async deactivateProcessDefinition(processDefinitionId) {
        try {
            let data = {
                "process_definition_id": processDefinitionId,
            }            
            let result = await Service.patch('/process-definition/inactive', data);
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successMessage.data = JSON.parse(result.data);
            successMessage.message = "Successfully deactivated"
            return successMessage
        }
        catch(e) { return errorMessage; }
    },
    async updateProcessDefinitionInformation(id, name, filename) {
        try {
            let data = {
                "process_definition_id": id,
                "process_definition_name": name,
                "file_name": filename
            }
            let result = await Service.patch('/process-definition/info', data);
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successMessage.data = JSON.parse(result.data);
            successMessage.message = "Successfully updated"
            return successMessage
        }
        catch(e) { return errorMessage; }
    },
    async deleteProcessDefinition(id) {
        try {
            let data = {
                "process_definition_id": id,
            }
            let result = await Service.delete('/process-definition', {data: data});
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successMessage.data = JSON.parse(result.data);
            successMessage.message = "Successfully deleted"
            return successMessage
        }
        catch(e) { return errorMessage; }
    },
};
//TODO: addProcessVersion
let ProcessVersion = {
    async getProcessVersion(versionId) {
        try {
            let result = await Service.get(`/process-version/${versionId}`);
            if(result?.data == 0) {
                warningMessage.data = {}
                return warningMessage;
            }
            successNoMessage.data = JSON.parse(result.data);
            return successNoMessage
        }
        catch(e) { return errorMessage; }
    },
    async getProcessVersions(processDefinitionId) {
        try {
            let params = {
                "process_definition_id": processDefinitionId
            }
            let result = await Service.get('/process-version', { params: params })
            if(result?.data.length == 0) {
                warningMessage.data = []
                return warningMessage;
            } 
            successNoMessage.data = JSON.parse(result.data);
            return successNoMessage
        }
        catch(e) { return errorMessage; }
    },
    async activateProcessVersion(processDefinitionId, processVersionId) {
        try {
            let data = {
                "process_definition_id": processDefinitionId,
                "process_version_id": processVersionId
            }
            let result = await Service.patch('/process-version/active', data);
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successMessage.data = JSON.parse(result.data);
            successMessage.message = "Successfully activated"
            return successMessage
        }
        catch(e) { return errorMessage; }
    },
    async deactivateProcessVersion(processDefinitionId, processVersionId) {
        try {
            let data = {
                "process_definition_id": processDefinitionId,
                "process_version_id": processVersionId
            }
            let result = await Service.patch('/process-version/inactive', data);
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successMessage.data = JSON.parse(result.data);
            successMessage.message = "Successfully deactivated"
            return successMessage
        }
        catch(e) { return errorMessage; }
    },
    async updateProcessVersionInformation(id, name, filename) {
        try {
            let data = {
                "process_version_id": id,
                "process_version_name": name,
                "filename": filename
            }
            let result = await Service.patch(`/process-version/info`, data);
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successMessage.data = JSON.parse(result.data);
            successMessage.message = "Successfully updated"
            return successMessage
        }
        catch(e) { return errorMessage; }
    },
    async deleteProcessVersion(id) {
        try {
            let data = {
                "process_version_id": id,
            }
            let result = await Service.delete('/process-version', {data: data});
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successMessage.data = JSON.parse(result.data);
            successMessage.message = "Successfully deleted"
            return successMessage
        }
        catch(e) { return errorMessage; }
    },
};
//TODO: getServiceStatus not called
let WebService = {
    async getServices() {
        try {
            let result = await Service.get('/web-service');
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successNoMessage.data = JSON.parse(result.data);
            return successNoMessage
        }
        catch(e) { return errorMessage; }
    },
    async getService(serviceId) {
        try {
            let result = await Service.get(`/web-service/${serviceId}`);
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successNoMessage.data = JSON.parse(result.data);
            return successNoMessage
        }
        catch(e) { return errorMessage; }
    },
    async deleteService(serviceId) {
        try {
            let data = {
                "id": serviceId,
            }
            let result = await Service.delete('/web-service', {data: data});
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successMessage.data = JSON.parse(result.data);
            successMessage.message = "Successfully deleted"
            return successMessage
        }
        catch(e) { return errorMessage; }
    },    
    async addService(data) {
        try {
            let result = await Service.post('/web-service', data);
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successMessage.data = JSON.parse(result.data);
            successMessage.message = "Successfully added"
            return successMessage
        }
        catch(e) { return errorMessage; }
    },
    async updateService(data) {
        try {
            let result = await Service.patch('/web-service', data);
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successMessage.data = JSON.parse(result.data);
            successMessage.message = "Successfully updated"
            return successMessage
        }
        catch(e) { return errorMessage; }
    },
    async changeServiceStatus(id) {
        try {
            let result = await Service.patch(`/web-service/${id}`);
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successMessage.data = JSON.parse(result.data);
            successMessage.message = "Successfully updated"
            return successMessage
        }
        catch(e) { return errorMessage; }
    },    
    async getServiceMeta(address) {
        try {
            let result = await Service.get(`/service/meta`, {
                params: { 
                    address: address
                }
            });
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successNoMessage.data = JSON.parse(result.data);
            return successNoMessage
        }
        catch(e) { return errorMessage; }
    },
    async getServiceStatus() {
        try {
            let result = await Service.get('/web-service/status');
            if(result?.data == null) {
                warningMessage.data = {}
                return warningMessage;
            }
            successNoMessage.data = JSON.parse(result.data);
            return successNoMessage
        }
        catch(e) { return errorMessage; }
    }    
};

export { ProcessDefinition, ProcessVersion, WebService };
