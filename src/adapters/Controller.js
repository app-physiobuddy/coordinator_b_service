require("dotenv").config();
const ErrorTypes = require("../utils/errors/ErrorTypes");
const axios = require("axios");
const entitiesServiceURL = process.env.ENTITIES_SERVICE_URL
const exerciseServiceURL = process.env.EXERCISE_SERVICE_URL
const gatewayServiceURL = process.env.GATEWAY_SERVICE_URL


class Controller {
    constructor(redisProvider) {
        this.redis = redisProvider
    }
    async therapistMakesCategoryWithCompanyUserId(req, res) {
        console.log("COORDINATOR B - therapistMakesCategoryWithCompanyUserId")
        const { company_id, therapist_user_id} = req.body.data
        console.log(req.body.data)
        let company_user_id 
        try {
            const response = await axios.get(`${entitiesServiceURL}/therapists/${therapist_user_id}/companies/${company_id}`);
            company_user_id = response.data.message
            //return res.status(response.status).send(response.data)
        } catch (error) {
            //console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        console.log(company_user_id, "here")
        //passar isso para exercise e criar category
        const newCategory = {
            name: req.body.data.name,
            desc: req.body.data.desc,
            //id_comp: company_id,
        }
        req.body.data = newCategory
        const exerciseGateway = `${exerciseServiceURL}/companies/${company_user_id}/categories` //comapany_id is the company_user_id
        console.group(exerciseGateway, req.body.data)
        try {
            const response = await axios.post(exerciseGateway, req.body);
            return res.status(response.status).send(response.data)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
     }


        ////////////
    async therapistGetsAllCategoriesWithCompanyUserId(req, res) {
        const { user_id, company_id } = req.params
        if (!user_id) throw ErrorTypes.UnauthorizedAcess("user_id is required");
        if (!company_id) throw ErrorTypes.UnauthorizedAcess("company_id is required");

        let company_user_id
        try {
            const { user_id, company_id } = req.params;
            const response = await axios.get(`${entitiesServiceURL}/therapists/${user_id}/companies/${company_id}`);
            company_user_id = response.data.message
            //return res.status(200).send(response.data)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        //passar isso para exercise e get all categories
        const exerciseGateway = `${exerciseServiceURL}/companies/${company_user_id}/categories` //comapany_id is the company_user_id
        console.group(exerciseGateway, req.body.data)
        try {
            const response = await axios.get(exerciseGateway,);
            return res.status(response.status).send(response.data)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // EXERCICIOS
    async therapistMakesExerciseWithCompanyUserId(req, res) {
        console.log("COORDINATOR B - therapistMakesExerciseWithCompanyUserId")
        const { company_id, therapist_user_id} = req.body.data


        let company_user_id 
        try {
            const response = await axios.get(`${entitiesServiceURL}/therapists/${therapist_user_id}/companies/${company_id}`);
            company_user_id = response.data.message
            //return res.status(response.status).send(response.data)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        //passar isso para exercise e criar exercicio
       
        req.body.data = {
            physio_id: therapist_user_id,
            ...req.body.data,
        }
        const exerciseGateway = `${exerciseServiceURL}/companies/${company_user_id}/exercises` //company_id is the company_user_id
        console.group(exerciseGateway, req.body.data)
        try {
            const response = await axios.post(exerciseGateway, req.body);
            return res.status(response.status).send(response.data)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
     }

    // CACHE IMPLEMENTED HERE
     async therapistGetsAllExercisesWithCompanyUserId(req, res) {
        const { user_id, company_id } = req.params
        const REDIS_URL = process.env.REDIS_URL
        console.log(REDIS_URL)
        if (!user_id) throw ErrorTypes.UnauthorizedAcess("user_id is required");
        if (!company_id) throw ErrorTypes.UnauthorizedAcess("company_id is required");
        console.log(user_id, company_id)

        let company_user_id
        // check if therapist is in the company, on redis
        
        try {
            const redisValue = await this.redis.get(user_id)
            console.log(redisValue, "redisValue")
            if (!redisValue) {
                // if not, check on entities service
                console.log("not in redis")
                const response = await axios.get(`${entitiesServiceURL}/therapists/${user_id}/companies/${company_id}`);
                company_user_id = response.data.message
                await this.redis.setWithExpiration(user_id, company_user_id, 20) // 20 segundos
                //await this.redis.set(user_id, company_user_id, 'EX', 6000); // 1-hour expiry
            }
            else {
                company_user_id = redisValue
                console.log("in redis")
            }
        } catch(e) {
            console.log(e, "redis error")
        }

        //passar isso para exercise e get all categories
        console.log("Asking for exercises of company id:", company_user_id)
        const exerciseGateway = `${exerciseServiceURL}/companies/${company_user_id}/exercises` //comapany_id is the company_user_id
        try {
            const response = await axios.get(exerciseGateway);
            return res.status(response.status).send(response.data)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async therapistMakesPlanWithPacientId(req, res) {
        console.log("COORDINATOR B - therapistMakesPlanWithPacientId")
        const { therapist_user_id, patient_id} = req.body.data


        // Check if therapist has this patient_id has his patient
        try {
            const response = await axios.get(`${entitiesServiceURL}/check/therapists/${therapist_user_id}/patients/${patient_id}`);
            if(!response.data.success) return res.status(response.status).send(response.data)

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        //passar isso para exercise e criar plano
        const newPlan = {
            id_pac: patient_id,
            id_physio: therapist_user_id,
            ...req.body.data,
    
        }
        req.body.data = newPlan
        const exerciseGateway = `${exerciseServiceURL}/therapists/${therapist_user_id}/patients/${patient_id}/plans` 
        console.warn(exerciseGateway, req.body.data)
        try {
            const response = await axios.post(exerciseGateway, req.body);
            return res.status(response.status).send(response.data)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
     }

    async patientGetsPlans(req, res) {
        if (!req.params.user_id) throw ErrorTypes.UnauthorizedAcess("user_id is required");
        if (!req.params.patient_id) throw ErrorTypes.UnauthorizedAcess("patient_id is required");
        const patient_id = Number(req.params.patient_id);
        const user_id = Number(req.params.user_id);
        console.log(patient_id, user_id)
        try {
            // check if user_id matches a patient profile with patient id
            const response = await axios.get(`${entitiesServiceURL}/patients/${user_id}/patients/${patient_id}`);
            if(!response.data.success) return res.status(response.status).send(response.data)
            const plans = await axios.get(`${exerciseServiceURL}/patients/${patient_id}/plans`);
            return res.status(plans.status).send(plans.data)
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async therapistGetsPlans(req, res) {
        if (!req.params.user_id) throw ErrorTypes.UnauthorizedAcess("user_id is required");
        if (!req.params.patient_id) throw ErrorTypes.UnauthorizedAcess("patient_id is required");
        const patient_id = Number(req.params.patient_id);
        const user_id = Number(req.params.user_id);

        try {
            // check if patient_id has user_id as his therapist
            const response = await axios.get(`${entitiesServiceURL}/check/therapists/${user_id}/patients/${patient_id}`);
            console.log(response.data)
            if(!response.data.success) return res.status(response.status).send(response.data)
            const plans = await axios.get(`${exerciseServiceURL}/patients/${patient_id}/plans`);
            return res.status(plans.status).send(plans.data)
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async patientGetsPlanById(req, res) {
        if (!req.params.user_id) throw ErrorTypes.UnauthorizedAcess("user_id is required");
        if (!req.params.patient_id) throw ErrorTypes.UnauthorizedAcess("patient_id is required");
        if (!req.params.plan_id) throw ErrorTypes.UnauthorizedAcess("plan_id is required");
        const patient_id = Number(req.params.patient_id);
        const user_id = Number(req.params.user_id);
        const plan_id = Number(req.params.plan_id);

        try {
            // check if user_id matches a patient profile with patient id
            const response = await axios.get(`${entitiesServiceURL}/patients/${user_id}/patients/${patient_id}`);
            if(!response.data.success) return res.status(response.status).send(response.data)
            const plans = await axios.get(`${exerciseServiceURL}/patients/${patient_id}/plans/${plan_id}`);
            return res.status(plans.status).send(plans.data)
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async therapistGetsPlanById(req, res) {
        if (!req.params.user_id) throw ErrorTypes.UnauthorizedAcess("user_id is required");
        if (!req.params.patient_id) throw ErrorTypes.UnauthorizedAcess("patient_id is required");
        if (!req.params.plan_id) throw ErrorTypes.UnauthorizedAcess("plan_id is required");
        const patient_id = Number(req.params.patient_id);
        const user_id = Number(req.params.user_id);
        const plan_id = Number(req.params.plan_id);

        console.log(patient_id, user_id, plan_id, "CALLED")
        try {
            // check if patient_id has user_id as his therapist
            const response = await axios.get(`${entitiesServiceURL}/check/therapists/${user_id}/patients/${patient_id}`);
            console.log(response.data, "EHER")
            if(!response.data.success) return res.status(response.status).send(response.data)
            const plans = await axios.get(`${exerciseServiceURL}/patients/${patient_id}/plans/${plan_id}`);
            if(!plans.data.success) return res.status(plans.status).json(plans.data)
            console.log("EXERCISE ANSER")
            //console.log(plans)
            return res.status(plans.status).send(plans.data)
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async onPlanMarkDayAsDone(req, res) {
        if (!req.params.user_id) throw ErrorTypes.UnauthorizedAcess("user_id is required");
        if (!req.params.patient_id) throw ErrorTypes.UnauthorizedAcess("patient_id is required");
        if (!req.params.plan_id) throw ErrorTypes.UnauthorizedAcess("plan_id is required");
        if (!req.params.exercise_id) throw ErrorTypes.UnauthorizedAcess("exercise_id is required");
        const patient_id = Number(req.params.patient_id);
        const user_id = Number(req.params.user_id);
        const plan_id = Number(req.params.plan_id);
        const exercise_id = Number(req.params.exercise_id)

        try {
            // check if user_id matches a patient profile with patient id
            const response = await axios.get(`${entitiesServiceURL}/patients/${user_id}/patients/${patient_id}`);
            if(!response.data.success) return res.status(response.status).send(response.data)

            const plans = await axios.put(`${exerciseServiceURL}/patients/${patient_id}/plans/${plan_id}/exercises/${exercise_id}`, req.body);
            return res.status(plans.status).send(plans.data)
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = Controller