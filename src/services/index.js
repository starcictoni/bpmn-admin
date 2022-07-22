import axios from 'axios';

let Service = axios.create({
    baseURL: process.env.VUE_APP_BPMN_SERVER,
    //timeout: 10000,
});

let ProcessDefinition = {
    async addProcessDefinition(data) {
        try {
            let result = await Service.post('/process-definition', data);
            if(result?.data.length == 0) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch(e) {
            console.log(e)
            return {};
        }
    },
    async getProcessDefinition(definitionId) {
        try {
            let result = await Service.get(`/process-definition/${definitionId}`);
            if(result?.data.length == 0) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch(e) {
            console.log(e)
            return {};
        }
    },
    async getProcessDefinitions() {
        try {
            let result = await Service.get('/process-definition');
            if(result?.data.length == 0) {
                return [];
            }
            return JSON.parse(result.data)
        }
        catch(e) {
            console.log(e)
            return [];
        }
    },
    async deactivateProcessDefinition(processDefinitionId) {
        try {
            let data = {
                "process_definition_id": processDefinitionId,
            }            
            let result = await Service.patch('/process-definition/inactive', data);
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch(e) {
            console.log(e)
            return {};
        }
    },
    async activateProcessDefinition(processDefinitionId, processVersionId) {
        try {
            let data = {
                "process_definition_id": processDefinitionId,
                "process_version_id": processVersionId
            }
            let result = await Service.patch(`/process-definition/active`, data);
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch(e) {
            console.log(e)
            return {};
        }
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
                return {};
            }
            return JSON.parse(result.data)
        }
        catch(e) {
            console.log(e)
            return {};
        }
    },
    async deleteProcessDefinition(id) {
        try {
            let data = {
                "process_definition_id": id,
            }
            let result = await Service.delete('/process-definition', {data: data});
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch(e) {
            console.log(e)
            return {};
        }
    },
};

let ProcessVersion = {
    async getProcessVersion(versionId) {
        try {
            let result = await Service.get(`/process-version/${versionId}`);
            if(result?.data.length == 0) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch(e) {
            console.log(e)
            return {};
        }
    },
    async getProcessVersions(processDefinitionId) {
        try {
            let params = {
                "process_definition_id": processDefinitionId
            }
            let result = await Service.get('/process-version', { params: params })
            if(result?.data.length == 0) {
                return [];
            } 
            return JSON.parse(result.data)
        }
        catch(e) {
            console.assert(e);
            return null;
        }
    },
    async activateProcessVersion(processDefinitionId, processVersionId) {
        try {
            let data = {
                "process_definition_id": processDefinitionId,
                "process_version_id": processVersionId
            }
            let result = await Service.patch('/process-version/active', data);
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch(e) {
            console.log(e)
            return {};
        }
    },
    async deactivateProcessVersion(processDefinitionId, processVersionId) {
        try {
            let data = {
                "process_definition_id": processDefinitionId,
                "process_version_id": processVersionId
            }
            let result = await Service.patch('/process-version/inactive', data);
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch(e) {
            console.log(e)
            return {};
        }
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
                return {};
            }
            return JSON.parse(result.data)
        }
        catch(e) {
            console.log(e)
            return {};
        }
    },
    async deleteProcessVersion(id) {
        try {
            let data = {
                "process_version_id": id,
            }
            let result = await Service.delete('/process-version', {data: data});
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch(e) {
            console.log(e)
            return {};
        }
    },
}

let WebService = {
    async getServices() {
        try {
            let result = await Service.get('/web-service');
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch (e) {
            console.assert(e)
            return {};
        }
    },
    async getService(serviceId) {
        try {
            let result = await Service.get(`/web-service/${serviceId}`);
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch (e) {
            console.assert(e)
            return {};
        }
    },
    async deleteService(serviceId) {
        try {
            let data = {
                "id": serviceId,
            }
            let result = await Service.delete('/web-service', {data: data});
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch (e) {
            console.assert(e)
            return {};
        }
    },    
    async addService(data) {
        try {
            let result = await Service.post('/web-service', data);
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch (e) {
            console.assert(e)
            return {};
        }
    },
    async updateService(data) {
        try {
            let result = await Service.patch('/web-service', data);
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch (e) {
            console.assert(e)
            return {};
        }
    },
    async changeServiceStatus(id) {
        try {
            let result = await Service.patch(`/web-service/${id}`);
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch (e) {
            console.assert(e)
            return {};
        }
    },    
    async getServiceMeta() {
        try {
            let result = await Service.get('/web-service/meta');
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch (e) {
            console.assert(e)
            return {};
        }
    },
    async getServiceStatus() {
        try {
            let result = await Service.get('/web-service/status');
            if(result?.data == null) {
                return {};
            }
            return JSON.parse(result.data)
        }
        catch (e) {
            console.assert(e)
            return {};
        }
    }    
}

let ProcessInstance = {
    async get(id) {
        try {
            let result = await Service.get(`/instance/${id}`);
            return result.data;
        } catch (e) {
            return null;
        }
    },
    async search(query) {
        try {
            let result = await Service.get('/instance', {
                params: {
                    q: query,
                },
            });
            return result.data.results;
        } catch (e) {
            return [];
        }
    },
};

export { Service, ProcessInstance, ProcessDefinition, WebService, ProcessVersion };
