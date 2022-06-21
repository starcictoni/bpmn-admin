import axios from 'axios';

// instanca axios-a za potrebe Fipugram backenda
let Service = axios.create({
    baseURL: process.env.VUE_APP_BPMN_SERVER,
    timeout: 5000,
});

let Model = {
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

export { Service, ProcessInstance, Model, WebService };
