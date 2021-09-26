import axios from 'axios';

// instanca axios-a za potrebe Fipugram backenda
let Service = axios.create({
    baseURL: process.env.VUE_APP_BPMN_SERVER,
    timeout: 1000,
});

// naš objekt za sve pozive koji se dotiču `Post`ova
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

export { Service, ProcessInstance };
