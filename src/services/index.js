import axios from 'axios';

// instanca axios-a za potrebe Fipugram backenda
let Service = axios.create({
    baseURL: process.env.VUE_APP_BPMN_SERVER,
    timeout: 5000,
});

let Model = {
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
            let result = await Service.patch('/process-definition/deactivate', data);
            if(result?.data == null) {
                return {};
            }
            debugger
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
            let result = await Service.patch(`/process-definition/activate`, data);
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
    async get(id) {
        try {
            let result = await Service.get(`/model/${id}`);
            return result.data;
        } catch (e) {
            return null;
        }
    },
    async search(query) {
        try {
            let result = await Service.get('/model', {
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

let ProcessVersion = {
    async getProcessVersions(processDefinitionId) {
        try {
            let result = await Service.get(`/process-version/${processDefinitionId}`)
            if(result?.data.length == 0) {
                return [];
            } 
            return JSON.parse(result.data)
        }
        catch(e) {
            console.assert(e);
            return null;
        }
    }
}

let WebService = {
    async get() {
        try {
            let result = await Service.get(`/service`);
            return result.data;
        }
        catch (e) {
            console.assert(e)
            return null;
        }
    },
    async getServiceMeta(url) {
        try {
            let serviceUrl = `/service/meta/${encodeURIComponent(url)}`;
            let result = await Service.get(serviceUrl)
            if(result.length == 0) return [];
            return result.data;
        }
        catch (e) {
            console.assert(e);
            return null;
        }
    },
    async getHealth() {
        try {
            let result = await Service.get(`/service/status`);
            return result.data;
        }
        catch (e) {
            console.assert(e)
            return null;
        }
    },
    async sendData(newData, oldData) {
        debugger;
        const resp = Service.post(`/service`, {
            new: newData,
            old: oldData
        }).then(function (response) {
            console.log(response)
            return response.data;
        }).catch(function (error) {
            console.log(error)            
            return error;
        })
        return resp
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

export { Service, ProcessInstance, Model, WebService, ProcessVersion };
