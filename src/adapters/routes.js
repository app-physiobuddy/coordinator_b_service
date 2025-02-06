const router = require('express').Router()

const Contoller = require("./Controller")
const redisProvider = require("../providers/Redis")
const redis = new redisProvider()
///
const controller = new Contoller(redis)

router.get('/', (req, res) => {
    res.send('coordinator B service')
})





router.post("/coordinator-b/make-category", (req, res) => {
    //Logged therapist front-end has already company id
    //asks entities service to verify if this therapist belongs to this company
    //returns the company_user_id
    controller.therapistMakesCategoryWithCompanyUserId(req, res)
})

router.get("/coordinator-b/therapists/:user_id/company/:company_id/categories", (req, res) => {
    //Logged therapist front-end has already company id
    //asks entities service to verify if this therapist belongs to this company
    //returns the company_user_id
    controller.therapistGetsAllCategoriesWithCompanyUserId(req, res)
})

router.post("/coordinator-b/make-exercise", (req, res) => {
    controller.therapistMakesExerciseWithCompanyUserId(req, res)
})

router.get("/coordinator-b/therapists/:user_id/company/:company_id/exercises", (req, res) => {
    controller.therapistGetsAllExercisesWithCompanyUserId(req, res)
})

router.post("/coordinator-b/make-plan", (req, res) => {
    controller.therapistMakesPlanWithPacientId(req, res)
})
// GET PLAN(S)
router.get("/coordinator-b/patient-user/:user_id/patient/:patient_id/plans", (req, res) => {
    controller.patientGetsPlans(req, res)
})

router.get("/coordinator-b/therapists/:user_id/patient/:patient_id/plans", (req, res) => {
    controller.therapistGetsPlans(req, res)
})

router.get("/coordinator-b/patient-user/:user_id/patient/:patient_id/plans/:plan_id", (req, res) => {
    controller.patientGetsPlanById(req, res)
})

router.get("/coordinator-b/therapists/:user_id/patient/:patient_id/plans/:plan_id", (req, res) => {
    controller.therapistGetsPlanById(req, res)
})

//Mark Plans as done
router.put("/coordinator-b/patient-user/:user_id/patient/:patient_id/plans/:plan_id/exercises/:exercise_id", (req, res) => {
    controller.onPlanMarkDayAsDone(req, res)
})
module.exports = router