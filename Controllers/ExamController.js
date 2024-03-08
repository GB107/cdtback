const ExamModel = require('../Models/exam.js');
const AnswerModel = require('../Models/answer.js');


class examController{

    static saveAnswer = async (req, res) => {
        try {
            const { testId, userId, answers } = req.body;

            if (!testId || !userId || !answers) {
                return res.status(400).json({ message: "Invalid request data" });
            }
            let existingAnswer = await Answer.findOne({ test: testId, answered_by: userId });
    
            if (!existingAnswer) {
                existingAnswer = new Answer({
                    test: testId,
                    answered_by: userId,
                    answers: {},
                });
            }
            for (const [questionIndex, selectedOption] of Object.entries(answers)) {
                existingAnswer.answers[questionIndex - 1] = selectedOption;
            }
    
            await existingAnswer.save();
    
            res.status(201).json({ message: "Answers saved successfully" });
        } catch (error) {
            console.error("Error saving answers:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    
    static addExam = (req,res)=>{
        const exam = new ExamModel(req.body);
        exam.save()
        .then((result)=>{
            res.send({
                isSuccessful: true,
                data:result
            });
        })
        .catch((err)=>{
            console.log(err);
            res.send({
                isSuccessful: false,
                data: err
            })
        })
    }
    static getExams = (req,res) =>{
        ExamModel.find()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    static getOneExam = (req,res) =>{
        ExamModel.findById(req.params.id)
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    static addQuestion = (req,res)=>{
        ExamModel.updateOne(req.body.query,{$push: req.body.data})
        .then((result)=>{
            res.send({
                isSuccessful: true,
                data:result
            });
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    static deleteQuestion = (req,res)=>{
        ExamModel.findById(req.body.examId)
        .then((result)=>{
            result.questions.slice(req.body.questionPosition,1);
            result.save()
            .then((result)=>{
                console.log(result);
                res.send({
                    isSuccessful:true,
                    data: result
                })
            })
            .catch((err)=>{
                console.log(err);
            })
        })
        .catch(err=>{
            res.send({
                isSuccessful:false,
                message: "Exam not available"
            })
        })
    }
    static deleteQuestion2 = (req,res)=>{
        console.log(req.body.id)
        ExamModel.findByIdAndUpdate(req.body.id, req.body.examId)
        .then((result)=>{
            res.send({
                isSuccessful:true,
                data:result
            })
        })
        .catch(err=>{
            res.send({
                isSuccessful:false,
                message: "Exam not available"
            })
        })
    }
}

module.exports = examController;